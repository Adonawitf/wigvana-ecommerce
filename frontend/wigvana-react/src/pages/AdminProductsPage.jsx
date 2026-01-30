import React, { useState } from 'react';
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
    InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const AdminProductsPage = () => {
    // Mock Product Data
    const [products, setProducts] = useState([
        { id: 1, name: 'Natural Wave Wig', seller: 'Jane Smith', price: 1200, category: 'Human Hair', status: 'pending', image: '/images/img1.jpg' },
        { id: 2, name: 'Long Straight Synthetic', seller: 'Alice Brown', price: 450, category: 'Synthetic', status: 'approved', image: '/images/img6.jpg' },
        { id: 3, name: 'Curly Bob', seller: 'Jane Smith', price: 890, category: 'Human Hair', status: 'rejected', image: '/images/img3.jpg' },
        { id: 4, name: 'Blonde Lace Front', seller: 'Alice Brown', price: 1500, category: 'Lace Front', status: 'pending', image: '/images/img5.jpg' },
    ]);

    const [searchTerm, setSearchTerm] = useState('');

    const handleStatusChange = (productId, newStatus) => {
        setProducts(products.map(product =>
            product.id === productId ? { ...product, status: newStatus } : product
        ));
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.seller.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                        {filteredProducts.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Avatar src={product.image} variant="rounded" />
                                    {product.name}
                                </TableCell>
                                <TableCell>{product.seller}</TableCell>
                                <TableCell>{product.category}</TableCell>
                                <TableCell>{product.price}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={product.status}
                                        color={
                                            product.status === 'approved' ? 'success' :
                                                product.status === 'rejected' ? 'error' : 'warning'
                                        }
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    {product.status === 'pending' && (
                                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                            <Button
                                                startIcon={<CheckCircleIcon />}
                                                color="success"
                                                size="small"
                                                variant="outlined"
                                                onClick={() => handleStatusChange(product.id, 'approved')}
                                            >
                                                Approve
                                            </Button>
                                            <Button
                                                startIcon={<CancelIcon />}
                                                color="error"
                                                size="small"
                                                variant="outlined"
                                                onClick={() => handleStatusChange(product.id, 'rejected')}
                                            >
                                                Reject
                                            </Button>
                                        </Box>
                                    )}
                                    {product.status !== 'pending' && (
                                        <Button
                                            size="small"
                                            color="inherit"
                                            onClick={() => handleStatusChange(product.id, 'pending')}
                                        >
                                            Reset
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default AdminProductsPage;
