import { Typography, Button, Box } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useRouteError } from 'react-router-dom';
import FlexBox from '@core/component/Elements/FlexBox';
import { useDeviceType } from '@core/hooks/useBreakpointValue';

export const RouterErrorElement = () => {
  const error = useRouteError();
  const { isMobile } = useDeviceType();

  return (
    <FlexBox
      sx={{
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        height: '90dvh',
      }}
    >
      <Box sx={{ my: 5 }}>
        <ErrorOutlineIcon sx={{ fontSize: isMobile ? 80 : 150, color: 'error.main' }} />
      </Box>

      <Typography variant="h2" fontSize={isMobile ? 22 : 'auto'}>
        Oops, Something Went Wrong!
      </Typography>

      <pre style={{ color: 'red', fontFamily: 'monospace' }}>
        {error?.message}
      </pre>

      <Button
        variant="contained"
        sx={{ mt: 5 }}
        onClick={() => window.location.assign(window.location.origin)}
      >
        Try Again
      </Button>
    </FlexBox>
  );
};
