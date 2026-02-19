export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const ENDPOINTS = {
    AUTH: {
        SEND_OTP: '/auth/send-otp',
        VERIFY_OTP: '/auth/verify-otp',
    },
    ADMIN: {
        DASHBOARD: '/admin/dashboard',
        USERS: '/admin/users',
        CATEGORIES: '/admin/categories',
        SERVICES: '/admin/services',
        EXPIRED_SUBSCRIPTIONS: '/admin/subscriptions/expired',
        SETTINGS: (key) => `/admin/settings/${key}`,
    },
    USERS: {
        ME: '/users/me',
    },
    BOOKINGS: {
        BASE: '/bookings',
        STATUS: (id) => `/bookings/${id}/status`,
    },
    NOTIFICATIONS: {
        BASE: '/notifications',
        READ: (id) => `/notifications/${id}/read`,
    }
};
