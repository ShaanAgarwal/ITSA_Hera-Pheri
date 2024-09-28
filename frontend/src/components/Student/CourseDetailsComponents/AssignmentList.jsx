import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemText, Typography, Box, Divider } from '@mui/material';
import axios from 'axios';

const AssignmentList = ({ assignments, onAssignmentClick }) => {

    const [attemptedAssignments, setAttemptedAssignments] = useState({});
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const fetchAttemptedStatuses = async () => {
            const statuses = await Promise.all(assignments.map(async (assignment) => {
                const response = await axios.get(`http://localhost:5000/assignments/${assignment.id}/status`, {
                    params: { userId },
                });
                return { id: assignment.id, attempted: response.data.attempted };
            }));
            const statusMap = statuses.reduce((acc, status) => {
                acc[status.id] = status.attempted;
                return acc;
            }, {});
            setAttemptedAssignments(statusMap);
        };

        fetchAttemptedStatuses();
    }, [assignments, userId]);

    return (
        <Box
            sx={{
                border: '1px solid #e0e0e0',
                borderRadius: 2,
                padding: 2,
                backgroundColor: '#fafafa',
                boxShadow: 1,
            }}
        >
            <Typography variant="h6" sx={{ marginBottom: 2, fontWeight: 'bold', color: '#333' }}>
                Assignments
            </Typography>
            <List>
                {assignments.length > 0 ? (
                    assignments.map((assignment, index) => (
                        <React.Fragment key={assignment.id}>
                            <ListItem
                                onClick={() => {
                                    if (!attemptedAssignments[assignment.id]) {
                                        onAssignmentClick(assignment.id);
                                    }
                                }}
                                sx={{
                                    padding: 1,
                                    borderRadius: 1,
                                    backgroundColor: attemptedAssignments[assignment.id] ? '#e0e0e0' : 'inherit',
                                    '&:hover': !attemptedAssignments[assignment.id] && {
                                        backgroundColor: '#f5f5f5',
                                        cursor: 'pointer',
                                    },
                                }}
                            >
                                <ListItemText
                                    primary={assignment.title}
                                    secondary={attemptedAssignments[assignment.id] ? "Attempted" : "Pending"}
                                    sx={{
                                        fontWeight: 'medium',
                                        color: '#555',
                                    }}
                                />
                            </ListItem>
                            {index < assignments.length - 1 && <Divider sx={{ marginY: 1 }} />}
                        </React.Fragment>
                    ))
                ) : (
                    <Typography variant="body2" sx={{ color: '#777' }}>
                        No assignments found for this course.
                    </Typography>
                )}
            </List>
        </Box>
    );
};

export default AssignmentList;