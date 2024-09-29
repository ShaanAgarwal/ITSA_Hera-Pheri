import React, { useState } from 'react';
import { Button, Box, List, ListItem, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import UploadExcel from './UploadExcel';
import ViewDialog from './ViewDialog';

const Sidebar = () => {
    const [open, setOpen] = useState(false);
    const [uploadType, setUploadType] = useState('');
    const [students, setStudents] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [viewOpen, setViewOpen] = useState(false);
    const [viewType, setViewType] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleClickOpen = (type) => {
        setUploadType(type);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setUploadType('');
    };

    const fetchStudents = async () => {
        setLoading(true);
        setError('');
        const instituteId = localStorage.getItem('userId');
        try {
            const response = await fetch(`http://localhost:5000/institute/${instituteId}/students`);
            if (!response.ok) {
                const text = await response.text();
                throw new Error(`Error ${response.status}: ${text}`);
            }
            const data = await response.json();
            setStudents(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    
    const fetchTeachers = async () => {
        setLoading(true);
        setError('');
        const instituteId = localStorage.getItem('userId');
        try {
            const response = await fetch(`http://localhost:5000/institute/${instituteId}/teachers`);
            if (!response.ok) {
                const text = await response.text();
                throw new Error(`Error ${response.status}: ${text}`);
            }
            const data = await response.json();
            setTeachers(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleViewOpen = (type) => {
        if (type === 'students') {
            fetchStudents();
        } else {
            fetchTeachers();
        }
        setViewType(type);
        setViewOpen(true);
    };

    const handleViewClose = () => {
        setViewOpen(false);
        setViewType('');
        setStudents([]);
        setTeachers([]);
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
                <ListItem>
                    <Button fullWidth variant="contained" onClick={() => handleViewOpen('students')}>
                        View All Students
                    </Button>
                </ListItem>
                <ListItem>
                    <Button fullWidth variant="contained" onClick={() => handleViewOpen('teachers')}>
                        View All Teachers
                    </Button>
                </ListItem>
            </List>

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>{uploadType.charAt(0).toUpperCase() + uploadType.slice(1)} Upload</DialogTitle>
                <DialogContent>
                    <UploadExcel type={uploadType} onClose={handleClose} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            <ViewDialog
                viewOpen={viewOpen}
                handleViewClose={handleViewClose}
                loading={loading}
                error={error}
                students={students}
                teachers={teachers}
                viewType={viewType}
            />
        </Box>
    );
};

export default Sidebar;
