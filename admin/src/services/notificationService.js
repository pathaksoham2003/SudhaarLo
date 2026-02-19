import { useCustomQuery, useCustomMutation } from '@core/hooks/useQuery';
import { ENDPOINTS } from './api';

/**
 * 🔔 Notification Service (Admin)
 */

// 📋 Get My Notifications
export const useGetMyNotifications = () => {
    return useCustomQuery({
        queryKey: ['notifications'],
        queryFn: () => ({
            method: 'GET',
            url: ENDPOINTS.NOTIFICATIONS ? ENDPOINTS.NOTIFICATIONS.BASE : '/notifications',
        }),
        refetchInterval: 30000,
    });
};

// ✅ Mark Notification as Read
export const useMarkAsRead = () => {
    return useCustomMutation({
        mutationFn: (id) => ({
            method: 'PATCH',
            url: ENDPOINTS.NOTIFICATIONS ? ENDPOINTS.NOTIFICATIONS.READ(id) : `/notifications/${id}/read`,
        }),
        invalidateQueries: [['notifications']],
    });
};
