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
  CircularProgress,
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  ShoppingCart as OrdersIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';
import client from '../api/client';

const SellerDashboardPage = () => {
  const { user, becomeSeller } = useAuth();
  const { products, getSellerProducts, loading: productsLoading } = useProducts();
  const navigate = useNavigate();
  const [activating, setActivating] = React.useState(false);

  const handleActivateSeller = async () => {
    setActivating(true);
    await becomeSeller({
      storeName: `${user?.firstName || 'My'}'s Boutique`,
      description: 'Welcome to my new boutique on WigVana!'
    });
    setActivating(false);
  };

  if (!user || !user.isSeller) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Paper elevation={3} sx={{ p: 6, textAlign: 'center', borderRadius: 4, bgcolor: '#FBF7F4' }}>
          <Typography variant="h3" sx={{ color: '#67442E', mb: 2, fontWeight: 'bold' }}>
            Start Your Selling Journey
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
            Transform your passion for wigs into a thriving business. Join Ethiopia's premier marketplace today.
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
            <Button
              variant="contained"
              size="large"
              disabled={activating}
              onClick={handleActivateSeller}
              sx={{
                bgcolor: '#67442E',
                px: 6,
                py: 1.5,
                fontSize: '1.2rem',
                borderRadius: 2,
                '&:hover': { bgcolor: '#523524' }
              }}
            >
              {activating ? <CircularProgress size={24} color="inherit" /> : 'Activate Seller Account Now'}
            </Button>

            <Button
              variant="text"
              onClick={() => navigate('/seller-guide')}
              sx={{ color: '#67442E' }}
            >
              Learn More in Seller Guide
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  // Actual statistics
  const sellerProducts = getSellerProducts();
  const stats = {
    totalProducts: sellerProducts.length,
    totalOrders: 0, // TODO: Integrate with real orders API
    averageRating: sellerProducts.reduce((acc, p) => acc + (p.averageRating || 0), 0) / (sellerProducts.length || 1),
    totalRevenue: 0,
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
              {sellerProducts.length === 0 ? (
                <>
                  <Typography variant="body2" color="text.secondary">
                    No recent activity to display.
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Start by adding products or managing orders.
                  </Typography>
                </>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {[...sellerProducts]
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .slice(0, 3)
                    .map((p) => (
                      <Box key={p._id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, bgcolor: '#FBF7F4', borderRadius: 1 }}>
                        <Box>
                          <Typography variant="subtitle2">{p.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            Added on {new Date(p.createdAt).toLocaleDateString()}
                          </Typography>
                        </Box>
                        <Typography variant="caption" sx={{
                          px: 1, py: 0.5, borderRadius: 1,
                          bgcolor: p.approvalStatus === 'approved' ? '#e8f5e9' : '#fff3e0',
                          color: p.approvalStatus === 'approved' ? '#2e7d32' : '#ed6c02',
                          fontWeight: 'bold'
                        }}>
                          {p.approvalStatus.toUpperCase()}
                        </Typography>
                      </Box>
                    ))}
                  <Button
                    size="small"
                    onClick={() => navigate('/seller/products')}
                    sx={{ alignSelf: 'flex-start', mt: 1, color: '#67442E' }}
                  >
                    View All Activity
                  </Button>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SellerDashboardPage;
