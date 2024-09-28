import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Alert,
    Paper,
    Link,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import axios from "axios";

const FormRenderer = ({ assignmentId, userId, initialResponses, initialFilePaths }) => {
    const [form, setForm] = useState(null);
    const [responses, setResponses] = useState(initialResponses);
    const [grades, setGrades] = useState({});
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        const fetchAssignment = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/assignments/${assignmentId}`);
                const data = response.data;
                if (!data.questions || !Array.isArray(data.questions)) {
                    throw new Error("Invalid assignment structure: 'questions' array is missing.");
                }
                setForm(data);
                setSuccess("Assignment loaded successfully!");
            } catch (err) {
                console.error("Error fetching assignment:", err);
                setError(`Failed to load assignment: ${err.message}`);
            }
        };

        fetchAssignment();
    }, [assignmentId]);

    useEffect(() => {
        setResponses(initialResponses);
    }, [initialResponses]);

    const handleGradeChange = (questionId, value) => {
        setGrades((prev) => ({ ...prev, [questionId]: value }));
    };

    const handleSubmitGrades = async () => {
        if (!form) {
            setError("No form data to submit.");
            return;
        }

        try {
            await axios.post(`http://localhost:5000/assignments/grade/${assignmentId}`, {
                grades,
                userId,
            });
            setSuccess("Grades saved successfully in the database!");
        } catch (err) {
            console.error("Error saving grades:", err);
            setError("Failed to save grades.");
        }
    };

    return (
        <Box sx={{ maxWidth: 600, mx: "auto", mt: 4, p: 3, borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h4" gutterBottom align="center">
                Assignment Renderer
            </Typography>

            {success && (
                <Alert severity="success" onClose={() => setSuccess(null)} sx={{ mb: 2 }}>
                    {success}
                </Alert>
            )}
            {error && (
                <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {!form ? (
                <Typography variant="body1" mt={2} align="center">
                    Loading assignment...
                </Typography>
            ) : (
                <Box>
                    <Typography variant="h5" gutterBottom>
                        {form.title || "Untitled Assignment"}
                    </Typography>
                    {form.questions.map((question, index) => (
                        <Paper key={question.id} elevation={1} sx={{ mb: 2, p: 2, borderRadius: 2 }}>
                            <Typography variant="h6">
                                {index + 1}. {question.text}
                                {question.maxMarks && <span> (Max Marks: {question.maxMarks})</span>}
                            </Typography>

                            {/* Displaying student's response */}
                            <Typography variant="body2">
                                <strong>Your Response:</strong> {responses[question.id] || "No response"}
                            </Typography>

                            {/* Display predefined answer */}
                            {question.predefinedAnswer && (
                                <Typography variant="body2" sx={{ color: 'gray' }}>
                                    <strong>Predefined Answer:</strong> {question.predefinedAnswer}
                                </Typography>
                            )}

                            {/* Display uploaded files for the question */}
                            {form.file_paths && form.file_paths[question.id] && 
                                form.file_paths[question.id].length > 0 && (
                                <Box mt={2}>
                                    <Typography variant="body2">
                                        <strong>Question Files:</strong>
                                    </Typography>
                                    {form.file_paths[question.id].map((filePath, idx) => (
                                        <Link
                                            key={idx}
                                            href={`http://localhost:5000/${filePath}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            download
                                        >
                                            <Button variant="outlined" sx={{ mt: 1, mr: 1 }}>
                                                Download Question File {idx + 1}
                                            </Button>
                                        </Link>
                                    ))}
                                </Box>
                            )}

                            {/* Display uploaded files for the student's response */}
                            {initialFilePaths && initialFilePaths[`files[${question.id}]`] && 
                                initialFilePaths[`files[${question.id}]`].length > 0 && (
                                <Box mt={2}>
                                    <Typography variant="body2">
                                        <strong>Uploaded Files:</strong>
                                    </Typography>
                                    {initialFilePaths[`files[${question.id}]`].map((filePath, idx) => (
                                        <Link
                                            key={idx}
                                            href={`http://localhost:5000/${filePath}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            download
                                        >
                                            <Button variant="outlined" sx={{ mt: 1, mr: 1 }}>
                                                Download Uploaded File {idx + 1}
                                            </Button>
                                        </Link>
                                    ))}
                                </Box>
                            )}

                            {/* Displaying grade input */}
                            <TextField
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                value={grades[question.id] || ""}
                                onChange={(e) => handleGradeChange(question.id, e.target.value)}
                                placeholder="Grade"
                                type="number"
                                sx={{ backgroundColor: "#fff", borderRadius: 1 }}
                            />
                        </Paper>
                    ))}

                    <Box mt={4} display="flex" justifyContent="center">
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<SaveIcon />}
                            onClick={handleSubmitGrades}
                            sx={{ padding: "10px 20px", borderRadius: 1 }}
                        >
                            Submit Grades
                        </Button>
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default FormRenderer;