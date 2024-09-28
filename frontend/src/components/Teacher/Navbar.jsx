import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const Navbar = ({ instituteName, teacherName, onLogout, onMenuClick }) => {
    const theme = useTheme();

    return (
        <AppBar position="static" sx={{ bgcolor: theme.palette.primary.main, boxShadow: 2 }}>
            <Toolbar>
                <IconButton edge="start" color="inherit" aria-label="menu" onClick={onMenuClick}>
                    <MenuIcon />
                </IconButton>
                
                <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold', fontSize: '1.5rem' }}>
                    {instituteName}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body1" sx={{ marginRight: 2, color: theme.palette.text.secondary, fontWeight: 'medium' }}>
                        {teacherName}
                    </Typography>
                    <Button 
                        variant="outlined" 
                        color="inherit" 
                        onClick={onLogout} 
                        startIcon={<ExitToAppIcon />}
                        sx={{ 
                            borderRadius: 20, 
                            textTransform: 'capitalize', 
                            borderColor: theme.palette.secondary.main,
                            '&:hover': {
                                backgroundColor: theme.palette.secondary.main,
                                borderColor: theme.palette.secondary.main,
                                color: theme.palette.common.white,
                            }
                        }}
                    >
                        Logout
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;