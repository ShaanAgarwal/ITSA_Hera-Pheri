import React, { useState } from 'react';
import { Button, Box, Snackbar, Alert } from '@mui/material';
import * as XLSX from 'xlsx';
import axios from 'axios';

const UploadExcel = ({ type }) => {
    const [file, setFile] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(firstSheet);

            // Retrieve instituteId from local storage
            const instituteId = localStorage.getItem('userId');

            // Map jsonData to include instituteId
            const dataWithInstituteId = jsonData.map(entry => ({
                ...entry,
                instituteId: instituteId,
            }));

            try {
                await axios.post(`http://localhost:5000/upload-${type}`, dataWithInstituteId, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                setSnackbarMessage(`${type.charAt(0).toUpperCase() + type.slice(1)} uploaded successfully`);
                setOpenSnackbar(true);
            } catch (error) {
                console.error(error);
                setSnackbarMessage('Error uploading data');
                setOpenSnackbar(true);
            }
        };
        reader.readAsArrayBuffer(file);
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <Box sx={{ marginTop: 2 }}>
            <input type="file" onChange={handleFileChange} />
            <Button variant="contained" onClick={handleUpload} sx={{ marginLeft: 1 }}>
                Upload {type.charAt(0).toUpperCase() + type.slice(1)}
            </Button>

            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default UploadExcel;
