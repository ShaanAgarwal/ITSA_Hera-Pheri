import AdminDashboard from './Pages/AdminDashboard';
import HomePage from './Pages/HomePage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TeacherDashboard from './Pages/TeacherDashboard';
import StudentDashboard from './Pages/StudentDashboard';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admindashboard" element={<AdminDashboard />} />
          <Route path="/teacherdashboard" element={<TeacherDashboard />} />
          <Route path="/studentdashboard" element={<StudentDashboard />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;