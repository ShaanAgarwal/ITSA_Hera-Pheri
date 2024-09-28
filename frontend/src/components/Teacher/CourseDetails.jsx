import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

import {
    Box,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Snackbar,
    List,
    ListItem,
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import FormBuilder from './FormBuilder';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const CourseDetails = () => {
    const { courseId } = useParams();
    const [courseDetails, setCourseDetails] = useState(null);
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openFormBuilder, setOpenFormBuilder] = useState(false);
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

    const handleOpenFormBuilder = () => {
        setOpenFormBuilder(true);
    };

    const handleCloseFormBuilder = () => {
        setOpenFormBuilder(false);
    };

    const handleAssignmentCreated = (assignment) => {
        setAssignments((prev) => [...prev, assignment]);
        setSnackbarMessage('Assignment created successfully!');
        setSnackbarOpen(true);
        handleCloseFormBuilder();
    };

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
            <Button variant="contained" color="primary" onClick={handleOpenFormBuilder}>
                Add Assignment
            </Button>

            <Box mt={4}>
                <Typography variant="h5">Assignments</Typography>
                <List>
                    {assignments.map((assignment) => (
                        <ListItem key={assignment.id}>
                            <Typography variant="body1">{assignment.title}</Typography>
                        </ListItem>
                    ))}
                </List>
            </Box>

            <Dialog open={openFormBuilder} onClose={handleCloseFormBuilder} fullWidth maxWidth="md">
                <DialogTitle>Add Assignment</DialogTitle>
                <DialogContent>
                    <FormBuilder courseId={courseId} onAssignmentCreated={handleAssignmentCreated} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseFormBuilder}>Close</Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
                <Alert onClose={() => setSnackbarOpen(false)} severity="success">
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default CourseDetails;