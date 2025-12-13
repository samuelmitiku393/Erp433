import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import useTelegram from '../../hooks/useTelegram';

const Header = () => {
  const { user } = useTelegram();

  return (
    <Box
      sx={{
        px: 2,
        py: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Typography fontWeight={600}>
        Business ERP
      </Typography>

      <Avatar sx={{ width: 30, height: 30 }}>
        {user?.first_name?.[0] || 'U'}
      </Avatar>
    </Box>
  );
};

export default Header;
