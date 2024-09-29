import React, { useEffect, useState } from 'react';
import { Typography, Box, Container, Paper, Fade } from '@mui/material';
import Navbar from '../components/Admin/Navbar';
import Sidebar from '../components/Admin/Sidebar';
import axios from 'axios';
import { styled } from '@mui/material/styles';

const MainContent = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: 'all 0.3s ease',
  minHeight: '100vh',
  background: theme.palette.background.default,
}));

const WelcomeCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  borderRadius: '8px',
  boxShadow: theme.shadows[5],
  backgroundColor: theme.palette.background.paper,
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.02)',
  },
}));

const AdminDashboard = () => {
  const [adminDetails, setAdminDetails] = useState(null);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchAdminDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/admin/${userId}`);
        setAdminDetails(response.data);
      } catch (error) {
        console.error('Error fetching admin details:', error);
      }
    };

    fetchAdminDetails();
  }, [userId]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <Box>
      <Navbar adminDetails={adminDetails} onLogout={handleLogout} />
      <Box display="flex">
        <Sidebar />
        <MainContent component="main">
          <Fade in={true} timeout={1000}>
            <Container>
              <WelcomeCard elevation={3}>
                <Typography variant="h4" color="primary" gutterBottom>
                  Welcome to the Admin Dashboard
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  Here you can manage all administrative tasks effectively.
                </Typography>
              </WelcomeCard>
            </Container>
          </Fade>
        </MainContent>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
