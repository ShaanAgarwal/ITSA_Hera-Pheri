from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from bson import ObjectId
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)

# MongoDB configuration
app.config["MONGO_URI"] = "mongodb://localhost:27017/samarpan"
mongo = PyMongo(app)

@app.route('/register', methods=['POST'])
def register_institute():
    data = request.json
    if not data or 'instituteName' not in data or 'adminUsername' not in data or 'adminPassword' not in data:
        return jsonify({'error': 'Invalid input'}), 400

    institute_data = {
        'instituteName': data['instituteName'],
        'adminUsername': data['adminUsername'],
        'adminPassword': data['adminPassword'],  # Consider hashing this
        'userType': 'admin'  # Default user type
    }
    result = mongo.db.institutes.insert_one(institute_data)
    return jsonify({'message': 'Institute registered successfully', 'id': str(result.inserted_id)}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    userType = data.get('userType')

    if not username or not password or not userType:
        return jsonify({'error': 'Invalid input'}), 400

    # Check credentials (for simplicity, this example uses direct comparison)
    user = mongo.db.institutes.find_one({'adminUsername': username, 'adminPassword': password})
    
    if user:
        return jsonify({'message': 'Login successful', 'user': {'username': username, 'userType': userType}}), 200
    return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/institutes', methods=['GET'])
def get_institutes():
    institutes = mongo.db.institutes.find()
    institute_list = [{'id': str(institute['_id']), 'instituteName': institute['instituteName']} for institute in institutes]
    return jsonify(institute_list), 200

if __name__ == '__main__':
    app.run(debug=True)