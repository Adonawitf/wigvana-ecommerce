import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-mui';
import * as Yup from 'yup';
import client from '../api/client';
// Removed legacy product data loading

// Validation schema
const ProductSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Name must be at least 3 characters')
    .max(100, 'Name must be less than 100 characters')
    .required('Name is required'),
  price: Yup.number()
    .positive('Price must be positive')
    .required('Price is required'),
  category: Yup.string()
    .required('Category is required'),
  description: Yup.string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters')
    .required('Description is required'),
  stock: Yup.number()
    .integer('Stock must be a whole number')
    .min(0, 'Stock cannot be negative')
    .required('Stock is required'),
  availableLengths: Yup.array()
    .min(1, 'Select at least one length')
    .required('Available lengths are required'),
  availableColors: Yup.array()
    .min(1, 'Select at least one color')
    .required('Available colors are required'),
  image: Yup.mixed()
    .required('Image is required'),
});

const SellerProducts = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        if (!user) {
          setLoading(false);
          return;
        }

        // Fetch Categories
        try {
          const { data: catData } = await client.get('/categories?limit=100');
          setCategories(catData.results || []);
        } catch (err) {
          console.error("Error fetching categories", err);
        }

        // Fetch My Products
        const { data: prodData } = await client.get('/me/products?limit=100');
        setProducts(prodData.results || []);

      } catch (error) {
        console.error('Error fetching data:', error);
        showToast('Failed to load products', 'error');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  const handleAddNew = () => {
    setEditingProduct(null);
    setDialogOpen(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setDialogOpen(true);
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await client.delete(`/me/products/${productId}`);
      setProducts(products.filter(p => p.id !== productId));
      showToast('Product deleted successfully', 'success');
    } catch (error) {
      showToast('Failed to delete product', 'error');
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      // 1. Prepare Product Payload
      const enrichedDescription = `${values.description}\n\nAvailable Lengths: ${values.availableLengths.join(', ')}\nAvailable Colors: ${values.availableColors.join(', ')}`;

      const payload = {
        name: values.name,
        description: enrichedDescription,
        categoryId: values.category, // Must be UUID
        basePrice: Number(values.price),
        currency: 'USD',
        isPublished: true
      };

      let productId = editingProduct?.id;

      // 2. Create or Update Product
      if (editingProduct) {
        await client.put(`/me/products/${productId}`, payload);
        showToast('Product updated successfully', 'success');
      } else {
        const { data } = await client.post('/me/products', payload);
        productId = data.id;
        showToast('Product created successfully', 'success');
      }

      // 3. Handle Image Upload
      if (values.image && typeof values.image === 'object' && values.image.base64) {
        try {
          // Convert base64 to blob
          const res = await fetch(values.image.base64);
          const blob = await res.blob();
          const formData = new FormData();
          formData.append('images', blob, 'product.jpg');

          await client.post(`/me/products/${productId}/images`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
        } catch (imgErr) {
          console.error("Image upload failed", imgErr);
          showToast('Product saved but image upload failed', 'warning');
        }
      }

      setDialogOpen(false);
      resetForm();
      // Reload logic - we can just manually trigger state update if we knew exact return structure
      // But easiest is just to force a reload of the component via a key or window.location.reload()
      // Let's use window.location.reload() to be 100% sure we fetch fresh data
      window.location.reload();

    } catch (error) {
      console.error('Error saving product:', error);
      const msg = error.response?.data?.message || 'Failed to save product';
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Check if user is authenticated and is a seller
  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Please login to access this page
          </Typography>
        </Paper>
      </Container>
    );
  }

  if (!user.isSeller) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            This page is only accessible to sellers
          </Typography>
        </Paper>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" sx={{ color: '#67442E' }}>My Products</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddNew}
          sx={{ bgcolor: '#67442E', '&:hover': { bgcolor: '#523524' } }}
        >
          Add New Product
        </Button>
      </Box>

      {products.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            No products yet
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
            Start adding products to your store
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddNew}
            sx={{ bgcolor: '#67442E', '&:hover': { bgcolor: '#523524' } }}
          >
            Add Your First Product
          </Button>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Image</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">Stock</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => {
                // Helper to find category name
                const catName = categories.find(c => c.id === product.category)?.name || product.category || 'Unknown';
                // Helper for image
                // If backend returns `images` array, take first. Else try `image` field.
                const displayInfo = product.images?.[0]?.imageUrl || product.image || 'https://via.placeholder.com/50';

                return (
                  <TableRow key={product.id}>
                    <TableCell>
                      <img
                        src={displayInfo}
                        alt={product.name}
                        style={{ width: 50, height: 50, objectFit: 'cover' }}
                      />
                    </TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{catName}</TableCell>
                    <TableCell align="right">ETB {Number(product.basePrice || product.price).toLocaleString()}</TableCell>
                    <TableCell align="right">{product.stockQuantity || product.stock || 0}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => handleEdit(product)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(product.id)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingProduct ? 'Edit Product' : 'Add New Product'}
        </DialogTitle>
        <Formik
          initialValues={editingProduct ? {
            name: editingProduct.name || '',
            price: editingProduct.price || '',
            category: editingProduct.category || '',
            description: editingProduct.description || '',
            stock: editingProduct.stock || '',
            image: editingProduct.image || null,
            availableLengths: Array.isArray(editingProduct.availableLengths) ? editingProduct.availableLengths : [],
            availableColors: Array.isArray(editingProduct.availableColors) ? editingProduct.availableColors : [],
          } : {
            name: '',
            price: '',
            category: '',
            description: '',
            stock: '',
            image: null,
            availableLengths: [],
            availableColors: [],
          }}
          validationSchema={ProductSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, setFieldValue, values, errors, touched }) => (
            <Form>
              <DialogContent>
                <Box sx={{ display: 'grid', gap: 2, pt: 2 }}>
                  <Field
                    component={TextField}
                    name="name"
                    label="Product Name"
                    fullWidth
                  />
                  <Field
                    component={TextField}
                    name="price"
                    label="Price (ETB)"
                    type="number"
                    fullWidth
                  />
                  {values.price > 0 && (
                    <Box sx={{ p: 1.5, bgcolor: 'grey.50', borderRadius: 1, border: '1px dashed #e0e0e0' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2" color="text.secondary">Listing Price:</Typography>
                        <Typography variant="body2">ETB {Number(values.price).toLocaleString()}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2" color="error.main">Platform Fee (5%):</Typography>
                        <Typography variant="body2" color="error.main">- ETB {(values.price * 0.05).toLocaleString()}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 1, borderTop: '1px solid #e0e0e0' }}>
                        <Typography variant="subtitle2" sx={{ color: '#67442E' }}>Your Net Earnings:</Typography>
                        <Typography variant="subtitle2" sx={{ color: '#67442E' }}>ETB {(values.price * 0.95).toLocaleString()}</Typography>
                      </Box>
                    </Box>
                  )}
                  <FormControl fullWidth error={touched.category && !!errors.category}>
                    <InputLabel>Category</InputLabel>
                    <Field name="category">
                      {({ field, form }) => (
                        <Select
                          {...field}
                          label="Category"
                          value={field.value || ''}
                          onChange={(e) => {
                            form.setFieldValue('category', e.target.value);
                          }}
                        >
                          {categories.map((cat) => (
                            <MenuItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    </Field>
                  </FormControl>
                  <Field
                    component={TextField}
                    name="description"
                    label="Description"
                    multiline
                    rows={4}
                    fullWidth
                  />
                  <Field
                    component={TextField}
                    name="stock"
                    label="Stock"
                    type="number"
                    fullWidth
                  />
                  <Field name="image">
                    {({ field, form }) => (
                      <ImageUpload
                        value={field.value?.base64 || field.value || ''}
                        onChange={({ base64, error }) => {
                          if (error) {
                            form.setFieldError('image', error);
                          } else {
                            form.setFieldValue('image', base64 ? { base64 } : null);
                            form.setFieldError('image', undefined);
                          }
                        }}
                        error={form.errors.image || ''}
                        touched={form.touched.image || false}
                      />
                    )}
                  </Field>
                  <FormControl fullWidth error={touched.availableLengths && !!errors.availableLengths}>
                    <InputLabel>Available Lengths</InputLabel>
                    <Field name="availableLengths">
                      {({ field, form }) => (
                        <Select
                          {...field}
                          multiple
                          label="Available Lengths"
                          value={Array.isArray(field.value) ? field.value : []}
                          onChange={(e) => {
                            form.setFieldValue('availableLengths', e.target.value);
                          }}
                        >
                          {['16', '18', '20', '22', '24', '26'].map((length) => (
                            <MenuItem key={length} value={length}>
                              {length} inches
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    </Field>
                  </FormControl>
                  <FormControl fullWidth error={touched.availableColors && !!errors.availableColors}>
                    <InputLabel>Available Colors</InputLabel>
                    <Field name="availableColors">
                      {({ field, form }) => (
                        <Select
                          {...field}
                          multiple
                          label="Available Colors"
                          value={Array.isArray(field.value) ? field.value : []}
                          onChange={(e) => {
                            form.setFieldValue('availableColors', e.target.value);
                          }}
                        >
                          {['Natural Black', 'Dark Brown', 'Brown', 'Blonde'].map((color) => (
                            <MenuItem key={color} value={color}>
                              {color}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    </Field>
                  </FormControl>
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                  sx={{ bgcolor: '#67442E', '&:hover': { bgcolor: '#523524' } }}
                >
                  {isSubmitting ? (
                    <CircularProgress size={24} />
                  ) : (
                    editingProduct ? 'Save Changes' : 'Add Product'
                  )}
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </Container>
  );
};

export default SellerProducts; 