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
    IconButton,
    TextField,
    InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const AdminUsersPage = () => {
    // Mock User Data
    const [users, setUsers] = useState([
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'buyer', status: 'active', joined: '2025-01-15' },
        { id: 2, name: 'Jane Smith', email: 'jane@store.com', role: 'seller', status: 'active', joined: '2025-01-20' },
        { id: 3, name: 'Bob Wilson', email: 'bob@example.com', role: 'buyer', status: 'suspended', joined: '2025-02-01' },
        { id: 4, name: 'Alice Brown', email: 'alice@store.com', role: 'seller', status: 'pending', joined: '2025-02-05' },
    ]);

    const [searchTerm, setSearchTerm] = useState('');

    const handleStatusChange = (userId, newStatus) => {
        setUsers(users.map(user =>
            user.id === userId ? { ...user, status: newStatus } : user
        ));
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#67442E' }}>
                    User Management
                </Typography>
                <TextField
                    size="small"
                    placeholder="Search users..."
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
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Joined</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredUsers.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={user.role}
                                        color={user.role === 'seller' ? 'primary' : 'default'}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={user.status}
                                        color={
                                            user.status === 'active' ? 'success' :
                                                user.status === 'suspended' ? 'error' : 'warning'
                                        }
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>{user.joined}</TableCell>
                                <TableCell align="right">
                                    {user.status === 'active' ? (
                                        <Button
                                            startIcon={<BlockIcon />}
                                            color="error"
                                            size="small"
                                            onClick={() => handleStatusChange(user.id, 'suspended')}
                                        >
                                            Suspend
                                        </Button>
                                    ) : (
                                        <Button
                                            startIcon={<CheckCircleIcon />}
                                            color="success"
                                            size="small"
                                            onClick={() => handleStatusChange(user.id, 'active')}
                                        >
                                            Activate
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

export default AdminUsersPage;
