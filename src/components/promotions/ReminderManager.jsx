import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Switch,
  Chip,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';
import { TimePicker } from '@mui/x-date-pickers';
import { useDispatch } from 'react-redux';
import { schedulePost } from '../../store/slices/promotionSlice';
import useTelegram from '../../hooks/useTelegram';

const ReminderManager = ({ promotion, reminders = [] }) => {
  const dispatch = useDispatch();
  const { hapticFeedback } = useTelegram();
  
  const [openDialog, setOpenDialog] = useState(false);
  const [scheduleData, setScheduleData] = useState({
    time: '14:30',
    days: [1, 3, 5], // Monday, Wednesday, Friday
    message: ''
  });

  const daysOfWeek = [
    { value: 0, label: 'Sunday' },
    { value: 1, label: 'Monday' },
    { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' },
    { value: 4, label: 'Thursday' },
    { value: 5, label: 'Friday' },
    { value: 6, label: 'Saturday' }
  ];

  const handleSchedulePost = async () => {
    try {
      await dispatch(schedulePost({
        promotionId: promotion._id,
        ...scheduleData
      })).unwrap();
      
      hapticFeedback?.notificationOccurred('success');
      setOpenDialog(false);
      setScheduleData({
        time: '14:30',
        days: [1, 3, 5],
        message: ''
      });
    } catch (error) {
      console.error('Failed to schedule post:', error);
      hapticFeedback?.notificationOccurred('error');
    }
  };

  const toggleDay = (day) => {
    setScheduleData(prev => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day]
    }));
  };

  return (
    <>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            <NotificationsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Reminders & Scheduling
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
          >
            Schedule Post
          </Button>
        </Box>

        <List>
          {reminders.map((reminder) => (
            <ListItem key={reminder._id} divider>
              <ListItemText
                primary={reminder.title}
                secondary={
                  <>
                    {reminder.message}
                    <br />
                    <Chip
                      size="small"
                      label={new Date(reminder.triggerTime).toLocaleString()}
                      sx={{ mt: 0.5 }}
                    />
                    {reminder.sent && (
                      <Chip
                        size="small"
                        label="Sent"
                        color="success"
                        sx={{ ml: 1, mt: 0.5 }}
                      />
                    )}
                  </>
                }
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" size="small">
                  <EditIcon />
                </IconButton>
                <IconButton edge="end" size="small" sx={{ ml: 1 }}>
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
          
          {reminders.length === 0 && (
            <Typography color="textSecondary" align="center" sx={{ py: 4 }}>
              No reminders scheduled yet
            </Typography>
          )}
        </List>
      </Paper>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Schedule Promotion Posts</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Message"
                multiline
                rows={3}
                value={scheduleData.message}
                onChange={(e) => setScheduleData({...scheduleData, message: e.target.value})}
                placeholder="What to post about this promotion..."
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Post Time"
                type="time"
                value={scheduleData.time}
                onChange={(e) => setScheduleData({...scheduleData, time: e.target.value})}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Days of Week:
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {daysOfWeek.map((day) => (
                  <Chip
                    key={day.value}
                    label={day.label}
                    onClick={() => toggleDay(day.value)}
                    color={scheduleData.days.includes(day.value) ? 'primary' : 'default'}
                    variant={scheduleData.days.includes(day.value) ? 'filled' : 'outlined'}
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSchedulePost} variant="contained">
            Schedule Posts
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ReminderManager;