import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import Navbar from '../components/Teacher/Navbar';
import Sidebar from '../components/Teacher/Sidebar';
import AddCourse from '../components/Teacher/AddCourse';
import axios from 'axios';

const TeacherDashboard = () => {
    const [instituteName, setInstituteName] = useState('');
    const [teacherName, setTeacherName] = useState('');
    const [loading, setLoading] = useState(true);
    const [showAddCourse, setShowAddCourse] = useState(false);
    const [courses, setCourses] = useState([]);
    const [showCourses, setShowCourses] = useState(false);
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const fetchTeacherDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/teacher/${userId}`);
                setTeacherName(response.data.teacherName);
                
                const instituteResponse = await axios.get(`http://localhost:5000/institutes/${response.data.instituteId}`);
                setInstituteName(instituteResponse.data.instituteName);
            } catch (error) {
                console.error('Error fetching teacher details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTeacherDetails();
    }, [userId]);

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/';
    };

    const handleAddCourse = () => {
        setShowAddCourse(true);
        setShowCourses(false);
    };

    const handleViewCourses = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/courses/${userId}`);
            setCourses(response.data);
            setShowCourses(true);
            setShowAddCourse(false);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    const handleCourseAdded = () => {
        handleViewCourses();
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ display: 'flex' }}>
            <Sidebar onAddCourse={handleAddCourse} onViewCourses={handleViewCourses} />
            <div style={{ padding: 20, flexGrow: 1 }}>
                <Navbar 
                    instituteName={instituteName} 
                    teacherName={teacherName} 
                    onLogout={handleLogout} 
                />
                {showAddCourse && <AddCourse onCourseAdded={handleCourseAdded} />}
                {showCourses && (
                    <div>
                        <h2>My Courses</h2>
                        <ul>
                            {courses.map(course => (
                                <li key={course.id}>
                                    <Link to={`/course/${course.id}`}>{course.courseName}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeacherDashboard;
