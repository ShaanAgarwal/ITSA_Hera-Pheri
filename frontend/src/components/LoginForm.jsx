import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Snackbar,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const LoginForm = ({ open, onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('admin');
  const [institutes, setInstitutes] = useState([]);
  const [selectedInstitute, setSelectedInstitute] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchInstitutes = async () => {
      try {
        const response = await axios.get('http://localhost:5000/institutes');
        setInstitutes(response.data);

        if (response.data.length > 0) {
          const firstInstitute = response.data[0];
          const instituteId = firstInstitute._id || firstInstitute.id;
          if (instituteId) {
            setSelectedInstitute(String(instituteId));
          } else {
            console.warn('First institute does not have _id or id:', firstInstitute);
            setSelectedInstitute('');
          }
        } else {
          setSelectedInstitute('');
        }
      } catch (error) {
        console.error('Error fetching institutes:', error);
        setSnackbarMessage('Failed to load institutes. Please try again.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        setInstitutes([]);
        setSelectedInstitute('');
      }
    };

    if (open) {
      fetchInstitutes();
    }
  }, [open]);

  const handleLogin = async () => {
    if (!selectedInstitute) {
      setSnackbarMessage('Please select an institute.');
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
      return;
    }

    if (!username || !password) {
      setSnackbarMessage('Please fill in all required fields.');
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
      return;
    }

    const loginData = {
      username,
      password,
      userType,
      institute: selectedInstitute,
    };

    try {
      const response = await axios.post('http://localhost:5000/login', loginData);
      if (response.status === 200) {
        console.log(response.data);
        setSnackbarMessage('Login successful!');
        setSnackbarSeverity('success');
        
        // Store user ID and other info in local storage
        localStorage.setItem('userId', response.data.user.id);
        localStorage.setItem('username', response.data.user.username);
        localStorage.setItem('userType', response.data.user.userType);

        // Navigate to /admindashboard if the user type is admin
        if (userType === 'admin') {
          navigate('/admindashboard'); // Navigate to admin dashboard
        }
      } else {
        setSnackbarMessage('Unexpected response. Please try again.');
        setSnackbarSeverity('warning');
      }
    } catch (error) {
      console.error('Error during login:', error);
      const message = error.response?.data?.message || 'Failed to login. Please try again.';
      setSnackbarMessage(message);
      setSnackbarSeverity('error');
    } finally {
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Login</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense" variant="outlined">
            <InputLabel>Institute</InputLabel>
            <Select
              value={selectedInstitute || ''}
              onChange={(e) => {
                console.log('Selected Institute:', e.target.value);
                setSelectedInstitute(e.target.value);
              }}
              label="Institute"
              required
            >
              {institutes.length > 0 ? (
                institutes.map((institute) => {
                  const instituteId = institute._id || institute.id;
                  if (!instituteId) {
                    console.warn('Institute missing _id or id:', institute);
                    return null;
                  }
                  return (
                    <MenuItem key={String(instituteId)} value={String(instituteId)}>
                      {institute.instituteName}
                    </MenuItem>
                  );
                })
              ) : (
                <MenuItem key="no-institutes" disabled>
                  No institutes available
                </MenuItem>
              )}
            </Select>
            <FormHelperText>Select your institute</FormHelperText>
          </FormControl>

          <FormControl fullWidth margin="dense" variant="outlined">
            <InputLabel>User Type</InputLabel>
            <Select
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              label="User Type"
            >
              <MenuItem key="admin" value="admin">
                Admin
              </MenuItem>
              <MenuItem key="teacher" value="teacher">
                Teacher
              </MenuItem>
              <MenuItem key="student" value="student">
                Student
              </MenuItem>
            </Select>
            <FormHelperText>Select your user type</FormHelperText>
          </FormControl>

          <TextField
            autoFocus
            margin="dense"
            label="Username"
            type="text"
            fullWidth
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <TextField
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleLogin} color="primary" variant="contained">
            Login
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
          elevation={6}
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default LoginForm;
