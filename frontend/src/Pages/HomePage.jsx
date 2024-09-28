import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Grid,
  Paper,
  Fade,
  Grow,
  Zoom,
} from '@mui/material';
import RegistrationForm from '../components/RegistrationForm';
import LoginForm from '../components/LoginForm';

const HomePage = () => {
  const [showFeatureCards, setShowFeatureCards] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState("Loading");
  const [registerOpen, setRegisterOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setShowFeatureCards(true);
    }, 500);

    const typingEffect = setInterval(() => {
      setLoadingText((prev) => (prev.length < 12 ? prev + "." : "Loading"));
    }, 150);

    return () => {
      clearTimeout(timer);
      clearInterval(typingEffect);
    };
  }, []);

  return (
    <Box>
      {loading ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: '#FF6F61',
            color: 'white',
            fontSize: '24px',
            fontWeight: 'bold',
          }}
        >
          <Typography variant="h4" gutterBottom>
            {loadingText}
          </Typography>
          <Box
            sx={{
              width: '60%',
              height: '10px',
              background: 'rgba(255, 255, 255, 0.3)',
              borderRadius: '5px',
              overflow: 'hidden',
              position: 'relative',
              marginTop: 2,
            }}
          >
            <Box
              sx={{
                width: '100%',
                height: '100%',
                backgroundColor: '#fff',
                position: 'absolute',
                left: '-100%',
                animation: 'loading-bar 2s linear infinite',
              }}
            />
          </Box>
          <style>
            {`
              @keyframes loading-bar {
                0% { left: -100%; }
                50% { left: 100%; }
                100% { left: -100%; }
              }
            `}
          </style>
        </Box>
      ) : (
        <>
          <Fade in={true} timeout={500}>
            <AppBar position="static" sx={{
              background: 'linear-gradient(135deg, #673AB7, #B39DDB)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
              borderRadius: '0 0 20px 20px',
              padding: '10px 20px',
            }}>
              <Toolbar>
                <Typography variant="h4" component="div" sx={{ flexGrow: 1, color: '#fff', fontWeight: 'bold', letterSpacing: '1px' }}>
                  Samarpan
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Button
                    color="inherit"
                    variant="contained"
                    onClick={() => setLoginOpen(true)}
                    sx={{
                      marginRight: 2,
                      borderRadius: '20px',
                      backgroundColor: '#3F51B5',
                      '&:hover': { backgroundColor: '#3949AB' },
                      padding: '10px 20px',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                      fontWeight: 'bold',
                      color: '#fff',
                      fontFamily: 'Arial, sans-serif',
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    color="inherit"
                    variant="contained"
                    onClick={() => setRegisterOpen(true)}
                    sx={{
                      borderRadius: '20px',
                      backgroundColor: '#FF5722',
                      '&:hover': {
                        backgroundColor: '#E64A19',
                      },
                      padding: '10px 20px',
                      marginLeft: 1,
                      fontWeight: 'bold',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                      color: '#fff',
                      fontFamily: 'Arial, sans-serif',
                    }}
                  >
                    Register
                  </Button>
                </Box>
              </Toolbar>
            </AppBar>
          </Fade>

          <Container maxWidth="lg" sx={{ marginTop: 4 }}>
            <Grid container spacing={4} sx={{ alignItems: 'center' }}>
              <Grid item xs={12} sm={6}>
                <Typography variant="h2" gutterBottom sx={{ fontWeight: 'bold', color: '#FF6F61' }}>
                  Welcome to Samarpan
                </Typography>
                <Typography variant="h6" gutterBottom>
                  Streamlining assignment submissions and grading for students and teachers.
                </Typography>
                <Zoom in timeout={1000}>
                  <Button variant="contained" color="primary" size="large" sx={{ marginRight: 2, borderRadius: '25px', boxShadow: 2 }}>
                    Get Started
                  </Button>
                </Zoom>
                <Zoom in timeout={1500}>
                  <Button variant="outlined" color="secondary" size="large" sx={{ borderRadius: '25px', boxShadow: 1 }}>
                    Learn More
                  </Button>
                </Zoom>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper
                  elevation={3}
                  sx={{
                    padding: 3,
                    textAlign: 'center',
                    borderRadius: '15px',
                    background: 'linear-gradient(to bottom, #FFFFFF, #F3F4F6)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  }}
                >
                  <Typography variant="h5" gutterBottom>
                    Join our community
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    Connect, share, and collaborate with peers and educators.
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            <Box sx={{ marginTop: 4 }}>
              <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold', color: '#FF6F61' }}>
                Features
              </Typography>
              <Grid container spacing={4}>
                {showFeatureCards && (
                  <>
                    <Grow in timeout={1000}>
                      <Grid item xs={12} sm={4}>
                        <Paper elevation={2} sx={{ padding: 3, textAlign: 'center', borderRadius: '15px', background: '#FFF5E1', transition: '0.3s', '&:hover': { boxShadow: 4 } }}>
                          <Typography variant="h5" gutterBottom>
                            Assignment Submission
                          </Typography>
                          <Typography variant="body1">
                            Easily upload and submit your homework with file attachments.
                          </Typography>
                        </Paper>
                      </Grid>
                    </Grow>
                    <Grow in timeout={1200}>
                      <Grid item xs={12} sm={4}>
                        <Paper elevation={2} sx={{ padding: 3, textAlign: 'center', borderRadius: '15px', background: '#D1E8FF', transition: '0.3s', '&:hover': { boxShadow: 4 } }}>
                          <Typography variant="h5" gutterBottom>
                            Teacher Review & Grading
                          </Typography>
                          <Typography variant="body1">
                            Teachers can review submissions, assign grades, and provide feedback.
                          </Typography>
                        </Paper>
                      </Grid>
                    </Grow>
                    <Grow in timeout={1400}>
                      <Grid item xs={12} sm={4}>
                        <Paper elevation={2} sx={{ padding: 3, textAlign: 'center', borderRadius: '15px', background: '#E1FFD5', transition: '0.3s', '&:hover': { boxShadow: 4 } }}>
                          <Typography variant="h5" gutterBottom>
                            Notifications
                          </Typography>
                          <Typography variant="body1">
                            Get alerts about upcoming deadlines and feedback from teachers.
                          </Typography>
                        </Paper>
                      </Grid>
                    </Grow>
                  </>
                )}
              </Grid>
            </Box>
          </Container>

          <RegistrationForm open={registerOpen} onClose={() => setRegisterOpen(false)} />
          <LoginForm open={loginOpen} onClose={() => setLoginOpen(false)} />
        </>
      )}
    </Box>
  );
};

export default HomePage;
