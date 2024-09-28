import React, { useEffect, useState } from 'react';
import { Typography, Box } from '@mui/material';
import Navbar from '../components/Admin/Navbar';
import Sidebar from '../components/Admin/Sidebar';
import axios from 'axios';

const AdminDashboard = () => {
    const [adminDetails, setAdminDetails] = useState(null);
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const fetchAdminDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/admin/${userId}`);
                setAdminDetails(response.data);
            } catch (error) {
                console.error('Error fetching admin details:', error);
            }
        };

        fetchAdminDetails();
    }, [userId]);

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/';
    };

    return (
        <Box>
            <Navbar adminDetails={adminDetails} onLogout={handleLogout} />
            <Box display="flex">
                <Sidebar />
                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                    <Typography variant="h4">Welcome to the Admin Dashboard</Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default AdminDashboard;
