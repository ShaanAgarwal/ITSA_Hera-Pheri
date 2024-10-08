import AdminDashboard from './Pages/AdminDashboard';
import HomePage from './Pages/HomePage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TeacherDashboard from './Pages/TeacherDashboard';
import StudentDashboard from './Pages/StudentDashboard';
import CourseDetails from './components/Teacher/CourseDetails';
import CourseDetailComponent from './components/Student/CourseDetailComponent';
import AssignmentDetails from './components/Teacher/AssignmentDetails';
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admindashboard" element={<AdminDashboard />} />
          <Route path="/teacherdashboard" element={<TeacherDashboard />} />
          <Route path="/studentdashboard" element={<StudentDashboard />} />
          <Route path="/course/:courseId" element={<CourseDetails />} />
          <Route path="/student/course/:courseId" element={<CourseDetailComponent />} />
          <Route path="/assignments/:assignmentId" element={<AssignmentDetails />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;