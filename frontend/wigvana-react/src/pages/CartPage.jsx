import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Grid,
  Divider,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const CartPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    getCartTotal,
  } = useCart();

  const handleQuantityChange = (productId, selectedLength, selectedColor, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId, selectedLength, selectedColor);
    } else {
      updateQuantity(productId, selectedLength, selectedColor, newQuantity);
    }
  };

  const handleRemove = (productId, selectedLength, selectedColor) => {
    removeFromCart(productId, selectedLength, selectedColor);
  };

  const calculateItemPrice = (item) => {
    const basePrice = item.price * item.quantity;
    const lengthPrice =
      parseInt(item.selectedLength) > 20
        ? (parseInt(item.selectedLength) - 20) * 500 * item.quantity
        : 0;
    return basePrice + lengthPrice;
  };

  const subtotal = cartItems ? cartItems.reduce((sum, item) => sum + calculateItemPrice(item), 0) : 0;
  const shipping = subtotal > 0 ? 500 : 0; // Example shipping cost
  const total = subtotal + shipping;

  const displayCartItems = cartItems || [];

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <ShoppingCartIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Please Login to View Your Cart
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            You need to be logged in to add items to your cart and checkout.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/login')}
            sx={{ bgcolor: '#67442E', '&:hover': { bgcolor: '#523524' } }}
          >
            Login
          </Button>
        </Paper>
      </Container>
    );
  }

  if (!displayCartItems || displayCartItems.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <ShoppingCartIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Your Cart is Empty
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Start shopping to add items to your cart.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/products')}
            sx={{ bgcolor: '#67442E', '&:hover': { bgcolor: '#523524' } }}
          >
            Browse Products
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ color: '#67442E', mb: 4 }}>
        Shopping Cart
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>Length</TableCell>
                  <TableCell>Color</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="center">Quantity</TableCell>
                  <TableCell align="right">Total</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displayCartItems.map((item, index) => (
                  <TableRow key={`${item.productId}-${item.selectedLength}-${item.selectedColor}-${index}`}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                          component="img"
                          src={item.image}
                          alt={item.name}
                          sx={{
                            width: 80,
                            height: 80,
                            objectFit: 'cover',
                            borderRadius: 1,
                          }}
                          onError={(e) => {
                            e.target.src = '/placeholder-image.jpg';
                          }}
                        />
                        <Typography variant="body1">{item.name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{item.selectedLength} inches</TableCell>
                    <TableCell>{item.selectedColor}</TableCell>
                    <TableCell align="right">
                      {item.price.toLocaleString()} ETB
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() =>
                            handleQuantityChange(
                              item.productId,
                              item.selectedLength,
                              item.selectedColor,
                              item.quantity - 1
                            )
                          }
                        >
                          <RemoveIcon />
                        </IconButton>
                        <TextField
                          value={item.quantity}
                          size="small"
                          sx={{ width: 60 }}
                          inputProps={{
                            style: { textAlign: 'center' },
                            min: 1,
                          }}
                          onChange={(e) => {
                            const newQty = parseInt(e.target.value) || 1;
                            handleQuantityChange(
                              item.productId,
                              item.selectedLength,
                              item.selectedColor,
                              newQty
                            );
                          }}
                        />
                        <IconButton
                          size="small"
                          onClick={() =>
                            handleQuantityChange(
                              item.productId,
                              item.selectedLength,
                              item.selectedColor,
                              item.quantity + 1
                            )
                          }
                        >
                          <AddIcon />
                        </IconButton>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      {calculateItemPrice(item).toLocaleString()} ETB
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="error"
                        onClick={() =>
                          handleRemove(
                            item.productId,
                            item.selectedLength,
                            item.selectedColor
                          )
                        }
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, position: 'sticky', top: 20 }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#67442E' }}>
              Order Summary
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Subtotal</Typography>
                <Typography>{subtotal.toLocaleString()} ETB</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Shipping</Typography>
                <Typography>{shipping.toLocaleString()} ETB</Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6" sx={{ color: '#67442E' }}>
                  {total.toLocaleString()} ETB
                </Typography>
              </Box>
            </Box>
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={() => {
                navigate('/checkout');
              }}
              sx={{
                bgcolor: '#67442E',
                '&:hover': { bgcolor: '#523524' },
                mt: 2,
              }}
            >
              Proceed to Checkout
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate('/products')}
              sx={{ mt: 2, borderColor: '#67442E', color: '#67442E' }}
            >
              Continue Shopping
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CartPage;
