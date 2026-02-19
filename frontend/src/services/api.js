export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const ENDPOINTS = {
    AUTH: {
        SEND_OTP: '/auth/send-otp',
        VERIFY_OTP: '/auth/verify-otp',
        SELECT_ROLE: '/auth/select-role',
    },
    USERS: {
        ME: '/users/me',
    },
    PROVIDERS: {
        SEARCH: '/providers/search',
        DETAILS: (id) => `/providers/${id}`,
        REVIEWS: (id) => `/providers/${id}/reviews`,
    },
    SERVICES: {
        LIST: '/services',
        CATEGORIES: '/services/categories',
    },
    BOOKINGS: {
        BASE: '/bookings',
        MY: '/bookings/my',
        PROVIDER: '/bookings/provider',
        STATUS: (id) => `/bookings/${id}/status`,
    },
    REVIEWS: {
        BASE: '/reviews',
        SERVICE: (providerId, serviceId) => `/reviews/provider/${providerId}/service/${serviceId}`,
    },
    NOTIFICATIONS: {
        BASE: '/notifications',
        READ: (id) => `/notifications/${id}/read`,
    },
    KYC: {
        SUBMIT: '/kyc/submit',
        UPLOAD: '/kyc/upload-documents',
        STATUS: '/kyc/status',
    }
};
