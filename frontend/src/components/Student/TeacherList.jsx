import React from 'react';
import {
  List,
  ListItem,
  Button,
  Card,
  Typography,
  useTheme,
} from '@mui/material';

const TeacherList = ({ teachers, onTeacherClick }) => {
  const theme = useTheme();

  return (
    <List>
      {teachers.map((teacher) => (
        <ListItem key={teacher.id} sx={{ padding: 0, marginBottom: 1 }}>
          <Card
            sx={{
              width: '100%',
              boxShadow: 2,
              transition: '0.3s',
              height: '50px',
              '&:hover': {
                boxShadow: 4,
              },
            }}
          >
            <Button
              fullWidth
              onClick={() => onTeacherClick(teacher.id)}
              sx={{
                textAlign: 'left',
                bgcolor: 'transparent',
                color: theme.palette.text.primary,
                height: '100%',
                padding: '8px 16px',
                '&:hover': {
                  bgcolor: theme.palette.action.hover,
                },
              }}
            >
              <Typography variant="body1" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                {teacher.teacherName}
              </Typography>
            </Button>
          </Card>
        </ListItem>
      ))}
    </List>
  );
};

export default TeacherList;