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
    // Dispatch failure action
    return next({
      type: failureType,
      error: {
        errorMessage: action.actionData?.errorMessage || 'An error occurred',
        errorStatusCode: error.error?.code || 'UNKNOWN_ERROR',
        ...error,
      },
      ...action.actionData,
    });
  }
};

export default apiMiddleware;
