import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    boxShadow: theme.shadows[4],
}));

const AdminName = styled(Typography)(({ theme }) => ({
    fontWeight: 'bold',
    color: theme.palette.common.white,
    marginRight: theme.spacing(2),
}));

const Navbar = ({ adminDetails, onLogout }) => {
    return (
        <StyledAppBar position="static">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1, color: 'white' }}>
                    {adminDetails ? adminDetails.instituteName : 'Loading...'}
                </Typography>
                {adminDetails && (
                    <Box display="flex" alignItems="center">
                        <AdminName variant="body1">
                            {adminDetails.adminUsername}
                        </AdminName>
                        <Button color="inherit" onClick={onLogout} variant="outlined" sx={{ borderColor: 'white', color: 'white', '&:hover': { borderColor: '#f5f5f5', color: '#f5f5f5' } }}>
                            Logout
                        </Button>
                    </Box>
                )}
            </Toolbar>
        </StyledAppBar>
    );
};

export default Navbar;
