import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import FormRenderer from './FormRenderer';

const CourseDetailComponent = () => {
    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);

    useEffect(() => {
        const fetchCourseDetails = async () => {
            try {
                const courseResponse = await axios.get(`http://localhost:5000/course/${courseId}`);
                setCourse(courseResponse.data);

                const assignmentsResponse = await axios.get(`http://localhost:5000/course/${courseId}/assignments`);
                setAssignments(assignmentsResponse.data);
            } catch (error) {
                console.error('Error fetching course details or assignments:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourseDetails();
    }, [courseId]);

    const handleAssignmentClick = (assignmentId) => {
        setSelectedAssignmentId(assignmentId);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedAssignmentId(null);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>{course.courseName}</h1>
            <p>{course.courseDescription}</p>
            <h2>Assignments</h2>
            {assignments.length > 0 ? (
                <ul>
                    {assignments.map(assignment => (
                        <li key={assignment.id} onClick={() => handleAssignmentClick(assignment.id)}>
                            {assignment.title}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No assignments found for this course.</p>
            )}

            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>{assignments.find(a => a.id === selectedAssignmentId)?.title}</h3>
                        <FormRenderer assignmentId={selectedAssignmentId} />
                        <button onClick={closeModal}>Close</button>
                    </div>
                </div>
            )}

            <style jsx>{`
                .modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .modal-content {
                    background: white;
                    padding: 20px;
                    border-radius: 8px;
                    width: 400px; /* Increased width */
                    max-height: 80vh; /* Set maximum height */
                    overflow-y: auto; /* Enable scrolling */
                    text-align: center;
                }
                button {
                    margin-top: 10px;
                }
            `}</style>
        </div>
    );
};

export default CourseDetailComponent;
