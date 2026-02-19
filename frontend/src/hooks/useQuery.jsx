import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxios from './useAxios';

/**
 * Custom wrapper for TanStack useQuery.
 * Expects queryFn to return an axios request config object.
 */
export const useCustomQuery = ({ queryKey, queryFn, ...options }) => {
    const axiosInstance = useAxios();

    return useQuery({
        queryKey,
        queryFn: async () => {
            const config = queryFn();
            const response = await axiosInstance(config);
            return response;
        },
        ...options,
    });
};

/**
 * Custom wrapper for TanStack useMutation.
 * Expects mutationFn to return an axios request config object.
 * Supports automatic query invalidation on success.
 */
export const useCustomMutation = ({ mutationFn, invalidateQueries, ...options }) => {
    const axiosInstance = useAxios();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data) => {
            const config = mutationFn(data);
            const response = await axiosInstance(config);
            return response;
        },
        onSuccess: (data, variables, context) => {
            if (invalidateQueries) {
                invalidateQueries.forEach((queryKey) => {
                    queryClient.invalidateQueries({ queryKey: queryKey });
                });
            }
            if (options.onSuccess) {
                options.onSuccess(data, variables, context);
            }
        },
        ...options,
    });
};
