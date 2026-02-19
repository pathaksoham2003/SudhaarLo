
import { useMediaQuery, useTheme } from '@mui/material';

export const useBreakpointValue = (values) => {
    const theme = useTheme();
    const matches = {
        xs: useMediaQuery(theme.breakpoints.up('xs')),
        sm: useMediaQuery(theme.breakpoints.up('sm')),
        md: useMediaQuery(theme.breakpoints.up('md')),
        lg: useMediaQuery(theme.breakpoints.up('lg')),
        xl: useMediaQuery(theme.breakpoints.up('xl')),
    };

    const validBreakpoints = Object.entries(matches)
        .filter(([breakpoint, isMatch]) => Object.keys(values).includes(breakpoint) && isMatch)
        .map(([key]) => key);

    const largestBreakpoint = validBreakpoints.pop();

    if (largestBreakpoint === undefined) {
        // fallback: return first available value
        const firstKey = Object.keys(values)[0];
        return values[firstKey];
    }

    return values[largestBreakpoint];
};

export const useDeviceType = () => {
    const theme = useTheme();
    const matches = {
        xs: useMediaQuery(theme.breakpoints.down('xs')),
        sm: useMediaQuery(theme.breakpoints.between('xs', 'sm')),
        md: useMediaQuery(theme.breakpoints.between('sm', 'md')),
        lg: useMediaQuery(theme.breakpoints.between('md', 'lg')),
        xl: useMediaQuery(theme.breakpoints.up('lg')),
    };

    const bkp = matches.xs
        ? 'xs'
        : matches.sm
            ? 'sm'
            : matches.md
                ? 'md'
                : matches.lg
                    ? 'lg'
                    : matches.xl
                        ? 'xl'
                        : 'unknown';

    return {
        isMobile: matches.xs || matches.sm,
        isTablet: matches.md,
        isDesktop: matches.lg || matches.xl,
        isMobileOrTablet: matches.xs || matches.sm || matches.md,
        breakPoint: bkp,
    };
};
