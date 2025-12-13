import React from 'react';
import { Box } from '@mui/material';
import TelegramHeader from './Header';
import BottomNav from './BottomNav';

const Layout = ({ children }) => {
  return (
    <Box sx={{ minHeight: '100vh', pb: 7 }}>
      <TelegramHeader />
      {children}
      <BottomNav />
    </Box>
  );
};

export default Layout;
