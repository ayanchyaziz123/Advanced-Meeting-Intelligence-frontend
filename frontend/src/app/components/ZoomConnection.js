'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  initiateZoomAuth,
  handleZoomCallback,
  getZoomConnectionStatus,
  disconnectZoom,
  refreshZoomToken,
  clearMessages,
  setShowConnectionModal,
  setShowDisconnectModal,
  selectZoomIsConnected,
  selectZoomConnectionStatus,
  selectZoomUserInfo,
  selectZoomAuthUrl,
  selectZoomLoading,
  selectZoomError,
  selectZoomSuccessMessage,
  selectZoomShowConnectionModal,
  selectZoomShowDisconnectModal,
  selectZoomConnectionDisplay,
  selectIsZoomTokenExpired,
  selectZoomTokenExpiry,
} from '../../redux/auth/zoomSlice'; // Adjust import path as needed

/**
 * ZoomConnection Component
 * 
 * A comprehensive Zoom integration component that provides:
 * - Connection status display
 * - OAuth authentication flow
 * - Connection/disconnection management
 * - Token refresh handling
 * - Modal interfaces for user interactions
 * 
 * @param {Object} props - Component props
 * @param {Function} [props.onConnectionChange] - Callback when connection status changes
 * @param {Function} [props.onError] - Callback when an error occurs
 * @param {Function} [props.onSuccess] - Callback when an action succeeds
 * @param {boolean} [props.showAsModal] - Whether to show as a modal or inline
 * @param {boolean} [props.autoCheckStatus] - Whether to automatically check connection status on mount
 * @param {string} [props.redirectUri] - Custom redirect URI for OAuth
 */
