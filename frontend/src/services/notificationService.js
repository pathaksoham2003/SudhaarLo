import { useCustomQuery, useCustomMutation } from '../hooks/useQuery';
import { ENDPOINTS } from './api';

/**
 * 🔔 Notification Service
 */

// 📋 Get My Notifications
export const useGetMyNotifications = () => {
    return useCustomQuery({
        queryKey: ['notifications'],
        queryFn: () => ({
            method: 'GET',
            url: ENDPOINTS.NOTIFICATIONS.BASE,
        }),
        refetchInterval: 30000, // Poll every 30 seconds
    });
};

// ✅ Mark Notification as Read
export const useMarkAsRead = () => {
    return useCustomMutation({
        mutationFn: (id) => ({
            method: 'PATCH',
            url: ENDPOINTS.NOTIFICATIONS.READ(id),
        }),
        invalidateQueries: [['notifications']],
    });
};
