import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    List,
    ListItem,
    ListItemText,
    Collapse,
    IconButton,
    Typography,
    Box,
    Button,
    Divider,
    Fade,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const GradesDialog = ({ open, onClose, gradesData }) => {
    const [openStudents, setOpenStudents] = useState({});

    const handleStudentToggle = (studentId) => {
        setOpenStudents((prev) => ({
            ...prev,
            [studentId]: !prev[studentId],
        }));
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
            <DialogTitle sx={{ bgcolor: '#1976d2', color: 'white', textAlign: 'center' }}>
                Overall Grades
                <IconButton
                    edge="end"
                    color="inherit"
                    onClick={onClose}
                    aria-label="close"
                    sx={{ position: 'absolute', right: 8, top: 8 }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ bgcolor: '#f0f0f0', p: 3 }}>
                <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                    {gradesData.length > 0 ? (
                        gradesData.map(student => (
                            <Box key={student.id}>
                                <ListItem button onClick={() => handleStudentToggle(student.id)} sx={{ paddingY: 1 }}>
                                    <ListItemText
                                        primary={
                                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                                {student.studentName}
                                            </Typography>
                                        }
                                    />
                                    <IconButton>
                                        {openStudents[student.id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                    </IconButton>
                                </ListItem>
                                <Collapse in={openStudents[student.id]} timeout="auto" unmountOnExit>
                                    <Fade in={openStudents[student.id]}>
                                        <List component="div" disablePadding>
                                            {student.assignments.map(assignment => (
                                                <ListItem key={assignment.assignmentId} sx={{ paddingLeft: 4 }}>
                                                    <ListItemText
                                                        primary={
                                                            <Typography variant="body1" sx={{ color: '#555' }}>
                                                                {assignment.title}: <strong>{assignment.totalGrade !== undefined ? assignment.totalGrade : 'Not graded'}</strong>
                                                            </Typography>
                                                        }
                                                    />
                                                </ListItem>
                                            ))}
                                        </List>
                                    </Fade>
                                </Collapse>
                                <Divider />
                            </Box>
                        ))
                    ) : (
                        <Typography>No grades available for this course.</Typography>
                    )}
                </List>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default GradesDialog;