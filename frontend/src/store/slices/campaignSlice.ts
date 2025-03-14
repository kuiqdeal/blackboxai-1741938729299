import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

// Types
interface Campaign {
  _id: string;
  name: string;
  type: 'email' | 'social_media' | 'ads' | 'sms' | 'whatsapp';
  platform: string;
  status: 'draft' | 'scheduled' | 'active' | 'paused' | 'completed' | 'failed';
  content: {
    subject?: string;
    body: string;
    template?: string;
    mediaUrls?: string[];
    callToAction?: {
      text: string;
      url: string;
    };
  };
  schedule: {
    startDate?: Date;
    endDate?: Date;
    frequency?: 'once' | 'daily' | 'weekly' | 'monthly';
    timeZone?: string;
  };
  targeting: {
    audience: string[];
    segments: string[];
    filters: Record<string, any>;
  };
  budget?: {
    amount: number;
    currency: string;
    daily?: number;
    spent: number;
  };
  performance: {
    impressions: number;
    clicks: number;
    conversions: number;
    revenue: number;
    roi: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface CampaignState {
  campaigns: Campaign[];
  currentCampaign: Campaign | null;
  loading: boolean;
  error: string | null;
  filters: {
    type?: string;
    platform?: string;
    status?: string;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const initialState: CampaignState = {
  campaigns: [],
  currentCampaign: null,
  loading: false,
  error: null,
  filters: {},
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
};

// Async actions
export const fetchCampaigns = createAsyncThunk(
  'campaigns/fetchCampaigns',
  async ({ page = 1, limit = 10, filters = {} }, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...filters,
      });

      const response = await axios.get(`/api/campaigns?${queryParams}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch campaigns');
    }
  }
);

export const fetchCampaignById = createAsyncThunk(
  'campaigns/fetchCampaignById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/campaigns/${id}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch campaign');
    }
  }
);

export const createCampaign = createAsyncThunk(
  'campaigns/createCampaign',
  async (campaignData: Partial<Campaign>, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/campaigns', campaignData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create campaign');
    }
  }
);

export const updateCampaign = createAsyncThunk(
  'campaigns/updateCampaign',
  async ({ id, data }: { id: string; data: Partial<Campaign> }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/campaigns/${id}`, data);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update campaign');
    }
  }
);

export const deleteCampaign = createAsyncThunk(
  'campaigns/deleteCampaign',
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/campaigns/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete campaign');
    }
  }
);

export const startCampaign = createAsyncThunk(
  'campaigns/startCampaign',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/api/campaigns/${id}/start`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to start campaign');
    }
  }
);

export const pauseCampaign = createAsyncThunk(
  'campaigns/pauseCampaign',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/api/campaigns/${id}/pause`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to pause campaign');
    }
  }
);

// Slice
const campaignSlice = createSlice({
  name: 'campaigns',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<typeof initialState.filters>) => {
      state.filters = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload;
    },
    clearCurrentCampaign: (state) => {
      state.currentCampaign = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Campaigns
    builder
      .addCase(fetchCampaigns.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCampaigns.fulfilled, (state, action) => {
        state.loading = false;
        state.campaigns = action.payload.data;
        state.pagination = {
          page: action.payload.currentPage,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.pages,
        };
      })
      .addCase(fetchCampaigns.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      });

    // Fetch Campaign by ID
    builder
      .addCase(fetchCampaignById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCampaignById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCampaign = action.payload;
      })
      .addCase(fetchCampaignById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      });

    // Create Campaign
    builder
      .addCase(createCampaign.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCampaign.fulfilled, (state, action) => {
        state.loading = false;
        state.campaigns.unshift(action.payload);
        toast.success('Campaign created successfully');
      })
      .addCase(createCampaign.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      });

    // Update Campaign
    builder
      .addCase(updateCampaign.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCampaign.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.campaigns.findIndex(
          (campaign) => campaign._id === action.payload._id
        );
        if (index !== -1) {
          state.campaigns[index] = action.payload;
        }
        if (state.currentCampaign?._id === action.payload._id) {
          state.currentCampaign = action.payload;
        }
        toast.success('Campaign updated successfully');
      })
      .addCase(updateCampaign.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      });

    // Delete Campaign
    builder
      .addCase(deleteCampaign.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCampaign.fulfilled, (state, action) => {
        state.loading = false;
        state.campaigns = state.campaigns.filter(
          (campaign) => campaign._id !== action.payload
        );
        if (state.currentCampaign?._id === action.payload) {
          state.currentCampaign = null;
        }
        toast.success('Campaign deleted successfully');
      })
      .addCase(deleteCampaign.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      });

    // Start Campaign
    builder
      .addCase(startCampaign.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(startCampaign.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.campaigns.findIndex(
          (campaign) => campaign._id === action.payload._id
        );
        if (index !== -1) {
          state.campaigns[index] = action.payload;
        }
        if (state.currentCampaign?._id === action.payload._id) {
          state.currentCampaign = action.payload;
        }
        toast.success('Campaign started successfully');
      })
      .addCase(startCampaign.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      });

    // Pause Campaign
    builder
      .addCase(pauseCampaign.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(pauseCampaign.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.campaigns.findIndex(
          (campaign) => campaign._id === action.payload._id
        );
        if (index !== -1) {
          state.campaigns[index] = action.payload;
        }
        if (state.currentCampaign?._id === action.payload._id) {
          state.currentCampaign = action.payload;
        }
        toast.success('Campaign paused successfully');
      })
      .addCase(pauseCampaign.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      });
  },
});

export const {
  setFilters,
  clearFilters,
  setCurrentPage,
  clearCurrentCampaign,
} = campaignSlice.actions;

export default campaignSlice.reducer;
