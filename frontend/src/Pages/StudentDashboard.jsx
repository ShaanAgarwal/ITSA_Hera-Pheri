import React, { useEffect, useState } from 'react';
import Navbar from '../components/Student/Navbar';
import axios from 'axios';
import { Box, Typography, Snackbar, Alert } from '@mui/material';
import TeacherList from '../components/Student/TeacherList';
import EnrolledCourses from '../components/Student/EnrolledCourses';
import CourseDialog from '../components/Student/CourseDialog';
import EnrollDialog from '../components/Student/EnrollDialog';

const StudentDashboard = () => {
    const [instituteName, setInstituteName] = useState('');
    const [studentName, setStudentName] = useState('');
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [courses, setCourses] = useState([]);
    const [enrollPassword, setEnrollPassword] = useState('');
    const [selectedCourseId, setSelectedCourseId] = useState(null);
    const [enrollmentSuccess, setEnrollmentSuccess] = useState(false);
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const fetchStudentDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/student/${userId}`);
                setStudentName(response.data.studentName);
                const instituteResponse = await axios.get(`http://localhost:5000/institutes/${response.data.instituteId}`);
                setInstituteName(instituteResponse.data.instituteName);
                const teachersResponse = await axios.get(`http://localhost:5000/teachers/institute/${response.data.instituteId}`);
                setTeachers(teachersResponse.data);
                const coursesResponse = await axios.get(`http://localhost:5000/student/${userId}/enrolledCourses`);
                setEnrolledCourses(coursesResponse.data);
            } catch (error) {
                console.error('Error fetching student details:', error);
            } finally {
                setLoading(false);
            };
        };
        fetchStudentDetails();
    }, [userId]);

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/';
    };

    const handleTeacherClick = async (teacherId) => {
        try {
            const response = await axios.get(`http://localhost:5000/courses/teacher/${teacherId}`);
            setCourses(response.data);
            setSelectedTeacher(teacherId);
        } catch (error) {
            console.error('Error fetching courses:', error);
        };
    };

    const handleClose = () => {
        setSelectedTeacher(null);
        setCourses([]);
        setEnrollPassword('');
        setSelectedCourseId(null);
    };

    const handleEnrollClick = (courseId) => {
        setSelectedCourseId(courseId);
    };

    const handleEnroll = async () => {
        if (!enrollPassword || !selectedCourseId) {
            alert("Please enter the password and select a course.");
            return;
        };
        try {
            const response = await axios.put(`http://localhost:5000/courses/enroll/${selectedCourseId}`, { 
                userId, 
                coursePassword: enrollPassword  
            });
            if (response.status === 200) {
                setEnrollmentSuccess(true);
                handleClose();
                const coursesResponse = await axios.get(`http://localhost:5000/student/${userId}/enrolledCourses`);
                setEnrolledCourses(coursesResponse.data);
            };
        } catch (error) {
            console.error('Error enrolling in course:', error);
            alert(error.response?.data?.error || 'An error occurred while enrolling in the course.');
        };
    };

    if (loading) {
        return <div>Loading...</div>;
    };

    return (
        <div>
            <Navbar 
                instituteName={instituteName} 
                studentName={studentName} 
                onLogout={handleLogout} 
            />
            <Box sx={{ padding: 2 }}>
                <Typography variant="h4">Welcome to the Student Dashboard</Typography>
                <Typography variant="h5">Teachers in your Institute:</Typography>
                <TeacherList teachers={teachers} onTeacherClick={handleTeacherClick} />
                <Typography variant="h5" sx={{ marginTop: 3 }}>Enrolled Courses:</Typography>
                <EnrolledCourses enrolledCourses={enrolledCourses} />
            </Box>
            <CourseDialog open={Boolean(selectedTeacher)} onClose={handleClose} courses={courses} onEnrollClick={handleEnrollClick} />
            <EnrollDialog 
                open={Boolean(selectedCourseId)} 
                onClose={() => setSelectedCourseId(null)} 
                enrollPassword={enrollPassword} 
                setEnrollPassword={setEnrollPassword} 
                onEnroll={handleEnroll} 
            />
            <Snackbar open={enrollmentSuccess} autoHideDuration={6000} onClose={() => setEnrollmentSuccess(false)}>
                <Alert onClose={() => setEnrollmentSuccess(false)} severity="success">
                    Enrollment successful!
                </Alert>
            </Snackbar>
        </div>
    );
};

export default StudentDashboard;