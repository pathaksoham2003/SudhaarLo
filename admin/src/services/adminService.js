import { useCustomQuery, useCustomMutation } from '@core/hooks/useQuery';
import { ENDPOINTS } from './api';

/**
 * 🛠️ Admin Management Service
 */

// 📊 Get Dashboard Stats
export const useGetDashboardStats = () => {
    return useCustomQuery({
        queryKey: ['admin', 'dashboard'],
        queryFn: () => ({
            method: 'GET',
            url: ENDPOINTS.ADMIN.DASHBOARD,
        }),
    });
};

// 👥 Get All Users
export const useGetUsers = (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return useCustomQuery({
        queryKey: ['admin', 'users', params],
        queryFn: () => ({
            method: 'GET',
            url: `${ENDPOINTS.ADMIN.USERS}?${queryParams}`,
        }),
    });
};

// 🏷️ Create Category
export const useCreateCategory = () => {
    return useCustomMutation({
        mutationFn: (data) => ({
            method: 'POST',
            url: ENDPOINTS.ADMIN.CATEGORIES,
            data,
        }),
        invalidateQueries: [['categories'], ['admin', 'dashboard']],
    });
};

// 🔧 Create Service
export const useCreateService = () => {
    return useCustomMutation({
        mutationFn: (data) => ({
            method: 'POST',
            url: ENDPOINTS.ADMIN.SERVICES,
            data,
        }),
        invalidateQueries: [['services'], ['admin', 'dashboard']],
    });
};

// 📂 Get All Categories
export const useGetCategories = () => {
    return useCustomQuery({
        queryKey: ['categories'],
        queryFn: () => ({
            method: 'GET',
            url: ENDPOINTS.ADMIN.CATEGORIES,
        }),
    });
};

// 📂 Get All Services
export const useGetServices = () => {
    return useCustomQuery({
        queryKey: ['services'],
        queryFn: () => ({
            method: 'GET',
            url: ENDPOINTS.ADMIN.SERVICES,
        }),
    });
};

// ⏳ Get Expired Subscriptions
export const useGetExpiredSubscriptions = () => {
    return useCustomQuery({
        queryKey: ['admin', 'subscriptions', 'expired'],
        queryFn: () => ({
            method: 'GET',
            url: ENDPOINTS.ADMIN.EXPIRED_SUBSCRIPTIONS,
        }),
    });
};
// ⚙️ Get System Setting
export const useGetSystemSetting = (key) => {
    return useCustomQuery({
        queryKey: ['admin', 'settings', key],
        queryFn: () => ({
            method: 'GET',
            url: ENDPOINTS.ADMIN.SETTINGS(key),
        }),
        enabled: !!key, // Only run if key is provided
    });
};

// ⚙️ Update System Setting
export const useUpdateSystemSetting = () => {
    return useCustomMutation({
        mutationFn: ({ key, data }) => ({
            method: 'PUT',
            url: ENDPOINTS.ADMIN.SETTINGS(key),
            data,
        }),
        invalidateQueries: [['admin', 'settings']],
    });
};
