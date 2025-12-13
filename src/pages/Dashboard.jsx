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

  // FIXED: Get Redux state once and memoize the derived values
  const transactionsState = useSelector(state => state.transactions);
  const promotionsState = useSelector(state => state.promotions);

  // Memoize the extracted values to prevent new references on every render
  const { transactions, summary, financeLoading } = useMemo(() => ({
    transactions: transactionsState?.transactions || [],
    summary: transactionsState?.summary || {},
    financeLoading: transactionsState?.loading || false
  }), [transactionsState]);

  const { promotions, activePromotions, promoLoading } = useMemo(() => ({
    promotions: promotionsState?.promotions || [],
    activePromotions: promotionsState?.activePromotions || [],
    promoLoading: promotionsState?.loading || false
  }), [promotionsState]);

  useEffect(() => {
    if (!user?.id) return;
    const userId = String(user.id);
    dispatch(fetchTransactions({ userId, limit: 5 }));
    dispatch(fetchPromotions({ userId, limit: 4 }));
  }, [dispatch, user]);

  // FIXED: Move calculations inside useMemo to use stable dependencies
  const stats = useMemo(() => {
    // Calculate scheduled posts count safely
    const scheduledPostsCount = promotions?.reduce?.(
      (total, promo) => total + (promo?.reminders?.length || 0),
      0
    ) || 0;

    return [
      {
        title: 'Income',
        value: `$${(summary?.totalIncome || 0).toFixed(2)}`,
        icon: <TrendingUp sx={{ color: 'success.main' }} />,
      },
      {
        title: 'Expenses',
        value: `$${(summary?.totalExpenses || 0).toFixed(2)}`,
        icon: <TrendingDown sx={{ color: 'error.main' }} />,
      },
      {
        title: 'Promotions',
        value: activePromotions?.length || 0,
        icon: <Campaign sx={{ color: 'primary.main' }} />,
      },
      {
        title: 'Scheduled Posts',
        value: scheduledPostsCount,
        icon: <Schedule sx={{ color: 'warning.main' }} />,
      }
    ];
  }, [summary, activePromotions, promotions]);

  const handleNavigate = useCallback((path) => {
    hapticFeedback?.impactOccurred?.('light');
    navigate(path);
  }, [navigate, hapticFeedback]);

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
        ) : transactions.length > 0 ? (
          <TransactionList transactions={transactions.slice(0, 3)} compact />
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
        ) : activePromotions.length > 0 ? (
          <PromotionList promotions={activePromotions.slice(0, 2)} compact />
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