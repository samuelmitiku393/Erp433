import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { Add as AddIcon, FilterList as FilterIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPromotions } from '../store/slices/promotionSlice';
import PromotionForm from '../components/promotions/PromotionForm';
import PromotionList from '../components/promotions/PromotionList';
import useTelegram from '../hooks/useTelegram';

const Promotions = () => {
  const dispatch = useDispatch();
  const { user, hapticFeedback } = useTelegram();
  
  const [tabValue, setTabValue] = useState(0);
  const [showPromotionForm, setShowPromotionForm] = useState(false);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    platform: '',
    page: 1,
    limit: 12
  });
  const [scheduleData, setScheduleData] = useState({
    time: '14:30',
    days: [1, 3, 5],
    message: ''
  });

  const { promotions, loading, pagination } = useSelector(state => state.promotions);

  useEffect(() => {
    if (user) {
      loadPromotions();
    }
  }, [user, filters]);

  const loadPromotions = () => {
    const userId = user?.id ? user.id.toString() : 'test_user_123';
    
    dispatch(fetchPromotions({
      userId,
      ...filters
    }));
  };

  const handleTabChange = (event, newValue) => {
    hapticFeedback?.impactOccurred('light');
    setTabValue(newValue);
    
    // Update filters based on tab
    let statusFilter = '';
    switch (newValue) {
      case 0: statusFilter = ''; break; // All
      case 1: statusFilter = 'active'; break;
      case 2: statusFilter = 'planned'; break;
      case 3: statusFilter = 'completed'; break;
      default: statusFilter = '';
    }
    
    setFilters(prev => ({ ...prev, status: statusFilter, page: 1 }));
  };

  const handleAddPromotion = () => {
    hapticFeedback?.impactOccurred('medium');
    setShowPromotionForm(true);
  };

  const handleClosePromotionForm = () => {
    setShowPromotionForm(false);
  };

  const handlePromotionSuccess = () => {
    hapticFeedback?.notificationOccurred('success');
    handleClosePromotionForm();
    loadPromotions();
  };

  const handleScheduleClick = (promotion) => {
    hapticFeedback?.impactOccurred('light');
    setSelectedPromotion(promotion);
    setShowScheduleDialog(true);
  };

  const handleScheduleSubmit = async () => {
    if (!selectedPromotion) return;
    
    try {
      hapticFeedback?.impactOccurred('medium');
      // You would dispatch schedulePostReminder here
      console.log('Scheduling post for:', selectedPromotion.title, scheduleData);
      
      hapticFeedback?.notificationOccurred('success');
      setShowScheduleDialog(false);
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

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const handleDayToggle = (day) => {
    setScheduleData(prev => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day]
    }));
  };

  const platforms = [
    { value: '', label: 'All Platforms' },
    { value: 'telegram', label: 'Telegram' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'twitter', label: 'Twitter' },
    { value: 'whatsapp', label: 'WhatsApp' },
    { value: 'other', label: 'Other' }
  ];

  const statuses = [
    { value: '', label: 'All Status' },
    { value: 'planned', label: 'Planned' },
    { value: 'active', label: 'Active' },
    { value: 'paused', label: 'Paused' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const dayNames = [
    { value: 0, label: 'Sun' },
    { value: 1, label: 'Mon' },
    { value: 2, label: 'Tue' },
    { value: 3, label: 'Wed' },
    { value: 4, label: 'Thu' },
    { value: 5, label: 'Fri' },
    { value: 6, label: 'Sat' }
  ];

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">
          Promotion Management
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<FilterIcon />}
            onClick={() => setShowFilterDialog(true)}
          >
            Filter
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddPromotion}
          >
            New Promotion
          </Button>
        </Box>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="All Promotions" />
          <Tab label="Active" />
          <Tab label="Planned" />
          <Tab label="Completed" />
          <Tab label="Calendar View" />
        </Tabs>
      </Paper>

      {/* Filters Bar */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              label="Status"
            >
              {statuses.map(status => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel>Platform</InputLabel>
            <Select
              value={filters.platform}
              onChange={(e) => handleFilterChange('platform', e.target.value)}
              label="Platform"
            >
              {platforms.map(platform => (
                <MenuItem key={platform.value} value={platform.value}>
                  {platform.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {loading ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography>Loading promotions...</Typography>
        </Paper>
      ) : (
        <PromotionList
          promotions={promotions}
          onEdit={() => {}}
          onSchedule={handleScheduleClick}
        />
      )}

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Stack direction="row" spacing={1}>
            {[...Array(pagination.pages).keys()].map(page => (
              <Button
                key={page + 1}
                variant={pagination.page === page + 1 ? 'contained' : 'outlined'}
                size="small"
                onClick={() => handlePageChange(page + 1)}
              >
                {page + 1}
              </Button>
            ))}
          </Stack>
        </Box>
      )}

      {/* Promotion Form Dialog */}
      <Dialog
        open={showPromotionForm}
        onClose={handleClosePromotionForm}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Create New Promotion</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <PromotionForm onSuccess={handlePromotionSuccess} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePromotionForm}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Schedule Post Dialog */}
      <Dialog
        open={showScheduleDialog}
        onClose={() => setShowScheduleDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Schedule Post for {selectedPromotion?.title}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ pt: 2 }}>
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
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {dayNames.map((day) => (
                  <Chip
                    key={day.value}
                    label={day.label}
                    onClick={() => handleDayToggle(day.value)}
                    color={scheduleData.days.includes(day.value) ? 'primary' : 'default'}
                    variant={scheduleData.days.includes(day.value) ? 'filled' : 'outlined'}
                  />
                ))}
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Post Message"
                value={scheduleData.message}
                onChange={(e) => setScheduleData({...scheduleData, message: e.target.value})}
                multiline
                rows={3}
                placeholder="What to post about this promotion..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowScheduleDialog(false)}>
            Cancel
          </Button>
          <Button onClick={handleScheduleSubmit} variant="contained">
            Schedule Posts
          </Button>
        </DialogActions>
      </Dialog>

      {/* Filter Dialog */}
      <Dialog
        open={showFilterDialog}
        onClose={() => setShowFilterDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Filter Promotions</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ pt: 2 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status}
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                  label="Status"
                >
                  {statuses.map(status => (
                    <MenuItem key={status.value} value={status.value}>
                      {status.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Platform</InputLabel>
                <Select
                  value={filters.platform}
                  onChange={(e) => setFilters({...filters, platform: e.target.value})}
                  label="Platform"
                >
                  {platforms.map(platform => (
                    <MenuItem key={platform.value} value={platform.value}>
                      {platform.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFilters({ status: '', platform: '', page: 1, limit: 12 })} color="error">
            Clear All
          </Button>
          <Button onClick={() => setShowFilterDialog(false)}>
            Cancel
          </Button>
          <Button onClick={() => { setShowFilterDialog(false); loadPromotions(); }} variant="contained">
            Apply Filters
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Promotions;