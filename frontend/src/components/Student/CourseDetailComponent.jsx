import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Grid, Typography, Box, AppBar, Toolbar, IconButton } from '@mui/material';
import CourseDetail from './CourseDetailsComponents/CourseDetail';
import AssignmentList from './CourseDetailsComponents/AssignmentList';
import AssignmentModal from './CourseDetailsComponents/AssignmentModal';
import LoadingIndicator from './CourseDetailsComponents/LoadingIndicator';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const CourseDetailComponent = () => {
    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourseDetails = async () => {
            try {
                const courseResponse = await axios.get(`http://localhost:5000/course/${courseId}`);
                setCourse(courseResponse.data);
                const assignmentsResponse = await axios.get(`http://localhost:5000/course/${courseId}/assignments`);
                setAssignments(assignmentsResponse.data);
            } catch (error) {
                console.error('Error fetching course details or assignments:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourseDetails();
    }, [courseId]);

    const handleAssignmentClick = (assignmentId) => {
        setSelectedAssignmentId(assignmentId);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedAssignmentId(null);
    };

    if (loading) {
        return <LoadingIndicator />;
    }

    return (
        <Container>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="back" onClick={() => navigate(-1)}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Course Details
                    </Typography>
                </Toolbar>
            </AppBar>

            <Box sx={{ padding: 3 }}>
                {course && <CourseDetail course={course} />}
                
                <Typography variant="h5" sx={{ marginY: 2 }}>
                    Assignments
                </Typography>
                <AssignmentList assignments={assignments} onAssignmentClick={handleAssignmentClick} />
            </Box>

            <AssignmentModal 
                open={isModalOpen} 
                onClose={closeModal} 
                assignmentTitle={assignments.find(a => a.id === selectedAssignmentId)?.title} 
                assignmentId={selectedAssignmentId} 
            />
        </Container>
    );
};

export default CourseDetailComponent;