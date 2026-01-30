import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Card,
  CardContent,
  Button,
  Divider,
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  ShoppingCart as OrdersIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const SellerDashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user || !user.isSeller) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Seller Access Required
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            You need to be a registered seller to access this dashboard.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/seller-guide')}
            sx={{ bgcolor: '#67442E', '&:hover': { bgcolor: '#523524' } }}
          >
            Become a Seller
          </Button>
        </Paper>
      </Container>
    );
  }

  // Mock statistics - replace with actual API calls
  const stats = {
    totalProducts: 12,
    totalOrders: 45,
    averageRating: 4.5,
    totalRevenue: 125000,
  };

  const dashboardCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: <InventoryIcon sx={{ fontSize: 40 }} />,
      color: '#1976d2',
      action: () => navigate('/seller/products'),
      actionText: 'Manage Products',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: <OrdersIcon sx={{ fontSize: 40 }} />,
      color: '#2e7d32',
      action: () => navigate('/seller/orders'),
      actionText: 'View Orders',
    },
    {
      title: 'Average Rating',
      value: stats.averageRating.toFixed(1),
      icon: <StarIcon sx={{ fontSize: 40 }} />,
      color: '#ed6c02',
      action: null,
      actionText: null,
    },
    {
      title: 'Total Revenue',
      value: `${stats.totalRevenue.toLocaleString()} ETB`,
      icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
      color: '#9c27b0',
      action: null,
      actionText: null,
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ color: '#67442E', mb: 4 }}>
        Seller Dashboard
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {dashboardCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-4px)' },
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ color: card.color, mr: 2 }}>{card.icon}</Box>
                  <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    {card.title}
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ color: card.color, mb: 2 }}>
                  {card.value}
                </Typography>
                {card.action && (
                  <Button
                    size="small"
                    onClick={card.action}
                    sx={{ color: card.color }}
                  >
                    {card.actionText}
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#67442E' }}>
              Quick Actions
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant="contained"
                fullWidth
                onClick={() => navigate('/seller/products')}
                sx={{ bgcolor: '#67442E', '&:hover': { bgcolor: '#523524' } }}
              >
                Add New Product
              </Button>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate('/seller/orders')}
                sx={{ borderColor: '#67442E', color: '#67442E' }}
              >
                View All Orders
              </Button>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate('/seller/store')}
                sx={{ borderColor: '#67442E', color: '#67442E' }}
              >
                Manage Store Profile
              </Button>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#67442E' }}>
              Recent Activity
            </Typography>
            <Box>
              <Typography variant="body2" color="text.secondary">
                No recent activity to display.
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Start by adding products or managing orders.
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SellerDashboardPage;
