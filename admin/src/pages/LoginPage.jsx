import React, { useState } from 'react';
import { Box, Paper, Typography, Button, Container } from '@mui/material';
import SapControlPhone from '@core/component/Form/SapControlPhone';
import SapControlInput from '@core/component/Form/SapControlInput';
import { useSendOTP, useVerifyOTP } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

const LoginPage = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(1); // 1: Phone, 2: OTP
    const navigate = useNavigate();

    const sendOtpMutation = useSendOTP();
    const verifyOtpMutation = useVerifyOTP();

    const handleSendOTP = async (e) => {
        e.preventDefault();
        const cleanPhone = phone.replace(/\D/g, '').slice(-10);
        if (cleanPhone.length < 10) {
            enqueueSnackbar('Please enter a valid 10-digit phone number', { variant: 'warning' });
            return;
        }

        sendOtpMutation.mutate({ phone: cleanPhone }, {
            onSuccess: () => setStep(2),
            onError: (error) => {
                enqueueSnackbar(error.response?.data?.message || 'Failed to send OTP', { variant: 'error' });
            }
        });
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        const cleanPhone = phone.replace(/\D/g, '').slice(-10);
        verifyOtpMutation.mutate({ phone: cleanPhone, otp }, {
            onSuccess: () => {
                enqueueSnackbar('Logged in successfully', { variant: 'success' });
                navigate('/admin/dashboard');
            },
            onError: (error) => {
                enqueueSnackbar(error.response?.data?.message || 'Invalid OTP. Please try again.', { variant: 'error' });
            }
        });
    };

    return (
        <Box sx={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #CA1551 0%, #8CA3A2 100%)'
        }}>
            <Container maxWidth="xs">
                <Paper elevation={6} sx={{ p: 4, borderRadius: 4, textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ fontWeight: 900, mb: 1, color: 'primary.main' }}>
                        SudhaarLo
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                        Admin Portal Access
                    </Typography>

                    {step === 1 ? (
                        <form onSubmit={handleSendOTP}>
                            <SapControlPhone
                                label="Phone Number"
                                value={phone}
                                onChange={(val) => setPhone(val)}
                                required
                                initCountry="IN"
                                sx={{ mb: 3 }}
                            />
                            <Button
                                fullWidth
                                variant="contained"
                                size="large"
                                type="submit"
                                disabled={sendOtpMutation.isLoading}
                                sx={{ borderRadius: 2, py: 1.5, fontWeight: 700 }}
                            >
                                {sendOtpMutation.isLoading ? 'Sending...' : 'Send OTP'}
                            </Button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOTP}>
                            <Typography variant="body2" sx={{ mb: 2 }}>
                                Enter the 6-digit code sent to <b>{phone}</b>
                            </Typography>
                            <SapControlInput
                                label="Enter OTP"
                                value={otp}
                                onChange={(val) => setOtp(val)}
                                required
                                sx={{ mb: 3 }}
                                inputProps={{ maxLength: 6 }}
                            />
                            <Button
                                fullWidth
                                variant="contained"
                                size="large"
                                type="submit"
                                disabled={verifyOtpMutation.isLoading}
                                sx={{ borderRadius: 2, py: 1.5, fontWeight: 700 }}
                            >
                                {verifyOtpMutation.isLoading ? 'Verifying...' : 'Login'}
                            </Button>
                            <Button
                                fullWidth
                                variant="text"
                                size="small"
                                onClick={() => setStep(1)}
                                sx={{ mt: 2 }}
                            >
                                Change Phone Number
                            </Button>
                        </form>
                    )}
                </Paper>
            </Container>
        </Box>
    );
};

export default LoginPage;
