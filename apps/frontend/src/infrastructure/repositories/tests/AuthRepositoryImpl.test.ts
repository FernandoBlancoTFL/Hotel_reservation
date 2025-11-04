import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthRepositoryImpl } from '../AuthRepositoryImpl';
import type { ApiClient } from '../../api/ApiClient';

describe('AuthRepositoryImpl', () => {
  let mockApiClient: ApiClient;
  let authRepository: AuthRepositoryImpl;

  beforeEach(() => {
    mockApiClient = {
      post: vi.fn(),
      get: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    } as any;
    authRepository = new AuthRepositoryImpl(mockApiClient);
  });

  it('should login successfully', async () => {
    const mockResponse = {
      user: {
        id: '123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'GUEST',
      },
      token: 'mock-token',
    };

    vi.mocked(mockApiClient.post).mockResolvedValue(mockResponse);

    const result = await authRepository.login('test@example.com', 'password123');

    expect(mockApiClient.post).toHaveBeenCalledWith('/auth/login', {
      email: 'test@example.com',
      password: 'password123',
    });
    expect(result).toEqual(mockResponse);
  });

  it('should register successfully', async () => {
    const mockResponse = {
      user: {
        id: '123',
        email: 'new@example.com',
        name: 'New User',
        role: 'GUEST',
      },
      token: 'mock-token',
    };

    const registerData = {
      email: 'new@example.com',
      password: 'password123',
      name: 'New User',
      phone: '+1234567890',
      documentId: '12345678',
      role: 'GUEST' as const,
    };

    vi.mocked(mockApiClient.post).mockResolvedValue(mockResponse);

    const result = await authRepository.register(registerData);

    expect(mockApiClient.post).toHaveBeenCalledWith('/auth/register', registerData);
    expect(result).toEqual(mockResponse);
  });

  it('should handle login error', async () => {
    vi.mocked(mockApiClient.post).mockRejectedValue(new Error('Invalid credentials'));

    await expect(
      authRepository.login('wrong@example.com', 'wrongpass')
    ).rejects.toThrow('Invalid credentials');
  });
});