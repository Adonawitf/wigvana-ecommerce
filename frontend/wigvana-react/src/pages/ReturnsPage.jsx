import React from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import RefreshIcon from '@mui/icons-material/Refresh';

const ReturnsPage = () => {
  const returnSteps = [
    {
      step: 1,
      title: 'Initiate Return',
      description: 'Log into your account and go to Order History. Select the order you want to return and click "Return Item".',
      icon: <RefreshIcon />,
    },
    {
      step: 2,
      title: 'Select Items',
      description: 'Choose the items you want to return and provide a reason for the return.',
      icon: <CheckCircleIcon />,
    },
    {
      step: 3,
      title: 'Get Approval',
      description: 'We will review your return request and send you a return authorization within 24 hours.',
      icon: <AccessTimeIcon />,
    },
    {
      step: 4,
      title: 'Ship Item',
      description: 'Package the item securely in its original packaging and ship it to our return center using the provided label.',
      icon: <LocalShippingIcon />,
    },
    {
      step: 5,
      title: 'Receive Refund',
      description: 'Once we receive and inspect the item, we will process your refund within 5-7 business days.',
      icon: <CheckCircleIcon />,
    },
  ];

  const returnConditions = [
    'Items must be unused and in original condition',
    'Original packaging and tags must be included',
    'Return must be initiated within 7 days of delivery',
    'Items must not be damaged or altered',
    'Personalized or custom items are not eligible for return',
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" sx={{ color: '#67442E', mb: 2 }}>
          Returns & Refunds
        </Typography>
        <Typography variant="h6" sx={{ color: 'text.secondary' }}>
          Easy returns and hassle-free refunds
        </Typography>
      </Box>

      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 3, color: '#67442E' }}>
          Return Policy
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          We want you to be completely satisfied with your purchase. If you are
          not happy with your order, you can return it within 7 days of
          delivery for a full refund or exchange.
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          All returned items must be in their original condition, unused, and
          include all original packaging and tags. We reserve the right to
          refuse returns that do not meet these conditions.
        </Typography>
      </Paper>

      <Typography variant="h5" sx={{ mb: 3, color: '#67442E' }}>
        How to Return an Item
      </Typography>
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {returnSteps.map((step) => (
          <Grid item xs={12} md={6} key={step.step}>
            <Card
              sx={{
                height: '100%',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-4px)' },
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      bgcolor: '#67442E',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2,
                      fontWeight: 'bold',
                    }}
                  >
                    {step.step}
                  </Box>
                  <Typography variant="h6">{step.title}</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {step.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#67442E' }}>
              Return Conditions
            </Typography>
            <List>
              {returnConditions.map((condition, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <CheckCircleIcon sx={{ color: '#67442E' }} />
                  </ListItemIcon>
                  <ListItemText primary={condition} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#67442E' }}>
              Refund Information
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Refund Processing Time
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Refunds are processed within 5-7 business days after we receive
                and inspect the returned item.
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Refund Method
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Refunds will be issued to the original payment method used for
                the purchase.
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Return Shipping
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Return shipping costs are the responsibility of the customer,
                unless the item is defective or incorrect.
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Paper sx={{ p: 4, mt: 4, bgcolor: '#FBF7F4' }}>
        <Typography variant="h6" sx={{ mb: 2, color: '#67442E' }}>
          Need Help?
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          If you have any questions about returns or need assistance with your
          return request, please contact our customer support team.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Email: support@wigvana.com | Phone: +251 911 123 456
        </Typography>
      </Paper>
    </Container>
  );
};

export default ReturnsPage;
