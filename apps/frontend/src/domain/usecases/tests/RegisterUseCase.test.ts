import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RegisterUseCase } from '../RegisterUseCase';
import type { AuthRepository } from '../../repositories/AuthRepository';

describe('RegisterUseCase', () => {
  let mockAuthRepository: AuthRepository;
  let registerUseCase: RegisterUseCase;

  beforeEach(() => {
    mockAuthRepository = {
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
    };
    registerUseCase = new RegisterUseCase(mockAuthRepository);
  });

  it('should register user successfully', async () => {
    const mockResponse = {
      user: {
        id: '123',
        email: 'new@example.com',
        name: 'New User',
        role: 'GUEST' as const,
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

    vi.mocked(mockAuthRepository.register).mockResolvedValue(mockResponse);

    const result = await registerUseCase.execute(registerData);

    expect(mockAuthRepository.register).toHaveBeenCalledWith(registerData);
    expect(result).toEqual(mockResponse);
  });

  it('should throw error when email already exists', async () => {
    const registerData = {
      email: 'existing@example.com',
      password: 'password123',
      name: 'User',
      phone: '+1234567890',
      documentId: '12345678',
      role: 'GUEST' as const,
    };

    vi.mocked(mockAuthRepository.register).mockRejectedValue(
      new Error('Email already exists')
    );

    await expect(registerUseCase.execute(registerData)).rejects.toThrow('Email already exists');
  });
});