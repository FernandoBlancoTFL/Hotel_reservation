import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@domain/entities/User';
import { AuthRepositoryImpl } from '@infrastructure/repositories/AuthRepositoryImpl';
import { LoginUseCase } from '@domain/usecases/auth/LoginUseCase';
import { RegisterUseCase } from '@domain/usecases/auth/RegisterUseCase';
import { LoginDTO, RegisterDTO } from '@domain/repositories/AuthRepository';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginDTO) => Promise<void>;
  register: (data: RegisterDTO) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const authRepository = new AuthRepositoryImpl();
  const loginUseCase = new LoginUseCase(authRepository);
  const registerUseCase = new RegisterUseCase(authRepository);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await authRepository.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (credentials: LoginDTO) => {
    const response = await loginUseCase.execute(credentials);
    setUser(response.user);
  };

  const register = async (data: RegisterDTO) => {
    const response = await registerUseCase.execute(data);
    setUser(response.user);
  };

  const logout = () => {
    authRepository.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};