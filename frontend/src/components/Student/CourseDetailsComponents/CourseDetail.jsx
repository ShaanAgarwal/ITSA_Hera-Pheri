import React from 'react';
import { Typography, Box } from '@mui/material';

const CourseDetail = ({ course }) => {
    return (
        <Box sx={{ marginBottom: 4, padding: 2, border: '1px solid #ccc', borderRadius: 2 }}>
            <Typography variant="h4" gutterBottom>
                {course.courseName}
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                {course.courseDescription}
            </Typography>
        </Box>
    );
};

export default CourseDetail;
