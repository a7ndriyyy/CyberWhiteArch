from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import motor.motor_asyncio

# --- MongoDB setup ---
DATABASE_URI = "mongodb://100.123.33.82:27017"
DB_NAME = "chatdb"

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

class Message(BaseModel):
    fromUserId: str
    toUserId: str
    text: str
    code: Optional[str] = None
    createdAt: Optional[datetime] = None

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
    msgs = await db.messages.find({
        "$or": [
            {"fromUserId": user1, "toUserId": user2},
            {"fromUserId": user2, "toUserId": user1}
        ]
    }).sort("createdAt", 1).to_list(length=200)

    return {"messages": msgs}


@app.post("/dm/messages")
async def send_message(msg: Message):
    msg.createdAt = datetime.utcnow()
    doc = msg.dict()
    result = await db.messages.insert_one(doc)
    doc["_id"] = str(result.inserted_id)
    return {"message": doc}
