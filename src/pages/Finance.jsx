import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { Add as AddIcon, FilterList as FilterIcon } from '@mui/icons-material';
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
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    startDate: null,
    endDate: null,
    page: 1,
    limit: 20
  });
  const [editingTransaction, setEditingTransaction] = useState(null);

  const { transactions, loading, pagination } = useSelector(state => state.transactions);

  useEffect(() => {
    if (user) {
      loadTransactions();
    }
  }, [user, filters]);

  const loadTransactions = () => {
    const userId = user?.id ? user.id.toString() : 'test_user_123';
    
    dispatch(fetchTransactions({
      userId,
      ...filters
    }));
  };

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
    setEditingTransaction(null);
  };

  const handleTransactionSuccess = () => {
    hapticFeedback?.notificationOccurred('success');
    handleCloseTransactionForm();
    loadTransactions();
  };

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setShowTransactionForm(true);
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleClearFilters = () => {
    setFilters({
      type: '',
      category: '',
      startDate: null,
      endDate: null,
      page: 1,
      limit: 20
    });
    setShowFilterDialog(false);
  };

  const handleApplyFilters = () => {
    loadTransactions();
    setShowFilterDialog(false);
  };

  const transactionTypes = [
    { value: '', label: 'All Types' },
    { value: 'income', label: 'Income' },
    { value: 'expense', label: 'Expense' },
    { value: 'withdrawal', label: 'Withdrawal' }
  ];

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'sales', label: 'Sales' },
    { value: 'service', label: 'Service' },
    { value: 'product', label: 'Product' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'salaries', label: 'Salaries' },
    { value: 'rent', label: 'Rent' },
    { value: 'utilities', label: 'Utilities' },
    { value: 'supplies', label: 'Supplies' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">
          Financial Management
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
            onClick={handleAddTransaction}
          >
            Add Transaction
          </Button>
        </Box>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
        >
          <Tab label="Transactions" />
          <Tab label="Overview" />
          <Tab label="Reports" />
        </Tabs>
      </Paper>

      {tabValue === 0 && (
        <Box>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Type</InputLabel>
                <Select
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  label="Type"
                >
                  {transactionTypes.map(type => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Category</InputLabel>
                <Select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  label="Category"
                >
                  {categories.map(category => (
                    <MenuItem key={category.value} value={category.value}>
                      {category.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <DatePicker
                label="Start Date"
                value={filters.startDate}
                onChange={(date) => handleFilterChange('startDate', date)}
                renderInput={(params) => <TextField {...params} fullWidth size="small" />}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <DatePicker
                label="End Date"
                value={filters.endDate}
                onChange={(date) => handleFilterChange('endDate', date)}
                renderInput={(params) => <TextField {...params} fullWidth size="small" />}
              />
            </Grid>
          </Grid>

          {loading ? (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography>Loading transactions...</Typography>
            </Paper>
          ) : (
            <TransactionList
              transactions={transactions}
              pagination={pagination}
              onEdit={handleEditTransaction}
              onPageChange={handlePageChange}
            />
          )}
        </Box>
      )}

      {tabValue === 1 && (
        <FinancialSummary />
      )}

      {tabValue === 2 && (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Reports & Analytics
          </Typography>
          <Typography color="textSecondary">
            Detailed financial reports and analytics coming soon!
          </Typography>
        </Paper>
      )}

      {/* Transaction Form Dialog */}
      <Dialog
        open={showTransactionForm}
        onClose={handleCloseTransactionForm}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TransactionForm
              onSuccess={handleTransactionSuccess}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseTransactionForm}>
            Cancel
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
        <DialogTitle>Filter Transactions</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ pt: 2 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={filters.type}
                  onChange={(e) => setFilters({...filters, type: e.target.value})}
                  label="Type"
                >
                  {transactionTypes.map(type => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={filters.category}
                  onChange={(e) => setFilters({...filters, category: e.target.value})}
                  label="Category"
                >
                  {categories.map(category => (
                    <MenuItem key={category.value} value={category.value}>
                      {category.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <DatePicker
                label="Start Date"
                value={filters.startDate}
                onChange={(date) => setFilters({...filters, startDate: date})}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
            <Grid item xs={12}>
              <DatePicker
                label="End Date"
                value={filters.endDate}
                onChange={(date) => setFilters({...filters, endDate: date})}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClearFilters} color="error">
            Clear All
          </Button>
          <Button onClick={() => setShowFilterDialog(false)}>
            Cancel
          </Button>
          <Button onClick={handleApplyFilters} variant="contained">
            Apply Filters
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Finance;