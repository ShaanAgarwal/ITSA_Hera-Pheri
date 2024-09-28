import React from 'react';
import { Box, Button, List, ListItem } from '@mui/material';

const Sidebar = ({ onAddCourse, onViewCourses }) => {
    return (
        <Box sx={{ width: 250, backgroundColor: '#f4f4f4', height: '100vh', padding: 2 }}>
            <List>
                <ListItem>
                    <Button fullWidth variant="contained" onClick={onAddCourse}>
                        Add Course
                    </Button>
                </ListItem>
                <ListItem>
                    <Button fullWidth variant="contained" onClick={onViewCourses}>
                        View All Courses
                    </Button>
                </ListItem>
            </List>
        </Box>
    );
};

export default Sidebar;
