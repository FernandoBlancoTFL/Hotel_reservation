import { User } from '../entities/User';

export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegisterDTO {
  email: string;
  password: string;
  name: string;
  phone: string;
  documentId: string;
  role: 'GUEST' | 'RECEPTIONIST' | 'ADMIN';
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface AuthRepository {
  login(credentials: LoginDTO): Promise<AuthResponse>;
  register(data: RegisterDTO): Promise<AuthResponse>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
}
