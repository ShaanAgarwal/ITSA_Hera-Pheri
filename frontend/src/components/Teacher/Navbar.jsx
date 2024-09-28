import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const Navbar = ({ instituteName, teacherName, onLogout }) => {
    const theme = useTheme();

    return (
        <AppBar position="static" sx={{ bgcolor: theme.palette.primary.main }}>
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                    {instituteName}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="h6" sx={{ marginRight: 2, color: theme.palette.text.secondary }}>
                        {teacherName}
                    </Typography>
                    <Button 
                        variant="outlined" 
                        color="inherit" 
                        onClick={onLogout} 
                        sx={{ borderRadius: 20, textTransform: 'capitalize', borderColor: theme.palette.secondary.main }}
                    >
                        Logout
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;