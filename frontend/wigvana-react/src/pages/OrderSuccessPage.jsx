import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Paper, Typography, Button, Box } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const OrderSuccessPage = () => {
    const navigate = useNavigate();

    return (
        <Container maxWidth="sm" sx={{ py: 8 }}>
            <Paper sx={{ p: 4, textAlign: 'center' }}>
                <CheckCircleOutlineIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
                <Typography variant="h4" gutterBottom sx={{ color: '#67442E' }}>
                    Order Placed Successfully!
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                    Thank you for your purchase. Your order has been received and is being processed.
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                    Order ID: #{Math.floor(Math.random() * 100000)}
                </Typography>
                <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Button
                        variant="contained"
                        fullWidth
                        onClick={() => navigate('/products')}
                        sx={{ bgcolor: '#67442E', '&:hover': { bgcolor: '#523524' } }}
                    >
                        Continue Shopping
                    </Button>
                    <Button
                        variant="outlined"
                        fullWidth
                        onClick={() => navigate('/orders')}
                        sx={{ color: '#67442E', borderColor: '#67442E' }}
                    >
                        View Order History
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default OrderSuccessPage;
