import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Tabs, Tab, TextField, Divider, Snackbar, Alert, Grid } from '@mui/material';
import { MarkdownEditor } from '../packages/core/component/MarkdownEditor'; // Updated import
import { Avatar } from '../packages/core/component/Avatar';
import 'easymde/dist/easymde.min.css'; // Import styles for SimpleMDE
import { useGetMyProfile, useUpdateMyProfile } from '../services/userService';
import { useGetSystemSetting, useUpdateSystemSetting } from '../services/adminService';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const ProfilePage = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // Profile Data
    const { data: userProfile, isLoading: isProfileLoading } = useGetMyProfile();
    const { mutate: updateProfile, isPending: isUpdatingProfile } = useUpdateMyProfile();

    // System Settings Data (Terms & Conditions)
    const { data: termsSetting, isLoading: isTermsLoading } = useGetSystemSetting('TERMS_CONDITIONS');
    const { mutate: updateTerms, isPending: isUpdatingTerms } = useUpdateSystemSetting();

    const [termsContent, setTermsContent] = useState('');

    useEffect(() => {
        if (termsSetting?.value) {
            setTermsContent(termsSetting.value);
        }
    }, [termsSetting]);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const handleSnackbarClose = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    // Profile Form
    const profileFormik = useFormik({
        enableReinitialize: true,
        initialValues: {
            name: userProfile?.name || '',
            phone: userProfile?.phone || '',
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Name is required'),
            phone: Yup.string().matches(/^[0-9]{10}$/, 'Phone number must be 10 digits'),
        }),
        onSubmit: (values) => {
            updateProfile(values, {
                onSuccess: () => {
                    setSnackbar({ open: true, message: 'Profile updated successfully', severity: 'success' });
                },
                onError: () => {
                    setSnackbar({ open: true, message: 'Failed to update profile', severity: 'error' });
                }
            });
        }
    });

    // Terms Save Handler
    const handleSaveTerms = () => {
        updateTerms({
            key: 'TERMS_CONDITIONS',
            data: {
                value: termsContent,
                description: 'Platform Terms and Conditions'
            }
        }, {
            onSuccess: () => {
                setSnackbar({ open: true, message: 'Terms & Conditions saved successfully', severity: 'success' });
            },
            onError: () => {
                setSnackbar({ open: true, message: 'Failed to save Terms & Conditions', severity: 'error' });
            }
        });
    };

    const handleCopyTerms = () => {
        // Create a temporary element to copy the text content (stripping HTML if needed, or keeping structure)
        // For T&C, usually we want the text or the formatted content. 
        // Let's copy the plain text for now or the HTML depending on use case. 
        // User said "it can be copied", often implies text.
        // But ReactQuill `termsContent` is HTML.

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = termsContent;
        const text = tempDiv.textContent || tempDiv.innerText || "";

        navigator.clipboard.writeText(text).then(() => {
            setSnackbar({ open: true, message: 'Terms copied to clipboard!', severity: 'info' });
        });
    };

    return (
        <Box sx={{ p: 4, maxWidth: 1200, mx: 'auto' }}>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 4 }}>
                My Profile & Settings
            </Typography>

            <Paper sx={{ mb: 4 }}>
                <Tabs value={activeTab} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tab label="Personal Profile" />
                    <Tab label="Terms & Conditions" />
                </Tabs>

                {/* Tab 1: Personal Profile */}
                <Box role="tabpanel" hidden={activeTab !== 0} sx={{ p: 4 }}>
                    {activeTab === 0 && (
                        <Grid container spacing={4}>
                            <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Avatar
                                    src={userProfile?.photo}
                                    alt={userProfile?.name}
                                    size={120}
                                    sx={{ mb: 2, fontSize: 40, bgcolor: 'primary.main' }}
                                />
                                <Typography variant="h6" fontWeight={700}>{userProfile?.name}</Typography>
                                <Typography variant="body2" color="text.secondary">{userProfile?.role}</Typography>
                                <Typography variant="body2" color="text.secondary">{userProfile?.email}</Typography>
                            </Grid>

                            <Grid item xs={12} md={8}>
                                <Typography variant="h6" sx={{ mb: 3 }}>Edit Details</Typography>
                                <form onSubmit={profileFormik.handleSubmit}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Full Name"
                                                name="name"
                                                value={profileFormik.values.name}
                                                onChange={profileFormik.handleChange}
                                                error={profileFormik.touched.name && Boolean(profileFormik.errors.name)}
                                                helperText={profileFormik.touched.name && profileFormik.errors.name}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Phone Number"
                                                name="phone"
                                                value={profileFormik.values.phone}
                                                onChange={profileFormik.handleChange}
                                                error={profileFormik.touched.phone && Boolean(profileFormik.errors.phone)}
                                                helperText={profileFormik.touched.phone && profileFormik.errors.phone}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                size="large"
                                                disabled={isUpdatingProfile}
                                            >
                                                {isUpdatingProfile ? 'Saving...' : 'Save Changes'}
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </form>
                            </Grid>
                        </Grid>
                    )}
                </Box>

                {/* Tab 2: Terms & Conditions */}
                <Box role="tabpanel" hidden={activeTab !== 1} sx={{ p: 4 }}>
                    {activeTab === 1 && (
                        <Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Typography variant="h6">Manage Terms & Conditions</Typography>
                                <Button variant="outlined" onClick={handleCopyTerms}>
                                    Copy Text
                                </Button>
                            </Box>

                            <Box sx={{ mb: 3 }}>
                                <MarkdownEditor
                                    value={termsContent}
                                    onChange={setTermsContent}
                                    placeholder="Enter Terms and Conditions..."
                                />
                            </Box>

                            <Box sx={{ mt: 8 }}>
                                <Button
                                    variant="contained"
                                    size="large"
                                    onClick={handleSaveTerms}
                                    disabled={isUpdatingTerms}
                                >
                                    {isUpdatingTerms ? 'Saving...' : 'Save Terms'}
                                </Button>
                            </Box>
                        </Box>
                    )}
                </Box>
            </Paper>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ProfilePage;