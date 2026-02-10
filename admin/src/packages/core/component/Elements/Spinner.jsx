import { Box } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { useDeviceType } from '@core/hooks/useBreakpointValue';

export default function Spinner() {
  const { isMobile } = useDeviceType();
  return (
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: isMobile ? '45%' : '50%',
      }}
    >
      <CircularProgress />
    </Box>
  );
}
