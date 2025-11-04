import { AuthRepository, LoginDTO, RegisterDTO, AuthResponse } from '@domain/repositories/AuthRepository';
import { User } from '@domain/entities/User';
import { apiClient } from '../api/apiClient';
import { TokenStorage } from '../storage/TokenStorage';

export class AuthRepositoryImpl implements AuthRepository {
  async login(credentials: LoginDTO): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/api/auth/login', credentials);
      
      TokenStorage.saveToken(response.token);
      TokenStorage.saveUser(response.user);
      
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al iniciar sesión');
    }
  }

  async register(data: RegisterDTO): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/api/auth/register', data);
      
      TokenStorage.saveToken(response.token);
      TokenStorage.saveUser(response.user);
      
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al registrarse');
    }
  }

  async logout(): Promise<void> {
    TokenStorage.clear();
  }

  async getCurrentUser(): Promise<User | null> {
    return TokenStorage.getUser<User>();
  }
}