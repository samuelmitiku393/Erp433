import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Finance from './pages/Finance';
import Promotions from './pages/Promotions';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import useTelegram from './hooks/useTelegram';

const App = () => {
  const { theme: telegramTheme, isLoading } = useTelegram();

  // Create theme based on Telegram theme
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
      borderRadius: 12,
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h5: {
        fontWeight: 600,
      },
      h6: {
        fontWeight: 600,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 8,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: telegramTheme === 'dark' 
              ? '0 4px 20px rgba(0, 0, 0, 0.3)'
              : '0 4px 20px rgba(0, 0, 0, 0.08)',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 12,
          },
        },
      },
    },
  });

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: telegramTheme === 'dark' ? '#18222d' : '#f5f5f5'
      }}>
        <div style={{
          textAlign: 'center',
          padding: '20px'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '3px solid #6a5af9',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }} />
          <p style={{
            color: telegramTheme === 'dark' ? '#ffffff' : '#212121',
            fontSize: '16px'
          }}>
            Loading Business ERP...
          </p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
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