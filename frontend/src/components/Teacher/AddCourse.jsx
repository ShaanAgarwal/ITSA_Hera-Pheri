import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Alert } from '@mui/material';
import axios from 'axios';

const AddCourse = ({ onCourseAdded }) => {
    const [courseName, setCourseName] = useState('');
    const [courseDescription, setCourseDescription] = useState('');
    const [coursePassword, setCoursePassword] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleAddCourse = async () => {
        const userId = localStorage.getItem('userId');

        try {
            await axios.post('http://localhost:5000/add-course', {
                courseName,
                courseDescription,
                coursePassword,
                teacherId: userId
            });
            setSuccess("Course added successfully!");
            onCourseAdded();
            resetForm();
        } catch (error) {
            setError("Error adding course. Please try again.");
            console.error('Error adding course:', error);
        }
    };

    const resetForm = () => {
        setCourseName('');
        setCourseDescription('');
        setCoursePassword('');
        setError(null);
        setSuccess(null);
    };

    return (
        <Box sx={{ padding: 3, borderRadius: 2, boxShadow: 3, backgroundColor: '#fff' }}>
            <Typography variant="h5" gutterBottom>
                Add New Course
            </Typography>
            {success && (
                <Alert severity="success" onClose={() => setSuccess(null)} sx={{ marginBottom: 2 }}>
                    {success}
                </Alert>
            )}
            {error && (
                <Alert severity="error" onClose={() => setError(null)} sx={{ marginBottom: 2 }}>
                    {error}
                </Alert>
            )}
            <TextField
                fullWidth
                label="Course Name"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                sx={{ marginBottom: 2 }}
                variant="outlined"
                required
            />
            <TextField
                fullWidth
                label="Course Description"
                value={courseDescription}
                onChange={(e) => setCourseDescription(e.target.value)}
                sx={{ marginBottom: 2 }}
                variant="outlined"
                multiline
                rows={4}
                required
            />
            <TextField
                fullWidth
                label="Course Password"
                type="password"
                value={coursePassword}
                onChange={(e) => setCoursePassword(e.target.value)}
                sx={{ marginBottom: 2 }}
                variant="outlined"
                required
            />
            <Button 
                variant="contained" 
                onClick={handleAddCourse} 
                sx={{ borderRadius: 25, padding: '10px 20px' }}
            >
                Add Course
            </Button>
        </Box>
    );
};

export default AddCourse;