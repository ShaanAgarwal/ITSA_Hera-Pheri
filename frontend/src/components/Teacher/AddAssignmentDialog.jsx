import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from '@mui/material';
import FormBuilder from './FormBuilder';

const AddAssignmentDialog = ({ open, onClose, courseId, onAssignmentCreated }) => {
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>Add Assignment</DialogTitle>
            <DialogContent>
                <FormBuilder courseId={courseId} onAssignmentCreated={onAssignmentCreated} />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddAssignmentDialog;