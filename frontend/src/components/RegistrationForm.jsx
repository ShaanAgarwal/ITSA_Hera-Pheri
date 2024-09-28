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
  CircularProgress,
  Box,
} from '@mui/material';
import axios from 'axios';
import { motion } from 'framer-motion';

const RegistrationForm = ({ open, onClose }) => {
  const [instituteName, setInstituteName] = useState('');
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handleRegister = async () => {
    if (!instituteName || !adminUsername || !adminPassword) {
      setSnackbarMessage('All fields are required.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    setLoading(true);

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
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold', color: '#3F51B5' }}>Register Your Institute</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              autoFocus
              margin="dense"
              label="Institute Name"
              type="text"
              fullWidth
              variant="outlined"
              value={instituteName}
              onChange={(e) => setInstituteName(e.target.value)}
              required
            />
            <TextField
              margin="dense"
              label="Admin Username"
              type="text"
              fullWidth
              variant="outlined"
              value={adminUsername}
              onChange={(e) => setAdminUsername(e.target.value)}
              required
            />
            <TextField
              margin="dense"
              label="Admin Password"
              type="password"
              fullWidth
              variant="outlined"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">
            Cancel
          </Button>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button onClick={handleRegister} color="primary" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'Register'}
            </Button>
          </motion.div>
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