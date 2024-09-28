import React, { useEffect, useState } from 'react';
import Navbar from '../components/Student/Navbar';
import axios from 'axios';
import { Typography, Snackbar, Alert, Grid, Paper, Divider } from '@mui/material';
import EnrolledCourses from '../components/Student/EnrolledCourses';
import CourseDialog from '../components/Student/CourseDialog';
import EnrollDialog from '../components/Student/EnrollDialog';
import TeacherList from '../components/Student/TeacherList';

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
            }
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
        }
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
        }
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
            }
        } catch (error) {
            console.error('Error enrolling in course:', error);
            alert(error.response?.data?.error || 'An error occurred while enrolling in the course.');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <Navbar 
                instituteName={instituteName} 
                studentName={studentName} 
                onLogout={handleLogout} 
            />
            <Grid container spacing={2} sx={{ padding: 2, height: 'calc(100vh - 64px)' }}>
                <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Paper elevation={3} sx={{ padding: 2, flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Enrolled Courses</Typography>
                        <Divider sx={{ marginY: 1 }} />
                        <div style={{ flex: 1, overflowY: 'auto' }}>
                            <EnrolledCourses enrolledCourses={enrolledCourses} />
                        </div>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={8} sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Paper elevation={3} sx={{ padding: 2, flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Teachers in Your Institute</Typography>
                        <Divider sx={{ marginY: 1 }} />
                        <div style={{ flex: 1, overflowY: 'auto' }}>
                            <TeacherList teachers={teachers} onTeacherClick={handleTeacherClick} />
                        </div>
                    </Paper>
                </Grid>
            </Grid>
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