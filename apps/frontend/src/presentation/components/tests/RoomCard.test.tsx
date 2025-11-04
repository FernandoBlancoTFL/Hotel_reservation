import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RoomCard } from '../RoomCard';

describe('RoomCard', () => {
  const mockRoom = {
    id: '1',
    number: '101',
    type: 'SINGLE' as const,
    pricePerNight: 100,
    currency: 'USD',
    capacity: 1,
    amenities: ['WiFi', 'TV'],
  };

  it('should render room information', () => {
    render(<RoomCard room={mockRoom} />);
    
    expect(screen.getByText(/101/)).toBeInTheDocument();
    expect(screen.getByText(/SINGLE/)).toBeInTheDocument();
    expect(screen.getByText(/100/)).toBeInTheDocument();
    expect(screen.getByText(/WiFi/)).toBeInTheDocument();
    expect(screen.getByText(/TV/)).toBeInTheDocument();
  });

  it('should call onSelect when button is clicked', () => {
    const handleSelect = vi.fn();
    render(<RoomCard room={mockRoom} onSelect={handleSelect} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(handleSelect).toHaveBeenCalledWith(mockRoom);
  });

  it('should display capacity', () => {
    render(<RoomCard room={mockRoom} />);
    expect(screen.getByText(/1/)).toBeInTheDocument();
  });

  it('should render all amenities', () => {
    const roomWithManyAmenities = {
      ...mockRoom,
      amenities: ['WiFi', 'TV', 'MiniBar', 'AC'],
    };
    
    render(<RoomCard room={roomWithManyAmenities} />);
    
    expect(screen.getByText(/WiFi/)).toBeInTheDocument();
    expect(screen.getByText(/TV/)).toBeInTheDocument();
    expect(screen.getByText(/MiniBar/)).toBeInTheDocument();
    expect(screen.getByText(/AC/)).toBeInTheDocument();
  });

  it('should render without onSelect button', () => {
    render(<RoomCard room={mockRoom} />);
    const buttons = screen.queryAllByRole('button');
    expect(buttons.length).toBe(0);
  });
});