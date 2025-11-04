import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    children: <div>This is a card with some content</div>,
  },
};

export const Hoverable: Story = {
  args: {
    children: <div>Hover over me!</div>,
    hoverable: true,
  },
};

export const WithContent: Story = {
  args: {
    children: (
      <div>
        <h3>Card Title</h3>
        <p>This is some content inside the card</p>
      </div>
    ),
  },
};