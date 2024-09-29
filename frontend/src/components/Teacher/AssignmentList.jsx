import React from 'react';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';

const AssignmentList = ({ assignments }) => {
    return (
        <Box mt={4}>
            <Typography variant="h5">Assignments</Typography>
            <List>
                {assignments.map((assignment) => (
                    <ListItem 
                        key={assignment.id} 
                        component={Link} 
                        to={`/assignments/${assignment.id}`}
                        sx={{
                            textDecoration: 'none',
                            color: 'inherit',
                            '&:hover': {
                                backgroundColor: '#f0f0f0',
                            },
                        }}
                    >
                        <ListItemText 
                            primary={
                                <Typography variant="body1">
                                    {assignment.title}
                                </Typography>
                            }
                        />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default AssignmentList;
