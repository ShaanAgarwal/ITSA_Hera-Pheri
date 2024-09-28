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
        if all(k in entry for k in ['teacherName', 'teacherUsername', 'teacherPassword', 'instituteId']):
            teachers_data.append({
                'instituteId': entry['instituteId'],
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
        if all(k in entry for k in ['studentName', 'studentUsername', 'studentPassword', 'instituteId']):
            students_data.append({
                'instituteId': entry['instituteId'],
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

@app.route('/teacher/<user_id>', methods=['GET'])
def get_teacher_details(user_id):
    teacher = mongo.db.teachers.find_one({'_id': ObjectId(user_id)})
    
    if teacher:
        return jsonify({
            'id': str(teacher['_id']),
            'teacherName': teacher['teacherName'],
            'instituteId': teacher['instituteId']
        }), 200

    return jsonify({'error': 'Teacher not found'}), 404

@app.route('/institutes/<institute_id>', methods=['GET'])
def get_institute_details(institute_id):
    institute = mongo.db.institutes.find_one({'_id': ObjectId(institute_id)})
    
    if institute:
        return jsonify({
            'instituteName': institute['instituteName']
        }), 200
    
    return jsonify({'error': 'Institute not found'}), 404

@app.route('/add-course', methods=['POST'])
def add_course():
    data = request.json
    course_data = {
        'courseName': data['courseName'],
        'courseDescription': data['courseDescription'],
        'coursePassword': data['coursePassword'],
        'teacherId': data['teacherId']
    }
    mongo.db.courses.insert_one(course_data)
    return jsonify({'message': 'Course added successfully'}), 201

@app.route('/courses/<teacher_id>', methods=['GET'])
def get_courses(teacher_id):
    courses = mongo.db.courses.find({'teacherId': teacher_id})
    course_list = [{'id': str(course['_id']), 'courseName': course['courseName']} for course in courses]
    return jsonify(course_list), 200

@app.route('/course/<course_id>', methods=['GET'])
def get_course_details(course_id):
    course = mongo.db.courses.find_one({'_id': ObjectId(course_id)})
    
    if course:
        return jsonify({
            'id': str(course['_id']),
            'courseName': course['courseName'],
            'courseDescription': course['courseDescription'],
            'coursePassword': course['coursePassword']
        }), 200
    
    return jsonify({'error': 'Course not found'}), 404

@app.route('/student/<user_id>', methods=['GET'])
def get_student_details(user_id):
    student = mongo.db.students.find_one({'_id': ObjectId(user_id)})
    if student:
        return jsonify({
            'id': str(student['_id']),
            'studentName': student['studentName'],
            'instituteId': student['instituteId']
        }), 200
    return jsonify({'error': 'Student not found'}), 404

@app.route('/teachers/institute/<institute_id>', methods=['GET'])
def get_teachers_by_institute(institute_id):
    teachers = mongo.db.teachers.find({'instituteId': institute_id})
    teacher_list = [{'id': str(teacher['_id']), 'teacherName': teacher['teacherName']} for teacher in teachers]
    return jsonify(teacher_list), 200

@app.route('/courses/teacher/<teacher_id>', methods=['GET'])
def get_courses_by_teacher(teacher_id):
    courses = mongo.db.courses.find({'teacherId': teacher_id})
    course_list = [{'id': str(course['_id']), 'courseName': course['courseName'], 'courseDescription': course['courseDescription'], 'coursePassword': course['coursePassword']} for course in courses]
    return jsonify(course_list), 200

@app.route('/courses/enroll/<course_id>', methods=['PUT'])
def enroll_in_course(course_id):
    data = request.json
    user_id = data.get('userId')
    course_password = data.get('coursePassword')

    # Validate input
    if not user_id or not course_password:
        return jsonify({'error': 'Invalid input'}), 400

    # Find the course
    course = mongo.db.courses.find_one({'_id': ObjectId(course_id)})
    if not course:
        return jsonify({'error': 'Course not found'}), 404

    # Check if the provided password matches
    if course['coursePassword'] != course_password:
        return jsonify({'error': 'Incorrect password'}), 401

    # Update the course with the new student
    if user_id not in course.get('enrolledStudents', []):
        mongo.db.courses.update_one({'_id': ObjectId(course_id)}, {'$push': {'enrolledStudents': user_id}})
    
    # Update the student with the new course
    student = mongo.db.students.find_one({'_id': ObjectId(user_id)})
    if student:
        if course_id not in student.get('courseEnrollments', []):
            mongo.db.students.update_one({'_id': ObjectId(user_id)}, {'$push': {'courseEnrollments': course_id}})
    
    return jsonify({'message': 'Enrollment successful'}), 200

@app.route('/student/<user_id>/enrolledCourses', methods=['GET'])
def get_enrolled_courses(user_id):
    # Find the student by user_id
    student = mongo.db.students.find_one({'_id': ObjectId(user_id)})
    
    if not student:
        return jsonify({'error': 'Student not found'}), 404

    # Get the list of enrolled course IDs
    enrolled_course_ids = student.get('courseEnrollments', [])

    if not enrolled_course_ids:
        return jsonify([]), 200  # No courses enrolled

    # Fetch course details for the enrolled courses
    courses = mongo.db.courses.find({'_id': {'$in': [ObjectId(course_id) for course_id in enrolled_course_ids]}})
    course_list = [{'id': str(course['_id']), 'courseName': course['courseName'], 'courseDescription': course['courseDescription']} for course in courses]

    return jsonify(course_list), 200

if __name__ == '__main__':
    app.run(debug=True)