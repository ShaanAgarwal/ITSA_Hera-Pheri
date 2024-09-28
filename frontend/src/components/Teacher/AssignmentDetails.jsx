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
    Button
} from '@mui/material';
import { useParams } from 'react-router-dom';
import FormRenderer from './FormRenderer'; // Make sure to import your FormRenderer component

const AssignmentDetails = () => {
    const [students, setStudents] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [responses, setResponses] = useState({});
    const { assignmentId } = useParams();

    useEffect(() => {
        const fetchAssignmentDetails = async () => {
            try {
                const studentsRes = await axios.get(`http://localhost:5000/api/courses/students/${assignmentId}`);
                const enrolledStudents = studentsRes.data.students;

                const attemptedRes = await axios.get(`http://localhost:5000/api/assignments/attempted/students/${assignmentId}`);
                const attemptedStudentIds = attemptedRes.data.attemptedStudentIds;

                const combinedStudents = enrolledStudents.map(student => ({
                    ...student,
                    hasAttempted: attemptedStudentIds.includes(student._id)
                }));

                setStudents(combinedStudents);
            } catch (error) {
                console.error('Error fetching assignment details:', error);
            }
        };

        fetchAssignmentDetails();
    }, [assignmentId]);

    const handleOpen = async (student) => {
        setSelectedStudent(student);
        // Fetch responses for the selected student
        try {
            const responseRes = await axios.get(`http://localhost:5000/assignment/responses/${assignmentId}/${student._id}`);
            setResponses(responseRes.data.responses || {});
        } catch (error) {
            console.error('Error fetching responses:', error);
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setResponses({}); // Clear responses when closing
    };

    if (!students.length) return <div>Loading...</div>;

    return (
        <Container>
            <Typography variant="h6">Students</Typography>
            <List>
                {students.map(student => (
                    <ListItem
                        key={student._id}
                        style={{ color: student.hasAttempted ? 'green' : 'red' }}
                        onClick={() => handleOpen(student)} // Open modal on click
                    >
                        {student.studentName}
                    </ListItem>
                ))}
            </List>

            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
                <DialogTitle>{selectedStudent ? selectedStudent.studentName : ''}'s Responses</DialogTitle>
                <DialogContent>
                    {selectedStudent && (
                        <FormRenderer assignmentId={assignmentId} userId={selectedStudent._id} initialResponses={responses} />
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
