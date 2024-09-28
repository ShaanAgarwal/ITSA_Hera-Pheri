import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';
import FormRenderer from '../FormRenderer';

const AssignmentModal = ({ open, onClose, assignmentTitle, assignmentId }) => {
    return (
        <Modal open={open} onClose={onClose} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box sx={{
                bgcolor: 'background.paper',
                borderRadius: 2,
                boxShadow: 24,
                p: 4,
                width: '1000px', // Increased width
                maxHeight: '80vh',
                overflowY: 'auto',
            }}>
                <Typography variant="h6" gutterBottom>{assignmentTitle}</Typography>
                <FormRenderer assignmentId={assignmentId} />
                <Button variant="contained" onClick={onClose} sx={{ marginTop: 2 }}>
                    Close
                </Button>
            </Box>
        </Modal>
    );
};

export default AssignmentModal;