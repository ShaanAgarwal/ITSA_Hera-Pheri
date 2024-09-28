import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Box, Typography, Button, Snackbar, CircularProgress, Grid } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import AssignmentList from './AssignmentList';
import AddAssignmentDialog from './AddAssignmentDialog';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const CourseDetails = () => {
    const { courseId } = useParams();
    const [courseDetails, setCourseDetails] = useState(null);
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

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

        const fetchAssignments = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/course/${courseId}/assignments`);
                setAssignments(response.data);
            } catch (error) {
                console.error('Error fetching assignments:', error);
            }
        };

        fetchCourseDetails();
        fetchAssignments();
    }, [courseId]);

    const handleOpenDialog = () => setOpenDialog(true);
    const handleCloseDialog = () => setOpenDialog(false);

    const handleAssignmentCreated = (assignment) => {
        setAssignments((prev) => [...prev, assignment]);
        setSnackbarMessage('Assignment created successfully!');
        setSnackbarOpen(true);
        handleCloseDialog();
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!courseDetails) {
        return <Typography variant="h6" color="error">Course not found.</Typography>;
    }

    return (
        <Box sx={{ padding: 3, backgroundColor: '#f9f9f9', borderRadius: 2, boxShadow: 2 }}>
            <Typography variant="h4" gutterBottom>{courseDetails.courseName}</Typography>
            <Typography variant="h6" color="text.secondary">Description:</Typography>
            <Typography variant="body1" sx={{ marginBottom: 2 }}>{courseDetails.courseDescription}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 2 }}>
                <strong>Password:</strong> {courseDetails.coursePassword}
            </Typography>
            <Button 
                variant="contained" 
                color="primary" 
                onClick={handleOpenDialog} 
                sx={{ mb: 2 }}
            >
                Add Assignment
            </Button>

            <AssignmentList assignments={assignments} />

            <AddAssignmentDialog 
                open={openDialog} 
                onClose={handleCloseDialog} 
                courseId={courseId} 
                onAssignmentCreated={handleAssignmentCreated} 
            />

            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
                <Alert onClose={() => setSnackbarOpen(false)} severity="success">
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default CourseDetails;