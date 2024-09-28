import React from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    useTheme,
    IconButton,
} from '@mui/material';
import { Logout } from '@mui/icons-material';

const Navbar = ({ instituteName, studentName, onLogout }) => {
    const theme = useTheme();

    return (
        <AppBar
            position="static"
            sx={{
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.5)',
            }}
        >
            <Toolbar>
                <Typography
                    variant="h6"
                    sx={{
                        flexGrow: 1,
                        fontWeight: 'bold',
                        letterSpacing: 1,
                        color: 'white',
                    }}
                >
                    {instituteName}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', marginRight: 2 }}>
                    <Typography variant="body1" sx={{ color: 'white', marginRight: 2 }}>
                        {studentName}
                    </Typography>
                </Box>

                <IconButton
                    onClick={onLogout}
                    sx={{
                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                        '&:hover': {
                            bgcolor: 'rgba(255, 255, 255, 0.2)',
                        },
                        borderRadius: 5,
                        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.5)',
                    }}
                    aria-label="logout"
                >
                    <Logout sx={{ color: 'white' }} />
                </IconButton>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;