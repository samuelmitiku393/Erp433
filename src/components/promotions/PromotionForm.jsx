import React, { useState } from 'react';
import {
  Box,
  TextField,
  Select,
  MenuItem,
  Button,
  Grid,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Chip,
  Stack,
  Slider,
  InputAdornment
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { useDispatch } from 'react-redux';
import { createPromotion } from '../../store/slices/promotionSlice';
import useTelegram from '../../hooks/useTelegram';

const PromotionForm = ({ onSuccess }) => {
  const dispatch = useDispatch();
  const { hapticFeedback, user } = useTelegram();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    platform: 'telegram',
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    budget: '',
    targetAudience: '',
    tags: [],
    tagInput: '',
    status: 'planned'
  });
  
  const [loading, setLoading] = useState(false);

  const platforms = [
    { value: 'telegram', label: 'Telegram' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'twitter', label: 'Twitter' },
    { value: 'whatsapp', label: 'WhatsApp' },
    { value: 'other', label: 'Other' }
  ];

  const statuses = [
    { value: 'planned', label: 'Planned' },
    { value: 'active', label: 'Active' },
    { value: 'paused', label: 'Paused' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      hapticFeedback?.impactOccurred('medium');
      
      await dispatch(createPromotion({
        userId: user?.id ? user.id.toString() : 'test_user_123',
        title: formData.title,
        description: formData.description,
        platform: formData.platform,
        startDate: formData.startDate.toISOString(),
        endDate: formData.endDate.toISOString(),
        budget: formData.budget ? parseFloat(formData.budget) : 0,
        targetAudience: formData.targetAudience,
        tags: formData.tags,
        status: formData.status
      })).unwrap();
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        platform: 'telegram',
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        budget: '',
        targetAudience: '',
        tags: [],
        tagInput: '',
        status: 'planned'
      });
      
      hapticFeedback?.notificationOccurred('success');
      onSuccess?.();
      
    } catch (error) {
      console.error('Failed to create promotion:', error);
      hapticFeedback?.notificationOccurred('error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTag = () => {
    if (formData.tagInput.trim()) {
      setFormData({
        ...formData,
        tags: [...formData.tags, formData.tagInput.trim()],
        tagInput: ''
      });
    }
  };

  const handleDeleteTag = (tagToDelete) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToDelete)
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const calculateDuration = () => {
    const diffTime = Math.abs(formData.endDate - formData.startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Create New Promotion
      </Typography>
      
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Promotion Title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
              placeholder="e.g., New Year Sale 2024"
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              multiline
              rows={3}
              placeholder="Describe your promotion campaign..."
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Platform</InputLabel>
              <Select
                value={formData.platform}
                onChange={(e) => setFormData({...formData, platform: e.target.value})}
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
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
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
          
          <Grid item xs={12} sm={6}>
            <DatePicker
              label="Start Date"
              value={formData.startDate}
              onChange={(date) => setFormData({...formData, startDate: date})}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <DatePicker
              label="End Date"
              value={formData.endDate}
              onChange={(date) => setFormData({...formData, endDate: date})}
              minDate={formData.startDate}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
              <Typography variant="body2" gutterBottom>
                Promotion Duration: {calculateDuration()} days
              </Typography>
              <Slider
                value={0}
                max={calculateDuration()}
                disabled
                sx={{ mt: 1 }}
              />
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Budget ($)"
              type="number"
              value={formData.budget}
              onChange={(e) => setFormData({...formData, budget: e.target.value})}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              inputProps={{ min: "0", step: "0.01" }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Target Audience"
              value={formData.targetAudience}
              onChange={(e) => setFormData({...formData, targetAudience: e.target.value})}
              placeholder="e.g., Young adults, 18-35"
            />
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ mb: 1 }}>
              <TextField
                fullWidth
                label="Add Tags"
                value={formData.tagInput}
                onChange={(e) => setFormData({...formData, tagInput: e.target.value})}
                onKeyPress={handleKeyPress}
                InputProps={{
                  endAdornment: (
                    <Button
                      size="small"
                      onClick={handleAddTag}
                      disabled={!formData.tagInput.trim()}
                    >
                      Add
                    </Button>
                  ),
                }}
                placeholder="e.g., sale, discount, holiday"
              />
            </Box>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {formData.tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  onDelete={() => handleDeleteTag(tag)}
                  size="small"
                />
              ))}
            </Stack>
          </Grid>
          
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading || !formData.title}
              size="large"
            >
              {loading ? 'Creating...' : 'Create Promotion'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default PromotionForm;