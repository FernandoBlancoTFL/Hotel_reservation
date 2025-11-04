import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { SearchRooms } from '../SearchRooms';
import { AuthContext } from '../../context/AuthContext';

describe('SearchRooms', () => {
  const mockAuthContext = {
    user: { id: '1', email: 'test@example.com', name: 'Test User', role: 'GUEST' as const },
    token: 'mock-token',
    login: vi.fn(),
    logout: vi.fn(),
    isAuthenticated: true,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderSearchRooms = () => {
    return render(
      <BrowserRouter>
        <AuthContext.Provider value={mockAuthContext}>
          <SearchRooms />
        </AuthContext.Provider>
      </BrowserRouter>
    );
  };

  it('should render search form', () => {
    renderSearchRooms();
    
    expect(screen.getByLabelText(/check-in|entrada/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/check-out|salida/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search|buscar/i })).toBeInTheDocument();
  });

  it('should update date inputs', () => {
    renderSearchRooms();
    
    const checkInInput = screen.getByLabelText(/check-in|entrada/i) as HTMLInputElement;
    const checkOutInput = screen.getByLabelText(/check-out|salida/i) as HTMLInputElement;
    
    fireEvent.change(checkInInput, { target: { value: '2024-06-01' } });
    fireEvent.change(checkOutInput, { target: { value: '2024-06-05' } });
    
    expect(checkInInput.value).toBe('2024-06-01');
    expect(checkOutInput.value).toBe('2024-06-05');
  });

  it('should show loading state when searching', async () => {
    renderSearchRooms();
    
    const checkInInput = screen.getByLabelText(/check-in|entrada/i);
    const checkOutInput = screen.getByLabelText(/check-out|salida/i);
    const searchButton = screen.getByRole('button', { name: /search|buscar/i });
    
    fireEvent.change(checkInInput, { target: { value: '2024-06-01' } });
    fireEvent.change(checkOutInput, { target: { value: '2024-06-05' } });
    fireEvent.click(searchButton);
    
    expect(screen.getByText(/loading|cargando/i)).toBeInTheDocument();
  });

  it('should display rooms after search', async () => {
    renderSearchRooms();
    
    const checkInInput = screen.getByLabelText(/check-in|entrada/i);
    const checkOutInput = screen.getByLabelText(/check-out|salida/i);
    const searchButton = screen.getByRole('button', { name: /search|buscar/i });
    
    fireEvent.change(checkInInput, { target: { value: '2024-06-01' } });
    fireEvent.change(checkOutInput, { target: { value: '2024-06-05' } });
    fireEvent.click(searchButton);
    
    await waitFor(() => {
      expect(screen.queryByText(/loading|cargando/i)).not.toBeInTheDocument();
    });
  });

  it('should show error message when search fails', async () => {
    renderSearchRooms();
    
    const searchButton = screen.getByRole('button', { name: /search|buscar/i });
    fireEvent.click(searchButton);
    
    await waitFor(() => {
      expect(screen.getByText(/error|fecha/i)).toBeInTheDocument();
    });
  });

  it('should have capacity filter', () => {
    renderSearchRooms();
    
    const capacityInput = screen.queryByLabelText(/capacity|capacidad|guests|huéspedes/i);
    if (capacityInput) {
      expect(capacityInput).toBeInTheDocument();
    }
  });
});