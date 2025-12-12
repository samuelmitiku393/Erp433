import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  Grid,
  LinearProgress,
  IconButton,
  Tooltip,
  Avatar
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Schedule as ScheduleIcon,
  Notifications as NotificationsIcon,
  Campaign as CampaignIcon
} from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { deletePromotion, updatePromotionStatus } from '../../store/slices/promotionSlice';
import useTelegram from '../../hooks/useTelegram';
import { format, differenceInDays } from 'date-fns';

const PromotionList = ({ promotions, onEdit, onSchedule }) => {
  const dispatch = useDispatch();
  const { hapticFeedback, showConfirm } = useTelegram();

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'telegram': return '📱';
      case 'instagram': return '📸';
      case 'facebook': return '📘';
      case 'twitter': return '🐦';
      case 'whatsapp': return '💬';
      default: return '📢';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'planned': return 'primary';
      case 'paused': return 'warning';
      case 'completed': return 'info';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getProgress = (promotion) => {
    const now = new Date();
    const start = new Date(promotion.startDate);
    const end = new Date(promotion.endDate);
    
    if (now < start) return 0;
    if (now > end) return 100;
    
    const totalDuration = end - start;
    const elapsed = now - start;
    return (elapsed / totalDuration) * 100;
  };

  const getRemainingDays = (promotion) => {
    const end = new Date(promotion.endDate);
    const now = new Date();
    const diff = differenceInDays(end, now);
    return diff > 0 ? diff : 0;
  };

  const handleDelete = async (id) => {
    hapticFeedback?.impactOccurred('medium');
    
    showConfirm?.('Are you sure you want to delete this promotion?', async (confirmed) => {
      if (confirmed) {
        try {
          await dispatch(deletePromotion(id)).unwrap();
          hapticFeedback?.notificationOccurred('success');
        } catch (error) {
          console.error('Failed to delete promotion:', error);
          hapticFeedback?.notificationOccurred('error');
        }
      }
    });
  };

  const handleStatusChange = async (id, status) => {
    hapticFeedback?.impactOccurred('light');
    
    try {
      await dispatch(updatePromotionStatus({ id, status })).unwrap();
      hapticFeedback?.notificationOccurred('success');
    } catch (error) {
      console.error('Failed to update status:', error);
      hapticFeedback?.notificationOccurred('error');
    }
  };

  const handleEdit = (promotion) => {
    hapticFeedback?.impactOccurred('light');
    onEdit?.(promotion);
  };

  const handleSchedule = (promotion) => {
    hapticFeedback?.impactOccurred('light');
    onSchedule?.(promotion);
  };

  if (!promotions || promotions.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <CampaignIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
        <Typography color="textSecondary" variant="h6">
          No promotions found
        </Typography>
        <Typography color="textSecondary" variant="body2">
          Create your first promotion campaign!
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {promotions.map((promotion) => {
        const progress = getProgress(promotion);
        const remainingDays = getRemainingDays(promotion);
        
        return (
          <Grid item xs={12} md={6} key={promotion._id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: 'primary.main',
                      mr: 2,
                      width: 40,
                      height: 40
                    }}
                  >
                    {getPlatformIcon(promotion.platform)}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" noWrap>
                      {promotion.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {promotion.platform.charAt(0).toUpperCase() + promotion.platform.slice(1)}
                    </Typography>
                  </Box>
                  <Chip
                    label={promotion.status}
                    size="small"
                    color={getStatusColor(promotion.status)}
                    sx={{ ml: 1 }}
                  />
                </Box>

                {promotion.description && (
                  <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                    {promotion.description.length > 100
                      ? `${promotion.description.substring(0, 100)}...`
                      : promotion.description}
                  </Typography>
                )}

                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" color="textSecondary">
                      Progress
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {progress.toFixed(0)}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={progress}
                    color={promotion.status === 'active' ? 'primary' : 'secondary'}
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                </Box>

                <Grid container spacing={1} sx={{ mb: 2 }}>
                  <Grid item xs={6}>
                    <Typography variant="caption" display="block" color="textSecondary">
                      Start Date
                    </Typography>
                    <Typography variant="body2">
                      {format(new Date(promotion.startDate), 'MMM dd')}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" display="block" color="textSecondary">
                      End Date
                    </Typography>
                    <Typography variant="body2">
                      {format(new Date(promotion.endDate), 'MMM dd')}
                    </Typography>
                  </Grid>
                  {promotion.budget > 0 && (
                    <Grid item xs={6}>
                      <Typography variant="caption" display="block" color="textSecondary">
                        Budget
                      </Typography>
                      <Typography variant="body2">
                        ${promotion.budget.toFixed(2)}
                      </Typography>
                    </Grid>
                  )}
                  <Grid item xs={6}>
                    <Typography variant="caption" display="block" color="textSecondary">
                      Days Left
                    </Typography>
                    <Typography variant="body2" color={remainingDays < 3 ? 'error.main' : 'text.primary'}>
                      {remainingDays}
                    </Typography>
                  </Grid>
                </Grid>

                {promotion.tags && promotion.tags.length > 0 && (
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 1 }}>
                    {promotion.tags.slice(0, 3).map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                    {promotion.tags.length > 3 && (
                      <Chip
                        label={`+${promotion.tags.length - 3}`}
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </Box>
                )}

                {promotion.reminders && promotion.reminders.length > 0 && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                    <NotificationsIcon fontSize="small" sx={{ mr: 0.5, color: 'warning.main' }} />
                    <Typography variant="caption" color="textSecondary">
                      {promotion.reminders.length} reminder{promotion.reminders.length !== 1 ? 's' : ''}
                    </Typography>
                  </Box>
                )}
              </CardContent>

              <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                <Box>
                  <Tooltip title="Edit">
                    <IconButton
                      size="small"
                      onClick={() => handleEdit(promotion)}
                      sx={{ mr: 1 }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Schedule Posts">
                    <IconButton
                      size="small"
                      onClick={() => handleSchedule(promotion)}
                      sx={{ mr: 1 }}
                    >
                      <ScheduleIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(promotion._id)}
                      color="error"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>

                <Box>
                  {promotion.status === 'planned' && (
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleStatusChange(promotion._id, 'active')}
                    >
                      Start
                    </Button>
                  )}
                  {promotion.status === 'active' && (
                    <Button
                      size="small"
                      variant="outlined"
                      color="warning"
                      onClick={() => handleStatusChange(promotion._id, 'paused')}
                    >
                      Pause
                    </Button>
                  )}
                  {promotion.status === 'paused' && (
                    <Button
                      size="small"
                      variant="outlined"
                      color="success"
                      onClick={() => handleStatusChange(promotion._id, 'active')}
                    >
                      Resume
                    </Button>
                  )}
                </Box>
              </CardActions>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default PromotionList;