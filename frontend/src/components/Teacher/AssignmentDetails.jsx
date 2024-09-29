import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Container,
    Typography,
    List,
    ListItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Box,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import FormRenderer from './FormRenderer';

const AssignmentDetails = () => {
    const [students, setStudents] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [responses, setResponses] = useState({});
    const [filePaths, setFilePaths] = useState({});
    const { assignmentId } = useParams();

    useEffect(() => {
        const fetchAssignmentDetails = async () => {
            try {
                const studentsRes = await axios.get(`http://localhost:5000/api/courses/students/${assignmentId}`);
                const enrolledStudents = studentsRes.data.students;

                const attemptedRes = await axios.get(`http://localhost:5000/api/assignments/attempted/students/${assignmentId}`);
                const attemptedStudentIds = attemptedRes.data.attemptedStudentIds;

                const gradingRes = await axios.get(`http://localhost:5000/api/assignment/grade/${assignmentId}`);
                const gradesData = gradingRes.data;

                const combinedStudents = enrolledStudents.map(student => {
                    const studentGrades = gradesData[student._id] || {};
                    const totalGrade = Object.values(studentGrades).reduce((acc, grade) => acc + parseFloat(grade), 0);
                    return {
                        ...student,
                        hasAttempted: attemptedStudentIds.includes(student._id),
                        totalGrade: studentGrades && Object.keys(studentGrades).length > 0 ? totalGrade : 'N/A',
                    };
                });

                setStudents(combinedStudents);
            } catch (error) {
                console.error('Error fetching assignment details:', error);
            }
        };

        fetchAssignmentDetails();
    }, [assignmentId]);

    const handleOpen = async (student) => {
        setSelectedStudent(student);
        try {
            const responseRes = await axios.get(`http://localhost:5000/assignment/responses/${assignmentId}/${student._id}`);
            const parsedResponses = responseRes.data.responses;
            setResponses(parsedResponses);
            setFilePaths(responseRes.data.file_paths || {});
        } catch (error) {
            console.error('Error fetching responses:', error);
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setResponses({});
        setFilePaths({});
    };

    if (!students.length) {
        return (
            <Container>
                <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    return (
        <Container>
            <Typography variant="h4" gutterBottom align="center">Students</Typography>
            <List>
                {students.map(student => (
                    <ListItem
                        key={student._id}
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleOpen(student)}
                    >
                        <Card
                            variant="outlined"
                            style={{
                                width: '100%',
                                margin: '8px 0',
                                backgroundColor: student.hasAttempted ? '#e8f5e9' : '#ffebee',
                                transition: 'transform 0.2s',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            <CardContent>
                                <Typography variant="h6" style={{ color: student.hasAttempted ? 'green' : 'red' }}>
                                    {student.studentName}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {student.hasAttempted ? 'Attempted' : 'Not Attempted'} 
                                    <br />
                                    {student.totalGrade ? `Total Marks: ${student.totalGrade}` : 'Marks: N/A'}
                                </Typography>
                            </CardContent>
                        </Card>
                    </ListItem>
                ))}
            </List>

            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
                <DialogTitle>{selectedStudent ? `${selectedStudent.studentName}'s Responses` : ''}</DialogTitle>
                <DialogContent>
                    {selectedStudent && (
                        <FormRenderer
                            assignmentId={assignmentId}
                            userId={selectedStudent._id}
                            initialResponses={responses}
                            initialFilePaths={filePaths}
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">Close</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default AssignmentDetails;