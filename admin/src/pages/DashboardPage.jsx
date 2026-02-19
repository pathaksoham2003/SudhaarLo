import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import {
    SapNumericTile,
    SapBarGraphTile,
    SapDonutGraphTile,
    SapListTile
} from '@core/component/Dashboard';
import { useGetDashboardStats } from '../services/adminService';

const DashboardPage = () => {
    const { data: stats, isLoading } = useGetDashboardStats();

    // stats might be undefined during loading or if backend is not ready
    const dashboardData = stats || {
        total_customers: 0,
        total_providers: 0,
        active_bookings: 0,
        revenue: 0,
        recentBookings: [],
        categoryDistribution: []
    };

    return (
        <Box sx={{ p: 4 }}>
            <Box sx={{ mb: 5 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary' }}>
                    Dashboard Overview
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Welcome back, Admin! Here's what's happening on SudhaarLo today.
                </Typography>
            </Box>

            <Grid container spacing={3}>
                {/* Statistics Row */}
                <Grid item xs={12} sm={6} md={3}>
                    <SapNumericTile
                        title="Users/Customers"
                        description="Registered customers"
                        itemOne={{ label: 'Customers', value: dashboardData.total_customers }}
                        isLoading={isLoading}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <SapNumericTile
                        title="Service Providers"
                        description="Active service partners"
                        itemOne={{ label: 'Active', value: dashboardData.total_providers }}
                        isLoading={isLoading}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <SapNumericTile
                        title="Active Bookings"
                        description="Current service requests"
                        itemOne={{ label: 'Active', value: dashboardData.active_bookings }}
                        isLoading={isLoading}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <SapNumericTile
                        title="Revenue"
                        description="Total platform earnings"
                        itemOne={{ label: 'Net', value: dashboardData.revenue, unit: '₹' }}
                        isLoading={isLoading}
                    />
                </Grid>

                {/* Performance & Distribution Row */}
                <Grid item xs={12} md={8}>
                    <SapBarGraphTile
                        title="Booking Trends"
                        description="Bookings completed over the last 5 periods"
                        items={[
                            { label: 'Period 1', value: 12 },
                            { label: 'Period 2', value: 19 },
                            { label: 'Period 3', value: 33 },
                            { label: 'Period 4', value: 25 },
                            { label: 'Period 5', value: 42 },
                        ]}
                        isLoading={isLoading}
                        showTotal={true}
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <SapDonutGraphTile
                        title="Category Split"
                        description="Service distribution by category"
                        items={dashboardData.categoryDistribution.length > 0 ? dashboardData.categoryDistribution : [
                            { label: 'Cleaning', value: 35 },
                            { label: 'Plumbing', value: 25 },
                            { label: 'Electrical', value: 20 },
                            { label: 'Others', value: 20 },
                        ]}
                        isLoading={isLoading}
                        showTotal={true}
                    />
                </Grid>

                {/* Recent Activity Row */}
                <Grid item xs={12}>
                    <SapListTile
                        title="Recent Activity"
                        description="Latest service requests on the platform"
                        items={dashboardData.recentBookings && dashboardData.recentBookings.length > 0 ? dashboardData.recentBookings.map(b => ({
                            label: b.customer_id?.name || 'Guest',
                            value: b.service_id?.service_name || 'Generic Service',
                            description: `Status: ${b.booking_status || 'PENDING'}`
                        })) : [
                            { label: 'No recent activity', value: '-', description: 'Activity will appear here' }
                        ]}
                        isLoading={isLoading}
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export default DashboardPage;
