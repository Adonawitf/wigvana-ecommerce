import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const NotFoundPage = () => {
    return (
        <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
            <Box sx={{ mb: 4 }}>
                <ErrorOutlineIcon sx={{ fontSize: 100, color: '#bdbdbd' }} />
            </Box>
            <Typography variant="h2" component="h1" gutterBottom sx={{ color: '#67442E' }}>
                404
            </Typography>
            <Typography variant="h4" gutterBottom>
                Page Not Found
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
                The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </Typography>
            <Button
                component={Link}
                to="/"
                variant="contained"
                size="large"
                sx={{
                    mt: 2,
                    bgcolor: '#67442E',
                    '&:hover': {
                        bgcolor: '#523524',
                    },
                }}
            >
                Go to Homepage
            </Button>
        </Container>
    );
};

export default NotFoundPage;
