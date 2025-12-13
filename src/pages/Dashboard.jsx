import React, { useEffect, useMemo, useCallback } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Skeleton
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Campaign,
  Schedule,
  AttachMoney,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTransactions } from '../store/slices/transactionSlice';
import { fetchPromotions } from '../store/slices/promotionSlice';
import PromotionList from '../components/promotions/PromotionList';
import TransactionList from '../components/finance/TransactionList';
import useTelegram from '../hooks/useTelegram';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, hapticFeedback } = useTelegram();

  const {
    transactions = [],
    summary = {},
    loading: financeLoading
  } = useSelector(state => state.transactions) || {};

  const {
    promotions = [],
    activePromotions = [],
    loading: promoLoading
  } = useSelector(state => state.promotions) || {};

  // Add safe data access
  const safeSummary = summary || {};
  const safeTransactions = transactions || [];
  const safePromotions = promotions || [];
  const safeActivePromotions = activePromotions || [];

  useEffect(() => {
    if (!user?.id) {
      console.log('No user ID available, skipping data fetch');
      return;
    }
    const userId = String(user.id);
    console.log('Fetching data for user:', userId);
    dispatch(fetchTransactions({ userId, limit: 5 }));
    dispatch(fetchPromotions({ userId, limit: 4 }));
  }, [dispatch, user]);

  const stats = useMemo(() => [
    {
      title: 'Income',
      value: `$${(safeSummary.totalIncome || 0).toFixed(2)}`,
      icon: <TrendingUp sx={{ color: 'success.main' }} />,
    },
    {
      title: 'Expenses',
      value: `$${(safeSummary.totalExpenses || 0).toFixed(2)}`,
      icon: <TrendingDown sx={{ color: 'error.main' }} />,
    },
    {
      title: 'Promotions',
      value: safeActivePromotions.length,
      icon: <Campaign sx={{ color: 'primary.main' }} />,
    },
    {
      title: 'Scheduled Posts',
      value: safePromotions.reduce(
        (total, promo) => total + (promo.reminders?.length || 0),
        0
      ),
      icon: <Schedule sx={{ color: 'warning.main' }} />,
    }
  ], [safeSummary, safeActivePromotions, safePromotions]);

  const handleNavigate = useCallback((path) => {
    // Safe haptic feedback with fallback
    try {
      hapticFeedback?.impactOccurred?.('light');
    } catch (error) {
      console.log('Haptic feedback not available');
    }
    navigate(path);
  }, [navigate, hapticFeedback]);

  // Add loading state for initial user check
  const [isInitializing, setIsInitializing] = React.useState(true);

  useEffect(() => {
    // Set a timeout to show loading state briefly
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Show loading skeleton if still initializing
  if (isInitializing) {
    return (
      <Box sx={{ p: 1 }}>
        <Typography fontSize="1rem" fontWeight={600} mb={1.5}>
          Business Dashboard
        </Typography>
        
        <Grid container spacing={1.5} mb={2}>
          {[1, 2, 3, 4].map((i) => (
            <Grid item xs={6} key={i}>
              <Skeleton variant="rectangular" height={70} />
            </Grid>
          ))}
        </Grid>
        
        <Skeleton variant="rectangular" height={50} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={80} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={80} />
      </Box>
    );
  }

  // Show message if no user is available
  if (!user?.id) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="textSecondary" gutterBottom>
          User not authenticated
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Please open this app from Telegram to access your dashboard.
        </Typography>
        {/* Optional: Add demo mode button */}
        <Button 
          variant="outlined" 
          sx={{ mt: 2 }}
          onClick={() => {
            // For testing purposes, you could set a demo user
            console.log('Demo mode activated');
          }}
        >
          Try Demo Mode
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 1 }}>
      <Typography fontSize="1rem" fontWeight={600} mb={1.5}>
        Business Dashboard
      </Typography>

      <Grid container spacing={1.5} mb={2}>
        {stats.map((stat, i) => (
          <Grid item xs={6} key={i}>
            <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
              <CardContent sx={{ p: 1.5 }}>
                <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                  {stat.icon}
                  <Typography fontSize="0.7rem" color="text.secondary">
                    {stat.title}
                  </Typography>
                </Box>
                <Typography fontWeight={600}>
                  {stat.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Paper elevation={0} sx={{ p: 1.5, border: '1px solid', borderColor: 'divider' }}>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Button
              fullWidth
              size="small"
              variant="contained"
              startIcon={<AttachMoney />}
              onClick={() => handleNavigate('/finance')}
            >
              Add
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              fullWidth
              size="small"
              variant="contained"
              startIcon={<Campaign />}
              onClick={() => handleNavigate('/promotions')}
            >
              Promote
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Box mt={2}>
        <Typography fontSize="0.9rem" mb={1}>
          Recent Transactions
        </Typography>
        {financeLoading ? (
          <Skeleton height={80} />
        ) : safeTransactions.length > 0 ? (
          <TransactionList transactions={safeTransactions.slice(0, 3)} compact />
        ) : (
          <Typography color="textSecondary" fontSize="0.8rem">
            No transactions yet
          </Typography>
        )}
      </Box>

      <Box mt={2}>
        <Typography fontSize="0.9rem" mb={1}>
          Active Promotions
        </Typography>
        {promoLoading ? (
          <Skeleton height={80} />
        ) : safeActivePromotions.length > 0 ? (
          <PromotionList promotions={safeActivePromotions.slice(0, 2)} compact />
        ) : (
          <Typography color="textSecondary" fontSize="0.8rem">
            No active promotions
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default Dashboard;