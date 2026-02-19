import { useCustomQuery, useCustomMutation } from '@core/hooks/useQuery';
import { ENDPOINTS } from './api';

/**
 * 📅 Booking Service (Admin)
 * Note: Admin uses this to manage platform-wide bookings if endpoints are available.
 * currently using base booking routes for overview.
 */

// 📋 Get All Bookings (Assuming admin can access base /bookings or use params)
export const useGetAllBookings = (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return useCustomQuery({
        queryKey: ['bookings', 'all', params],
        queryFn: () => ({
            method: 'GET',
            url: (ENDPOINTS.BOOKINGS ? ENDPOINTS.BOOKINGS.BASE : '/bookings') + (queryParams ? `?${queryParams}` : ''),
        }),
    });
};

// 🔄 Update Booking Status
export const useUpdateBookingStatus = () => {
    return useCustomMutation({
        mutationFn: ({ id, status }) => ({
            method: 'PUT',
            url: ENDPOINTS.BOOKINGS ? ENDPOINTS.BOOKINGS.STATUS(id) : `/bookings/${id}/status`,
            data: { status },
        }),
        invalidateQueries: [['bookings', 'all']],
    });
};
