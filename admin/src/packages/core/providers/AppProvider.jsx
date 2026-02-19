import React from 'react'
import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'
import { HelmetProvider } from 'react-helmet-async';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { SnackbarProvider } from 'notistack';
import { RouterProvider } from 'react-router-dom';
import Spinner from "@core/component/Elements/Spinner";
import CustomThemeProvider from './helper/ThemeProvider';

const queryClient = new QueryClient()

const AppProvider = ({ config }) => {

    return (
        <CustomThemeProvider>
            <HelmetProvider>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <SnackbarProvider
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        autoHideDuration={3000}
                        preventDuplicate
                    >
                        <QueryClientProvider client={queryClient}>
                            <RouterProvider router={config.router} fallbackElement={<Spinner />} />
                        </QueryClientProvider>
                    </SnackbarProvider>
                </LocalizationProvider>
            </HelmetProvider>
        </CustomThemeProvider>
    )
}

export default AppProvider