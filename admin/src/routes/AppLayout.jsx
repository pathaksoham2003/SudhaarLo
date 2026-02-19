import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import SidebarLayout from '@core/component/Layout/SidebarLayout';
import ProtectedRoute from '@core/routes/ProtectedRoute';
import Spinner from '@core/component/Elements/Spinner';

const AppLayout = () => (
    <ProtectedRoute>
        <SidebarLayout>
            <Suspense fallback={<Spinner />}>
                <Outlet />
            </Suspense>
        </SidebarLayout>
    </ProtectedRoute>
);

export default AppLayout;
