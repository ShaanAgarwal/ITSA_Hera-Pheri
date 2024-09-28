import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    Button,
    Typography,
    useTheme,
} from '@mui/material';

const EnrollDialog = ({ open, onClose, enrollPassword, setEnrollPassword, onEnroll }) => {
    const theme = useTheme();

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ fontWeight: 'bold', textAlign: 'center' }}>Enroll in Course</DialogTitle>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ mb: 2, textAlign: 'center', color: theme.palette.text.secondary }}>
                    Please enter the password to enroll in this course.
                </Typography>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Course Password"
                    type="password"
                    fullWidth
                    variant="outlined"
                    value={enrollPassword}
                    onChange={(e) => setEnrollPassword(e.target.value)}
                    sx={{ mb: 2 }}
                />
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center' }}>
                <Button onClick={onClose} color="inherit" sx={{ mr: 1 }}>
                    Cancel
                </Button>
                <Button 
                    onClick={onEnroll} 
                    variant="contained" 
                    color="primary" 
                    disabled={!enrollPassword}
                >
                    Enroll
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EnrollDialog;