import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { SapTable } from '@core/component/Table';
import { useGetAllBookings } from '../services/bookingService';

const BookingsPage = () => {
    const { data: bookingsData, isLoading } = useGetAllBookings();

    const getStatusColor = (status) => {
        switch (status?.toUpperCase()) {
            case 'COMPLETED': return 'success';
            case 'PENDING': return 'warning';
            case 'CANCELLED': return 'error';
            case 'REJECTED': return 'error';
            case 'APPROVED': return 'info';
            case 'IN_PROGRESS': return 'primary';
            default: return 'default';
        }
    };
    console.log(bookingsData)

    const columns = [
        { field: '_id', header: 'Booking ID', render: (val) => val?.slice(-6).toUpperCase() },
        {
            field: 'customer_id',
            header: 'Customer',
            render: (val) => (
                <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{val?.name || 'Guest'}</Typography>
                    <Typography variant="caption" color="text.secondary">{val?.phone || '-'}</Typography>
                </Box>
            )
        },
        { field: 'service_id', header: 'Service', render: (val) => val?.service_name || 'Generic Service' },
        {
            field: 'booking_status',
            header: 'Status',
            render: (val) => (
                <Chip
                    label={val}
                    size="small"
                    color={getStatusColor(val)}
                    sx={{ fontWeight: 700, textTransform: 'uppercase', fontSize: 10 }}
                />
            )
        },
        {
            field: 'booking_date',
            header: 'Date',
            render: (val) => val ? new Date(val).toLocaleDateString() : '-'
        },
        { field: 'address', header: 'Address' }
    ];

    return (
        <Box sx={{ p: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>
                    Global Bookings
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Monitor all service requests across the platform.
                </Typography>
            </Box>

            <SapTable
                tableId="bookings-table"
                tableData={bookingsData || []}
                columns={columns}
                isLoading={isLoading}
                addSearchBox={true}
                addTableCount={true}
                countEntityTypePlural="Bookings"
                isEnableRowHover={true}
            />
        </Box>
    );
};

export default BookingsPage;
