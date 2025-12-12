import React from 'react';
import { Box, Container, useTheme } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';
import { useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const theme = useTheme();
  const location = useLocation();
  
  const hideSidebarPaths = ['/login', '/register'];
  const hideSidebar = hideSidebarPaths.includes(location.pathname);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {!hideSidebar && <Sidebar />}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {!hideSidebar && <Header />}
        <Container
          maxWidth="xl"
          sx={{
            flexGrow: 1,
            py: 3,
            px: { xs: 2, sm: 3 },
            backgroundColor: theme.palette.background.default
          }}
        >
          {children}
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;