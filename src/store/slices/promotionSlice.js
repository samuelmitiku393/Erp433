import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { promotionAPI } from '../../services/api';

export const fetchPromotions = createAsyncThunk(
  'promotions/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const response = await promotionAPI.getAll(params);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createPromotion = createAsyncThunk(
  'promotions/create',
  async (promotionData, { rejectWithValue }) => {
    try {
      const response = await promotionAPI.create(promotionData);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const schedulePostReminder = createAsyncThunk(
  'promotions/schedulePost',
  async ({ promotionId, scheduleData }, { rejectWithValue }) => {
    try {
      const response = await promotionAPI.schedulePost(promotionId, scheduleData);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updatePromotion = createAsyncThunk(
  'promotions/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await promotionAPI.update(id, data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deletePromotion = createAsyncThunk(
  'promotions/delete',
  async (id, { rejectWithValue }) => {
    try {
      await promotionAPI.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updatePromotionStatus = createAsyncThunk(
  'promotions/updateStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await promotionAPI.updateStatus(id, status);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const promotionSlice = createSlice({
  name: 'promotions',
  initialState: {
    promotions: [],
    activePromotions: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      total: 0,
      pages: 1
    }
  },
  reducers: {
    clearPromotions: (state) => {
      state.promotions = [];
      state.activePromotions = [];
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Promotions
      .addCase(fetchPromotions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPromotions.fulfilled, (state, action) => {
        state.loading = false;
        state.promotions = action.payload.data || [];
        state.pagination = action.payload.pagination || {
          page: 1,
          total: 0,
          pages: 1
        };
        
        // Calculate active promotions
        const now = new Date();
        state.activePromotions = state.promotions.filter(p => 
          p.status === 'active' && 
          new Date(p.endDate) >= now
        );
      })
      .addCase(fetchPromotions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to fetch promotions';
      })
      
      // Create Promotion
      .addCase(createPromotion.fulfilled, (state, action) => {
        state.promotions.unshift(action.payload.data?.promotion || action.payload.data);
      })
      
      // Schedule Post
      .addCase(schedulePostReminder.fulfilled, (state, action) => {
        const promotion = state.promotions.find(
          p => p._id === action.meta.arg.promotionId
        );
        if (promotion && promotion.reminders) {
          promotion.reminders.push(action.payload.data?.reminder?._id);
        }
      })
      
      // Update Promotion
      .addCase(updatePromotion.fulfilled, (state, action) => {
        const index = state.promotions.findIndex(
          p => p._id === action.payload.data._id
        );
        if (index !== -1) {
          state.promotions[index] = action.payload.data;
        }
      })
      
      // Delete Promotion
      .addCase(deletePromotion.fulfilled, (state, action) => {
        state.promotions = state.promotions.filter(
          p => p._id !== action.payload
        );
        state.activePromotions = state.activePromotions.filter(
          p => p._id !== action.payload
        );
      })
      
      // Update Status
      .addCase(updatePromotionStatus.fulfilled, (state, action) => {
        const index = state.promotions.findIndex(
          p => p._id === action.payload.data._id
        );
        if (index !== -1) {
          state.promotions[index] = action.payload.data;
        }
      });
  }
});

export const { clearPromotions, clearError } = promotionSlice.actions;
export default promotionSlice.reducer;