import React from 'react';
import { List, ListItem, ListItemText, Button } from '@mui/material';

const TeacherList = ({ teachers, onTeacherClick }) => (
    <List>
        {teachers.map(teacher => (
            <ListItem key={teacher.id}>
                <ListItemText 
                    primary={
                        <Button onClick={() => onTeacherClick(teacher.id)}>
                            {teacher.teacherName}
                        </Button>
                    }
                />
            </ListItem>
        ))}
    </List>
);

export default TeacherList;