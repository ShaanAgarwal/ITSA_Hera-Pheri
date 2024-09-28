import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

const Navbar = ({ adminDetails, onLogout }) => {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    {adminDetails ? adminDetails.instituteName : 'Loading...'}
                </Typography>
                {adminDetails && (
                    <>
                        <Typography variant="body1" sx={{ marginRight: 2 }}>
                            {adminDetails.adminUsername}
                        </Typography>
                        <Button color="inherit" onClick={onLogout}>Logout</Button>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
