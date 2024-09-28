import React, { useState, useRef } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  RadioGroup,
  Radio,
  FormControlLabel,
  Checkbox,
  FormControl,
  Alert,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import axios from "axios";

const FormRenderer = ({ assignmentId }) => {
  const [form, setForm] = useState(null); // Holds the form structure
  const [responses, setResponses] = useState({}); // Holds user responses
  const [error, setError] = useState(null); // Holds error messages
  const [success, setSuccess] = useState(null); // Holds success messages

  // Fetch assignment data when assignmentId changes
  React.useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/assignments/${assignmentId}`);
        const data = response.data;

        // Basic validation
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

  // Handler for input changes in the form
  const handleChange = (questionId, value) => {
    setResponses((prev) => ({ ...prev, [questionId]: value }));
  };

  // Handler for submitting the form responses
  const handleSubmit = async () => {
    if (!form) {
        setError("No form data to submit.");
        return;
    }

    const answers = JSON.stringify(responses, null, 2);

    // Create the Blob for downloading
    const blob = new Blob([answers], { type: "application/json" });
    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = "responses.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // API call to save the responses in the backend
    try {
        await axios.post(`http://localhost:5000/assignments/${assignmentId}/responses`, {
            responses,
        });
        setSuccess("Responses saved successfully in the database!");
    } catch (err) {
        console.error("Error saving responses:", err);
        setError("Failed to save responses.");
    }
};


  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Assignment Renderer
      </Typography>

      {/* Display success or error messages */}
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

      {/* If no form is loaded, show a message */}
      {!form ? (
        <Typography variant="body1" mt={2}>
          Loading assignment...
        </Typography>
      ) : (
        /* If form is loaded, render the form */
        <Box>
          <Typography variant="h5" gutterBottom>
            {form.title || "Untitled Assignment"}
          </Typography>
          {form.questions.map((question, index) => (
            (question.type === "mcq" || question.type === "short" || question.type === "long") && (
              <Box key={question.id} mb={3} p={2} border={1} borderRadius={2}>
                <Typography variant="h6">
                  {index + 1}. {question.text} 
                  {question.maxMarks && <span> (Max Marks: {question.maxMarks})</span>}
                </Typography>

                {/* Render based on question type */}
                {question.type === "short" && (
                  <TextField
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={responses[question.id] || ""}
                    onChange={(e) => handleChange(question.id, e.target.value)}
                    placeholder="Your answer"
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
              </Box>
            )
          ))}

          {/* Submit Button */}
          <Box mt={4}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              onClick={handleSubmit}
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