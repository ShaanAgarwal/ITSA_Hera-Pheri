import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

const Navbar = ({ instituteName, teacherName, onLogout }) => {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" style={{ flexGrow: 1 }}>
                    {instituteName}
                </Typography>
                <Typography variant="h6" style={{ marginRight: 20 }}>
                    {teacherName}
                </Typography>
                <Button color="inherit" onClick={onLogout}>Logout</Button>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
