import React, { useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Snackbar,
  Alert,
} from '@mui/material';
import axios from 'axios';

const RegistrationForm = ({ open, onClose }) => {
  const [instituteName, setInstituteName] = useState('');
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handleRegister = async () => {
    const registerData = {
      instituteName,
      adminUsername,
      adminPassword,
    };

    try {
      const response = await axios.post('http://localhost:5000/register', registerData);

      if (response.status === 201) {
        setSnackbarMessage('Institute registered successfully!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);

        setInstituteName('');
        setAdminUsername('');
        setAdminPassword('');

        onClose();
      }
    } catch (error) {
      console.error('Error during registration:', error);
      setSnackbarMessage('Failed to register institute. Please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Register Your Institute</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Institute Name"
            type="text"
            fullWidth
            variant="outlined"
            value={instituteName}
            onChange={(e) => setInstituteName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Admin Username"
            type="text"
            fullWidth
            variant="outlined"
            value={adminUsername}
            onChange={(e) => setAdminUsername(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Admin Password"
            type="password"
            fullWidth
            variant="outlined"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleRegister} color="primary">
            Register
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default RegistrationForm;
