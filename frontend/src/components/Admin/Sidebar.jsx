import React from 'react';
import { Box, Button, List, ListItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
    const navigate = useNavigate();

    return (
        <Box sx={{ width: 250, backgroundColor: '#f4f4f4', height: '100vh', padding: 2 }}>
            <List>
                <ListItem>
                    <Button fullWidth variant="contained" onClick={() => navigate('/add-teacher')}>
                        Add Teacher
                    </Button>
                </ListItem>
                <ListItem>
                    <Button fullWidth variant="contained" onClick={() => navigate('/add-student')}>
                        Add Student
                    </Button>
                </ListItem>
            </List>
        </Box>
    );
};

export default Sidebar;
