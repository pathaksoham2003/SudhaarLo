import { useCustomQuery, useCustomMutation } from '../hooks/useQuery';
import { ENDPOINTS } from './api';

/**
 * 📅 Booking Service
 */

// ➕ Create Booking (Customer)
export const useCreateBooking = () => {
    return useCustomMutation({
        mutationFn: (data) => ({
            method: 'POST',
            url: ENDPOINTS.BOOKINGS.BASE,
            data,
        }),
        invalidateQueries: [['bookings', 'my']],
    });
};

// 📋 Get My Bookings (Customer)
export const useGetMyBookings = () => {
    return useCustomQuery({
        queryKey: ['bookings', 'my'],
        queryFn: () => ({
            method: 'GET',
            url: ENDPOINTS.BOOKINGS.MY,
        }),
    });
};

// 📋 Get Provider Bookings (Provider)
export const useGetProviderBookings = () => {
    return useCustomQuery({
        queryKey: ['bookings', 'provider'],
        queryFn: () => ({
            method: 'GET',
            url: ENDPOINTS.BOOKINGS.PROVIDER,
        }),
    });
};

// 🔄 Update Booking Status (Provider)
export const useUpdateBookingStatus = () => {
    return useCustomMutation({
        mutationFn: ({ id, status }) => ({
            method: 'PUT',
            url: ENDPOINTS.BOOKINGS.STATUS(id),
            data: { status },
        }),
        invalidateQueries: [['bookings', 'provider'], ['bookings', 'my']],
    });
};
