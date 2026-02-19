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
            const res = await axiosInstance(config);
            // res is already the body because of the interceptor
            return res;
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
            const res = await axiosInstance(config);
            return res;
        },
        onSuccess: (data, variables, context) => {
            if (invalidateQueries) {
                invalidateQueries.forEach((queryKey) => {
                    queryClient.invalidateQueries({ queryKey });
                });
            }
            if (options.onSuccess) {
                options.onSuccess(data, variables, context);
            }
        },
        ...options,
    });
};
