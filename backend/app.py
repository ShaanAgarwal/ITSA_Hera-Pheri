from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from bson import ObjectId
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)

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
        'adminPassword': data['adminPassword'],
        'userType': 'admin'
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

    user = None

    if userType == 'admin':
        user = mongo.db.institutes.find_one({'adminUsername': username, 'adminPassword': password})
    elif userType == 'teacher':
        user = mongo.db.teachers.find_one({'teacherUsername': username, 'teacherPassword': password})
    elif userType == 'student':
        user = mongo.db.students.find_one({'studentUsername': username, 'studentPassword': password})
    else:
        return jsonify({'error': 'Invalid user type'}), 400

    if user:
        user_id = str(user['_id'])
        return jsonify({
            'message': 'Login successful',
            'user': {
                'id': user_id,
                'username': username,
                'userType': userType
            }
        }), 200

    return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/institutes', methods=['GET'])
def get_institutes():
    institutes = mongo.db.institutes.find()
    institute_list = [{'id': str(institute['_id']), 'instituteName': institute['instituteName']} for institute in institutes]
    return jsonify(institute_list), 200

@app.route('/admin/<user_id>', methods=['GET'])
def get_admin_details(user_id):
    admin = mongo.db.institutes.find_one({'_id': ObjectId(user_id)})
    
    if admin:
        return jsonify({
            'id': str(admin['_id']),
            'instituteName': admin['instituteName'],
            'adminUsername': admin['adminUsername']
        }), 200
    
    return jsonify({'error': 'Admin not found'}), 404

@app.route('/upload-teacher', methods=['POST'])
def upload_teacher():
    data = request.json

    if not data:
        return jsonify({'error': 'No data provided'}), 400

    teachers_data = []
    for entry in data:
        # Check for required fields
        if all(k in entry for k in ['teacherName', 'teacherUsername', 'teacherPassword', 'instituteId']):
            teachers_data.append({
                'instituteId': entry['instituteId'],  # Directly take it from the entry
                'teacherName': entry['teacherName'],
                'teacherUsername': entry['teacherUsername'],
                'teacherPassword': entry['teacherPassword'],
            })
        else:
            missing_fields = [k for k in ['teacherName', 'teacherUsername', 'teacherPassword', 'instituteId'] if k not in entry]
            return jsonify({'error': 'Invalid data format for teachers', 'missing_fields': missing_fields}), 400

    if teachers_data:
        mongo.db.teachers.insert_many(teachers_data)
        return jsonify({'message': 'Teachers added successfully'}), 201

    return jsonify({'error': 'No valid teacher data found'}), 400


@app.route('/upload-student', methods=['POST'])
def upload_student():
    data = request.json

    if not data:
        return jsonify({'error': 'No data provided'}), 400

    students_data = []
    for entry in data:
        # Check for required fields
        if all(k in entry for k in ['studentName', 'studentUsername', 'studentPassword', 'instituteId']):
            students_data.append({
                'instituteId': entry['instituteId'],  # Directly take it from the entry
                'studentName': entry['studentName'],
                'studentUsername': entry['studentUsername'],
                'studentPassword': entry['studentPassword'],
            })
        else:
            missing_fields = [k for k in ['studentName', 'studentUsername', 'studentPassword', 'instituteId'] if k not in entry]
            return jsonify({'error': 'Invalid data format for students', 'missing_fields': missing_fields}), 400

    if students_data:
        mongo.db.students.insert_many(students_data)
        return jsonify({'message': 'Students added successfully'}), 201

    return jsonify({'error': 'No valid student data found'}), 400


if __name__ == '__main__':
    app.run(debug=True)