// CourseDetails.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Box, Typography } from '@mui/material';

const CourseDetails = () => {
    const { courseId } = useParams(); // Get course ID from URL
    const [courseDetails, setCourseDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourseDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/course/${courseId}`);
                setCourseDetails(response.data);
            } catch (error) {
                console.error('Error fetching course details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourseDetails();
    }, [courseId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!courseDetails) {
        return <div>Course not found.</div>;
    }

    return (
        <Box sx={{ padding: 2 }}>
            <Typography variant="h4">{courseDetails.courseName}</Typography>
            <Typography variant="h6">Description: {courseDetails.courseDescription}</Typography>
            <Typography variant="body1">Password: {courseDetails.coursePassword}</Typography>
        </Box>
    );
};

export default CourseDetails;
