import type { Meta, StoryObj } from '@storybook/react';
import { RoomCard } from './RoomCard';
import { Room } from '@domain/entities/Room';

const meta: Meta<typeof RoomCard> = {
  title: 'Components/RoomCard',
  component: RoomCard,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof RoomCard>;

const mockRoom: Room = {
  id: '1',
  number: '101',
  type: 'SINGLE',
  pricePerNight: 100,
  currency: 'USD',
  capacity: 1,
  amenities: ['WiFi', 'TV', 'MiniBar'],
};

export const Single: Story = {
  args: {
    room: mockRoom,
    onSelect: (room) => alert(`Selected room ${room.number}`),
  },
};

export const Double: Story = {
  args: {
    room: {
      ...mockRoom,
      number: '202',
      type: 'DOUBLE',
      capacity: 2,
      pricePerNight: 150,
    },
  },
};

export const Suite: Story = {
  args: {
    room: {
      ...mockRoom,
      number: '301',
      type: 'SUITE',
      capacity: 4,
      pricePerNight: 300,
      amenities: ['WiFi', 'TV', 'MiniBar', 'Jacuzzi', 'Balcony'],
    },
  },
};

export const WithoutAction: Story = {
  args: {
    room: mockRoom,
  },
};