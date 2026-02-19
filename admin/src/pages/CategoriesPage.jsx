import React, { useState } from 'react';
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { SapTable } from '@core/component/Table';
import { useGetCategories, useCreateCategory } from '../services/adminService';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const CategoriesPage = () => {
    const { data: categoriesData, isLoading } = useGetCategories();
    const { mutate: createCategory, isPending: isCreating } = useCreateCategory();
    const [openDialog, setOpenDialog] = useState(false);

    const handleOpen = () => setOpenDialog(true);
    const handleClose = () => {
        setOpenDialog(false);
        formik.resetForm();
    };

    const formik = useFormik({
        initialValues: {
            category_name: '',
            description: ''
        },
        validationSchema: Yup.object({
            category_name: Yup.string().required('Category name is required'),
            description: Yup.string().required('Description is required')
        }),
        onSubmit: (values) => {
            createCategory(values, {
                onSuccess: () => {
                    handleClose();
                }
            });
        }
    });

    const columns = [
        { field: 'category_name', header: 'Category Name', sortable: true },
        { field: 'description', header: 'Description' },
        // Assuming the backend returns serviceCount or we derive it later. Using render for safeguard.
        {
            field: 'serviceCount',
            header: 'Total Services',
            render: (val) => val === undefined || val === null ? '-' : val
        }
    ];

    return (
        <Box sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>
                    Service Categories
                </Typography>
                <Button variant="contained" onClick={handleOpen}>
                    Add Category
                </Button>
            </Box>

            <SapTable
                tableId="categories-table"
                tableData={categoriesData || []}
                columns={columns}
                isLoading={isLoading}
                addSearchBox={true}
                addTableCount={true}
                countEntityTypePlural="Categories"
                emptyTableString="No categories configured."
            />

            <Dialog open={openDialog} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>Add New Category</DialogTitle>
                <form onSubmit={formik.handleSubmit}>
                    <DialogContent>
                        <TextField
                            fullWidth
                            margin="normal"
                            id="category_name"
                            name="category_name"
                            label="Category Name"
                            value={formik.values.category_name}
                            onChange={formik.handleChange}
                            error={formik.touched.category_name && Boolean(formik.errors.category_name)}
                            helperText={formik.touched.category_name && formik.errors.category_name}
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

export default CategoriesPage;
