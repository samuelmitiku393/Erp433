import React, { useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AccountBalance as AccountBalanceIcon,
  AttachMoney as MoneyIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFinancialSummary } from '../../store/slices/transactionSlice';
import useTelegram from '../../hooks/useTelegram';

const FinancialSummary = () => {
  const dispatch = useDispatch();
  const { user } = useTelegram();
  const { summary, loading } = useSelector((state) => state.transactions);

  useEffect(() => {
    if (user) {
      dispatch(fetchFinancialSummary({
        userId: user.id ? user.id.toString() : 'test_user_123'
      }));
    }
  }, [dispatch, user]);

  if (loading) {
    return <LinearProgress />;
  }

  if (!summary) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="textSecondary">
          No financial data available
        </Typography>
      </Paper>
    );
  }

  const {
    totalIncome = 0,
    totalExpenses = 0,
    totalWithdrawals = 0,
    netProfit = 0
  } = summary;

  const stats = [
    {
      title: 'Total Income',
      value: `$${totalIncome.toFixed(2)}`,
      icon: <TrendingUpIcon sx={{ color: 'success.main' }} />,
      color: 'success',
      trend: 'positive'
    },
    {
      title: 'Total Expenses',
      value: `$${totalExpenses.toFixed(2)}`,
      icon: <TrendingDownIcon sx={{ color: 'error.main' }} />,
      color: 'error',
      trend: 'negative'
    },
    {
      title: 'Withdrawals',
      value: `$${totalWithdrawals.toFixed(2)}`,
      icon: <AccountBalanceIcon sx={{ color: 'warning.main' }} />,
      color: 'warning',
      trend: 'neutral'
    },
    {
      title: 'Net Profit',
      value: `$${netProfit.toFixed(2)}`,
      icon: <MoneyIcon sx={{ color: netProfit >= 0 ? 'success.main' : 'error.main' }} />,
      color: netProfit >= 0 ? 'success' : 'error',
      trend: netProfit >= 0 ? 'positive' : 'negative'
    }
  ];

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Financial Overview
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 3 }}>
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
                <Typography
                  variant="h5"
                  sx={{
                    color: stat.color === 'success' ? 'success.main' :
                           stat.color === 'error' ? 'error.main' :
                           stat.color === 'warning' ? 'warning.main' : 'text.primary'
                  }}
                >
                  {stat.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Income vs Expenses
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Type</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="right">Percentage</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Income</TableCell>
                    <TableCell align="right">${totalIncome.toFixed(2)}</TableCell>
                    <TableCell align="right">100%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Expenses</TableCell>
                    <TableCell align="right">${totalExpenses.toFixed(2)}</TableCell>
                    <TableCell align="right">
                      {totalIncome > 0 ? ((totalExpenses / totalIncome) * 100).toFixed(1) : 0}%
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Withdrawals</TableCell>
                    <TableCell align="right">${totalWithdrawals.toFixed(2)}</TableCell>
                    <TableCell align="right">
                      {totalIncome > 0 ? ((totalWithdrawals / totalIncome) * 100).toFixed(1) : 0}%
                    </TableCell>
                  </TableRow>
                  <TableRow sx={{ fontWeight: 'bold' }}>
                    <TableCell>Net Profit</TableCell>
                    <TableCell align="right">${netProfit.toFixed(2)}</TableCell>
                    <TableCell align="right">
                      {totalIncome > 0 ? ((netProfit / totalIncome) * 100).toFixed(1) : 0}%
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Profit Margin Analysis
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Profit Margin</Typography>
                <Typography variant="body2">
                  {totalIncome > 0 ? ((netProfit / totalIncome) * 100).toFixed(1) : 0}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={totalIncome > 0 ? Math.min(100, (netProfit / totalIncome) * 100) : 0}
                color={netProfit >= 0 ? 'success' : 'error'}
                sx={{ height: 10, borderRadius: 5 }}
              />
              
              <Box sx={{ mt: 3 }}>
                <Typography variant="body2" gutterBottom>
                  Efficiency Metrics
                </Typography>
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Paper sx={{ p: 1.5, textAlign: 'center' }}>
                      <Typography variant="caption" display="block">
                        Expense Ratio
                      </Typography>
                      <Typography variant="h6">
                        {totalIncome > 0 ? ((totalExpenses / totalIncome) * 100).toFixed(1) : 0}%
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper sx={{ p: 1.5, textAlign: 'center' }}>
                      <Typography variant="caption" display="block">
                        Withdrawal Ratio
                      </Typography>
                      <Typography variant="h6">
                        {totalIncome > 0 ? ((totalWithdrawals / totalIncome) * 100).toFixed(1) : 0}%
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FinancialSummary;