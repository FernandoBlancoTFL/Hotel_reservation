import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Register } from '../Register';
import { AuthContext } from '../../context/AuthContext';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Register', () => {
  const mockRegister = vi.fn();
  const mockAuthContext = {
    user: null,
    token: null,
    login: vi.fn(),
    logout: vi.fn(),
    register: mockRegister,
    isAuthenticated: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderRegister = () => {
    return render(
      <BrowserRouter>
        <AuthContext.Provider value={mockAuthContext}>
          <Register />
        </AuthContext.Provider>
      </BrowserRouter>
    );
  };

  it('should render register form', () => {
    renderRegister();
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/name|nombre/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register|registrarse/i })).toBeInTheDocument();
  });

  it('should update form fields', () => {
    renderRegister();
    
    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    const nameInput = screen.getByLabelText(/name|nombre/i) as HTMLInputElement;
    
    fireEvent.change(emailInput, { target: { value: 'new@example.com' } });
    fireEvent.change(nameInput, { target: { value: 'New User' } });
    
    expect(emailInput.value).toBe('new@example.com');
    expect(nameInput.value).toBe('New User');
  });

  it('should call register function on form submit', async () => {
    mockRegister.mockResolvedValue({
      user: { id: '1', email: 'new@example.com', name: 'New User', role: 'GUEST' },
      token: 'mock-token',
    });

    renderRegister();
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const nameInput = screen.getByLabelText(/name|nombre/i);
    const phoneInput = screen.getByLabelText(/phone|teléfono/i);
    const documentInput = screen.getByLabelText(/document|documento/i);
    const submitButton = screen.getByRole('button', { name: /register|registrarse/i });
    
    fireEvent.change(emailInput, { target: { value: 'new@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(nameInput, { target: { value: 'New User' } });
    fireEvent.change(phoneInput, { target: { value: '+1234567890' } });
    fireEvent.change(documentInput, { target: { value: '12345678' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalled();
    });
  });

  it('should show error message on registration failure', async () => {
    mockRegister.mockRejectedValue(new Error('Email already exists'));

    renderRegister();
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const nameInput = screen.getByLabelText(/name|nombre/i);
    const phoneInput = screen.getByLabelText(/phone|teléfono/i);
    const documentInput = screen.getByLabelText(/document|documento/i);
    const submitButton = screen.getByRole('button', { name: /register|registrarse/i });
    
    fireEvent.change(emailInput, { target: { value: 'existing@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(nameInput, { target: { value: 'User' } });
    fireEvent.change(phoneInput, { target: { value: '+1234567890' } });
    fireEvent.change(documentInput, { target: { value: '12345678' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/email already exists|el email ya existe/i)).toBeInTheDocument();
    });
  });

  it('should have link to login page', () => {
    renderRegister();
    
    const loginLink = screen.getByRole('link', { name: /login|iniciar sesión/i });
    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute('href', '/login');
  });
});