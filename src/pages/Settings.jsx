import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Avatar
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Language as LanguageIcon,
  Security as SecurityIcon,
  Palette as PaletteIcon,
  Person as PersonIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import useTelegram from '../hooks/useTelegram';

const Settings = () => {
  const { user } = useTelegram();

  const settings = [
    {
      title: 'Notifications',
      icon: <NotificationsIcon />,
      items: [
        { label: 'Promotion Reminders', enabled: true },
        { label: 'Transaction Alerts', enabled: false }
      ]
    },
    {
      title: 'Appearance',
      icon: <PaletteIcon />,
      items: [
        { label: 'Dark Mode', enabled: true }
      ]
    },
    {
      title: 'Security',
      icon: <SecurityIcon />,
      items: [
        { label: 'Auto Logout', enabled: true }
      ]
    }
  ];

  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        Settings
      </Typography>

      {/* User Profile */}
      <Card sx={{ mb: 2 }}>
        <CardContent sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              sx={{
                width: 50,
                height: 50,
                bgcolor: 'primary.main',
                mr: 2
              }}
            >
              <PersonIcon />
            </Avatar>
            <Box>
              <Typography variant="subtitle1">
                {user?.first_name || 'User'}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                @{user?.username || 'username'}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Settings Sections */}
      {settings.map((section, index) => (
        <Paper key={index} sx={{ mb: 2 }}>
          <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {section.icon}
              {section.title}
            </Typography>
          </Box>
          <List disablePadding>
            {section.items.map((item, itemIndex) => (
              <React.Fragment key={itemIndex}>
                <ListItem sx={{ py: 1, px: 2 }}>
                  <ListItemText 
                    primary={item.label}
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                  <Switch
                    size="small"
                    checked={item.enabled}
                    onChange={() => {}}
                  />
                </ListItem>
                {itemIndex < section.items.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      ))}

      {/* Actions */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Actions
        </Typography>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Button
              fullWidth
              variant="outlined"
              size="small"
              startIcon={<LanguageIcon />}
            >
              Language
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              fullWidth
              variant="outlined"
              size="small"
              color="error"
              startIcon={<LogoutIcon />}
            >
              Log Out
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Typography variant="caption" color="textSecondary" align="center" display="block">
        Version 1.0.0 • Telegram Mini App
      </Typography>
    </Box>
  );
};

export default Settings;