from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson.objectid import ObjectId
from datetime import datetime
from time import time

app = Flask(__name__)
CORS(app)

# Mongo connection
client = MongoClient("mongodb://100.123.33.82:27017/")
db = client["Utilisateur"]
posts_col = db["posts"]
users_col = db["users"]   # if you have a users collection

def serialize_comment(c):
    return {
        "id": str(c.get("_id")),
        "userId": c.get("userId"),
        "author": c.get("author", "Unknown"),
        "text": c.get("text"),
        "image": c.get("image"),
        "time": c.get("createdAt", datetime.utcnow()).isoformat(),
    }

def serialize_post(p):
    comments = p.get("comments", [])
    return {
        "id": str(p["_id"]),
        "userId": p.get("userId"),
        "author": p.get("author", "Unknown"),
        "initials": p.get("author", "?")[:2].upper(),
        "text": p.get("text"),
        "image": p.get("image"),
        "audience": p.get("audience", "public"),
        "allowVotes": p.get("allowVotes", False),
        "score": p.get("score", 0),
        "myVote": 0,  # client side only for now
        "time": p.get("createdAt", datetime.utcnow()).isoformat(),
        "reposts": p.get("reposts", 0),
        "reaction": p.get("reaction"),
        "comments": [serialize_comment(c) for c in comments[::-1]],
    }

# --------- ROUTES ---------

@app.get("/posts")
def get_posts():
    posts = list(posts_col.find().sort("createdAt", -1))
    return jsonify([serialize_post(p) for p in posts])

@app.post("/posts")
def create_post():
    data = request.get_json() or {}
    user_id = data.get("userId")
    text = data.get("text")
    image = data.get("image")
    audience = data.get("audience", "public")
    allow_votes = data.get("allowVotes", False)

    if not user_id:
      return jsonify({"error": "userId required"}), 400

    # Optional: look up username by userId
    username = "Guest"
    if ObjectId.is_valid(user_id):
        user = users_col.find_one({"_id": ObjectId(user_id)})
        if user:
            username = user.get("username", "Guest")

    post_doc = {
        "userId": user_id,
        "author": username,
        "text": text,
        "image": image,
        "audience": audience,
        "allowVotes": bool(allow_votes),
        "score": 0,
        "reposts": 0,
        "reaction": None,
        "createdAt": datetime.utcnow(),
        "comments": [],
    }

    res = posts_col.insert_one(post_doc)
    post_doc["_id"] = res.inserted_id
    return jsonify(serialize_post(post_doc)), 201

@app.post("/posts/<post_id>/repost")
def repost_post(post_id):
    data = request.get_json() or {}
    user_id = data.get("userId")

    if not user_id:
        return jsonify({"error": "userId required"}), 400

    # --- find original post by its Mongo _id ---
    if not ObjectId.is_valid(post_id):
        return jsonify({"error": "invalid post id"}), 400

    original = posts_col.find_one({"_id": ObjectId(post_id)})
    if not original:
        return jsonify({"error": "post not found"}), 404

    # --- username of the user who is reposting ---
    username = "Guest"
    if ObjectId.is_valid(user_id):
        user = users_col.find_one({"_id": ObjectId(user_id)})
        if user:
            username = user.get("username", "Guest")

    # --- increment reposts counter on original ---
    posts_col.update_one(
        {"_id": original["_id"]},
        {"$inc": {"reposts": 1}}
    )

    # --- create a new post as the repost ---
    new_post_doc = {
        "userId": user_id,
        "author": username,
        "text": original.get("text"),
        "image": original.get("image"),
        "audience": original.get("audience", "public"),
        "allowVotes": original.get("allowVotes", False),
        "score": 0,
        "reposts": 0,
        "reaction": None,
        "createdAt": datetime.utcnow(),
        "comments": [],
        "repostOf": str(original["_id"]),  # link to original
    }

    res = posts_col.insert_one(new_post_doc)
    new_post_doc["_id"] = res.inserted_id

    # re-use your existing serializer
    return jsonify(serialize_post(new_post_doc)), 201

@app.post("/posts/<post_id>/comments")
def add_comment(post_id):
    data = request.get_json() or {}
    user_id = data.get("userId")
    text = data.get("text")
    image = data.get("image")

    if not user_id:
        return jsonify({"error": "userId required"}), 400

    # --- find post by Mongo _id ---
    if not ObjectId.is_valid(post_id):
        return jsonify({"error": "invalid post id"}), 400

    post = posts_col.find_one({"_id": ObjectId(post_id)})
    if not post:
        return jsonify({"error": "post not found"}), 404

    # --- username of commenter ---
    username = "Guest"
    if ObjectId.is_valid(user_id):
        user = users_col.find_one({"_id": ObjectId(user_id)})
        if user:
            username = user.get("username", "Guest")

    comment_doc = {
        "_id": ObjectId(),
        "userId": user_id,
        "author": username,
        "text": text,
        "image": image,
        "createdAt": datetime.utcnow(),
    }

    posts_col.update_one(
        {"_id": post["_id"]},
        {"$push": {"comments": comment_doc}}
    )

    return jsonify(serialize_comment(comment_doc)), 201

@app.post("/posts/<post_id>/vote")
def vote_post(post_id):
    data = request.get_json() or {}
    user_id = data.get("userId")
    direction = data.get("direction")  # "up" or "down"

    if not user_id:
        return jsonify({"error": "userId required"}), 400

    if direction not in ("up", "down"):
        return jsonify({"error": "direction must be 'up' or 'down'"}), 400

    if not ObjectId.is_valid(post_id):
        return jsonify({"error": "invalid post id"}), 400

    post = posts_col.find_one({"_id": ObjectId(post_id)})
    if not post:
        return jsonify({"error": "post not found"}), 404

    # votes map: { userId: -1|0|1 }
    votes = post.get("votes", {})
    try:
        old_vote = int(votes.get(user_id, 0))
    except (TypeError, ValueError):
        old_vote = 0

    # ---------- decide new_vote based on direction + old_vote ----------
    if direction == "up":
        if old_vote == 1:
            # was upvoted -> clear
            new_vote = 0
        elif old_vote == -1:
            # was downvoted -> switch to upvote
            new_vote = 1
        else:
            # no vote -> upvote
            new_vote = 1
    else:  # direction == "down"
        if old_vote == -1:
            # was downvoted -> clear
            new_vote = 0
        elif old_vote == 1:
            # was upvoted -> switch to downvote
            new_vote = -1
        else:
            # no vote -> downvote
            new_vote = -1

    diff = new_vote - old_vote  # how much this user changes score
    current_score = post.get("score", 0) or 0
    new_score = current_score + diff

    votes[user_id] = new_vote

    posts_col.update_one(
        {"_id": post["_id"]},
        {"$set": {"votes": votes, "score": new_score}}
    )

    return jsonify({"score": new_score, "myVote": new_vote}), 200


if __name__ == "__main__":
    # important: run on the same port the React code uses
    app.run(host="0.0.0.0", port=8002, debug=True)
