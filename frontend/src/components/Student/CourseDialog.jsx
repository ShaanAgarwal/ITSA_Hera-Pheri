import React from 'react';
import { Dialog, DialogTitle, DialogContent, List, ListItem, ListItemText, Button, Typography } from '@mui/material';

const CourseDialog = ({ open, onClose, courses, onEnrollClick }) => (
    <Dialog open={open} onClose={onClose}>
        <DialogTitle>Courses Taught by Teacher</DialogTitle>
        <DialogContent>
            {courses.length > 0 ? (
                <List>
                    {courses.map(course => (
                        <ListItem key={course.id}>
                            <ListItemText primary={course.courseName} secondary={course.courseDescription} />
                            <Button onClick={() => onEnrollClick(course.id)}>Enroll</Button>
                        </ListItem>
                    ))}
                </List>
            ) : (
                <Typography>No courses found for this teacher.</Typography>
            )}
        </DialogContent>
    </Dialog>
);

export default CourseDialog;