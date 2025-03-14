import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import settingsReducer from './slices/settingsSlice';
import leadReducer from './slices/leadSlice';
import campaignReducer from './slices/campaignSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    settings: settingsReducer,
    leads: leadReducer,
    campaigns: campaignReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['persist/PERSIST'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.schedule.startDate', 'payload.schedule.endDate'],
        // Ignore these paths in the state
        ignoredPaths: [
          'campaigns.currentCampaign.schedule.startDate',
          'campaigns.currentCampaign.schedule.endDate',
        ],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
