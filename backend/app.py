from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from bson import ObjectId
from flask_cors import CORS
import json
from datetime import datetime

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
    if not user_id or not course_password:
        return jsonify({'error': 'Invalid input'}), 400
    course = mongo.db.courses.find_one({'_id': ObjectId(course_id)})
    if not course:
        return jsonify({'error': 'Course not found'}), 404
    if course['coursePassword'] != course_password:
        return jsonify({'error': 'Incorrect password'}), 401
    if user_id not in course.get('enrolledStudents', []):
        mongo.db.courses.update_one({'_id': ObjectId(course_id)}, {'$push': {'enrolledStudents': user_id}})
    student = mongo.db.students.find_one({'_id': ObjectId(user_id)})
    if student:
        if course_id not in student.get('courseEnrollments', []):
            mongo.db.students.update_one({'_id': ObjectId(user_id)}, {'$push': {'courseEnrollments': course_id}})
    return jsonify({'message': 'Enrollment successful'}), 200

@app.route('/student/<user_id>/enrolledCourses', methods=['GET'])
def get_enrolled_courses(user_id):
    student = mongo.db.students.find_one({'_id': ObjectId(user_id)})
    if not student:
        return jsonify({'error': 'Student not found'}), 404
    enrolled_course_ids = student.get('courseEnrollments', [])
    if not enrolled_course_ids:
        return jsonify([]), 200
    courses = mongo.db.courses.find({'_id': {'$in': [ObjectId(course_id) for course_id in enrolled_course_ids]}})
    course_list = [{'id': str(course['_id']), 'courseName': course['courseName'], 'courseDescription': course['courseDescription']} for course in courses]
    return jsonify(course_list), 200

@app.route('/upload-assignment/<course_id>', methods=['POST'])
def upload_assignment(course_id):
    data = request.json
    if not data or 'title' not in data or 'questions' not in data:
        return jsonify({'error': 'Invalid input'}), 400
    if 'deadline' not in data or 'date' not in data['deadline'] or 'time' not in data['deadline']:
        return jsonify({'error': 'Deadline date and time are required'}), 400
    deadline_datetime = f"{data['deadline']['date']}"
    assignment_data = {
        'title': data['title'],
        'questions': data['questions'],
        'courseId': course_id,
        'deadline': deadline_datetime 
    }
    result = mongo.db.assignments.insert_one(assignment_data)
    return jsonify({'message': 'Assignment uploaded successfully', 'id': str(result.inserted_id)}), 201

@app.route('/course/<course_id>/assignments', methods=['GET'])
def get_assignments_by_course(course_id):
    assignments = mongo.db.assignments.find({'courseId': course_id})
    assignment_list = [{'id': str(assignment['_id']), 'title': assignment['title'], 'questions': assignment['questions']} for assignment in assignments]
    return jsonify(assignment_list), 200

@app.route('/assignments/<assignment_id>', methods=['GET'])
def get_assignment_details(assignment_id):
    assignment = mongo.db.assignments.find_one({'_id': ObjectId(assignment_id)})
    if assignment:
        return jsonify({
            'id': str(assignment['_id']),
            'title': assignment['title'],
            'questions': assignment['questions'],
            'courseId': assignment['courseId']
        }), 200
    return jsonify({'error': 'Assignment not found'}), 404

@app.route('/assignments/<assignment_id>/responses', methods=['POST'])
def save_responses(assignment_id):
    data = request.json
    if not data or 'responses' not in data or 'userId' not in data:
        return jsonify({'error': 'Invalid input, responses or userId not found'}), 400
    responses = data['responses']
    user_id = data['userId']
    response_data = {
        'assignmentId': assignment_id,
        'responses': responses,
        'userId': user_id, 
    }
    try:
        mongo.db.responses.insert_one(response_data)
        return jsonify({'message': 'Responses saved successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/assignments/<assignment_id>/status', methods=['GET'])
def check_assignment_status(assignment_id):
    user_id = request.args.get('userId')
    if not user_id:
        return jsonify({'error': 'User ID is required'}), 400
    
    response = mongo.db.responses.find_one({
        'assignmentId': assignment_id,
        'userId': user_id
    })

    if response:
        return jsonify({'attempted': True}), 200
    else:
        return jsonify({'attempted': False}), 200     
    
@app.route('/api/courses/students/<assignment_id>', methods=['GET'])
def get_students_in_course(assignment_id):
    try:
        assignment = mongo.db.assignments.find_one({'_id': ObjectId(assignment_id)})
        if not assignment:
            return jsonify({'error': 'Assignment not found'}), 404
        
        course_id = assignment['courseId']
        course = mongo.db.courses.find_one({'_id': ObjectId(course_id)})
        if not course:
            return jsonify({'error': 'Course not found'}), 404
        
        enrolled_students_ids = course['enrolledStudents']
        students = list(mongo.db.students.find({'_id': {'$in': [ObjectId(student_id) for student_id in enrolled_students_ids]}}))
        
        students = [{**student, '_id': str(student['_id'])} for student in students]
        
        return jsonify({'students': students})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/api/assignments/attempted/students/<assignment_id>', methods=['GET'])
def get_students_attempted_assignment(assignment_id):
    try:
        responses = list(mongo.db.responses.find({'assignmentId': assignment_id}))        
        attempted_student_ids = {response['userId'] for response in responses}
        return jsonify({'attemptedStudentIds': list(attempted_student_ids)})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/assignment/responses/<assignment_id>/<user_id>', methods=['GET'])
def get_student_responses(assignment_id, user_id):
    responses = mongo.db.responses.find_one({
        'assignmentId': assignment_id,
        'userId': user_id
    })
    if not responses:
        return jsonify({'error': 'No responses found'}), 404
    responses['_id'] = str(responses['_id'])
    return jsonify(responses), 200

@app.route('/assignments/grade/<assignment_id>', methods=['POST'])
def grade_assignment(assignment_id):
    data = request.json
    print(data)
    if not data or 'userId' not in data or 'grades' not in data:
        return jsonify({'error': 'Invalid input'}), 400
    
    grading_data = {
        'assignmentId': assignment_id,
        'userId': data['userId'],
        'grades': data['grades']
    }
    
    existing_grades = mongo.db.grades.find_one({
        'assignmentId': assignment_id,
        'userId': data['userId']
    })
    
    if existing_grades:
        mongo.db.grades.update_one(
            {'_id': existing_grades['_id']},
            {'$set': {'grades': grading_data['grades']}}
        )
        message = 'Grades updated successfully'
    else:
        result = mongo.db.grades.insert_one(grading_data)
        message = 'Grades submitted successfully'
    
    # Mark grading as true in responses
    mongo.db.responses.update_one(
        {
            'assignmentId': assignment_id,
            'userId': data['userId']
        },
        {'$set': {'graded': True}}  # Assuming you want to add a 'graded' field
    )
    
    return jsonify({'message': message}), 200

if __name__ == '__main__':
    app.run(debug=True)