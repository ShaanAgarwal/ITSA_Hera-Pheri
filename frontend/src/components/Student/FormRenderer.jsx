import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormControl,
  Alert,
  Paper,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import axios from "axios";

const FormRenderer = ({ assignmentId }) => {
  const userId = localStorage.getItem('userId');
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState({});
  const [files, setFiles] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState({});
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

        const gradesResponse = await axios.get(`http://localhost:5000/api/assignment/grades`, {
          params: { userId, assignmentId },
        });
        setGrades(gradesResponse.data);

        const responsesResponse = await axios.get(`http://localhost:5000/assignment/responses/${assignmentId}/${userId}`);
        if (responsesResponse.data) {
          setResponses(responsesResponse.data.responses || {});
          setUploadedFiles(responsesResponse.data.uploaded_files || {});
        } else {
          setResponses({});
        }
      } catch (err) {
        console.error("Error fetching assignment:", err);
      }
    };

    fetchAssignment();
  }, [assignmentId, userId]);

  const handleChange = (questionId, value) => {
    setResponses((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleFileChange = (questionId, filesArray) => {
    setFiles((prev) => ({ ...prev, [questionId]: Array.from(filesArray) }));
  };

  const handleSubmit = async () => {
    if (!form) {
      setError("No form data to submit.");
      return;
    }

    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('assignmentId', assignmentId);
    formData.append('responses', JSON.stringify(responses));

    for (const questionId in files) {
      files[questionId].forEach((file) => {
        formData.append(`files[${questionId}]`, file);
      });
    }

    try {
      await axios.post(`http://localhost:5000/assignments/${assignmentId}/responses`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setSuccess("Responses saved successfully in the database!");
    } catch (err) {
      console.error("Error saving responses:", err);
      setError("Failed to save responses.");
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

              {grades[question.id] && (
                <Typography variant="body2" color="green">
                  Your Grade: {grades[question.id]}
                </Typography>
              )}

              {question.type === "short" && (
                <TextField
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={responses[question.id] || ""}
                  onChange={(e) => handleChange(question.id, e.target.value)}
                  placeholder="Your answer"
                  sx={{ backgroundColor: "#fff", borderRadius: 1 }}
                />
              )}

              {question.type === "long" && (
                <TextField
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  multiline
                  rows={4}
                  value={responses[question.id] || ""}
                  onChange={(e) => handleChange(question.id, e.target.value)}
                  placeholder="Your detailed answer"
                  sx={{ backgroundColor: "#fff", borderRadius: 1 }}
                />
              )}

              {question.type === "mcq" && (
                <FormControl component="fieldset" margin="normal">
                  <RadioGroup
                    value={responses[question.id] || ""}
                    onChange={(e) => handleChange(question.id, e.target.value)}
                  >
                    {question.options.map((option, idx) => (
                      <FormControlLabel
                        key={idx}
                        value={option}
                        control={<Radio />}
                        label={option}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              )}

              <input
                type="file"
                multiple
                onChange={(e) => handleFileChange(question.id, e.target.files)}
                style={{ marginTop: '10px', marginBottom: '10px' }}
              />

              {files[question.id] && Array.isArray(files[question.id]) && files[question.id].length > 0 && (
                <Box>
                  <Typography variant="subtitle2">Files Associated with this Question:</Typography>
                  {files[question.id].map((file, idx) => (
                    <Typography key={idx} variant="body2">
                      {file.name}
                    </Typography>
                  ))}
                </Box>
              )}

              {uploadedFiles[question.id] && Array.isArray(uploadedFiles[question.id]) && uploadedFiles[question.id].length > 0 && (
                <Box>
                  <Typography variant="subtitle2">Your Previously Uploaded Files:</Typography>
                  {uploadedFiles[question.id].map((filePath, idx) => (
                    <Typography key={idx} variant="body2">
                      {filePath}
                    </Typography>
                  ))}
                </Box>
              )}
            </Paper>
          ))}

          <Box mt={4} display="flex" justifyContent="center">
            <Button
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              onClick={handleSubmit}
              sx={{ padding: "10px 20px", borderRadius: 1 }}
            >
              Submit Responses
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default FormRenderer;
