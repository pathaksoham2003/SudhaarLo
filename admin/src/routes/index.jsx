import React, { Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { RouterErrorElement } from '@core/component/Error/RouterErrorElement';
import { protectedRoutes } from './protected';
import Spinner from '@core/component/Elements/Spinner';

const LoginPage = React.lazy(() => import('../pages/LoginPage'));
const PageNotFound = React.lazy(() => import('@core/component/Error/PageNotFound'));

export const router = createBrowserRouter([
    // Protected routes
    ...protectedRoutes,

    {
        path: '/login',
        element: (
            <Suspense fallback={<Spinner />}>
                <LoginPage />
            </Suspense>
        ),
        errorElement: <RouterErrorElement />,
    },

    {
        path: '/',
        element: <Navigate to="/admin/dashboard" replace />,
    },

    // 404 fallback
    {
        path: '*',
        element: (
            <Suspense fallback={<Spinner />}>
                <PageNotFound />
            </Suspense>
        ),
        errorElement: <RouterErrorElement />,
    },
]);
