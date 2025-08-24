import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { ApiResponse, ApiError } from '../types';

class ApiService {
  private api: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
    
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error) => {
        if (error.response?.status === 401) {
          // Only auto-logout for auth-related endpoints, not for other protected resources
          const url = error.config?.url || '';
          const isAuthEndpoint = url.includes('/auth/') || url.includes('/users/profile');
          
          if (isAuthEndpoint) {
            // Token expired or invalid on auth endpoints
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            window.location.href = '/';
          }
          // For other endpoints (like favorites), let the component handle the error
        }
        return Promise.reject(error);
      }
    );
  }

  // Generic API methods
  public async get<T>(endpoint: string, params?: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.api.get(`/v1${endpoint}`, { params });
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Method for full URL requests (used by middleware)
  public async getFullUrl<T>(fullUrl: string, params?: any): Promise<ApiResponse<T>> {
    try {
      const token = localStorage.getItem('authToken');
      const headers: any = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      
      // Use axios directly without the configured baseURL to avoid duplication
      const response = await axios.get(fullUrl, { 
        params,
        timeout: 10000,
        headers
      });
      return response.data;
    } catch (error: any) {
      // Handle 401 errors more selectively for direct axios calls
      if (error.response?.status === 401) {
        const isAuthEndpoint = fullUrl.includes('/auth/') || fullUrl.includes('/users/profile');
        
        if (isAuthEndpoint) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          window.location.href = '/';
        }
      }
      throw this.handleError(error);
    }
  }

  public async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.api.post(`/v1${endpoint}`, data);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  public async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.api.put(`/v1${endpoint}`, data);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  public async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await this.api.delete(`/v1${endpoint}`);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): ApiError {
    if (error.response?.data) {
      return error.response.data;
    }
    
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: error.message || 'Network error occurred',
        timestamp: new Date().toISOString(),
        path: '',
        method: '',
      },
    };
  }

  // Health check
  public async healthCheck(): Promise<any> {
    try {
      const response = await this.api.get('/health');
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Get base URL for API calls
  public getBaseURL(): string {
    return this.baseURL + '/v1';
  }
}

export const apiService = new ApiService();

// Export getBase function for use in actions
export const getBase = (): string => {
  return process.env.REACT_APP_API_URL || 'http://localhost:8000';
};

export default apiService;
