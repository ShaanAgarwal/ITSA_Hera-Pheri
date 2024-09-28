import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, List, ListItem } from '@mui/material';
import { useParams } from 'react-router-dom';

const AssignmentDetails = () => {
    const [students, setStudents] = useState([]);
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

    if (!students.length) return <div>Loading...</div>;

    return (
        <Container>
            <Typography variant="h6">Students</Typography>
            <List>
                {students.map(student => ( 
                    <ListItem key={student._id} style={{ color: student.hasAttempted ? 'green' : 'red' }}>
                        {student.studentName}
                    </ListItem>
                ))}
            </List>
        </Container>
    );
};

export default AssignmentDetails;