# backend.py
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash
from bson import ObjectId
import os

# load .env if you need it (path is optional)
load_dotenv('/my-app/src/backend/.env')

app = Flask(__name__)
CORS(app)  # allows GET/POST/PATCH from your Vite dev server

# --- Mongo setup ---
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
DB_NAME = os.getenv("MONGO_DB", "cyberwhitehattest")

client = MongoClient(MONGO_URI)
db = client['cyberwhitehattest']
users_collection = db['users']


# --- helpers ---
def serialize_user(user):
    """Return a frontend-friendly dict; never include password."""
    return {
        'userId': str(user['_id']),
        'username': user.get('username', ''),
        'followers': user.get('followers', 0),
        'following': user.get('following', 0),

        'displayName': user.get('displayName', user.get('username', '')),
        'title': user.get('title', ''),
        'bio': user.get('bio', ''),
        'tags': user.get('tags', []),
        'highlights': user.get('highlights', []),
        'skills': user.get('skills', []),
        'avatarUrl': user.get('avatarUrl', ''),
        'bannerUrl': user.get('bannerUrl', ''),
        'gallery': user.get('gallery', []),
        'posts': user.get('posts', []),
    }


# --- routes ---
@app.route('/', methods=['GET'])
def home():
    return jsonify({'msg': 'Server running!'}), 200


@app.route('/register', methods=['POST'])
def register():
    data = request.json or {}
    username = (data.get('username') or '').strip()
    password = (data.get('password') or '').strip()

    if not username or not password:
        return jsonify({'msg': 'Username and password are required'}), 400

    if users_collection.find_one({'username': username}):
        return jsonify({'msg': 'User already exist'}), 400

    hashed_password = generate_password_hash(password)
    doc = {
        'username': username,
        'password': hashed_password,
        'followers': 0,
        'following': 0,

        # profile fields (start empty/clean but editable)
        'displayName': username,  # default to username
        'title': '',
        'bio': '',
        'tags': [],         # e.g., ["E2E Advocate", "@handle"]
        'highlights': [],   # e.g., ["CSP", "Bug Bounty Top 1%"]
        'skills': [],       # e.g., ["Web Exploitation", ...]
        'avatarUrl': '',
        'bannerUrl': '',
        'gallery': [],      # later: [{url,label}]
        'posts': [],        # later: minimal post objects
    }

    result = users_collection.insert_one(doc)

    return jsonify({
        'msg': 'User registered successfully',
        'userId': str(result.inserted_id),
        'username': username,
        'followers': 0,
        'following': 0
    }), 201


@app.route('/login', methods=['POST'])
def login():
    data = request.json or {}
    username = (data.get('username') or '').strip()
    password = (data.get('password') or '').strip()

    if not username or not password:
        return jsonify({'msg': 'Username and password are required'}), 400

    user = users_collection.find_one({'username': username})
    if not user or not check_password_hash(user['password'], password):
        return jsonify({'msg': 'Invalid username or password'}), 401

    return jsonify({
        'msg': 'Login successful',
        'userId': str(user['_id']),
        'username': user['username'],
        'followers': user.get('followers', 0),
        'following': user.get('following', 0)
    }), 200


@app.route('/users/<user_id>', methods=['GET'])
def get_user(user_id):
    try:
        oid = ObjectId(user_id)
    except Exception:
        return jsonify({'msg': 'Invalid user id'}), 400

    user = users_collection.find_one({'_id': oid})
    if not user:
        return jsonify({'msg': 'User not found'}), 404

    return jsonify(serialize_user(user)), 200


@app.route('/users/<user_id>', methods=['PATCH'])
def update_user(user_id):
    try:
        oid = ObjectId(user_id)
    except Exception:
        return jsonify({'msg': 'Invalid user id'}), 400

    data = request.json or {}

    # whitelist fields that can be updated
    allowed = {
        'displayName', 'title', 'bio', 'tags', 'highlights', 'skills',
        'avatarUrl', 'bannerUrl', 'gallery'
    }
    update = {k: data[k] for k in allowed if k in data}

    # normalize list fields if they arrive as strings
    for k in ['tags', 'highlights', 'skills', 'gallery']:
        if k in update and isinstance(update[k], str):
            update[k] = [s.strip() for s in update[k].split(',') if s.strip()]

    if not update:
        return jsonify({'msg': 'No updatable fields'}), 400

    users_collection.update_one({'_id': oid}, {'$set': update})
    user = users_collection.find_one({'_id': oid})

    return jsonify(serialize_user(user) | {'msg': 'Updated'}), 200


if __name__ == '__main__':
    # host=0.0.0.0 if you want LAN access
    app.run(debug=True)
