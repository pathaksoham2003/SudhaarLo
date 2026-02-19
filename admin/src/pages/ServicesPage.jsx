import React, { useState } from 'react';
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem } from '@mui/material';
import { SapTable } from '@core/component/Table';
import { useGetServices, useCreateService, useGetCategories } from '../services/adminService';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const ServicesPage = () => {
    const { data: servicesData, isLoading: servicesLoading } = useGetServices();
    const { data: categoriesData } = useGetCategories();
    const { mutate: createService, isPending: isCreating } = useCreateService();
    const [openDialog, setOpenDialog] = useState(false);

    const handleOpen = () => setOpenDialog(true);
    const handleClose = () => {
        setOpenDialog(false);
        formik.resetForm();
    };

    const formik = useFormik({
        initialValues: {
            name: '',
            description: '',
            category: '',
            basePrice: '',
            status: 'ACTIVE' // default status
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Service name is required'),
            description: Yup.string(),
            category: Yup.string().required('Category is required'),
            basePrice: Yup.number().typeError('Must be a number').positive('Must be positive').required('Base Price is required'),
            status: Yup.string().oneOf(['ACTIVE', 'INACTIVE'], 'Invalid status').required('Status is required')
        }),
        onSubmit: (values) => {
            const payload = {
                service_name: values.name,
                description: values.description,
                category_id: values.category,
                basePrice: values.basePrice,
                active: values.status === 'ACTIVE'
            };
            createService(payload, {
                onSuccess: () => {
                    handleClose();
                }
            });
        }
    });

    const columns = [
        { field: 'service_name', header: 'Service Name', sortable: true },
        {
            field: 'category_id',
            header: 'Category',
            render: (val) => {
                // If populated
                if (val && typeof val === 'object' && val.category_name) {
                    return val.category_name;
                }
                // If just ID (unlikely with populate but possible)
                const found = categoriesData?.find(c => c._id === val || c.id === val);
                return found ? found.category_name : val || '-';
            }
        },
        { field: 'basePrice', header: 'Base Price', render: (val) => `₹${val}` },
        {
            field: 'active',
            header: 'Status',
            render: (val) => (
                <Typography
                    variant="caption"
                    sx={{
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        bgcolor: val ? 'success.light' : 'error.light',
                        color: val ? 'success.dark' : 'error.dark',
                        fontWeight: 700
                    }}
                >
                    {val ? 'ACTIVE' : 'INACTIVE'}
                </Typography>
            )
        }
    ];

    return (
        <Box sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>
                    Platform Services
                </Typography>
                <Button variant="contained" onClick={handleOpen}>
                    Add Service
                </Button>
            </Box>

            <SapTable
                tableId="services-table"
                tableData={servicesData || []}
                columns={columns}
                isLoading={servicesLoading}
                addSearchBox={true}
                addTableCount={true}
                countEntityTypePlural="Services"
                emptyTableString="No services listed."
            />

            <Dialog open={openDialog} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>Add New Service</DialogTitle>
                <form onSubmit={formik.handleSubmit}>
                    <DialogContent>
                        <TextField
                            fullWidth
                            margin="normal"
                            id="name"
                            name="name"
                            label="Service Name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            error={formik.touched.name && Boolean(formik.errors.name)}
                            helperText={formik.touched.name && formik.errors.name}
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            id="description"
                            name="description"
                            label="Description"
                            multiline
                            rows={3}
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            error={formik.touched.description && Boolean(formik.errors.description)}
                            helperText={formik.touched.description && formik.errors.description}
                        />
                        <TextField
                            select
                            fullWidth
                            margin="normal"
                            id="category"
                            name="category"
                            label="Category"
                            value={formik.values.category}
                            onChange={formik.handleChange}
                            error={formik.touched.category && Boolean(formik.errors.category)}
                            helperText={formik.touched.category && formik.errors.category}
                        >
                            {categoriesData?.map((cat) => (
                                <MenuItem key={cat._id || cat.id} value={cat._id || cat.id}>
                                    {cat.category_name}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            fullWidth
                            margin="normal"
                            id="basePrice"
                            name="basePrice"
                            label="Base Price (₹)"
                            type="number"
                            value={formik.values.basePrice}
                            onChange={formik.handleChange}
                            error={formik.touched.basePrice && Boolean(formik.errors.basePrice)}
                            helperText={formik.touched.basePrice && formik.errors.basePrice}
                        />
                        <TextField
                            select
                            fullWidth
                            margin="normal"
                            id="status"
                            name="status"
                            label="Status"
                            value={formik.values.status}
                            onChange={formik.handleChange}
                            error={formik.touched.status && Boolean(formik.errors.status)}
                            helperText={formik.touched.status && formik.errors.status}
                        >
                            <MenuItem value="ACTIVE">Active</MenuItem>
                            <MenuItem value="INACTIVE">Inactive</MenuItem>
                        </TextField>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="inherit">Cancel</Button>
                        <Button type="submit" variant="contained" disabled={isCreating}>
                            {isCreating ? 'Creating...' : 'Create'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Box>
    );
};

export default ServicesPage;
