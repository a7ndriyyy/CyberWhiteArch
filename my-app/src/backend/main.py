from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime,timedelta
import motor.motor_asyncio
import re
from bson import ObjectId 
from pydantic import BaseModel



# --- MongoDB setup ---
# IMPORTANT: same DB as Flask (Utilisateur)
DATABASE_URI = "mongodb://100.123.33.82:27017"
DB_NAME = "Utilisateur"  # <-- match app.py

client = motor.motor_asyncio.AsyncIOMotorClient(DATABASE_URI)
db = client[DB_NAME]





friend_requests = db["friendRequests"]
typing_states   = db["typingStates"]
# --- FastAPI setup ---
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # adjust for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Models ---
class User(BaseModel):
    username: str
    displayName: str
    initials: str
    friends: List[str] = []

class Message(BaseModel):
    fromUserId: str   # we use username, not ObjectId
    toUserId: str     # username of friend
    text: str
    code: Optional[str] = None
    createdAt: Optional[datetime] = None

class FriendRequest(BaseModel):
    friendUsername: str

class FriendRequestCreate(BaseModel):
    toUsername: str

class FriendRequestRespond(BaseModel):
    accept: bool

class TypingPayload(BaseModel):
    fromUser: str
    toUser: str
    isTyping: bool   

class FriendInvite(BaseModel):
    fromUser: str
    toUser: str     

class FriendRespond(BaseModel):
    toUser: str     # the one responding (current user)
    fromUser: str   # the one who sent the request
    accept: bool    


# --- Create default users on startup (optional) ---
@app.on_event("startup")
async def create_default_users():
    default_users = [
        {
            "username": "Root",
            "displayName": "Root",
            "initials": "RT",
             "friends": [],
            "incomingRequests": [],
            "outgoingRequests": [],
        },
        {
            "username": "roottest",
            "displayName": "RootTest",
            "initials": "RT",
             "friends": [],
            "incomingRequests": [],
            "outgoingRequests": [],
        },
    ]

    for user in default_users:
        existing = await db.users.find_one({"username": user["username"]})
        if not existing:
            await db.users.insert_one(user)
            print(f"Created default user: {user['username']}")
        else:
            # optional: backfill missing fields
            update = {}
            for key in ["friends", "incomingRequests", "outgoingRequests"]:
                if key not in existing:
                    update[key] = []
            if update:
                await db.users.update_one({"_id": existing["_id"]}, {"$set": update})
            print(f"Default user already exists: {user['username']}")


# --- Routes ---

@app.post("/register")
async def register_user(user: User):
    """
    Only for DM testing; your main registration is in Flask.
    This one stores minimal user profile in the same Mongo DB.
    """
    existing = await db.users.find_one({"username": user.username})
    if existing:
        raise HTTPException(status_code=400, detail="User already exists")

    doc = {
        "username": user.username,
        "displayName": user.displayName,
        "initials": user.initials,
        "friends": [],
        "incomingRequests": [],
        "outgoingRequests": [],
    }
    result = await db.users.insert_one(doc)
    return {"id": str(result.inserted_id), "user": doc}


@app.get("/dm/conversations/{userId}")
async def get_conversations(userId: str):
    # Find all messages where user is sender or receiver
    pipeline = [
        {"$match": {"$or": [{"fromUserId": userId}, {"toUserId": userId}]}},
        {"$sort": {"createdAt": -1}},
        {"$group": {
            "_id": {
                "otherUserId": {
                    "$cond": [
                        {"$eq": ["$fromUserId", userId]},
                        "$toUserId",
                        "$fromUserId"
                    ]
                }
            },
            "lastText": {"$first": "$text"},
            "lastAt": {"$first": "$createdAt"}
        }}
    ]
    results = await db.messages.aggregate(pipeline).to_list(length=100)

    conversations = []
    for r in results:
        other_id = r["_id"]["otherUserId"]
        other_user = await db.users.find_one({"username": other_id})

        if other_user:
            display = other_user.get("displayName") or other_user.get("username") or other_id
            initials = other_user.get("initials") or (display[:2] or "U").upper()
        else:
            display = other_id
            initials = (other_id[:2] or "U").upper()

        conversations.append({
            "otherUserId": other_id,
            "displayName": display,
            "initials": initials,
            "lastText": r["lastText"],
            "lastAt": r["lastAt"],
        })

    return {"conversations": conversations}



@app.get("/dm/messages")
async def get_messages(user1: str, user2: str):
    """
    user1 & user2 are usernames (not ObjectIds)
    """
    msgs_cursor = db.messages.find({
        "$or": [
            {"fromUserId": user1, "toUserId": user2},
            {"fromUserId": user2, "toUserId": user1},
        ]
    }).sort("createdAt", 1)

    messages = []
    async for m in msgs_cursor:
        created = m.get("createdAt") or datetime.utcnow()
        if isinstance(created, datetime):
            created_str = created.isoformat() + "Z"
        else:
            created_str = str(created)

        messages.append({
            "id": str(m.get("_id")),
            "fromUserId": m.get("fromUserId"),
            "toUserId": m.get("toUserId"),
            "text": m.get("text", ""),
            "code": m.get("code"),
            "attachments": m.get("attachments", []),
            "createdAt": created_str,
        })

    return {"messages": messages}


