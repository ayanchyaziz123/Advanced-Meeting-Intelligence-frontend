import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Constants
const ZOOM_STORAGE_KEYS = {
  CONNECTION: 'zoom_connection',
  ACCESS_TOKEN: 'zoom_access_token',
  REFRESH_TOKEN: 'zoom_refresh_token',
  USER_INFO: 'zoom_user_info'
};

const ZOOM_API_ENDPOINTS = {
  TOKEN_EXCHANGE: '/api/zoom/token',
  USER_INFO: '/api/zoom/user',
  RECORDINGS: '/api/zoom/recordings',
  REFRESH_TOKEN: '/api/zoom/refresh'
};

const ZOOM_CONFIG = {
  CLIENT_ID: process.env.NEXT_PUBLIC_ZOOM_CLIENT_ID,
  REDIRECT_URI: process.env.NEXT_PUBLIC_ZOOM_REDIRECT_URI,
  SCOPE: 'recording:read user:read',
  BASE_URL: 'https://zoom.us/oauth'
};

// Safe localStorage utilities for SSR compatibility
const zoomStorage = {
  get: (key) => {
    if (typeof window === 'undefined') return null;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error parsing localStorage item ${key}:`, error);
      localStorage.removeItem(key);
      return null;
    }
  },
  
  set: (key, value) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting localStorage item ${key}:`, error);
    }
  },
  
  remove: (key) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage item ${key}:`, error);
    }
  },
  
  clear: () => {
    if (typeof window === 'undefined') return;
    try {
      Object.values(ZOOM_STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Error clearing Zoom storage:', error);
    }
  }
};

// Helper function to extract error message
const extractZoomErrorMessage = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

// Generate Zoom OAuth URL
const generateZoomAuthUrl = () => {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: ZOOM_CONFIG.CLIENT_ID,
    redirect_uri: ZOOM_CONFIG.REDIRECT_URI,
    scope: ZOOM_CONFIG.SCOPE,
    state: Math.random().toString(36).substring(2, 15)
  });

  return `${ZOOM_CONFIG.BASE_URL}/authorize?${params.toString()}`;
};

// Async thunk for initiating Zoom OAuth
export const initiateZoomAuth = createAsyncThunk(
  'zoom/initiateAuth',
  async (_, { rejectWithValue }) => {
    try {
      const authUrl = generateZoomAuthUrl();
      
      return new Promise((resolve, reject) => {
        const popup = window.open(
          authUrl,
          'zoomAuth',
          'width=500,height=700,scrollbars=yes,resizable=yes,top=100,left=100'
        );

        if (!popup) {
          reject(new Error('Popup blocked. Please allow popups and try again.'));
          return;
        }

        // Poll for popup closure
        const checkClosed = setInterval(() => {
          if (popup.closed) {
            clearInterval(checkClosed);
            
            // Check if we have the auth result in localStorage
            const authResult = zoomStorage.get('zoom_auth_result');
            if (authResult) {
              zoomStorage.remove('zoom_auth_result');
              
              if (authResult.success) {
                resolve(authResult);
              } else {
                reject(new Error(authResult.error || 'Authentication failed'));
              }
            } else {
              reject(new Error('Authentication cancelled'));
            }
          }
        }, 1000);

        // Timeout after 10 minutes
        setTimeout(() => {
          if (!popup.closed) {
            popup.close();
            clearInterval(checkClosed);
            reject(new Error('Authentication timeout'));
          }
        }, 600000);
      });
    } catch (error) {
      console.error('Zoom auth initiation error:', error);
      return rejectWithValue({ message: extractZoomErrorMessage(error) });
    }
  }
);

// Async thunk for exchanging authorization code for tokens
export const exchangeZoomCode = createAsyncThunk(
  'zoom/exchangeCode',
  async (code, { rejectWithValue }) => {
    try {
      if (!code) {
        throw new Error('Authorization code is required');
      }

      console.log('Exchanging Zoom authorization code...');

      const response = await axios.post(ZOOM_API_ENDPOINTS.TOKEN_EXCHANGE, { code });

      return {
        tokens: response.data,
        message: 'Authorization successful'
      };
    } catch (error) {
      console.error('Zoom token exchange error:', error);
      const message = extractZoomErrorMessage(error);
      return rejectWithValue({ message, code: error.response?.status });
    }
  }
);

// Async thunk for fetching Zoom user info
export const fetchZoomUserInfo = createAsyncThunk(
  'zoom/fetchUserInfo',
  async (accessToken, { rejectWithValue }) => {
    try {
      if (!accessToken) {
        throw new Error('Access token is required');
      }

      console.log('Fetching Zoom user info...');

      const response = await axios.get(ZOOM_API_ENDPOINTS.USER_INFO, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      return response.data;
    } catch (error) {
      console.error('Zoom user info fetch error:', error);
      const message = extractZoomErrorMessage(error);
      return rejectWithValue({ message, code: error.response?.status });
    }
  }
);

// Async thunk for fetching Zoom recordings
export const fetchZoomRecordings = createAsyncThunk(
  'zoom/fetchRecordings',
  async ({ accessToken, from, to, pageSize = 30 }, { rejectWithValue }) => {
    try {
      if (!accessToken) {
        throw new Error('Access token is required');
      }

      console.log('Fetching Zoom recordings...');

      const params = new URLSearchParams();
      if (from) params.append('from', from);
      if (to) params.append('to', to);
      params.append('page_size', pageSize.toString());

      const response = await axios.get(`${ZOOM_API_ENDPOINTS.RECORDINGS}?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      return {
        recordings: response.data.meetings || [],
        total: response.data.total_records || 0,
        page_count: response.data.page_count || 1,
        from,
        to
      };
    } catch (error) {
      console.error('Zoom recordings fetch error:', error);
      const message = extractZoomErrorMessage(error);
      return rejectWithValue({ message, code: error.response?.status });
    }
  }
);

