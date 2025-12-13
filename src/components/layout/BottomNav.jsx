import React from 'react';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import {
  Dashboard,
  AttachMoney,
  Campaign,
  Settings
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import useTelegram from '../../hooks/useTelegram';

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { hapticFeedback } = useTelegram();

  const handleChange = (_, value) => {
    hapticFeedback?.impactOccurred('light');
    navigate(value);
  };

  return (
    <BottomNavigation
      value={location.pathname}
      onChange={handleChange}
      sx={{
        position: 'fixed',
        bottom: 0,
        width: '100%',
        borderTop: 1,
        borderColor: 'divider'
      }}
    >
      <BottomNavigationAction label="Home" value="/" icon={<Dashboard />} />
      <BottomNavigationAction label="Finance" value="/finance" icon={<AttachMoney />} />
      <BottomNavigationAction label="Promos" value="/promotions" icon={<Campaign />} />
      <BottomNavigationAction label="Settings" value="/settings" icon={<Settings />} />
    </BottomNavigation>
  );
};

export default BottomNav;
