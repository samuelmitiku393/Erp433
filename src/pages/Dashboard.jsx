import React, { useEffect, useMemo } from 'react';
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

  const stats = useMemo(() => [
    {
      title: 'Total Income',
      value: `$${summary?.totalIncome?.toFixed(2) || '0.00'}`,
      icon: <TrendingUp sx={{ color: 'success.main', fontSize: 24 }} />,
      color: 'success'
    },
    {
      title: 'Total Expenses',
      value: `$${summary?.totalExpenses?.toFixed(2) || '0.00'}`,
      icon: <TrendingDown sx={{ color: 'error.main', fontSize: 24 }} />,
      color: 'error'
    },
    {
      title: 'Active Promos',
      value: activePromotions.length,
      icon: <Campaign sx={{ color: 'primary.main', fontSize: 24 }} />,
      color: 'primary'
    },
    {
      title: 'Upcoming Posts',
      value: promotions.reduce((total, promo) => 
        total + (promo.reminders?.length || 0), 0
      ),
      icon: <Schedule sx={{ color: 'warning.main', fontSize: 24 }} />,
      color: 'warning'
    }
  ], [summary, activePromotions, promotions]);

  const loading = financeLoading || promoLoading;

  if (loading) {
    return (
      <Box sx={{ p: 2 }}>
        <Skeleton variant="text" width="60%" height={40} sx={{ mb: 3 }} />
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {[1, 2, 3, 4].map(i => (
            <Grid item xs={6} sm={3} key={i}>
              <Skeleton variant="rectangular" height={100} />
            </Grid>
          ))}
        </Grid>
        <Skeleton variant="rectangular" height={200} />
      </Box>
    );
  }

  const handleNavigation = (path) => {
    hapticFeedback?.impactOccurred('light');
    navigate(path);
  };

  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 2, fontSize: '1.1rem' }}>
        Business Dashboard
      </Typography>
      
      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {stats.map((stat, index) => (
          <Grid item xs={6} key={index}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box sx={{ mr: 1 }}>
                    {stat.icon}
                  </Box>
                  <Typography color="textSecondary" variant="caption" sx={{ fontSize: '0.75rem' }}>
                    {stat.title}
                  </Typography>
                </Box>
                <Typography variant="h6" sx={{ color: `${stat.color}.main`, fontSize: '1.25rem' }}>
                  {stat.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {/* Quick Actions */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Quick Actions
        </Typography>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Button
              fullWidth
              variant="contained"
              size="small"
              startIcon={<AttachMoney sx={{ fontSize: 18 }} />}
              onClick={() => handleNavigation('/finance')}
            >
              Add Transaction
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              fullWidth
              variant="contained"
              size="small"
              startIcon={<Campaign sx={{ fontSize: 18 }} />}
              onClick={() => handleNavigation('/promotions')}
            >
              New Promotion
            </Button>
          </Grid>
        </Grid>
      </Paper>
      
      <Grid container spacing={2}>
        {/* Recent Transactions */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="subtitle1">
                Recent Transactions
              </Typography>
              <Button
                size="small"
                onClick={() => handleNavigation('/finance')}
              >
                View All
              </Button>
            </Box>
            {transactions.length > 0 ? (
              <TransactionList transactions={transactions.slice(0, 3)} compact />
            ) : (
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography color="textSecondary" variant="caption">
                  No recent transactions
                </Typography>
                <Button
                  variant="text"
                  size="small"
                  onClick={() => handleNavigation('/finance')}
                  sx={{ mt: 0.5 }}
                >
                  Add Transaction
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>
        
        {/* Active Promotions */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="subtitle1">
                Active Promotions
              </Typography>
              <Button
                size="small"
                onClick={() => handleNavigation('/promotions')}
              >
                View All
              </Button>
            </Box>
            {activePromotions.length > 0 ? (
              <PromotionList promotions={activePromotions.slice(0, 2)} compact />
            ) : (
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography color="textSecondary" variant="caption">
                  No active promotions
                </Typography>
                <Button
                  variant="text"
                  size="small"
                  onClick={() => handleNavigation('/promotions')}
                  sx={{ mt: 0.5 }}
                >
                  Create Promotion
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;