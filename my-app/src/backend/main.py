from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from bson import ObjectId
import motor.motor_asyncio
from typing import List, Optional
import re

# --- MongoDB setup ---
DATABASE_URI = "mongodb://100.123.33.82:27017"
DB_NAME = "Chatdb"

client = motor.motor_asyncio.AsyncIOMotorClient(DATABASE_URI)
db = client[DB_NAME]

# --- FastAPI setup ---
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # adjust for production
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
    fromUserId: str
    toUserId: str
    text: str
    code: Optional[str] = None
    createdAt: Optional[datetime] = None

class FriendRequest(BaseModel):
    friendUsername: str

# --- Create default users on startup ---
@app.on_event("startup")
async def create_default_users():
    default_users = [
        {
            "username": "Root",
            "displayName": "Root",
            "initials": "RT",
        },
        {
            "username": "roottest",
            "displayName": "RootTest",
            "initials": "RT",
        },
    ]

    for user in default_users:
        existing = await db.users.find_one({"username": user["username"]})
        if not existing:
            await db.users.insert_one(user)
            print(f"Created default user: {user['username']}")
        else:
            print(f"Default user already exists: {user['username']}")

# --- Routes ---

@app.post("/register")
async def register_user(user: User):
    existing = await db.users.find_one({"username": user.username})
    if existing:
        raise HTTPException(status_code=400, detail="User already exists")

    doc = {
        "username": user.username,
        "displayName": user.displayName,
        "initials": user.initials,
        "friends": [],
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
        conversations.append({
            "otherUserId": other_id,
            "displayName": other_user["displayName"] if other_user else other_id,
            "initials": other_user["initials"] if other_user else "?",
            "lastText": r["lastText"],
            "lastAt": r["lastAt"],
        })

    return {"conversations": conversations}


@app.get("/dm/messages")
async def get_messages(user1: str, user2: str):
    raw_msgs = await db.messages.find({
        "$or": [
            {"fromUserId": user1, "toUserId": user2},
            {"fromUserId": user2, "toUserId": user1}
        ]
    }).sort("createdAt", 1).to_list(length=200)

    messages = []
    for m in raw_msgs:
        created = m.get("createdAt")
        if isinstance(created, datetime):
            created_str = created.isoformat() + "Z"
        else:
            created_str = str(created)
        
        messages.append({
            "id": str(m.get("_id")),
            "fromUserId": m.get("fromUserId", ""),
            "toUserId": m.get("toUserId", ""),
            "text": m.get("text", ""),
            "code": m.get("code"),
            "attachments": m.get("attachments", []),
            "createdAt": created_str,
        })
    
    return {"messages": messages}


@app.post("/dm/messages")
async def send_message(msg: Message):
    msg.createdAt = datetime.utcnow()
    doc = msg.dict()
    result = await db.messages.insert_one(doc)
    doc["_id"] = str(result.inserted_id)
    return {"message": doc}

@app.get("/users/search")
async def search_users(q: str = ""):
    """
    Search users ny username prefix: /users/search?q=roo
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
    Body: { "friendUserame": "roottest" }
    """
    me = await db.users.find_one({"username": username})
    if not me:
        raise HTTPException(status_code=404, detail="User not found")

    friend = await db.users.find_one({"username": req.friendUsername})
    if not friend:
        raise HTTPException(status_code=404, detail="Friend not found")

    if friend["username"] == username:
        raise HTTPException(status_code=400, detail="Cannot add yourself")

    await db.users.update_one(
        {"username": username},
        {"$addToSet": {"friends": friend["username"]}}
    )

    await db.users.update_one(
        {"username": friend["username"]},
        {"$addToSet": {"friends": username}}
    )

    return {
        "msg": "friend added",
        "me": username,
        "friend": friend
    }