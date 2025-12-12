import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Button,
  Dialog,
  DialogContent,
  Grid,
  FormControl,
  Select,
  MenuItem
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
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
  const [filters, setFilters] = useState({
    status: '',
    platform: '',
    page: 1,
    limit: 10
  });

  const { promotions, loading } = useSelector(state => state.promotions);

  useEffect(() => {
    if (user) {
      loadPromotions();
    }
  }, [user, filters]);

  const loadPromotions = useCallback(() => {
    const userId = user?.id ? user.id.toString() : 'test_user_123';
    dispatch(fetchPromotions({
      userId,
      ...filters
    }));
  }, [user, filters, dispatch]);

  const handleTabChange = (event, newValue) => {
    hapticFeedback?.impactOccurred('light');
    setTabValue(newValue);
    
    let statusFilter = '';
    switch (newValue) {
      case 0: statusFilter = ''; break;
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

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const platforms = [
    { value: '', label: 'All Platforms' },
    { value: 'telegram', label: 'Telegram' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <Box sx={{ p: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Promotions
        </Typography>
        <Button
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
          onClick={handleAddPromotion}
        >
          New
        </Button>
      </Box>

      <Paper sx={{ mb: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons={false}
          sx={{ minHeight: 48 }}
        >
          <Tab label="All" sx={{ minWidth: 0, fontSize: '0.75rem' }} />
          <Tab label="Active" sx={{ minWidth: 0, fontSize: '0.75rem' }} />
          <Tab label="Planned" sx={{ minWidth: 0, fontSize: '0.75rem' }} />
          <Tab label="Completed" sx={{ minWidth: 0, fontSize: '0.75rem' }} />
        </Tabs>
      </Paper>

      {/* Filter */}
      <Box sx={{ mb: 2 }}>
        <FormControl fullWidth size="small">
          <Select
            value={filters.platform}
            onChange={(e) => handleFilterChange('platform', e.target.value)}
            displayEmpty
          >
            {platforms.map(platform => (
              <MenuItem key={platform.value} value={platform.value}>
                {platform.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="caption">Loading promotions...</Typography>
        </Paper>
      ) : (
        <PromotionList
          promotions={promotions}
          compact
          showPagination={false}
        />
      )}

      {/* Promotion Form Dialog */}
      <Dialog
        open={showPromotionForm}
        onClose={handleClosePromotionForm}
        fullWidth
        maxWidth="sm"
      >
        <DialogContent sx={{ p: 2 }}>
          <PromotionForm
            onSuccess={handlePromotionSuccess}
            compact
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Promotions;