// Async thunk for refreshing Zoom access token
export const refreshZoomToken = createAsyncThunk(
  'zoom/refreshToken',
  async (_, { rejectWithValue, getState }) => {
    try {
      const refreshToken = getState().zoom.refreshToken || zoomStorage.get(ZOOM_STORAGE_KEYS.REFRESH_TOKEN);
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      console.log('Refreshing Zoom access token...');

      const response = await axios.post(ZOOM_API_ENDPOINTS.REFRESH_TOKEN, { 
        refresh_token: refreshToken 
      });

      const { access_token, refresh_token: newRefreshToken } = response.data;

      // Update stored tokens
      zoomStorage.set(ZOOM_STORAGE_KEYS.ACCESS_TOKEN, access_token);
      if (newRefreshToken) {
        zoomStorage.set(ZOOM_STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);
      }

      return {
        accessToken: access_token,
        refreshToken: newRefreshToken || refreshToken
      };
    } catch (error) {
      console.error('Zoom token refresh error:', error);
      
      // If refresh fails, clear stored data
      zoomStorage.clear();
      
      const message = extractZoomErrorMessage(error);
      return rejectWithValue({ message, code: error.response?.status });
    }
  }
);

// Async thunk for complete Zoom connection flow
export const connectToZoom = createAsyncThunk(
  'zoom/connect',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      console.log('Starting Zoom connection flow...');

      // Step 1: Initiate OAuth
      const authResult = await dispatch(initiateZoomAuth()).unwrap();
      
      // Step 2: Exchange code for tokens
      const tokenResult = await dispatch(exchangeZoomCode(authResult.code)).unwrap();
      
      // Step 3: Fetch user info
      const userInfo = await dispatch(fetchZoomUserInfo(tokenResult.tokens.access_token)).unwrap();
      
      // Step 4: Store connection data
      const connectionData = {
        user: userInfo,
        tokens: tokenResult.tokens,
        connected_at: new Date().toISOString(),
        platform: 'zoom'
      };
      
      zoomStorage.set(ZOOM_STORAGE_KEYS.CONNECTION, connectionData);
      zoomStorage.set(ZOOM_STORAGE_KEYS.ACCESS_TOKEN, tokenResult.tokens.access_token);
      if (tokenResult.tokens.refresh_token) {
        zoomStorage.set(ZOOM_STORAGE_KEYS.REFRESH_TOKEN, tokenResult.tokens.refresh_token);
      }
      zoomStorage.set(ZOOM_STORAGE_KEYS.USER_INFO, userInfo);

      return {
        ...connectionData,
        message: 'Successfully connected to Zoom!'
      };
    } catch (error) {
      console.error('Zoom connection flow error:', error);
      return rejectWithValue({ 
        message: error.message || 'Failed to connect to Zoom' 
      });
    }
  }
);

