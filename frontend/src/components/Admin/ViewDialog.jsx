import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemIcon, ListItemText, CircularProgress, Typography, Box, Button } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';

const ViewDialog = ({ viewOpen, handleViewClose, loading, error, students, teachers, viewType }) => {
    return (
        <Dialog open={viewOpen} onClose={handleViewClose} maxWidth="sm" fullWidth>
            <DialogTitle>{viewType === 'students' ? 'All Students' : 'All Teachers'}</DialogTitle>
            <DialogContent>
                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height={100}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        {error && (
                            <Typography color="error" align="center" marginBottom={2}>
                                {error}
                            </Typography>
                        )}
                        <List>
                            {viewType === 'students' ? (
                                students.map(student => (
                                    <ListItem key={student.id}>
                                        <ListItemIcon>
                                            <PeopleIcon />
                                        </ListItemIcon>
                                        <ListItemText primary={student.studentName} />
                                    </ListItem>
                                ))
                            ) : (
                                teachers.map(teacher => (
                                    <ListItem key={teacher.id}>
                                        <ListItemIcon>
                                            <SchoolIcon />
                                        </ListItemIcon>
                                        <ListItemText primary={teacher.teacherName} />
                                    </ListItem>
                                ))
                            )}
                        </List>
                    </>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleViewClose} color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ViewDialog;
