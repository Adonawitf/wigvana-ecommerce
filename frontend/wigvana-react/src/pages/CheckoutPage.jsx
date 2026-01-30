import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Paper,
    Typography,
    Grid,
    TextField,
    Button,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
    Box,
    Divider,
    Stepper,
    Step,
    StepLabel
} from '@mui/material';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import client from '../api/client';

const steps = ['Shipping Address', 'Payment Details', 'Review Order'];

const CheckoutPage = () => {
    const navigate = useNavigate();
    const { cartItems, getCartTotal, clearCart } = useCart();
    const { showToast } = useToast();
    const [activeStep, setActiveStep] = useState(0);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        state: 'Addis Ababa', // Default for demo
        postalCode: '1000',
        country: 'ET',
        phone: '',
        paymentMethod: 'cod'
    });

    const handleNext = () => {
        if (activeStep === 0) {
            if (!formData.firstName || !formData.address || !formData.city || !formData.phone) {
                showToast('Please fill in all required fields', 'error');
                return;
            }
        }
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const { user } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handlePlaceOrder = async () => {
        if (!user) {
            showToast('Please login to place an order', 'error');
            return;
        }

        setIsSubmitting(true);
        try {
            // Step 1: Create Shipping Address
            const addressPayload = {
                addressLine1: formData.address,
                city: formData.city,
                stateProvinceRegion: formData.state,
                postalCode: formData.postalCode,
                country: formData.country,
                contactName: `${formData.firstName} ${formData.lastName}`,
                contactPhone: formData.phone,
                addressType: 'shipping' // API requires specific type
            };

            const { data: shippingAddr } = await client.post('/me/addresses', addressPayload);
            const shippingAddressId = shippingAddr.id || shippingAddr._id;

            // Step 2: Create Billing Address (Mirroring shipping for simplicity)
            // Note: Backend might allow reusing ID if logic supported, but usually distinct records for type.
            const { data: billingAddr } = await client.post('/me/addresses', {
                ...addressPayload,
                addressType: 'billing'
            });
            const billingAddressId = billingAddr.id || billingAddr._id;

            // Step 3: Create Payment Method
            const { data: paymentMethod } = await client.post('/me/payment-methods', {
                paymentToken: 'tok_demo_' + Date.now(), // Dummy token for demo
                type: formData.paymentMethod,
                billingAddressId: billingAddressId,
                isDefault: true
            });
            const paymentMethodId = paymentMethod.id || paymentMethod._id;

            // Step 4: Place Order
            await client.post('/me/orders', {
                shippingAddressId,
                billingAddressId,
                paymentMethodId,
                shippingMethod: 'standard',
                notesByBuyer: 'Placed via WigVana Web'
            });

            // Success
            clearCart();
            showToast('Order placed successfully!', 'success');
            navigate('/order-success'); // Ensure this route exists or redirect to history

        } catch (error) {
            console.error("Order placement failed:", error);
            const msg = error.response?.data?.message || 'Failed to place order';
            showToast(msg, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const subtotal = getCartTotal();
    const shipping = 500;
    const serviceFee = subtotal * 0.05; // 5% Service Fee
    const total = subtotal + shipping + serviceFee;

    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                label="First Name"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                label="Last Name"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                label="Address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                label="City"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                label="Phone Number"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                label="State/Region"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                label="Postal Code"
                                name="postalCode"
                                value={formData.postalCode}
                                onChange={handleChange}
                            />
                        </Grid>
                    </Grid>
                );
            case 1:
                return (
                    <FormControl component="fieldset">
                        <FormLabel component="legend">Payment Method</FormLabel>
                        <RadioGroup
                            name="paymentMethod"
                            value={formData.paymentMethod}
                            onChange={handleChange}
                        >
                            <FormControlLabel value="cod" control={<Radio />} label="Cash on Delivery" />
                            <FormControlLabel value="mobile_money" control={<Radio />} label="Mobile Money (Telebirr/CBE Birr)" />
                        </RadioGroup>
                    </FormControl>
                );
            case 2:
                return (
                    <Box>
                        <Typography variant="h6" gutterBottom>Order Summary</Typography>
                        <Box sx={{ mb: 2 }}>
                            {cartItems.map((item, index) => (
                                <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2">{item.name} x {item.quantity}</Typography>
                                    <Typography variant="body2">{((item.price * item.quantity)).toLocaleString()} ETB</Typography>
                                </Box>
                            ))}
                        </Box>
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography>Subtotal</Typography>
                            <Typography>{subtotal.toLocaleString()} ETB</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography>Shipping</Typography>
                            <Typography>{shipping.toLocaleString()} ETB</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, color: 'info.main' }}>
                            <Typography>Platform Service Fee (5%)</Typography>
                            <Typography>{serviceFee.toLocaleString()} ETB</Typography>
                        </Box>
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Total</Typography>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#67442E' }}>
                                {total.toLocaleString()} ETB
                            </Typography>
                        </Box>
                    </Box>
                );
            default:
                return 'Unknown step';
        }
    };

    if (cartItems.length === 0) {
        return (
            <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
                <Typography variant="h5">Your cart is empty</Typography>
                <Button onClick={() => navigate('/products')} sx={{ mt: 2 }}>Browse Products</Button>
            </Container>
        )
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Typography variant="h4" sx={{ mb: 4, color: '#67442E' }}>Checkout</Typography>
            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            <Paper sx={{ p: 4 }}>
                {renderStepContent(activeStep)}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                    {activeStep !== 0 && (
                        <Button onClick={handleBack} sx={{ mr: 1 }}>
                            Back
                        </Button>
                    )}
                    <Button
                        variant="contained"
                        onClick={activeStep === steps.length - 1 ? handlePlaceOrder : handleNext}
                        disabled={isSubmitting}
                        sx={{ bgcolor: '#67442E', '&:hover': { bgcolor: '#523524' } }}
                    >
                        {isSubmitting ? 'Placing Order...' : (activeStep === steps.length - 1 ? 'Place Order' : 'Next')}
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default CheckoutPage;
