import React from 'react';
import { Box, Typography } from '@mui/material';
import { SapTable } from '@core/component/Table';
import { useGetUsers } from '../services/adminService';

const ProvidersPage = () => {
    // We can filter the users list for providers or assume a dedicated endpoint
    const { data: usersData, isLoading } = useGetUsers({ role: 'SERVICE_PROVIDER' });

    const columns = [
        { field: 'name', header: 'Provider Name', sortable: true },
        { field: 'email', header: 'Email' },
        { field: 'phone', header: 'Phone' },
        {
            field: 'isVerified',
            header: 'KYC Status',
            render: (val) => (
                <Typography
                    variant="caption"
                    sx={{
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        bgcolor: val ? 'success.light' : 'warning.light',
                        color: val ? 'success.dark' : 'warning.dark',
                        fontWeight: 700
                    }}
                >
                    {val ? 'VERIFIED' : 'PENDING'}
                </Typography>
            )
        },
        {
            field: 'rating',
            header: 'Rating',
            render: (val) => val ? `⭐ ${val}` : 'No ratings'
        }
    ];

    return (
        <Box sx={{ p: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>
                    Service Providers
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Manage service partner accounts and verification status.
                </Typography>
            </Box>

            <SapTable
                tableId="providers-table"
                tableData={usersData?.filter(u => u.role === 'SERVICE_PROVIDER') || []}
                columns={columns}
                isLoading={isLoading}
                addSearchBox={true}
                addTableCount={true}
                countEntityTypePlural="Providers"
            />
        </Box>
    );
};

export default ProvidersPage;
