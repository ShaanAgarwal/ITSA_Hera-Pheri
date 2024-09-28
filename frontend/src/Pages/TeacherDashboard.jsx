import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, CircularProgress, Typography, List, ListItem, ListItemText, Button } from '@mui/material';
import Navbar from '../components/Teacher/Navbar';
import Sidebar from '../components/Teacher/Sidebar';
import AddCourse from '../components/Teacher/AddCourse';
import axios from 'axios';

const TeacherDashboard = () => {
    const [instituteName, setInstituteName] = useState('');
    const [teacherName, setTeacherName] = useState('');
    const [loading, setLoading] = useState(true);
    const [showAddCourse, setShowAddCourse] = useState(false);
    const [courses, setCourses] = useState([]);
    const [showCourses, setShowCourses] = useState(false);
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const fetchTeacherDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/teacher/${userId}`);
                setTeacherName(response.data.teacherName);
                
                const instituteResponse = await axios.get(`http://localhost:5000/institutes/${response.data.instituteId}`);
                setInstituteName(instituteResponse.data.instituteName);
            } catch (error) {
                console.error('Error fetching teacher details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTeacherDetails();
    }, [userId]);

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/';
    };

    const handleAddCourse = () => {
        setShowAddCourse(true);
        setShowCourses(false);
    };

    const handleViewCourses = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/courses/${userId}`);
            setCourses(response.data);
            setShowCourses(true);
            setShowAddCourse(false);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    const handleCourseAdded = () => {
        handleViewCourses();
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box display="flex" sx={{ bgcolor: '#f5f5f5', height: '100vh' }}>
            <Sidebar onAddCourse={handleAddCourse} onViewCourses={handleViewCourses} />
            <Box sx={{ padding: 3, flexGrow: 1 }}>
                <Navbar 
                    instituteName={instituteName} 
                    teacherName={teacherName} 
                    onLogout={handleLogout} 
                />
                <Box sx={{ mt: 3, bgcolor: '#fff', borderRadius: 2, boxShadow: 3, p: 3 }}>
                    {showAddCourse && <AddCourse onCourseAdded={handleCourseAdded} />}
                    {showCourses && (
                        <div>
                            <Typography variant="h5" sx={{ mb: 2 }}>
                                My Courses
                            </Typography>
                            <List>
                                {courses.map(course => (
                                    <ListItem key={course.id} sx={{ bgcolor: '#fafafa', mb: 1, borderRadius: 1, '&:hover': { bgcolor: '#e0e0e0', cursor: 'pointer' } }}>
                                        <ListItemText 
                                            primary={<Link to={`/course/${course.id}`} style={{ textDecoration: 'none', color: '#1976d2' }}>{course.courseName}</Link>} 
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </div>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default TeacherDashboard;