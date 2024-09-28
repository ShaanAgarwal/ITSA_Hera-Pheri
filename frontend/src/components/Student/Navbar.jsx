import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  useTheme,
} from '@mui/material';
import { Logout } from '@mui/icons-material';

const Navbar = ({ instituteName, studentName, onLogout }) => {
  const theme = useTheme();

  return (
    <AppBar
      position="static"
      sx={{
        background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
      }}
    >
      <Toolbar>
        <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 'bold', letterSpacing: 1 }}>
          {instituteName}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', marginRight: 2 }}>
          <Typography variant="body1" sx={{ color: 'white', marginRight: 3 }}>
            {studentName}
          </Typography>
        </Box>

        <Button
          variant="contained"
          color="inherit"
          onClick={onLogout}
          sx={{
            bgcolor: 'rgba(255, 255, 255, 0.1)',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.2)',
            },
            borderRadius: 5,
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.5)',
          }}
          startIcon={<Logout />}
        >
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;