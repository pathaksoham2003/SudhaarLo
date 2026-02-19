import { useCustomQuery } from '../hooks/useQuery';
import { ENDPOINTS } from './api';

/**
 * 🏢 Provider & Search Service
 */

// 🔍 Search Providers
export const useSearchProviders = (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return useCustomQuery({
        queryKey: ['providers', 'search', params],
        queryFn: () => ({
            method: 'GET',
            url: `${ENDPOINTS.PROVIDERS.SEARCH}?${queryParams}`,
        }),
    });
};

// 📄 Get Provider Details
export const useGetProviderDetails = (id) => {
    return useCustomQuery({
        queryKey: ['provider', id],
        queryFn: () => ({
            method: 'GET',
            url: ENDPOINTS.PROVIDERS.DETAILS(id),
        }),
        enabled: !!id,
    });
};

// ⭐ Get Provider Reviews
export const useGetProviderReviews = (id) => {
    return useCustomQuery({
        queryKey: ['provider', id, 'reviews'],
        queryFn: () => ({
            method: 'GET',
            url: ENDPOINTS.PROVIDERS.REVIEWS(id),
        }),
        enabled: !!id,
    });
};

// 🏷️ Get Categories
export const useGetCategories = () => {
    return useCustomQuery({
        queryKey: ['categories'],
        queryFn: () => ({
            method: 'GET',
            url: ENDPOINTS.SERVICES.CATEGORIES,
        }),
    });
};

// 🔧 Get Services
export const useGetServices = () => {
    return useCustomQuery({
        queryKey: ['services'],
        queryFn: () => ({
            method: 'GET',
            url: ENDPOINTS.SERVICES.LIST,
        }),
    });
};
