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
  Select,
  MenuItem,
  FormControl
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTransactions } from '../store/slices/transactionSlice';
import TransactionForm from '../components/finance/TransactionForm';
import TransactionList from '../components/finance/TransactionList';
import FinancialSummary from '../components/finance/FinancialSummary';
import useTelegram from '../hooks/useTelegram';

const Finance = () => {
  const dispatch = useDispatch();
  const { user, hapticFeedback } = useTelegram();
  
  const [tabValue, setTabValue] = useState(0);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    page: 1,
    limit: 10
  });

  const { transactions, loading } = useSelector(state => state.transactions);

  useEffect(() => {
    if (user) {
      loadTransactions();
    }
  }, [user, filters]);

  const loadTransactions = useCallback(() => {
    const userId = user?.id ? user.id.toString() : 'test_user_123';
    dispatch(fetchTransactions({
      userId,
      ...filters
    }));
  }, [user, filters, dispatch]);

  const handleTabChange = (event, newValue) => {
    hapticFeedback?.impactOccurred('light');
    setTabValue(newValue);
  };

  const handleAddTransaction = () => {
    hapticFeedback?.impactOccurred('medium');
    setShowTransactionForm(true);
  };

  const handleCloseTransactionForm = () => {
    setShowTransactionForm(false);
  };

  const handleTransactionSuccess = () => {
    hapticFeedback?.notificationOccurred('success');
    handleCloseTransactionForm();
    loadTransactions();
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const transactionTypes = [
    { value: '', label: 'All Types' },
    { value: 'income', label: 'Income' },
    { value: 'expense', label: 'Expense' }
  ];

  const categories = [
    { value: '', label: 'All' },
    { value: 'sales', label: 'Sales' },
    { value: 'service', label: 'Service' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'supplies', label: 'Supplies' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <Box sx={{ p: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Finance
        </Typography>
        <Button
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
          onClick={handleAddTransaction}
        >
          Add
        </Button>
      </Box>

      <Paper sx={{ mb: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ minHeight: 48 }}
        >
          <Tab label="Transactions" sx={{ minWidth: 0, fontSize: '0.75rem' }} />
          <Tab label="Overview" sx={{ minWidth: 0, fontSize: '0.75rem' }} />
        </Tabs>
      </Paper>

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
        <FormControl size="small" sx={{ minWidth: 120, flex: 1 }}>
          <Select
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            displayEmpty
            size="small"
          >
            {transactionTypes.map(type => (
              <MenuItem key={type.value} value={type.value}>
                {type.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 120, flex: 1 }}>
          <Select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            displayEmpty
            size="small"
          >
            {categories.map(category => (
              <MenuItem key={category.value} value={category.value}>
                {category.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {tabValue === 0 && (
        <>
          {loading ? (
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="caption">Loading...</Typography>
            </Paper>
          ) : (
            <TransactionList
              transactions={transactions}
              compact
              showPagination={false}
            />
          )}
        </>
      )}

      {tabValue === 1 && (
        <FinancialSummary compact />
      )}

      {/* Transaction Form Dialog */}
      <Dialog
        open={showTransactionForm}
        onClose={handleCloseTransactionForm}
        fullWidth
        maxWidth="xs"
      >
        <DialogContent sx={{ p: 2 }}>
          <TransactionForm
            onSuccess={handleTransactionSuccess}
            compact
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Finance;