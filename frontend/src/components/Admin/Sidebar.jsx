import React, { useState } from 'react';
import { Box, Button, List, ListItem, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import UploadExcel from './UploadExcel';

const Sidebar = () => {
    const [open, setOpen] = useState(false);
    const [uploadType, setUploadType] = useState('');

    const handleClickOpen = (type) => {
        setUploadType(type);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setUploadType('');
    };

    return (
        <Box sx={{ width: 250, backgroundColor: '#f4f4f4', height: '100vh', padding: 2 }}>
            <List>
                <ListItem>
                    <Button fullWidth variant="contained" onClick={() => handleClickOpen('teacher')}>
                        Upload Teacher Data
                    </Button>
                </ListItem>
                <ListItem>
                    <Button fullWidth variant="contained" onClick={() => handleClickOpen('student')}>
                        Upload Student Data
                    </Button>
                </ListItem>
            </List>

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>{uploadType.charAt(0).toUpperCase() + uploadType.slice(1)} Upload</DialogTitle>
                <DialogContent>
                    <UploadExcel type={uploadType} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Sidebar;