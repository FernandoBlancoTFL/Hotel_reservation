import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LoginUseCase } from '../LoginUseCase';
import type { AuthRepository } from '../../repositories/AuthRepository';

describe('LoginUseCase', () => {
  let mockAuthRepository: AuthRepository;
  let loginUseCase: LoginUseCase;

  beforeEach(() => {
    mockAuthRepository = {
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
    };
    loginUseCase = new LoginUseCase(mockAuthRepository);
  });

  it('should login successfully with valid credentials', async () => {
    const mockResponse = {
      user: {
        id: '123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'GUEST' as const,
      },
      token: 'mock-token',
    };

    vi.mocked(mockAuthRepository.login).mockResolvedValue(mockResponse);

    const result = await loginUseCase.execute('test@example.com', 'password123');

    expect(mockAuthRepository.login).toHaveBeenCalledWith('test@example.com', 'password123');
    expect(result).toEqual(mockResponse);
  });

  it('should throw error with invalid credentials', async () => {
    vi.mocked(mockAuthRepository.login).mockRejectedValue(new Error('Invalid credentials'));

    await expect(
      loginUseCase.execute('wrong@example.com', 'wrongpass')
    ).rejects.toThrow('Invalid credentials');
  });

  it('should throw error with empty email', async () => {
    await expect(
      loginUseCase.execute('', 'password123')
    ).rejects.toThrow();
  });

  it('should throw error with empty password', async () => {
    await expect(
      loginUseCase.execute('test@example.com', '')
    ).rejects.toThrow();
  });
});