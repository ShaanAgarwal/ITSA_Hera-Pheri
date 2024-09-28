import React from 'react';
import {
  List,
  ListItem,
  Button,
  Card,
  CardContent,
  Typography,
  useTheme,
} from '@mui/material';

const TeacherList = ({ teachers, onTeacherClick }) => {
  const theme = useTheme();

  return (
    <List>
      {teachers.map((teacher) => (
        <ListItem key={teacher.id} sx={{ padding: 0, marginBottom: 2 }}>
          <Card
            sx={{
              width: '100%',
              boxShadow: 3,
              transition: '0.3s',
              '&:hover': {
                boxShadow: 6,
              },
            }}
          >
            <CardContent>
              <Button
                fullWidth
                onClick={() => onTeacherClick(teacher.id)}
                sx={{
                  textAlign: 'left',
                  bgcolor: 'transparent',
                  color: theme.palette.text.primary,
                  '&:hover': {
                    bgcolor: theme.palette.action.hover,
                  },
                }}
              >
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                  {teacher.teacherName}
                </Typography>
              </Button>
            </CardContent>
          </Card>
        </ListItem>
      ))}
    </List>
  );
};

export default TeacherList;
