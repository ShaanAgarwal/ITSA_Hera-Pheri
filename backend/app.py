from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from bson import ObjectId
import json

app = Flask(__name__)

# MongoDB configuration
app.config["MONGO_URI"] = "mongodb://localhost:27017/samarpan"  # Replace with your MongoDB URI
mongo = PyMongo(app)

@app.route('/register', methods=['POST'])
def register_institute():
    # Get JSON data from request
    data = request.json

    # Validate input
    if not data or 'instituteName' not in data or 'adminUsername' not in data or 'adminPassword' not in data:
        return jsonify({'error': 'Invalid input'}), 400

    # Prepare the institute data
    institute_data = {
        'instituteName': data['instituteName'],
        'adminUsername': data['adminUsername'],
        'adminPassword': data['adminPassword']  # In production, consider hashing passwords
    }

    # Insert into MongoDB
    result = mongo.db.institutes.insert_one(institute_data)
    
    return jsonify({'message': 'Institute registered successfully', 'id': str(result.inserted_id)}), 201

if __name__ == '__main__':
    app.run(debug=True)