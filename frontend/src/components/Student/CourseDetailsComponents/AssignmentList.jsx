import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemText, Typography, Box, Divider } from '@mui/material';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const AssignmentList = ({ assignments, onAssignmentClick }) => {
    const [assignmentStatuses, setAssignmentStatuses] = useState({});
    const userId = localStorage.getItem('userId');
    const { courseId } = useParams();

    useEffect(() => {
        const fetchStatuses = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/assignments/status`, {
                    params: { userId, courseId },
                });

                const statusMap = {};
                response.data.forEach(status => {
                    statusMap[status.assignmentId] = status;
                });

                setAssignmentStatuses(statusMap);
            } catch (error) {
                console.error('Error fetching assignment statuses', error);
            }
        };

        if (userId && courseId) {
            fetchStatuses();
        }
    }, [userId, courseId]);

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
                    assignments.map((assignment, index) => {
                        const assignmentId = assignment.id; 
                        const status = assignmentStatuses[assignmentId] || { attempted: false, graded: false };

                        let backgroundColor = 'inherit';
                        let statusText = 'Pending';

                        if (status.attempted) {
                            if (status.graded) {
                                backgroundColor = '#d0ffd0';
                                statusText = 'Graded';
                            } else {
                                backgroundColor = '#e0e0e0';
                                statusText = 'Attempted';
                            }
                        }

                        return (
                            <React.Fragment key={assignmentId}>
                                <ListItem
                                    onClick={() => {
                                        // Allow click if graded or not attempted
                                        if (status.graded || !status.attempted) {
                                            onAssignmentClick(assignmentId);
                                        }
                                    }}
                                    sx={{
                                        padding: 1,
                                        borderRadius: 1,
                                        backgroundColor: backgroundColor,
                                        '&:hover': (status.graded || !status.attempted) && {
                                            backgroundColor: '#f5f5f5',
                                            cursor: 'pointer',
                                        },
                                    }}
                                >
                                    <ListItemText
                                        primary={assignment.title}
                                        secondary={
                                            <Typography variant="body2" color="textSecondary">
                                                ID: {assignmentId} - Status: {statusText}
                                            </Typography>
                                        }
                                        sx={{
                                            fontWeight: 'medium',
                                            color: '#555',
                                        }}
                                    />
                                </ListItem>
                                {index < assignments.length - 1 && (
                                    <Divider key={`divider-${assignmentId}`} sx={{ marginY: 1 }} />
                                )}
                            </React.Fragment>
                        );
                    })
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