@app.post("/dm/messages")
async def send_message(msg: Message):
    """
    msg.fromUserId & msg.toUserId are usernames.
    """
    msg.createdAt = datetime.utcnow()
    doc = msg.dict()
    result = await db.messages.insert_one(doc)
    doc["_id"] = str(result.inserted_id)
    # make createdAt JSON-safe
    doc["createdAt"] = msg.createdAt.isoformat() + "Z"
    return {"message": doc}


@app.get("/users/search")
async def search_users(q: str = ""):
    """
    Search users by username prefix: /users/search?q=roo
    Case-insensitive.
    """
    q = q.strip()
    if not q:
        return {"results": []}

    regex = re.compile(f"^{re.escape(q)}", re.IGNORECASE)
    cursor = db.users.find({"username": {"$regex": regex}})

    results = []
    async for u in cursor:
        username = u.get("username")
        display = u.get("displayName", username)
        initials = u.get("initials", (display[:2] or "U").upper())
        results.append({
            "username": username,
            "displayName": display,
            "initials": initials,
        })
    return {"results": results}


@app.post("/users/{username}/friends")
async def add_friend(username: str, req: FriendRequest):
    """
    Add a friend by username.
    Path:  /users/{username}/friends        (username = current user)
    Body:  { "friendUsername": "roottest" }
    Now case-insensitive + trimmed.
    """
    me_name = username.strip()
    friend_name = (req.friendUsername or "").strip()

    if not me_name or not friend_name:
        raise HTTPException(status_code=400, detail="Usernames cannot be empty")

    # Case-insensitive lookup for "me"
    me = await db.users.find_one(
        {"username": {"$regex": f"^{re.escape(me_name)}$", "$options": "i"}}
    )
    if not me:
        raise HTTPException(status_code=404, detail="User not found")

    # Case-insensitive lookup for "friend"
    friend = await db.users.find_one(
        {"username": {"$regex": f"^{re.escape(friend_name)}$", "$options": "i"}}
    )
    if not friend:
        raise HTTPException(status_code=404, detail="Friend not found")

    me_username = me["username"]
    friend_username = friend["username"]

    if friend_username == me_username:
        raise HTTPException(status_code=400, detail="Cannot add yourself")

    # Add each other to friends list (store by username)
    await db.users.update_one(
        {"username": me_username},
        {"$addToSet": {"friends": friend_username}},
    )
    await db.users.update_one(
        {"username": friend_username},
        {"$addToSet": {"friends": me_username}},
    )

    return {
        "msg": "friend added",
        "me": me_username,
        "friend": friend_username,
    }


@app.post("/friends/request/{from_username}")
async def create_friend_request(from_username: str, payload: FriendRequestCreate):
    to_username = payload.toUsername.strip()

    if not to_username:
        raise HTTPException(status_code=400, detail="Missing toUsername")
    if to_username == from_username:
        raise HTTPException(status_code=400, detail="Cannot add yourself")

    me = await db.users.find_one({"username": from_username})
    friend = await db.users.find_one({"username": to_username})
    if not me or not friend:
        raise HTTPException(status_code=404, detail="User not found")

    # already friends?
    if to_username in me.get("friends", []):
        return {"msg": "already_friends"}

    # already pending?
    existing = await friend_requests.find_one({
        "from": from_username,
        "to": to_username,
        "status": "pending",
    })
    if existing:
        return {"msg": "already_pending"}

    doc = {
        "from": from_username,
        "to": to_username,
        "status": "pending",
        "createdAt": datetime.utcnow(),
        "decidedAt": None,
    }
    res = await friend_requests.insert_one(doc)

    return {
        "requestId": str(res.inserted_id),
        "status": "pending",
        "msg": "request_sent",
    }



@app.get("/users/{username}/friends")
async def list_friends(username: str):
    me = await db.users.find_one({"username": username})
    if not me:
        raise HTTPException(status_code=404, detail="User not found")

    friend_usernames = me.get("friends", [])
    if not friend_usernames:
        return {"friends": []}

    cursor = db.users.find({"username": {"$in": friend_usernames}})
    friends = []
    async for u in cursor:
        uname = u.get("username")
        display = u.get("displayName") or uname
        initials = u.get("initials") or (display[:2] or "U").upper()
        friends.append(
            {
                "username": uname,
                "displayName": display,
                "initials": initials,
            }
        )
    return {"friends": friends}



