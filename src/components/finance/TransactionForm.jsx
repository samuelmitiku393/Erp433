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
  InputAdornment,
  FormControl,
  InputLabel,
  Chip,
  Stack
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { useDispatch } from 'react-redux';
import { addTransaction } from '../../store/slices/transactionSlice';
import useTelegram from '../../hooks/useTelegram';

const TransactionForm = ({ onSuccess }) => {
  const dispatch = useDispatch();
  const { hapticFeedback, user } = useTelegram();
  
  const [formData, setFormData] = useState({
    type: 'expense',
    category: '',
    amount: '',
    description: '',
    date: new Date(),
    paymentMethod: 'cash',
    tags: [],
    tagInput: ''
  });
  
  const [loading, setLoading] = useState(false);

  const transactionTypes = {
    income: {
      label: 'Income',
      categories: [
        { value: 'sales', label: 'Sales' },
        { value: 'service', label: 'Service' },
        { value: 'product', label: 'Product' }
      ]
    },
    expense: {
      label: 'Expense',
      categories: [
        { value: 'marketing', label: 'Marketing' },
        { value: 'salaries', label: 'Salaries' },
        { value: 'rent', label: 'Rent' },
        { value: 'utilities', label: 'Utilities' },
        { value: 'supplies', label: 'Supplies' },
        { value: 'other', label: 'Other' }
      ]
    },
    withdrawal: {
      label: 'Withdrawal',
      categories: [
        { value: 'withdrawal', label: 'Withdrawal' }
      ]
    }
  };

  const paymentMethods = [
    { value: 'cash', label: 'Cash' },
    { value: 'card', label: 'Card' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'crypto', label: 'Crypto' },
    { value: 'other', label: 'Other' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      hapticFeedback?.impactOccurred('medium');
      
      await dispatch(addTransaction({
        userId: user?.id ? user.id.toString() : 'test_user_123',
        type: formData.type,
        category: formData.category || (formData.type === 'income' ? 'sales' : 'other'),
        amount: parseFloat(formData.amount),
        description: formData.description,
        date: formData.date,
        paymentMethod: formData.paymentMethod,
        tags: formData.tags
      })).unwrap();
      
      // Reset form
      setFormData({
        type: 'expense',
        category: '',
        amount: '',
        description: '',
        date: new Date(),
        paymentMethod: 'cash',
        tags: [],
        tagInput: ''
      });
      
      hapticFeedback?.notificationOccurred('success');
      onSuccess?.();
      
    } catch (error) {
      console.error('Failed to add transaction:', error);
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

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Add New Transaction
      </Typography>
      
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value, category: ''})}
                label="Type"
                required
              >
                <MenuItem value="income">Income</MenuItem>
                <MenuItem value="expense">Expense</MenuItem>
                <MenuItem value="withdrawal">Withdrawal</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                label="Category"
                required
              >
                <MenuItem value="">
                  <em>Select Category</em>
                </MenuItem>
                {transactionTypes[formData.type].categories.map(cat => (
                  <MenuItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Amount"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
              required
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              inputProps={{ min: "0.01", step: "0.01" }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <DatePicker
              label="Date"
              value={formData.date}
              onChange={(date) => setFormData({...formData, date})}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Payment Method</InputLabel>
              <Select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                label="Payment Method"
              >
                {paymentMethods.map(method => (
                  <MenuItem key={method.value} value={method.value}>
                    {method.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
              multiline
              rows={2}
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
              disabled={loading}
              size="large"
            >
              {loading ? 'Adding...' : 'Add Transaction'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default TransactionForm;