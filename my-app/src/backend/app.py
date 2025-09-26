# backend.py (your existing Flask file)
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash
from bson import ObjectId
import os

load_dotenv('/my-app/src/backend/.env')

app = Flask(__name__)
CORS(app)

client = MongoClient("mongodb://localhost:27017/")
db = client['cyberwhitehattest']
users_collection = db['users']

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    if users_collection.find_one({'username': username}):
        return jsonify({'msg': 'User already exist'}), 400

    hashed_password = generate_password_hash(password)
    doc = {
        'username': username,
        'password': hashed_password,
        'followers': 0,
        'following': 0
    }
    result = users_collection.insert_one(doc)

    # Return created user info (including userId)
    return jsonify({
        'msg': 'User registered successfully',
        'userId': str(result.inserted_id),
        'username': username,
        'followers': 0,
        'following': 0
    }), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    user = users_collection.find_one({'username': username})
    if not user or not check_password_hash(user['password'], password):
        return jsonify({'msg': 'Invalid username or password'}), 401

    # Return user info (including userId) — but never return password
    return jsonify({
        'msg': 'Login successful',
        'userId': str(user['_id']),
        'username': user['username'],
        'followers': user.get('followers', 0),
        'following': user.get('following', 0)
    }), 200

# 🔥 NEW: fetch user directly from Mongo by id (what your sidebar will call)
@app.route('/users/<user_id>', methods=['GET'])
def get_user(user_id):
    try:
        oid = ObjectId(user_id)
    except Exception:
        return jsonify({'msg': 'Invalid user id'}), 400

    user = users_collection.find_one({'_id': oid})
    if not user:
        return jsonify({'msg': 'User not found'}), 404

    return jsonify({
        'userId': str(user['_id']),
        'username': user['username'],
        'followers': user.get('followers', 0),
        'following': user.get('following', 0)
    }), 200

@app.route('/')
def home():
    return jsonify({'msg': 'Server running!'}), 200

if __name__ == '__main__':
    app.run(debug=True)