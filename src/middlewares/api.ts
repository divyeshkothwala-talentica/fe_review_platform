import { Middleware } from 'redux';
import { apiService } from '../services/api';
import { IApiCall } from '../common/interface';

export const CALL_API = 'CALL_API';

const apiMiddleware: Middleware = (store) => (next) => async (action: any) => {
  const callAPI = action[CALL_API];
  
  if (typeof callAPI === 'undefined') {
    return next(action);
  }

  const { types, url, method, data } = callAPI as IApiCall;
  const [requestType, successType, failureType] = types;
  
  // Prevent books API calls when there's an authentication error
  const state = store.getState();
  const authState = state.auth;
  if (url.includes('/books') && authState?.error && !authState?.data?.isAuthenticated) {
    console.log('Blocking books API call due to auth error:', url);
    return; // Don't proceed with the API call
  }

  // Dispatch request action
  next({
    type: requestType,
    ...action.actionData,
  });

  try {
    let response;
    
    switch (method) {
      case 'GET':
        response = await apiService.getFullUrl(url, data);
        break;
      case 'POST':
        response = await apiService.post(url, data);
        break;
      case 'PUT':
        response = await apiService.put(url, data);
        break;
      case 'DELETE':
        response = await apiService.delete(url);
        break;
      default:
        throw new Error(`Unsupported method: ${method}`);
    }

    // Dispatch success action
    return next({
      type: successType,
      response,
      ...action.actionData,
    });
  } catch (error: any) {
    // Extract detailed error information from server response
    let errorMessage = action.actionData?.errorMessage || 'An error occurred';
    let errorStatusCode = 'UNKNOWN_ERROR';
    
    // Handle different error response structures
    if (error.response) {
      errorStatusCode = error.response.status;
      
      // Try to extract message from different possible response structures
      if (error.response.data) {
        if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.error) {
          errorMessage = error.response.data.error;
        } else if (error.response.data.errors && Array.isArray(error.response.data.errors)) {
          errorMessage = error.response.data.errors.join(', ');
        } else if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        }
      }
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    // Dispatch failure action
    return next({
      type: failureType,
      error: {
        errorMessage,
        errorStatusCode,
        message: errorMessage, // Additional field for component access
        ...error.response?.data, // Include original response data
      },
      ...action.actionData,
    });
  }
};

export default apiMiddleware;
