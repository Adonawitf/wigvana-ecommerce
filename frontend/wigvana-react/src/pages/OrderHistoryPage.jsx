import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import client from '../api/client';

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'delivered':
    case 'completed':
      return 'success';
    case 'processing':
    case 'shipped':
    case 'out_for_delivery':
      return 'warning';
    case 'cancelled':
    case 'cancelled_by_user':
    case 'cancelled_by_seller':
    case 'cancelled_by_admin':
      return 'error';
    case 'pending_payment':
      return 'info';
    default:
      return 'default';
  }
};

const OrderHistoryPage = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const { data } = await client.get('/me/orders?limit=50&sort=-createdAt');
        setOrders(data.results || []);
      } catch (error) {
        console.error('Error fetching orders:', error);
        showToast('Failed to load orders', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, navigate]);

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setDialogOpen(true);
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      await client.post(`/orders/${orderId}/cancel`);
      showToast('Order cancellation requested', 'info');
      // Update local state
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId
            ? { ...order, status: 'cancelled_by_user' }
            : order
        )
      );
    } catch (error) {
      console.error("Cancel failed", error);
      showToast('Failed to cancel order', 'error');
    }
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ color: '#67442E', mb: 4 }}>
        Order History
      </Typography>

      {orders.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            No Orders Yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Start shopping to see your orders here.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/products')}
            sx={{ bgcolor: '#67442E', '&:hover': { bgcolor: '#523524' } }}
          >
            Browse Products
          </Button>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Items</TableCell>
                <TableCell>Total Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>
                    {new Date(order.orderDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {order.items?.length || 0} item(s)
                  </TableCell>
                  <TableCell>
                    {order.totalAmount?.toLocaleString()} ETB
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={order.status?.replace(/_/g, ' ').toUpperCase()}
                      color={getStatusColor(order.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={() => handleViewDetails(order)}
                      color="primary"
                    >
                      <VisibilityIcon />
                    </IconButton>
                    {order.status === 'pending_payment' && (
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleCancelOrder(order.id)}
                        sx={{ ml: 1 }}
                      >
                        Cancel
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Order Details</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Order ID: {selectedOrder.id}
              </Typography>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                Date: {new Date(selectedOrder.orderDate).toLocaleString()}
              </Typography>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Items:
              </Typography>
              {selectedOrder.items?.map((item, index) => (
                <Box key={index} sx={{ mb: 1, display: 'flex', justifyContent: 'space-between' }}>
                  <Typography>{item.name} x {item.quantity}</Typography>
                  <Typography>{item.price.toLocaleString()} ETB</Typography>
                </Box>
              ))}
              <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6">Total:</Typography>
                  <Typography variant="h6" sx={{ color: '#67442E' }}>
                    {selectedOrder.totalAmount?.toLocaleString()} ETB
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ mt: 2 }}>
                <Chip
                  label={selectedOrder.status?.replace(/_/g, ' ').toUpperCase()}
                  color={getStatusColor(selectedOrder.status)}
                />
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default OrderHistoryPage;
