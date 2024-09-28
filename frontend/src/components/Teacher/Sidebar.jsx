import React from 'react';
import { Box, Button, List, ListItem, Typography } from '@mui/material';

const Sidebar = ({ onAddCourse, onViewCourses }) => {
    return (
        <Box 
            sx={{ 
                width: 250, 
                backgroundColor: '#fafafa', 
                height: '100vh', 
                padding: 2, 
                boxShadow: 2, 
                display: 'flex', 
                flexDirection: 'column' 
            }}
        >
            <Typography variant="h6" sx={{ marginBottom: 2, fontWeight: 'bold', color: '#333' }}>
                Dashboard Menu
            </Typography>
            <List sx={{ flexGrow: 1 }}>
                <ListItem>
                    <Button 
                        fullWidth 
                        variant="contained" 
                        onClick={onAddCourse} 
                        sx={{ 
                            borderRadius: 25, 
                            padding: 1.5, 
                            backgroundColor: '#1976d2',
                            '&:hover': {
                                backgroundColor: '#1565c0'
                            }
                        }}
                    >
                        Add Course
                    </Button>
                </ListItem>
                <ListItem>
                    <Button 
                        fullWidth 
                        variant="contained" 
                        onClick={onViewCourses} 
                        sx={{ 
                            borderRadius: 25, 
                            padding: 1.5, 
                            backgroundColor: '#1976d2',
                            '&:hover': {
                                backgroundColor: '#1565c0'
                            }
                        }}
                    >
                        View All Courses
                    </Button>
                </ListItem>
            </List>
        </Box>
    );
};

export default Sidebar;