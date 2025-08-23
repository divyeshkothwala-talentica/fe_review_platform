import { apiService } from './api';
import { LoginRequest, RegisterRequest, AuthResponse, User } from '../types';

class AuthService {
  private readonly TOKEN_KEY = 'authToken';
  private readonly USER_KEY = 'user';

  // Authentication API calls
  public async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await apiService.post<AuthResponse>('/auth/login', credentials);
      
      if (response.success && response.data) {
        this.setAuthData(response.data.token, response.data.user);
        return response.data;
      }
      
      throw new Error('Login failed');
    } catch (error: any) {
      throw error;
    }
  }

  public async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await apiService.post<AuthResponse>('/auth/register', userData);
      
      if (response.success && response.data) {
        this.setAuthData(response.data.token, response.data.user);
        return response.data;
      }
      
      throw new Error('Registration failed');
    } catch (error: any) {
      throw error;
    }
  }

  // Token management
  public setAuthData(token: string, user: User): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  public getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  public getUser(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        console.error('Error parsing user data:', error);
        this.clearAuthData();
        return null;
      }
    }
    return null;
  }

  public isAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.getUser();
    
    if (!token || !user) {
      return false;
    }

    // Check if token is expired (JWT tokens have exp field)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      
      if (payload.exp && payload.exp < currentTime) {
        this.clearAuthData();
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error validating token:', error);
      this.clearAuthData();
      return false;
    }
  }

  public logout(): void {
    this.clearAuthData();
  }

  private clearAuthData(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  // Auto-logout setup
  public setupAutoLogout(): void {
    const token = this.getToken();
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = payload.exp * 1000; // Convert to milliseconds
      const currentTime = Date.now();
      const timeUntilExpiration = expirationTime - currentTime;

      if (timeUntilExpiration > 0) {
        setTimeout(() => {
          this.logout();
          window.location.reload();
        }, timeUntilExpiration);
      } else {
        this.logout();
      }
    } catch (error) {
      console.error('Error setting up auto-logout:', error);
      this.logout();
    }
  }
}

export const authService = new AuthService();
export default authService;
