from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash
import os

load_dotenv('/my-app/src/backend/.env')

app = Flask(__name__)
CORS(app)

client = MongoClient("mongodb://localhost:27017/")
db = client['CyberWhiteHat']
users_collection = db['users']

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    if users_collection.find_one({'username': username}):
        return jsonify({'msg': 'User already exist'}), 400

    hashed_password = generate_password_hash(password)
    users_collection.insert_one({'username': username, 'password': hashed_password})


    return jsonify({'msg': 'User registered successfully'}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    user = users_collection.find_one({'username': username})
    if not user or not check_password_hash(user['password'], password):
        return jsonify({'msg': 'Invalid username or password'}), 401

    return jsonify({'msg': 'Login successful'}), 200

@app.route('/')
def home():
    return jsonify({'msg': 'Server running!'}), 200

if __name__ == '__main__':
    app.run(debug=True)