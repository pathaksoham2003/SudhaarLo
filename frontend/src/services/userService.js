import { useCustomQuery, useCustomMutation } from '../hooks/useQuery';
import { ENDPOINTS } from './api';

/**
 * 👤 User Profile Service
 */

// 🏷️ Get My Profile
export const useGetMyProfile = () => {
    return useCustomQuery({
        queryKey: ['user', 'me'],
        queryFn: () => ({
            method: 'GET',
            url: ENDPOINTS.USERS.ME,
        }),
    });
};

// 🔄 Update My Profile
export const useUpdateMyProfile = () => {
    return useCustomMutation({
        mutationFn: (data) => ({
            method: 'PUT',
            url: ENDPOINTS.USERS.ME,
            data,
        }),
        invalidateQueries: [['user', 'me']],
    });
};
