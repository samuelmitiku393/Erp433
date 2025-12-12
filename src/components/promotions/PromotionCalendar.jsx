import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import EventIcon from '@mui/icons-material/Event';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

const localizer = momentLocalizer(moment);

const PromotionCalendar = ({ promotions, onEventSelect }) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const formattedEvents = promotions.map(promo => {
      const start = new Date(promo.startDate);
      const end = new Date(promo.endDate);
      
      // Add reminder events
      const reminderEvents = promo.reminders?.map(reminder => ({
        id: `reminder-${reminder._id}`,
        title: `🔔 ${reminder.title}`,
        start: new Date(reminder.triggerTime),
        end: new Date(reminder.triggerTime),
        allDay: false,
        resource: { type: 'reminder', data: reminder },
        color: '#ff9800'
      })) || [];

      return [
        {
          id: promo._id,
          title: `📢 ${promo.title}`,
          start,
          end,
          allDay: true,
          resource: { type: 'promotion', data: promo },
          color: promo.status === 'active' ? '#4caf50' : 
                 promo.status === 'completed' ? '#2196f3' : '#9e9e9e'
        },
        ...reminderEvents
      ];
    }).flat();

    setEvents(formattedEvents);
  }, [promotions]);

  const eventStyleGetter = (event) => {
    return {
      style: {
        backgroundColor: event.color || '#3174ad',
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block'
      }
    };
  };

  const handleSelectEvent = (event) => {
    onEventSelect?.(event.resource);
  };

  return (
    <Paper sx={{ p: 2, height: 600 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <EventIcon sx={{ mr: 1 }} />
        <Typography variant="h6">Promotion Calendar</Typography>
        <Tooltip title="Orange dots are reminders">
          <IconButton size="small" sx={{ ml: 1 }}>
            <NotificationsActiveIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
      
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        eventPropGetter={eventStyleGetter}
        onSelectEvent={handleSelectEvent}
        views={['month', 'week', 'day']}
        defaultView="month"
        popup
      />
      
      <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Chip size="small" label="Active Promotions" sx={{ bgcolor: '#4caf50', color: 'white' }} />
        <Chip size="small" label="Completed" sx={{ bgcolor: '#2196f3', color: 'white' }} />
        <Chip size="small" label="Reminders" sx={{ bgcolor: '#ff9800', color: 'white' }} />
      </Box>
    </Paper>
  );
};

export default PromotionCalendar;