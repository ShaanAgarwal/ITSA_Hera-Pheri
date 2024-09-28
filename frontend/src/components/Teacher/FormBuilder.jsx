import React, { useState } from "react";
import {
    Box,
    Button,
    TextField,
    MenuItem,
    Typography,
    IconButton,
    List,
    ListItem,
    ListItemSecondaryAction,
    Container,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import axios from "axios";
import { LocalizationProvider, DatePicker, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const questionTypes = [
    { label: "Short Answer", value: "short" },
    { label: "Long Answer", value: "long" },
    { label: "Multiple Choice", value: "mcq" },
];

const FormBuilder = ({ courseId }) => {
    const [assignmentName, setAssignmentName] = useState("");
    const [questions, setQuestions] = useState([]);
    const [deadlineDate, setDeadlineDate] = useState(dayjs());
    const [deadlineTime, setDeadlineTime] = useState(dayjs());

    const handleAddQuestion = () => {
        setQuestions([...questions, { id: Date.now(), type: "short", text: "", options: [], maxMarks: 0, predefinedAnswer: "", files: [] }]);
    };

    const handleQuestionChange = (id, field, value) => {
        setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, [field]: value } : q)));
    };

    const handleFileChange = (id, files) => {
        setQuestions((prev) => {
            const question = prev.find(q => q.id === id);
            return prev.map((q) => (q.id === id ? { ...q, files: [...question.files, ...Array.from(files)] } : q));
        });
    };

    const handleDeleteQuestion = (id) => {
        setQuestions((prev) => prev.filter((q) => q.id !== id));
    };

    const handleDeleteFile = (questionId, fileName) => {
        setQuestions((prev) => {
            const question = prev.find(q => q.id === questionId);
            return prev.map((q) => (q.id === questionId ? { ...q, files: question.files.filter(file => file.name !== fileName) } : q));
        });
    };

    const handleAddOption = (questionId) => {
        setQuestions((prev) => prev.map((q) => (q.id === questionId ? { ...q, options: [...q.options, ""] } : q)));
    };

    const handleOptionChange = (questionId, optionIndex, value) => {
        setQuestions((prev) => prev.map((q) => (q.id === questionId ? { ...q, options: q.options.map((opt, idx) => (idx === optionIndex ? value : opt)) } : q)));
    };

    const handleDeleteOption = (questionId, optionIndex) => {
        setQuestions((prev) => prev.map((q) => (q.id === questionId ? { ...q, options: q.options.filter((_, idx) => idx !== optionIndex) } : q)));
    };

    const handleExport = () => {
        const formData = { title: assignmentName, questions, deadline: { date: deadlineDate, time: deadlineTime } };
        const json = JSON.stringify(formData, null, 2);
        const blob = new Blob([json], { type: "application/json" });
        const href = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = href;
        link.download = "form.json";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleImport = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const importedData = JSON.parse(e.target.result);
                    setAssignmentName(importedData.title);
                    setQuestions(importedData.questions);
                    if (importedData.deadline) {
                        setDeadlineDate(dayjs(importedData.deadline.date));
                        setDeadlineTime(dayjs(importedData.deadline.time));
                    }
                } catch (error) {
                    console.error("Error parsing JSON file:", error);
                }
            };
            reader.readAsText(file);
        }
    };

    const handleCreateAssignment = async () => {
        const formData = new FormData();
        const assignmentData = {
            title: assignmentName,
            questions: questions.map(({ files, ...rest }) => ({ ...rest })),
            deadline: { date: deadlineDate, time: deadlineTime }
        };
    
        formData.append("assignment", JSON.stringify(assignmentData));
    
        // Append each file organized by question ID
        questions.forEach((question) => {
            question.files.forEach((file) => {
                formData.append(`files[${question.id}]`, file);
            });
        });
    
        try {
            const response = await axios.post(`http://localhost:5000/upload-assignment/${courseId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setAssignmentName('');
            setQuestions([]);
            setDeadlineDate(dayjs());
            setDeadlineTime(dayjs());
        } catch (error) {
            console.error('Error creating assignment:', error.response.data);
        }
    };    

    return (
        <Container>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box>
                    <Typography variant="h4" gutterBottom>
                        Form Builder
                    </Typography>
                    <TextField
                        label="Assignment Name"
                        variant="outlined"
                        fullWidth
                        value={assignmentName}
                        onChange={(e) => setAssignmentName(e.target.value)}
                        margin="normal"
                    />
                    <input type="file" accept=".json" onChange={handleImport} />
                    <Box marginTop={2}>
                        <Typography variant="h6">Deadline</Typography>
                        <DatePicker
                            label="Deadline Date"
                            value={deadlineDate}
                            onChange={(newValue) => setDeadlineDate(newValue)}
                            renderInput={(params) => <TextField {...params} />}
                        />
                        <TimePicker
                            label="Deadline Time"
                            value={deadlineTime}
                            onChange={(newValue) => setDeadlineTime(newValue)}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </Box>
                    {questions.map((question, index) => (
                        <Box key={question.id} mb={3} p={2} border={1} borderRadius={2}>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Typography variant="h6">Question {index + 1}</Typography>
                                <IconButton color="error" onClick={() => handleDeleteQuestion(question.id)}>
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                            <TextField
                                label="Question Text"
                                variant="outlined"
                                fullWidth
                                value={question.text}
                                onChange={(e) => handleQuestionChange(question.id, "text", e.target.value)}
                                margin="normal"
                            />
                            <TextField
                                select
                                label="Question Type"
                                value={question.type}
                                onChange={(e) => handleQuestionChange(question.id, "type", e.target.value)}
                                fullWidth
                                margin="normal"
                            >
                                {questionTypes.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                label="Maximum Marks"
                                variant="outlined"
                                type="number"
                                value={question.maxMarks}
                                onChange={(e) => handleQuestionChange(question.id, "maxMarks", Number(e.target.value))}
                                fullWidth
                                margin="normal"
                            />
                            {/* File upload for each question */}
                            <Box mt={2}>
                                <input
                                    type="file"
                                    multiple
                                    onChange={(e) => handleFileChange(question.id, e.target.files)}
                                />
                                <Typography variant="caption" color="textSecondary">
                                    {question.files.length > 0 
                                        ? `Uploaded: ${question.files.map(file => file.name).join(", ")}`
                                        : "No files uploaded"}
                                </Typography>
                                <List>
                                    {question.files.map((file) => (
                                        <ListItem key={file.name}>
                                            <Typography variant="body2">{file.name}</Typography>
                                            <ListItemSecondaryAction>
                                                <IconButton edge="end" color="error" onClick={() => handleDeleteFile(question.id, file.name)}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                    ))}
                                </List>
                            </Box>
                            {question.type === "mcq" && (
                                <>
                                    <TextField
                                        label="Predefined Answer"
                                        variant="outlined"
                                        value={question.predefinedAnswer}
                                        onChange={(e) => handleQuestionChange(question.id, "predefinedAnswer", e.target.value)}
                                        fullWidth
                                        margin="normal"
                                    />
                                    <Box mt={2}>
                                        <Typography variant="subtitle1">Options:</Typography>
                                        <List>
                                            {question.options.map((option, idx) => (
                                                <ListItem key={idx}>
                                                    <TextField
                                                        label={`Option ${idx + 1}`}
                                                        variant="outlined"
                                                        value={option}
                                                        onChange={(e) => handleOptionChange(question.id, idx, e.target.value)}
                                                        fullWidth
                                                    />
                                                    <ListItemSecondaryAction>
                                                        <IconButton edge="end" color="error" onClick={() => handleDeleteOption(question.id, idx)}>
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </ListItemSecondaryAction>
                                                </ListItem>
                                            ))}
                                        </List>
                                        <Button variant="outlined" startIcon={<AddIcon />} onClick={() => handleAddOption(question.id)}>
                                            Add Option
                                        </Button>
                                    </Box>
                                </>
                            )}
                        </Box>
                    ))}
                    <Button variant="contained" onClick={handleAddQuestion}>
                        Add Question
                    </Button>
                    <Box mt={2}>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<SaveIcon />}
                            onClick={handleCreateAssignment}
                        >
                            Create Assignment
                        </Button>
                    </Box>
                    <Box mt={4}>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<SaveIcon />}
                            onClick={handleExport}
                        >
                            Export Form as JSON
                        </Button>
                    </Box>
                </Box>
            </LocalizationProvider>
        </Container>
    );
};

export default FormBuilder;