import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MuiAlert from '@mui/material/Alert';
import AssignmentList from './AssignmentList';
import AddAssignmentDialog from './AddAssignmentDialog';
import GradesDialog from './GradesDialog';
import axios from 'axios';
import {
    Box,
    Typography,
    Button,
    Snackbar,
    CircularProgress,
    Card,
    CardContent,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    List,
    ListItem,
    Divider,
    IconButton,
    Grid,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const CourseDetails = () => {
    const { courseId } = useParams();
    const [courseDetails, setCourseDetails] = useState(null);
    const [assignments, setAssignments] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [studentDialogOpen, setStudentDialogOpen] = useState(false);
    const [gradesDialogOpen, setGradesDialogOpen] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [gradesData, setGradesData] = useState([]);

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

    const fetchStudents = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/course/${courseId}/students`);
            setStudents(response.data);
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    };

    const handleStudentDialogOpen = () => {
        fetchStudents();
        setStudentDialogOpen(true);
    };

    const handleStudentDialogClose = () => setStudentDialogOpen(false);

    const fetchGrades = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/course/${courseId}/students/assignments`);
            setGradesData(response.data);
        } catch (error) {
            console.error('Error fetching grades:', error);
        }
    };

    const handleGradesDialogOpen = () => {
        fetchGrades();
        setGradesDialogOpen(true);
    };

    const handleGradesDialogClose = () => setGradesDialogOpen(false);

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
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h4" gutterBottom>{courseDetails.courseName}</Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">Description:</Typography>
                    <Typography variant="body1" sx={{ marginBottom: 2 }}>{courseDetails.courseDescription}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 2 }}>
                        <strong>Password:</strong> {courseDetails.coursePassword}
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                            <Button variant="contained" color="primary" onClick={handleOpenDialog} fullWidth>
                                Add Assignment
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Button variant="outlined" color="secondary" onClick={handleStudentDialogOpen} fullWidth>
                                View Enrolled Students
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Button variant="outlined" color="success" onClick={handleGradesDialogOpen} fullWidth>
                                View Overall Grades
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            <AssignmentList assignments={assignments} />

            <AddAssignmentDialog 
                open={openDialog} 
                onClose={handleCloseDialog} 
                courseId={courseId} 
                onAssignmentCreated={handleAssignmentCreated} 
            />

            <Dialog open={studentDialogOpen} onClose={handleStudentDialogClose} maxWidth="sm" fullWidth>
                <DialogTitle>
                    Enrolled Students
                    <IconButton
                        edge="end"
                        color="inherit"
                        onClick={handleStudentDialogClose}
                        aria-label="close"
                        sx={{ position: 'absolute', right: 8, top: 8 }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <List>
                        {students.length > 0 ? (
                            students.map(student => (
                                <ListItem key={student._id}>
                                    <Typography>{student.studentName}</Typography>
                                </ListItem>
                            ))
                        ) : (
                            <Typography>No students enrolled in this course.</Typography>
                        )}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleStudentDialogClose} color="primary">Close</Button>
                </DialogActions>
            </Dialog>

            <GradesDialog 
                open={gradesDialogOpen} 
                onClose={handleGradesDialogClose} 
                gradesData={gradesData} 
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