const ZoomConnection = ({
  onConnectionChange,
  onError,
  onSuccess,
  showAsModal = false,
  autoCheckStatus = true,
  redirectUri,
}) => {
  const dispatch = useDispatch();
  
  // Redux state
  const isConnected = useSelector(selectZoomIsConnected);
  const connectionStatus = useSelector(selectZoomConnectionStatus);
  const userInfo = useSelector(selectZoomUserInfo);
  const authUrl = useSelector(selectZoomAuthUrl);
  const loading = useSelector(selectZoomLoading);
  const error = useSelector(selectZoomError);
  const successMessage = useSelector(selectZoomSuccessMessage);
  const showConnectionModal = useSelector(selectZoomShowConnectionModal);
  const showDisconnectModal = useSelector(selectZoomShowDisconnectModal);
  const connectionDisplay = useSelector(selectZoomConnectionDisplay);
  const isTokenExpired = useSelector(selectIsZoomTokenExpired);
  const tokenExpiry = useSelector(selectZoomTokenExpiry);

  // Local state
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Check connection status on component mount
  useEffect(() => {
    if (autoCheckStatus && isInitialLoad) {
      dispatch(getZoomConnectionStatus()).finally(() => {
        setIsInitialLoad(false);
      });
    }
  }, [dispatch, autoCheckStatus, isInitialLoad]);

  // Handle URL parameters for OAuth callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const error = urlParams.get('error');

    if (code && state) {
      dispatch(handleZoomCallback({ code, state }));
      // Clean up URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (error) {
      dispatch(clearMessages());
      // Handle OAuth error
      console.error('Zoom OAuth error:', error);
    }
  }, [dispatch]);

  // Handle auth URL redirect
  useEffect(() => {
    if (authUrl) {
      window.location.href = authUrl;
    }
  }, [authUrl]);

  // Clear messages after 5 seconds
  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => {
        dispatch(clearMessages());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error, dispatch]);

  // Notify parent component of connection changes
  useEffect(() => {
    if (onConnectionChange) {
      onConnectionChange(isConnected, connectionStatus, userInfo);
    }
  }, [isConnected, connectionStatus, userInfo, onConnectionChange]);

  // Notify parent component of errors
  useEffect(() => {
    if (error && onError) {
      onError(error);
    }
  }, [error, onError]);

  // Notify parent component of success
  useEffect(() => {
    if (successMessage && onSuccess) {
      onSuccess(successMessage);
    }
  }, [successMessage, onSuccess]);

  // Auto-refresh token if expired
  useEffect(() => {
    if (isConnected && isTokenExpired) {
      dispatch(refreshZoomToken());
    }
  }, [isConnected, isTokenExpired, dispatch]);

  const handleConnect = () => {
    dispatch(setShowConnectionModal(true));
  };

  const handleDisconnect = () => {
    dispatch(setShowDisconnectModal(true));
  };

  const handleConfirmConnect = () => {
    dispatch(initiateZoomAuth(redirectUri ? { redirectUri } : undefined));
  };

  const handleConfirmDisconnect = () => {
    dispatch(disconnectZoom());
  };

  const handleRefreshToken = () => {
    dispatch(refreshZoomToken());
  };

  const closeModals = () => {
    dispatch(setShowConnectionModal(false));
    dispatch(setShowDisconnectModal(false));
  };

  const formatTokenExpiry = (expiry) => {
    if (!expiry) return 'Unknown';
    const date = new Date(expiry);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const ConnectionStatus = () => (
    <div className="flex items-center space-x-3">
      <div className="flex items-center">
        <div className={`w-3 h-3 rounded-full mr-2 ${
          connectionDisplay.color === 'green' ? 'bg-green-400' :
          connectionDisplay.color === 'yellow' ? 'bg-yellow-400' :
          connectionDisplay.color === 'red' ? 'bg-red-400' :
          'bg-gray-400'
        }`}></div>
        <span className="text-sm font-medium text-gray-900">
          {connectionDisplay.status}
        </span>
      </div>
      <span className="text-sm text-gray-500">
        {connectionDisplay.message}
      </span>
    </div>
  );

  const ConnectionCard = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <svg className="h-8 w-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">Zoom Integration</h3>
            <p className="text-sm text-gray-500">Connect your Zoom account to create and manage meetings</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <ConnectionStatus />

        {isConnected && userInfo && (
          <div className="bg-gray-50 rounded-md p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Account Information</h4>
            <div className="space-y-1 text-sm text-gray-600">
              {userInfo.first_name && (
                <p><span className="font-medium">Name:</span> {userInfo.first_name} {userInfo.last_name}</p>
              )}
              {userInfo.email && (
                <p><span className="font-medium">Email:</span> {userInfo.email}</p>
              )}
              {userInfo.account_id && (
                <p><span className="font-medium">Account ID:</span> {userInfo.account_id}</p>
              )}
              {tokenExpiry && (
                <p><span className="font-medium">Token Expires:</span> {formatTokenExpiry(tokenExpiry)}</p>
              )}
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">{successMessage}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex space-x-3">
          {!isConnected ? (
            <button
              onClick={handleConnect}
              disabled={loading || connectionStatus === 'connecting'}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Connecting...
                </>
              ) : (
                <>
                  <svg className="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  Connect to Zoom
                </>
              )}
            </button>
          ) : (
            <>
              {isTokenExpired && (
                <button
                  onClick={handleRefreshToken}
                  disabled={loading}
                  className="inline-flex items-center px-3 py-2 border border-yellow-300 text-sm font-medium rounded-md text-yellow-700 bg-yellow-50 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh Token
                </button>
              )}
              <button
                onClick={handleDisconnect}
                disabled={loading}
                className="inline-flex items-center px-3 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                </svg>
                Disconnect
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  // If showing as modal, return modal component
  if (showAsModal) {
    return (
      <>
        {showConnectionModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={closeModals}></div>
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
              <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                      <svg className="h-6 w-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Connect to Zoom
                      </h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Connect your Zoom account to enable meeting creation and management. You'll be redirected to Zoom for secure authentication.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    onClick={handleConfirmConnect}
                    disabled={loading}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Connecting...' : 'Connect to Zoom'}
                  </button>
                  <button
                    type="button"
                    onClick={closeModals}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showDisconnectModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={closeModals}></div>
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
              <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Disconnect from Zoom
                      </h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Are you sure you want to disconnect from Zoom? This will remove access to your Zoom account and you'll need to reconnect to create meetings.
                        </p>
                        {userInfo && userInfo.email && (
                          <p className="mt-2 text-sm text-gray-700 font-medium">
                            Currently connected as: {userInfo.email}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    onClick={handleConfirmDisconnect}
                    disabled={loading}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Disconnecting...' : 'Disconnect'}
                  </button>
                  <button
                    type="button"
                    onClick={closeModals}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Return inline component
  return <ConnectionCard />;
};

// Simple button component for easy integration
export const ZoomConnectButton = ({ 
  onConnectionChange, 
  className = "",
  children = "Connect Zoom"
}) => {
  const dispatch = useDispatch();
  const isConnected = useSelector(selectZoomIsConnected);
  const loading = useSelector(selectZoomLoading);
  const connectionStatus = useSelector(selectZoomConnectionStatus);

  const handleClick = () => {
    if (isConnected) {
      dispatch(setShowDisconnectModal(true));
    } else {
      dispatch(setShowConnectionModal(true));
    }
  };

  useEffect(() => {
    dispatch(getZoomConnectionStatus());
  }, [dispatch]);

  const defaultClassName = isConnected 
    ? "inline-flex items-center px-4 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
    : "inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500";

  return (
    <>
      <button
        onClick={handleClick}
        disabled={loading || connectionStatus === 'connecting'}
        className={className || defaultClassName}
      >
        <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        {loading ? (
          connectionStatus === 'connecting' ? 'Connecting...' : 'Loading...'
        ) : isConnected ? (
          'Disconnect Zoom'
        ) : (
          children
        )}
      </button>
      <ZoomConnection showAsModal={true} onConnectionChange={onConnectionChange} />
    </>
  );
};

// Status indicator component
export const ZoomConnectionStatus = ({ showDetails = false }) => {
  const dispatch = useDispatch();
  const isConnected = useSelector(selectZoomIsConnected);
  const connectionDisplay = useSelector(selectZoomConnectionDisplay);
  const userInfo = useSelector(selectZoomUserInfo);
  const isTokenExpired = useSelector(selectIsZoomTokenExpired);

  useEffect(() => {
    dispatch(getZoomConnectionStatus());
  }, [dispatch]);

  return (
    <div className="flex items-center space-x-2">
      <div className={`w-2 h-2 rounded-full ${
        connectionDisplay.color === 'green' ? 'bg-green-400' :
        connectionDisplay.color === 'yellow' ? 'bg-yellow-400' :
        connectionDisplay.color === 'red' ? 'bg-red-400' :
        'bg-gray-400'
      }`}></div>
      <span className="text-sm text-gray-600">
        {connectionDisplay.status}
      </span>
      {showDetails && isConnected && userInfo && (
        <span className="text-xs text-gray-500">
          ({userInfo.email || userInfo.first_name})
        </span>
      )}
      {isTokenExpired && (
        <span className="text-xs text-yellow-600 font-medium">
          Token Expired
        </span>
      )}
    </div>
  );
};

export default ZoomConnection;