// Initial state
const initialState = {
  // Connection state
  isConnected: false,
  connectionStatus: 'disconnected', // disconnected, connecting, connected, error
  user: zoomStorage.get(ZOOM_STORAGE_KEYS.USER_INFO),
  accessToken: zoomStorage.get(ZOOM_STORAGE_KEYS.ACCESS_TOKEN),
  refreshToken: zoomStorage.get(ZOOM_STORAGE_KEYS.REFRESH_TOKEN),
  connectionData: zoomStorage.get(ZOOM_STORAGE_KEYS.CONNECTION),
  
  // Recordings state
  recordings: [],
  recordingsMetadata: {
    total: 0,
    pageCount: 0,
    from: null,
    to: null
  },
  
  // Loading states
  loading: false,
  connecting: false,
  fetchingRecordings: false,
  refreshingToken: false,
  
  // Messages
  error: null,
  successMessage: null,
  
  // Last activity
  lastRecordingsFetch: null,
  lastTokenRefresh: null
};

// Set initial connection state
if (initialState.accessToken && initialState.user) {
  initialState.isConnected = true;
  initialState.connectionStatus = 'connected';
}

const zoomSlice = createSlice({
  name: 'zoom',
  initialState,
  reducers: {
    // Clear error messages
    clearZoomError: (state) => {
      state.error = null;
    },
    
    // Clear success messages
    clearZoomSuccess: (state) => {
      state.successMessage = null;
    },
    
    // Clear all messages
    clearZoomMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
    
    // Set connection status
    setConnectionStatus: (state, action) => {
      state.connectionStatus = action.payload;
    },
    
    // Disconnect from Zoom
    disconnectZoom: (state) => {
      state.isConnected = false;
      state.connectionStatus = 'disconnected';
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.connectionData = null;
      state.recordings = [];
      state.recordingsMetadata = {
        total: 0,
        pageCount: 0,
        from: null,
        to: null
      };
      state.error = null;
      state.successMessage = 'Disconnected from Zoom';
      
      // Clear storage
      zoomStorage.clear();
    },
    
    // Hydrate zoom state from localStorage
    hydrateZoomState: (state) => {
      const storedConnection = zoomStorage.get(ZOOM_STORAGE_KEYS.CONNECTION);
      const storedToken = zoomStorage.get(ZOOM_STORAGE_KEYS.ACCESS_TOKEN);
      const storedUser = zoomStorage.get(ZOOM_STORAGE_KEYS.USER_INFO);
      const storedRefreshToken = zoomStorage.get(ZOOM_STORAGE_KEYS.REFRESH_TOKEN);
      
      if (storedConnection && storedToken && storedUser) {
        state.isConnected = true;
        state.connectionStatus = 'connected';
        state.connectionData = storedConnection;
        state.accessToken = storedToken;
        state.refreshToken = storedRefreshToken;
        state.user = storedUser;
      } else {
        // Clear inconsistent state
        zoomStorage.clear();
        state.isConnected = false;
        state.connectionStatus = 'disconnected';
      }
    },
    
    // Update recordings manually (for real-time updates)
    updateRecordings: (state, action) => {
      state.recordings = action.payload;
    },
    
    // Add new recording
    addRecording: (state, action) => {
      state.recordings.unshift(action.payload);
      state.recordingsMetadata.total += 1;
    }
  },
  
  extraReducers: (builder) => {
    builder
      // Initiate Zoom Auth
      .addCase(initiateZoomAuth.pending, (state) => {
        state.connecting = true;
        state.loading = true;
        state.connectionStatus = 'connecting';
        state.error = null;
        state.successMessage = null;
      })
      .addCase(initiateZoomAuth.fulfilled, (state, action) => {
        state.connecting = false;
        state.loading = false;
        // Auth initiated successfully, continue with token exchange
      })
      .addCase(initiateZoomAuth.rejected, (state, action) => {
        state.connecting = false;
        state.loading = false;
        state.connectionStatus = 'error';
        state.error = action.payload?.message || 'Failed to initiate Zoom authentication';
        state.successMessage = null;
      })
      
      // Exchange Code
      .addCase(exchangeZoomCode.pending, (state) => {
        state.connecting = true;
        state.loading = true;
        state.error = null;
      })
      .addCase(exchangeZoomCode.fulfilled, (state, action) => {
        state.connecting = false;
        state.loading = false;
        state.accessToken = action.payload.tokens.access_token;
        state.refreshToken = action.payload.tokens.refresh_token;
      })
      .addCase(exchangeZoomCode.rejected, (state, action) => {
        state.connecting = false;
        state.loading = false;
        state.connectionStatus = 'error';
        state.error = action.payload?.message || 'Failed to exchange authorization code';
      })
      
      // Fetch User Info
      .addCase(fetchZoomUserInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchZoomUserInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchZoomUserInfo.rejected, (state, action) => {
        state.loading = false;
        state.connectionStatus = 'error';
        state.error = action.payload?.message || 'Failed to fetch user information';
      })
      
      // Connect to Zoom (complete flow)
      .addCase(connectToZoom.pending, (state) => {
        state.connecting = true;
        state.loading = true;
        state.connectionStatus = 'connecting';
        state.error = null;
        state.successMessage = null;
      })
      .addCase(connectToZoom.fulfilled, (state, action) => {
        state.connecting = false;
        state.loading = false;
        state.isConnected = true;
        state.connectionStatus = 'connected';
        state.user = action.payload.user;
        state.accessToken = action.payload.tokens.access_token;
        state.refreshToken = action.payload.tokens.refresh_token;
        state.connectionData = action.payload;
        state.successMessage = action.payload.message;
        state.error = null;
      })
      .addCase(connectToZoom.rejected, (state, action) => {
        state.connecting = false;
        state.loading = false;
        state.connectionStatus = 'error';
        state.error = action.payload?.message || 'Failed to connect to Zoom';
        state.successMessage = null;
      })
      
      // Fetch Recordings
      .addCase(fetchZoomRecordings.pending, (state) => {
        state.fetchingRecordings = true;
        state.error = null;
      })
      .addCase(fetchZoomRecordings.fulfilled, (state, action) => {
        state.fetchingRecordings = false;
        state.recordings = action.payload.recordings;
        state.recordingsMetadata = {
          total: action.payload.total,
          pageCount: action.payload.page_count,
          from: action.payload.from,
          to: action.payload.to
        };
        state.lastRecordingsFetch = new Date().toISOString();
      })
      .addCase(fetchZoomRecordings.rejected, (state, action) => {
        state.fetchingRecordings = false;
        state.error = action.payload?.message || 'Failed to fetch recordings';
      })
      
      // Refresh Token
      .addCase(refreshZoomToken.pending, (state) => {
        state.refreshingToken = true;
      })
      .addCase(refreshZoomToken.fulfilled, (state, action) => {
        state.refreshingToken = false;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.lastTokenRefresh = new Date().toISOString();
        state.error = null;
      })
      .addCase(refreshZoomToken.rejected, (state, action) => {
        state.refreshingToken = false;
        state.isConnected = false;
        state.connectionStatus = 'disconnected';
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.connectionData = null;
        state.error = action.payload?.message || 'Token refresh failed';
      });
  }
});

// Export actions
export const {
  clearZoomError,
  clearZoomSuccess,
  clearZoomMessages,
  setConnectionStatus,
  disconnectZoom,
  hydrateZoomState,
  updateRecordings,
  addRecording
} = zoomSlice.actions;

// Selectors
export const selectZoom = (state) => state.zoom;
export const selectZoomConnection = (state) => state.zoom.isConnected;
export const selectZoomConnectionStatus = (state) => state.zoom.connectionStatus;
export const selectZoomUser = (state) => state.zoom.user;
export const selectZoomRecordings = (state) => state.zoom.recordings;
export const selectZoomRecordingsMetadata = (state) => state.zoom.recordingsMetadata;
export const selectZoomLoading = (state) => state.zoom.loading;
export const selectZoomError = (state) => state.zoom.error;
export const selectZoomSuccessMessage = (state) => state.zoom.successMessage;
export const selectZoomFetchingRecordings = (state) => state.zoom.fetchingRecordings;

export default zoomSlice.reducer;