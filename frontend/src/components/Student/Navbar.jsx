import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

const Navbar = ({ instituteName, studentName, onLogout }) => {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    {instituteName}
                </Typography>
                <Typography variant="h6" sx={{ marginRight: 2 }}>
                    {studentName}
                </Typography>
                <Button color="inherit" onClick={onLogout}>Logout</Button>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;