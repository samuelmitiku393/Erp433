import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { transactionAPI } from '../../services/api';

export const fetchTransactions = createAsyncThunk(
  'transactions/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const response = await transactionAPI.getAll(params);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const addTransaction = createAsyncThunk(
  'transactions/add',
  async (transactionData, { rejectWithValue }) => {
    try {
      const response = await transactionAPI.create(transactionData);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchFinancialSummary = createAsyncThunk(
  'transactions/summary',
  async (params, { rejectWithValue }) => {
    try {
      const response = await transactionAPI.getSummary(params);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateTransaction = createAsyncThunk(
  'transactions/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await transactionAPI.update(id, data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteTransaction = createAsyncThunk(
  'transactions/delete',
  async (id, { rejectWithValue }) => {
    try {
      await transactionAPI.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const transactionSlice = createSlice({
  name: 'transactions',
  initialState: {
    transactions: [],
    summary: null,
    loading: false,
    error: null,
    pagination: {
      page: 1,
      total: 0,
      pages: 1
    }
  },
  reducers: {
    clearTransactions: (state) => {
      state.transactions = [];
      state.summary = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Transactions
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload.data || [];
        state.pagination = action.payload.pagination || {
          page: 1,
          total: 0,
          pages: 1
        };
        if (action.payload.summary) {
          state.summary = action.payload.summary;
        }
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to fetch transactions';
      })
      
      // Add Transaction
      .addCase(addTransaction.fulfilled, (state, action) => {
        state.transactions.unshift(action.payload.data);
      })
      
      // Fetch Summary
      .addCase(fetchFinancialSummary.fulfilled, (state, action) => {
        state.summary = action.payload.data?.summary || null;
      })
      
      // Update Transaction
      .addCase(updateTransaction.fulfilled, (state, action) => {
        const index = state.transactions.findIndex(
          t => t._id === action.payload.data._id
        );
        if (index !== -1) {
          state.transactions[index] = action.payload.data;
        }
      })
      
      // Delete Transaction
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.transactions = state.transactions.filter(
          t => t._id !== action.payload
        );
      });
  }
});

export const { clearTransactions, clearError } = transactionSlice.actions;
export default transactionSlice.reducer;