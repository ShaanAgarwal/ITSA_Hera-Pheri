import React, { useState } from "react";
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

const FormRenderer = ({ assignmentId, userId }) => { // Accept userId as a prop
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState({});
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  React.useEffect(() => {
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

  const handleChange = (questionId, value) => {
    setResponses((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async () => {
    if (!form) {
      setError("No form data to submit.");
      return;
    }
    const userId = localStorage.getItem('userId');
    try {
      await axios.post(`http://localhost:5000/assignments/${assignmentId}/responses`, {
        responses,
        userId, // Include userId in the request
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