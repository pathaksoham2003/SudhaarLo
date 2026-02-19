import { useCustomMutation, useCustomQuery } from '../hooks/useQuery';
import { ENDPOINTS } from './api';

/**
 * 🆔 KYC Service
 */

// 📝 Submit KYC Details
export const useSubmitKYCDetails = () => {
    return useCustomMutation({
        mutationFn: (data) => ({
            method: 'POST',
            url: ENDPOINTS.KYC.SUBMIT,
            data,
        }),
        invalidateQueries: [['kyc', 'status']],
    });
};

// 📂 Upload KYC Documents (Multipart Form Data)
export const useUploadKYCDocuments = () => {
    return useCustomMutation({
        mutationFn: (formData) => ({
            method: 'POST',
            url: ENDPOINTS.KYC.UPLOAD,
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }),
        invalidateQueries: [['kyc', 'status']],
    });
};

// 📊 Get KYC Status
export const useGetKYCStatus = () => {
    return useCustomQuery({
        queryKey: ['kyc', 'status'],
        queryFn: () => ({
            method: 'GET',
            url: ENDPOINTS.KYC.STATUS,
        }),
    });
};
