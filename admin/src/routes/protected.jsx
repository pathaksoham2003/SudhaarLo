import { lazy } from 'react';
import { RouterErrorElement } from '@core/component/Error/RouterErrorElement';
import AppLayout from './AppLayout';
import { Navigate } from 'react-router-dom';

// Lazy load pages
const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const UsersPage = lazy(() => import('../pages/UsersPage'));
const ProvidersPage = lazy(() => import('../pages/ProvidersPage'));
const BookingsPage = lazy(() => import('../pages/BookingsPage'));
const CategoriesPage = lazy(() => import('../pages/CategoriesPage'));
const ServicesPage = lazy(() => import('../pages/ServicesPage'));
const ProfilePage = lazy(() => import('../pages/ProfilePage'));

export const protectedRoutes = [
    {
        path: '/admin',
        element: <AppLayout />,
        errorElement: <RouterErrorElement />,
        children: [
            { path: 'dashboard', element: <DashboardPage />, errorElement: <RouterErrorElement /> },
            { path: 'users', element: <UsersPage />, errorElement: <RouterErrorElement /> },
            { path: 'providers', element: <ProvidersPage />, errorElement: <RouterErrorElement /> },
            { path: 'bookings', element: <BookingsPage />, errorElement: <RouterErrorElement /> },
            { path: 'categories', element: <CategoriesPage />, errorElement: <RouterErrorElement /> },
            { path: 'services', element: <ServicesPage />, errorElement: <RouterErrorElement /> },
            { path: 'profile', element: <ProfilePage />, errorElement: <RouterErrorElement /> },
            { index: true, element: <Navigate to="dashboard" replace /> },
        ],
    },
];
