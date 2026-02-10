import { Box } from '@mui/material';
import { FC } from 'react';

const FlexBox = ({ children, sx, ...props }) => (
  <Box display="flex" sx={{ ...sx }} {...props}>
    {children}
  </Box>
);

export default FlexBox;
