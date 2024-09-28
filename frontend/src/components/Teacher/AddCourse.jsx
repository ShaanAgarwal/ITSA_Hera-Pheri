import React, { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';
import axios from 'axios';

const AddCourse = ({ onCourseAdded }) => {
    const [courseName, setCourseName] = useState('');
    const [courseDescription, setCourseDescription] = useState('');
    const [coursePassword, setCoursePassword] = useState('');

    const handleAddCourse = async () => {
        const userId = localStorage.getItem('userId');

        try {
            await axios.post('http://localhost:5000/add-course', {
                courseName,
                courseDescription,
                coursePassword,
                teacherId: userId
            });
            onCourseAdded();
            setCourseName('');
            setCourseDescription('');
            setCoursePassword('');
        } catch (error) {
            console.error('Error adding course:', error);
        }
    };

    return (
        <Box sx={{ padding: 2 }}>
            <h2>Add Course</h2>
            <TextField
                fullWidth
                label="Course Name"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                sx={{ marginBottom: 2 }}
            />
            <TextField
                fullWidth
                label="Course Description"
                value={courseDescription}
                onChange={(e) => setCourseDescription(e.target.value)}
                sx={{ marginBottom: 2 }}
            />
            <TextField
                fullWidth
                label="Course Password"
                type="password"
                value={coursePassword}
                onChange={(e) => setCoursePassword(e.target.value)}
                sx={{ marginBottom: 2 }}
            />
            <Button variant="contained" onClick={handleAddCourse}>
                Add Course
            </Button>
        </Box>
    );
};

export default AddCourse;
