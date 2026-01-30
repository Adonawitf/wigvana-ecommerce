import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Chip,
    Avatar,
    TextField,
    InputAdornment,
    CircularProgress,
    Alert
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import client from '../api/client';
import { toast } from 'react-toastify';

const AdminProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const { data } = await client.get('/admin/products');
            setProducts(data.results || []);
            setError(null);
        } catch (err) {
            console.error('Error fetching products:', err);
            setError('Failed to load products. Please ensure you are authorized.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleStatusChange = async (productId, newStatus) => {
        try {
            await client.put(`/admin/products/${productId}`, { approvalStatus: newStatus });
            toast.success(`Product ${newStatus} successfully`);
            fetchProducts(); // Refresh list
        } catch (err) {
            console.error(`Error updating product status:`, err);
            toast.error(`Failed to update product status.`);
        }
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.sellerId?.firstName + ' ' + product.sellerId?.lastName).toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading && products.length === 0) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#67442E' }}>
                    Product Moderation
                </Typography>
                <TextField
                    size="small"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            <TableContainer component={Paper}>
                <Table>
                    <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                        <TableRow>
                            <TableCell>Product</TableCell>
                            <TableCell>Seller</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Price (ETB)</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredProducts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                                    No products found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredProducts.map((product) => (
                                <TableRow key={product._id}>
                                    <TableCell sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Avatar src={product.mainImage || '/images/placeholder-product.png'} variant="rounded" />
                                        {product.name}
                                    </TableCell>
                                    <TableCell>
                                        {product.sellerId ? `${product.sellerId.firstName} ${product.sellerId.lastName}` : 'Unknown Seller'}
                                    </TableCell>
                                    <TableCell>{product.categoryId?.name || 'Uncategorized'}</TableCell>
                                    <TableCell>{(product.basePrice || 0).toLocaleString()}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={product.approvalStatus}
                                            color={
                                                product.approvalStatus === 'approved' ? 'success' :
                                                    product.approvalStatus === 'rejected' ? 'error' : 'warning'
                                            }
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                            {product.approvalStatus !== 'approved' && (
                                                <Button
                                                    startIcon={<CheckCircleIcon />}
                                                    color="success"
                                                    size="small"
                                                    variant="outlined"
                                                    onClick={() => handleStatusChange(product._id, 'approved')}
                                                >
                                                    Approve
                                                </Button>
                                            )}
                                            {product.approvalStatus !== 'rejected' && (
                                                <Button
                                                    startIcon={<CancelIcon />}
                                                    color="error"
                                                    size="small"
                                                    variant="outlined"
                                                    onClick={() => handleStatusChange(product._id, 'rejected')}
                                                >
                                                    Reject
                                                </Button>
                                            )}
                                            {product.approvalStatus !== 'pending' && (
                                                <Button
                                                    size="small"
                                                    color="inherit"
                                                    onClick={() => handleStatusChange(product._id, 'pending')}
                                                >
                                                    Reset
                                                </Button>
                                            )}
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default AdminProductsPage;
