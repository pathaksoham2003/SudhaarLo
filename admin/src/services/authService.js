import { useCustomMutation } from '@core/hooks/useQuery';
import { ENDPOINTS } from './api';

/**
 * 🔐 Authentication Service
 */

// 📲 Send OTP
export const useSendOTP = () => {
    return useCustomMutation({
        mutationFn: (data) => ({
            method: 'POST',
            url: ENDPOINTS.AUTH.SEND_OTP,
            data,
        }),
    });
};

// ✅ Verify OTP & Login
export const useVerifyOTP = () => {
    return useCustomMutation({
        mutationFn: (data) => ({
            method: 'POST',
            url: ENDPOINTS.AUTH.VERIFY_OTP,
            data,
        }),
        onSuccess: (data) => {
            if (data.token) {
                localStorage.setItem('auth_token', data.token);
                localStorage.setItem('user_role', data.user.role);
            }
        },
    });
};

// 🚪 Logout
export const useLogout = () => {
    return () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_role');
        window.location.href = '/login';
    };
};
