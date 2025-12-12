//this is a placeholder for settings page
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
  TextField,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Language as LanguageIcon,
  Security as SecurityIcon,
  Backup as BackupIcon,
  Palette as PaletteIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import useTelegram from '../hooks/useTelegram';

const Settings = () => {
  const { user } = useTelegram();

  const settings = [
    {
      title: 'Notifications',
      icon: <NotificationsIcon />,
      items: [
        { label: 'Email Notifications', enabled: true },
        { label: 'Push Notifications', enabled: true },
        { label: 'Promotion Reminders', enabled: true },
        { label: 'Transaction Alerts', enabled: false }
      ]
    },
    {
      title: 'Appearance',
      icon: <PaletteIcon />,
      items: [
        { label: 'Dark Mode', enabled: true },
        { label: 'Compact View', enabled: false },
        { label: 'Large Text', enabled: false }
      ]
    },
    {
      title: 'Privacy & Security',
      icon: <SecurityIcon />,
      items: [
        { label: 'Two-Factor Authentication', enabled: false },
        { label: 'Data Encryption', enabled: true },
        { label: 'Auto Logout', enabled: true }
      ]
    }
  ];

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Settings
      </Typography>

      {/* User Profile Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar
              sx={{
                width: 60,
                height: 60,
                bgcolor: 'primary.main',
                mr: 3
              }}
            >
              <PersonIcon />
            </Avatar>
            <Box>
              <Typography variant="h6">
                {user?.first_name || 'Test User'}
              </Typography>
              <Typography color="textSecondary">
                @{user?.username || 'test_user'}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Telegram ID: {user?.id || '123456789'}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Settings Sections */}
        {settings.map((section, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Paper sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ mr: 1, color: 'primary.main' }}>
                  {section.icon}
                </Box>
                <Typography variant="h6">
                  {section.title}
                </Typography>
              </Box>
              <List>
                {section.items.map((item, itemIndex) => (
                  <React.Fragment key={itemIndex}>
                    <ListItem>
                      <ListItemText primary={item.label} />
                      <Switch
                        checked={item.enabled}
                        onChange={() => {}}
                      />
                    </ListItem>
                    {itemIndex < section.items.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>
        ))}

        {/* Additional Settings */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Additional Settings
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Currency"
                  defaultValue="USD"
                  select
                  SelectProps={{ native: true }}
                >
                  <option value="USD">US Dollar ($)</option>
                  <option value="EUR">Euro (€)</option>
                  <option value="GBP">British Pound (£)</option>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Time Zone"
                  defaultValue="UTC"
                  select
                  SelectProps={{ native: true }}
                >
                  <option value="UTC">UTC</option>
                  <option value="EST">Eastern Time</option>
                  <option value="PST">Pacific Time</option>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Date Format"
                  defaultValue="MM/DD/YYYY"
                  select
                  SelectProps={{ native: true }}
                >
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </TextField>
              </Grid>
            </Grid>

            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button variant="contained" color="primary">
                Save Changes
              </Button>
              <Button variant="outlined">
                Reset to Default
              </Button>
              <Button variant="outlined" color="error">
                Clear All Data
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<LanguageIcon />}
                >
                  Language
                </Button>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<BackupIcon />}
                >
                  Backup Data
                </Button>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Button
                  fullWidth
                  variant="outlined"
                  color="error"
                >
                  Log Out
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Settings;