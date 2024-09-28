import React from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from '@mui/material';

const EnrollDialog = ({ open, onClose, enrollPassword, setEnrollPassword, onEnroll }) => (
    <Dialog open={open} onClose={onClose}>
        <DialogTitle>Enroll in Course</DialogTitle>
        <DialogContent>
            <TextField
                autoFocus
                margin="dense"
                label="Course Password"
                type="password"
                fullWidth
                variant="standard"
                value={enrollPassword}
                onChange={(e) => setEnrollPassword(e.target.value)}
            />
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button onClick={onEnroll}>Enroll</Button>
        </DialogActions>
    </Dialog>
);

export default EnrollDialog;