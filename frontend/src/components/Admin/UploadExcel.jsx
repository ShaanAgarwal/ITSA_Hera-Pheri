import React, { useState, useEffect } from 'react';
import { Button, Box, Snackbar, Alert, Typography, CircularProgress } from '@mui/material';
import * as XLSX from 'xlsx';
import axios from 'axios';

const UploadExcel = ({ type, onClose }) => {
    const [file, setFile] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    useEffect(() => {
        let timer;
        if (openSnackbar && snackbarSeverity === 'success') {
            timer = setTimeout(() => {
                setOpenSnackbar(false);
                onClose(); // Close the dialog after the message is shown
            }, 5000);
        } else if (openSnackbar && snackbarSeverity === 'error') {
            // If it's an error, close the snackbar manually after clicking
            setTimeout(() => {
                setOpenSnackbar(false);
            }, 6000);
        }
        return () => clearTimeout(timer);
    }, [openSnackbar, snackbarSeverity, onClose]);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setSnackbarMessage('Please select a file to upload.');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
            return;
        }

        setLoading(true);
        const reader = new FileReader();
        reader.onload = async (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(firstSheet);

            const instituteId = localStorage.getItem('userId');
            const dataWithInstituteId = jsonData.map(entry => ({
                ...entry,
                instituteId: instituteId,
            }));

            try {
                await axios.post(`http://localhost:5000/upload-${type}`, dataWithInstituteId, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                setSnackbarMessage(`${type.charAt(0).toUpperCase() + type.slice(1)} uploaded successfully`);
                setSnackbarSeverity('success');
                setOpenSnackbar(true);
                // Close the dialog after successful upload
                // The dialog will close after 5 seconds via useEffect
            } catch (error) {
                console.error('Upload error:', error);
                setSnackbarMessage('Error uploading data. Please try again.');
                setSnackbarSeverity('error');
                setOpenSnackbar(true);
            } finally {
                setLoading(false);
                setFile(null); // Clear the file after upload
            }
        };

        reader.readAsArrayBuffer(file);
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <Box sx={{ marginTop: 2, textAlign: 'center' }}>
            <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                id="file-upload"
            />
            <label htmlFor="file-upload">
                <Button variant="outlined" component="span" sx={{ marginRight: 1 }}>
                    Choose File
                </Button>
            </label>
            <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 1 }}>
                {file ? file.name : 'No file selected'}
            </Typography>
            <Button
                variant="contained"
                onClick={handleUpload}
                sx={{ marginLeft: 1 }}
                disabled={loading}
            >
                {loading ? <CircularProgress size={24} color="inherit" /> : `Upload ${type.charAt(0).toUpperCase() + type.slice(1)}`}
            </Button>

            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default UploadExcel;
