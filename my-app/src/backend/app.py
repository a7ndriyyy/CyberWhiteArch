# backend.py
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient, DESCENDING
from werkzeug.security import generate_password_hash, check_password_hash
from bson import ObjectId
from pathlib import Path
from datetime import datetime
import os

# load .env if you need it (path is optional)
env_path = Path(__file__).with_suffix('.env')
load_dotenv(env_path)

app = Flask(__name__)
CORS(app)  # allows GET/POST/PATCH from your Vite dev server

# --- Mongo setup ---
MONGO_URI = os.getenv("MONGO_URI", "mongodb://100.123.33.82:27017/")
DB_NAME = os.getenv("MONGO_DB", "Utilisateur")

client = MongoClient(MONGO_URI)
db = client[DB_NAME]
users_collection = db['users']
posts_collection = db['posts']
conversations_collection = db['conversations']
messages_collection = db['messages']


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

        'friends': [str(fid) for fid in user.get('friends', [])],
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


        'friends': [],
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

@app.route('/dm/messages', methods=['POST'])
def dm_send_message():
    data = request.json or {}

    from_id = (data.get('fromUserId') or '').strip()
    to_id   = (data.get('toUserId') or '').strip()
    text    = (data.get('text') or '').strip()
    code    = data.get('code')  # {language, content} or None
    # attachments are tricky because they contain File objects in frontend.
    # For now we ignore real upload & only store text/code.
    attachments = data.get('attachments') or []

    if not from_id or not to_id:
        return jsonify({'msg': 'fromUserId and toUserId are required'}), 400

    if not text and not code and not attachments:
        return jsonify({'msg': 'Message is empty'}), 400

    try:
        from_oid = ObjectId(from_id)
        to_oid   = ObjectId(to_id)
    except Exception:
        return jsonify({'msg': 'Invalid user id'}), 400

    # optional: ensure users exist
    if not users_collection.find_one({'_id': from_oid}) or not users_collection.find_one({'_id': to_oid}):
        return jsonify({'msg': 'User not found'}), 404

    # find or create conversation between these 2 users
    participants = sorted([from_oid, to_oid], key=lambda x: str(x))

    conv = conversations_collection.find_one({'participants': participants})
    now = datetime.utcnow()

    if not conv:
        conv_id = conversations_collection.insert_one({
            'participants': participants,
            'createdAt': now,
            'lastText': text,
            'lastFrom': from_oid,
            'lastAt': now,
        }).inserted_id
    else:
        conv_id = conv['_id']
        conversations_collection.update_one(
            {'_id': conv_id},
            {'$set': {
                'lastText': text,
                'lastFrom': from_oid,
                'lastAt': now,
            }}
        )

    msg_doc = {
        'conversationId': conv_id,
        'fromUserId': from_oid,
        'toUserId': to_oid,
        'text': text,
        'code': code,
        'attachments': attachments,   # you can later store URLs here
        'createdAt': now,
    }

    result = messages_collection.insert_one(msg_doc)
    msg_doc['_id'] = result.inserted_id

    return jsonify({
        'message': {
            'id': str(msg_doc['_id']),
            'conversationId': str(conv_id),
            'fromUserId': from_id,
            'toUserId': to_id,
            'text': text,
            'code': code,
            'attachments': attachments,
            'createdAt': now.isoformat() + 'Z',
        }
    }), 201

@app.route('/dm/messages', methods=['GET'])
def dm_get_messages():
    user1 = (request.args.get('user1') or '').strip()
    user2 = (request.args.get('user2') or '').strip()

    if not user1 or not user2:
        return jsonify({'msg': 'user1 and user2 are required'}), 400

    try:
        u1 = ObjectId(user1)
        u2 = ObjectId(user2)
    except Exception:
        return jsonify({'msg': 'Invalid user id'}), 400

    participants = sorted([u1, u2], key=lambda x: str(x))
    conv = conversations_collection.find_one({'participants': participants})
    if not conv:
        return jsonify({'messages': []}), 200

    cursor = messages_collection.find({'conversationId': conv['_id']}).sort('createdAt', 1)

    messages = []
    for m in cursor:
        messages.append({
            'id': str(m['_id']),
            'fromUserId': str(m['fromUserId']),
            'toUserId': str(m['toUserId']),
            'text': m.get('text', ''),
            'code': m.get('code'),
            'attachments': m.get('attachments', []),
            'createdAt': m['createdAt'].isoformat() + 'Z',
        })

    return jsonify({'messages': messages}), 200
@app.route('/dm/conversations/<user_id>', methods=['GET'])
def dm_get_conversations(user_id):
    try:
        oid = ObjectId(user_id)
    except Exception:
        return jsonify({'msg': 'Invalid user id'}), 400

    cursor = conversations_collection.find({'participants': oid}).sort('lastAt', DESCENDING)

    result = []
    for conv in cursor:
        # other participant
        others = [p for p in conv['participants'] if p != oid]
        if not others:
            continue
        other_id = others[0]
        other = users_collection.find_one({'_id': other_id})
        if not other:
            continue

        display = other.get('displayName') or other.get('username', 'User')
        initials = (display[:2] or "U ").upper()

        last_at = conv.get('lastAt', datetime.utcnow())

        result.append({
            'conversationId': str(conv['_id']),
            'otherUserId': str(other_id),
            'username': other.get('username', ''),
            'displayName': display,
            'initials': initials,
            'lastText': conv.get('lastText', ''),
            'lastAt': last_at.isoformat() + 'Z',
            # you can add unread count later
        })

    return jsonify({'conversations': result}), 200
