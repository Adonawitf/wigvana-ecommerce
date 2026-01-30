import React from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PaymentIcon from '@mui/icons-material/Payment';

const ShippingPage = () => {
  const shippingOptions = [
    {
      name: 'Standard Shipping',
      duration: '3-5 business days',
      price: '500 ETB',
      description: 'Available for all locations in Ethiopia',
      icon: <LocalShippingIcon sx={{ fontSize: 40 }} />,
    },
    {
      name: 'Express Shipping',
      duration: '1-2 business days',
      price: '1,000 ETB',
      description: 'Fast delivery within Addis Ababa and major cities',
      icon: <AccessTimeIcon sx={{ fontSize: 40 }} />,
    },
    {
      name: 'Same Day Delivery',
      duration: 'Same day',
      price: '1,500 ETB',
      description: 'Available in Addis Ababa only (orders placed before 12 PM)',
      icon: <LocationOnIcon sx={{ fontSize: 40 }} />,
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" sx={{ color: '#67442E', mb: 2 }}>
          Shipping Information
        </Typography>
        <Typography variant="h6" sx={{ color: 'text.secondary' }}>
          Fast and reliable delivery across Ethiopia
        </Typography>
      </Box>

      <Grid container spacing={4} sx={{ mb: 6 }}>
        {shippingOptions.map((option, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card
              sx={{
                height: '100%',
                textAlign: 'center',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-4px)' },
              }}
            >
              <CardContent>
                <Box sx={{ color: '#67442E', mb: 2 }}>
                  {option.icon}
                </Box>
                <Typography variant="h5" sx={{ mb: 1, color: '#67442E' }}>
                  {option.name}
                </Typography>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  {option.price}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {option.duration}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {option.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 3, color: '#67442E' }}>
          Shipping Policy
        </Typography>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Processing Time
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Orders are typically processed within 1-2 business days. During peak
            seasons, processing may take up to 3 business days. You will receive
            an email confirmation once your order has been shipped.
          </Typography>
        </Box>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Delivery Areas
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            We currently deliver to all major cities and towns in Ethiopia.
            Delivery to remote areas may take additional time. Contact us if you
            are unsure about delivery to your location.
          </Typography>
        </Box>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Tracking Your Order
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Once your order ships, you will receive a tracking number via email
            and SMS. You can track your order status in real-time through your
            account dashboard or by contacting our customer support.
          </Typography>
        </Box>
        <Box>
          <Typography variant="h6" gutterBottom>
            Delivery Instructions
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Please ensure someone is available to receive the package at the
            delivery address. If no one is available, our delivery partner will
            attempt delivery again the next business day. You can also provide
            special delivery instructions during checkout.
          </Typography>
        </Box>
      </Paper>

      <Paper sx={{ p: 4, bgcolor: '#FBF7F4' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <PaymentIcon sx={{ fontSize: 32, color: '#67442E', mr: 2 }} />
          <Typography variant="h6" sx={{ color: '#67442E' }}>
            Free Shipping
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          Enjoy free standard shipping on orders over 5,000 ETB. This offer
          applies to all locations in Ethiopia.
        </Typography>
      </Paper>
    </Container>
  );
};

export default ShippingPage;
