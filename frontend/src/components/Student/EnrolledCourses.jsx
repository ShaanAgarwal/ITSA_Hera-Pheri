import React from 'react';
import { List, ListItem, ListItemText, Typography, Card } from '@mui/material';
import { Link } from 'react-router-dom';

const EnrolledCourses = ({ enrolledCourses }) => (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {enrolledCourses.length > 0 ? (
            enrolledCourses.map(course => (
                <ListItem key={course.id} sx={{ padding: '8px', marginBottom: 1 }}>
                    <Card 
                        sx={{ 
                            width: '100%', 
                            transition: '0.3s', 
                            boxShadow: 2, 
                            '&:hover': { boxShadow: 4 } 
                        }}
                    >
                        <ListItemText 
                            primary={
                                <Link to={`/student/course/${course.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <Typography variant="body1" sx={{ fontWeight: 'bold', padding: '8px' }}>
                                        {course.courseName}
                                    </Typography>
                                </Link>
                            } 
                        />
                    </Card>
                </ListItem>
            ))
        ) : (
            <Typography variant="body2" color="text.secondary" sx={{ padding: 2 }}>
                No courses enrolled yet.
            </Typography>
        )}
    </List>
);

export default EnrolledCourses;