@app.post("/friends/request")
async def send_friend_request(inv: FriendInvite):
    if inv.fromUser == inv.toUser:
        raise HTTPException(status_code=400, detail="Cannot add yourself")

    me = await db.users.find_one({"username": inv.fromUser})
    them = await db.users.find_one({"username": inv.toUser})

    if not me or not them:
        raise HTTPException(status_code=404, detail="User not found")

    me_friends = me.get("friends", [])
    if inv.toUser in me_friends:
        raise HTTPException(status_code=400, detail="Already friends")

    me_out = me.get("outgoingRequests", [])
    them_in = them.get("incomingRequests", [])

    if inv.toUser in me_out:
        raise HTTPException(status_code=400, detail="Request already sent")

    if inv.fromUser in them_in:
        raise HTTPException(status_code=400, detail="Request already pending")

    # add to outgoing / incoming
    await db.users.update_one(
        {"username": inv.fromUser},
        {"$addToSet": {"outgoingRequests": inv.toUser}},
    )
    await db.users.update_one(
        {"username": inv.toUser},
        {"$addToSet": {"incomingRequests": inv.fromUser}},
    )

    return {"msg": "request sent"}



@app.get("/friends/requests/{username}")
async def get_friend_requests(username: str):
    me = await db.users.find_one({"username": username})
    if not me:
        raise HTTPException(status_code=404, detail="User not found")

    incoming_names = me.get("incomingRequests", [])
    outgoing_names = me.get("outgoingRequests", [])

    # helper to expand usernames to profile info
    async def expand(names):
        if not names:
            return []
        cursor = db.users.find({"username": {"$in": names}})
        res = []
        async for u in cursor:
            uname = u.get("username")
            display = u.get("displayName") or uname
            initials = u.get("initials") or (display[:2] or "U").upper()
            res.append(
                {
                    "username": uname,
                    "displayName": display,
                    "initials": initials,
                }
            )
        # keep same order as original arrays
        order = {n: i for i, n in enumerate(names)}
        res.sort(key=lambda x: order.get(x["username"], 999))
        return res

    incoming = await expand(incoming_names)
    outgoing = await expand(outgoing_names)

    return {"incoming": incoming, "outgoing": outgoing}

@app.post("/friends/respond")
async def respond_friend_request(body: FriendRespond):
    if body.toUser == body.fromUser:
        raise HTTPException(status_code=400, detail="Invalid request")

    me = await db.users.find_one({"username": body.toUser})
    them = await db.users.find_one({"username": body.fromUser})

    if not me or not them:
        raise HTTPException(status_code=404, detail="User not found")

    # remove from pending
    await db.users.update_one(
        {"username": body.toUser},
        {"$pull": {"incomingRequests": body.fromUser}},
    )
    await db.users.update_one(
        {"username": body.fromUser},
        {"$pull": {"outgoingRequests": body.toUser}},
    )

    if body.accept:
        # add to friends
        await db.users.update_one(
            {"username": body.toUser},
            {"$addToSet": {"friends": body.fromUser}},
        )
        await db.users.update_one(
            {"username": body.fromUser},
            {"$addToSet": {"friends": body.toUser}},
        )
        return {"msg": "friend accepted"}

    return {"msg": "friend declined"}


@app.delete("/users/{username}/friends/{friend_username}")
async def remove_friend(username: str, friend_username: str):
    if username == friend_username:
        raise HTTPException(status_code=400, detail="Invalid friend")

    me = await db.users.find_one({"username": username})
    them = await db.users.find_one({"username": friend_username})

    if not me or not them:
        raise HTTPException(status_code=404, detail="User not found")

    # remove from friends and any pending requests both ways
    await db.users.update_one(
        {"username": username},
        {
            "$pull": {
                "friends": friend_username,
                "incomingRequests": friend_username,
                "outgoingRequests": friend_username,
            }
        },
    )
    await db.users.update_one(
        {"username": friend_username},
        {
            "$pull": {
                "friends": username,
                "incomingRequests": username,
                "outgoingRequests": username,
            }
        },
    )

    return {"msg": "friend removed"}




@app.post("/dm/typing")
async def set_typing(payload: TypingPayload):
    now = datetime.utcnow()

    if payload.isTyping:
        # upsert record valid for a few seconds
        await typing_states.update_one(
            {"fromUser": payload.fromUser, "toUser": payload.toUser},
            {
                "$set": {
                    "fromUser": payload.fromUser,
                    "toUser": payload.toUser,
                    "expiresAt": now + timedelta(seconds=5),
                }
            },
            upsert=True,
        )
    else:
        await typing_states.delete_one(
            {"fromUser": payload.fromUser, "toUser": payload.toUser}
        )

    return {"ok": True}

@app.get("/dm/typing-status")
async def get_typing_status(user1: str, user2: str):
    """
    user1 = "me", user2 = "other".
    We check if user2 is currently typing to user1.
    """
    now = datetime.utcnow()
    doc = await typing_states.find_one({
        "fromUser": user2,
        "toUser": user1,
        "expiresAt": {"$gt": now},
    })

    if not doc:
        return {"typing": False, "fromUser": None}

    return {"typing": True, "fromUser": user2}


#to launch the code the commands is uvicorn main:app --host 0.0.0.0 --port 8001 