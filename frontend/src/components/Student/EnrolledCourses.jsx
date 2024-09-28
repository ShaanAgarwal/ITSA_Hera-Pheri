import React from 'react';
import { List, ListItem, ListItemText, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const EnrolledCourses = ({ enrolledCourses }) => (
    <List>
        {enrolledCourses.length > 0 ? (
            enrolledCourses.map(course => (
                <ListItem key={course.id}>
                    <ListItemText 
                        primary={
                            <Link to={`/student/course/${course.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                {course.courseName}
                            </Link>
                        } 
                        secondary={course.courseDescription} 
                    />
                </ListItem>
            ))
        ) : (
            <Typography>No courses enrolled yet.</Typography>
        )}
    </List>
);

export default EnrolledCourses;
