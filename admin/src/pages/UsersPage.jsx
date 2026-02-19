import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { SapTable } from '@core/component/Table';
import { useGetUsers } from '../services/adminService';

const UsersPage = () => {
    const { data: usersData, isLoading } = useGetUsers();

    const columns = [
        { field: 'name', header: 'Full Name', sortable: true },
        { field: 'email', header: 'Email Address', sortable: true },
        { field: 'phone', header: 'Phone Number' },
        {
            field: 'role',
            header: 'User Role',
            render: (val) => (
                <Typography
                    variant="caption"
                    sx={{
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        bgcolor: val === 'ADMIN' ? 'error.light' : 'success.light',
                        color: val === 'ADMIN' ? 'error.dark' : 'success.dark',
                        fontWeight: 700
                    }}
                >
                    {val}
                </Typography>
            )
        },
        {
            field: 'createdAt',
            header: 'Joined On',
            render: (val) => val ? new Date(val).toLocaleDateString() : '-'
        }
    ];

    return (
        <Box sx={{ p: 4 }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 800 }}>
                        User Management
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        View and manage all registered users on the platform.
                    </Typography>
                </Box>
                <Button variant="contained" sx={{ borderRadius: 2 }}>
                    Export Users
                </Button>
            </Box>

            <SapTable
                tableId="users-table"
                tableData={usersData || []}
                columns={columns}
                isLoading={isLoading}
                addSearchBox={true}
                addTableCount={true}
                countEntityTypePlural="Users"
                enableTableSettings={true}
                isEnableRowHover={true}
                isShowPageSizeOptions={true}
            />
        </Box>
    );
};

export default UsersPage;
