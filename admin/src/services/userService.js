import { useCustomQuery, useCustomMutation } from '@core/hooks/useQuery';
import { ENDPOINTS } from './api';

/**
 * 👤 User Service (Admin)
 * Handles admin's own profile and settings.
 */

// 🏷️ Get My Profile
export const useGetMyProfile = () => {
    return useCustomQuery({
        queryKey: ['user', 'me'],
        queryFn: () => ({
            method: 'GET',
            url: ENDPOINTS.USERS ? ENDPOINTS.USERS.ME : '/users/me',
        }),
    });
};

// 🔄 Update My Profile
export const useUpdateMyProfile = () => {
    return useCustomMutation({
        mutationFn: (data) => ({
            method: 'PUT',
            url: ENDPOINTS.USERS ? ENDPOINTS.USERS.ME : '/users/me',
            data,
        }),
        invalidateQueries: [['user', 'me']],
    });
};
