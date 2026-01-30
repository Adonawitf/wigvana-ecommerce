import React from 'react';
import { Box, Container, Grid, Paper, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PeopleIcon from '@mui/icons-material/People';
import InventoryIcon from '@mui/icons-material/Inventory';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const AdminDashboardPage = () => {
    const navigate = useNavigate();

    const stats = [
        { title: 'Total Users', value: '1,234', icon: <PeopleIcon />, color: '#1976d2', link: '/admin/users' },
        { title: 'Total Products', value: '567', icon: <InventoryIcon />, color: '#2e7d32', link: '/admin/products' },
        { title: 'Total Orders', value: '89', icon: <ShoppingCartIcon />, color: '#ed6c02', link: '/admin/orders' },
        { title: 'Revenue', value: 'ETB 450K', icon: <TrendingUpIcon />, color: '#9c27b0', link: '#' },
    ];

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', color: '#67442E' }}>
                Admin Dashboard
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                {stats.map((stat, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Paper
                            elevation={2}
                            sx={{
                                p: 3,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                cursor: stat.link !== '#' ? 'pointer' : 'default',
                                transition: 'transform 0.2s',
                                '&:hover': stat.link !== '#' ? { transform: 'translateY(-5px)' } : {},
                            }}
                            onClick={() => stat.link !== '#' && navigate(stat.link)}
                        >
                            <Box sx={{ p: 2, borderRadius: '50%', bgcolor: `${stat.color}20`, mb: 2 }}>
                                {React.cloneElement(stat.icon, { sx: { fontSize: 40, color: stat.color } })}
                            </Box>
                            <Typography variant="h6" color="text.secondary">
                                {stat.title}
                            </Typography>
                            <Typography variant="h4" sx={{ fontWeight: 'bold', my: 1 }}>
                                {stat.value}
                            </Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, height: '100%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="h6">Recent Users</Typography>
                            <Button onClick={() => navigate('/admin/users')}>View All</Button>
                        </Box>
                        {/* Placeholder for list */}
                        <Typography variant="body2" color="text.secondary">
                            No recent registrations.
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, height: '100%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="h6">Pending Products</Typography>
                            <Button onClick={() => navigate('/admin/products')}>Review All</Button>
                        </Box>
                        {/* Placeholder for list */}
                        <Typography variant="body2" color="text.secondary">
                            No pending products.
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default AdminDashboardPage;
