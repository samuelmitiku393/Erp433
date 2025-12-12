import React, { useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  LinearProgress,
  Button
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Campaign,
  Schedule,
  AttachMoney,
  CalendarToday
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTransactions } from '../store/slices/transactionSlice';
import { fetchPromotions } from '../store/slices/promotionSlice';
import FinancialSummary from '../components/finance/FinancialSummary';
import PromotionList from '../components/promotions/PromotionList';
import TransactionList from '../components/finance/TransactionList';
import useTelegram from '../hooks/useTelegram';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, hapticFeedback } = useTelegram();
  
  const { transactions, summary, loading: financeLoading } = useSelector(state => state.transactions);
  const { promotions, activePromotions, loading: promoLoading } = useSelector(state => state.promotions);

  useEffect(() => {
    if (user) {
      const userId = user.id ? user.id.toString() : 'test_user_123';
      
      dispatch(fetchTransactions({
        userId,
        limit: 5
      }));
      
      dispatch(fetchPromotions({
        userId,
        limit: 4
      }));
    }
  }, [dispatch, user]);

  const loading = financeLoading || promoLoading;

  if (loading) {
    return <LinearProgress />;
  }

  const stats = [
    {
      title: 'Total Income',
      value: `$${summary?.totalIncome?.toFixed(2) || '0.00'}`,
      icon: <TrendingUp sx={{ color: 'success.main' }} />,
      color: 'success',
      trend: 'up'
    },
    {
      title: 'Total Expenses',
      value: `$${summary?.totalExpenses?.toFixed(2) || '0.00'}`,
      icon: <TrendingDown sx={{ color: 'error.main' }} />,
      color: 'error',
      trend: 'down'
    },
    {
      title: 'Active Promotions',
      value: activePromotions.length,
      icon: <Campaign sx={{ color: 'primary.main' }} />,
      color: 'primary',
      trend: 'neutral'
    },
    {
      title: 'Upcoming Posts',
      value: promotions.reduce((total, promo) => 
        total + (promo.reminders?.length || 0), 0
      ),
      icon: <Schedule sx={{ color: 'warning.main' }} />,
      color: 'warning',
      trend: 'neutral'
    }
  ];

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Business Dashboard
      </Typography>
      
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box sx={{ mr: 1 }}>
                    {stat.icon}
                  </Box>
                  <Typography color="textSecondary" variant="body2">
                    {stat.title}
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ color: `${stat.color}.main` }}>
                  {stat.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {/* Quick Actions */}
      <Paper sx={{ p: 2, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6} sm={3}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<AttachMoney />}
              onClick={() => {
                hapticFeedback?.impactOccurred('light');
                navigate('/finance');
              }}
            >
              Add Transaction
            </Button>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<Campaign />}
              onClick={() => {
                hapticFeedback?.impactOccurred('light');
                navigate('/promotions');
              }}
            >
              New Promotion
            </Button>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<CalendarToday />}
              onClick={() => {
                hapticFeedback?.impactOccurred('light');
                navigate('/analytics');
              }}
            >
              View Analytics
            </Button>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => {
                hapticFeedback?.impactOccurred('light');
                navigate('/settings');
              }}
            >
              Settings
            </Button>
          </Grid>
        </Grid>
      </Paper>
      
      <Grid container spacing={3}>
        {/* Recent Transactions */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Recent Transactions
              </Typography>
              <Button
                size="small"
                onClick={() => navigate('/finance')}
              >
                View All
              </Button>
            </Box>
            {transactions.length > 0 ? (
              <TransactionList transactions={transactions.slice(0, 5)} />
            ) : (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography color="textSecondary">
                  No recent transactions
                </Typography>
                <Button
                  variant="text"
                  onClick={() => navigate('/finance')}
                  sx={{ mt: 1 }}
                >
                  Add Transaction
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>
        
        {/* Active Promotions */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Active Promotions
              </Typography>
              <Button
                size="small"
                onClick={() => navigate('/promotions')}
              >
                View All
              </Button>
            </Box>
            {activePromotions.length > 0 ? (
              <PromotionList promotions={activePromotions.slice(0, 3)} />
            ) : (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography color="textSecondary">
                  No active promotions
                </Typography>
                <Button
                  variant="text"
                  onClick={() => navigate('/promotions')}
                  sx={{ mt: 1 }}
                >
                  Create Promotion
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>
        
        {/* Financial Summary */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <FinancialSummary />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;