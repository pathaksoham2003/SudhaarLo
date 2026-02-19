import { useCustomMutation, useCustomQuery } from '../hooks/useQuery';
import { ENDPOINTS } from './api';

/**
 * ⭐ Review Service
 */

// ➕ Add Review
export const useAddReview = () => {
    return useCustomMutation({
        mutationFn: (data) => ({
            method: 'POST',
            url: ENDPOINTS.REVIEWS.BASE,
            data,
        }),
        invalidateQueries: [['provider'], ['providers']],
    });
};

// 📋 Get Service Reviews
export const useGetServiceReviews = (providerId, serviceId) => {
    return useCustomQuery({
        queryKey: ['reviews', providerId, serviceId],
        queryFn: () => ({
            method: 'GET',
            url: ENDPOINTS.REVIEWS.SERVICE(providerId, serviceId),
        }),
        enabled: !!providerId && !!serviceId,
    });
};
