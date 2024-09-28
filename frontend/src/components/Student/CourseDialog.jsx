import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    List,
    ListItem,
    ListItemText,
    Button,
    Typography,
    Divider,
    useTheme,
} from '@mui/material';

const CourseDialog = ({ open, onClose, courses, onEnrollClick }) => {
    const theme = useTheme();

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ fontWeight: 'bold' }}>Courses Taught by Teacher</DialogTitle>
            <DialogContent>
                {courses.length > 0 ? (
                    <List>
                        {courses.map(course => (
                            <ListItem key={course.id} sx={{ padding: '8px 16px', borderBottom: `1px solid ${theme.palette.divider}` }}>
                                <ListItemText
                                    primary={
                                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                            {course.courseName}
                                        </Typography>
                                    }
                                    secondary={
                                        <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                            {course.courseDescription}
                                        </Typography>
                                    }
                                />
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => onEnrollClick(course.id)}
                                    sx={{ marginLeft: '16px' }}
                                >
                                    Enroll
                                </Button>
                            </ListItem>
                        ))}
                    </List>
                ) : (
                    <Typography variant="body1" sx={{ padding: 2, textAlign: 'center', color: theme.palette.text.secondary }}>
                        No courses found for this teacher.
                    </Typography>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default CourseDialog;