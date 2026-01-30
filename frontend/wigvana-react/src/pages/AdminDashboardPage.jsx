import React, { useState, useEffect } from 'react';
import { Box, Container, Grid, Paper, Typography, Button, CircularProgress, List, ListItem, ListItemText, ListItemAvatar, Avatar, Chip, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PeopleIcon from '@mui/icons-material/People';
import InventoryIcon from '@mui/icons-material/Inventory';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import client from '../api/client';

const AdminDashboardPage = () => {
    const navigate = useNavigate();
    const [statsData, setStatsData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await client.get('/admin/stats');
                setStatsData(data);
            } catch (error) {
                console.error('Error fetching admin stats:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const stats = [
        { title: 'Total Users', value: statsData?.users?.toLocaleString() || '0', icon: <PeopleIcon />, color: '#1976d2', link: '/admin/users' },
        { title: 'Total Products', value: statsData?.products?.toLocaleString() || '0', icon: <InventoryIcon />, color: '#2e7d32', link: '/admin/products' },
        { title: 'Total Orders', value: statsData?.orders?.toLocaleString() || '0', icon: <ShoppingCartIcon />, color: '#ed6c02', link: '/admin/orders' },
        { title: 'Revenue', value: `ETB ${statsData?.revenue?.toLocaleString() || '0'}`, icon: <TrendingUpIcon />, color: '#9c27b0', link: '#' },
    ];

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

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
                        <List>
                            {statsData?.recentUsers?.length > 0 ? (
                                statsData.recentUsers.map((user, index) => (
                                    <React.Fragment key={user._id}>
                                        <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                                            <ListItemAvatar>
                                                <Avatar sx={{ bgcolor: '#67442E20', color: '#67442E' }}>
                                                    {user.firstName?.charAt(0)}
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={`${user.firstName} ${user.lastName}`}
                                                secondary={
                                                    <React.Fragment>
                                                        <Typography component="span" variant="body2" color="text.primary">
                                                            {user.email}
                                                        </Typography>
                                                        {` — ${new Date(user.createdAt).toLocaleDateString()}`}
                                                    </React.Fragment>
                                                }
                                            />
                                            <Chip label={user.roles[0]} size="small" variant="outlined" />
                                        </ListItem>
                                        {index < statsData.recentUsers.length - 1 && <Divider component="li" />}
                                    </React.Fragment>
                                ))
                            ) : (
                                <Typography variant="body2" color="text.secondary">
                                    No recent registrations.
                                </Typography>
                            )}
                        </List>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, height: '100%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="h6">Pending Products</Typography>
                            <Button onClick={() => navigate('/admin/products')}>Review All</Button>
                        </Box>
                        <List>
                            {statsData?.pendingProducts?.length > 0 ? (
                                statsData.pendingProducts.map((product, index) => (
                                    <React.Fragment key={product._id}>
                                        <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                                            <ListItemAvatar>
                                                <Avatar variant="rounded" src={product.mainImage} />
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={product.name}
                                                secondary={
                                                    <React.Fragment>
                                                        <Typography component="span" variant="body2" color="text.primary">
                                                            ETB {(product.basePrice || 0).toLocaleString()}
                                                        </Typography>
                                                        {` — by ${product.sellerId?.firstName || 'Unknown'}`}
                                                    </React.Fragment>
                                                }
                                            />
                                            <Button size="small" onClick={() => navigate('/admin/products')}>Review</Button>
                                        </ListItem>
                                        {index < statsData.pendingProducts.length - 1 && <Divider component="li" />}
                                    </React.Fragment>
                                ))
                            ) : (
                                <Typography variant="body2" color="text.secondary">
                                    No pending products.
                                </Typography>
                            )}
                        </List>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default AdminDashboardPage;
