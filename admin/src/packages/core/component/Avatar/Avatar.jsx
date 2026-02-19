import React from 'react';
import { Avatar as MuiAvatar } from '@mui/material';

/**
 * Avatar Component
 * Wrapper around MUI Avatar with potential for customization or fallback logic.
 */
const Avatar = ({ src, alt, size = 40, ...props }) => {
    return (
        <MuiAvatar
            src={src}
            alt={alt}
            sx={{ width: size, height: size, ...props.sx }}
            {...props}
        >
            {!src && alt ? alt.charAt(0).toUpperCase() : null}
        </MuiAvatar>
    );
};

export default Avatar;
