import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Finance from './pages/Finance';
import Promotions from './pages/Promotions';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import useTelegram from './hooks/useTelegram';

const App = () => {
  const { theme: telegramTheme, isLoading } = useTelegram();

  const theme = createTheme({
    palette: {
      mode: telegramTheme === 'dark' ? 'dark' : 'light',
      primary: {
        main: telegramTheme === 'dark' ? '#8774e1' : '#6a5af9',
      },
      secondary: {
        main: telegramTheme === 'dark' ? '#50b5ff' : '#2196f3',
      },
      background: {
        default: telegramTheme === 'dark' ? '#18222d' : '#f5f5f5',
        paper: telegramTheme === 'dark' ? '#1e2733' : '#ffffff',
      },
    },
    shape: {
      borderRadius: 10,
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h6: { fontWeight: 600 },
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: 'none',
            border: '1px solid',
            borderColor: 'divider',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            boxShadow: 'none',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 8,
          },
        },
      },
    },
  });

  if (isLoading) {
    return (
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          bgcolor: theme.palette.background.default,
        }}
      >
        <CircularProgress size={36} />
        <Typography mt={2} fontSize="0.9rem">
          Loading…
        </Typography>
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/finance" element={<Finance />} />
            <Route path="/promotions" element={<Promotions />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Layout>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default App;
