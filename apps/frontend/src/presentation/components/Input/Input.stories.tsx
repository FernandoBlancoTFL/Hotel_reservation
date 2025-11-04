import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';
import { useState } from 'react';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return <Input value={value} onChange={setValue} placeholder="Enter text..." />;
  },
};

export const WithLabel: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return <Input label="Email" value={value} onChange={setValue} placeholder="email@example.com" />;
  },
};

export const Required: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return <Input label="Password" type="password" value={value} onChange={setValue} required />;
  },
};

export const WithError: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <Input
        label="Email"
        value={value}
        onChange={setValue}
        error="Invalid email format"
        placeholder="email@example.com"
      />
    );
  },
};

export const Disabled: Story = {
  render: () => {
    return <Input label="Disabled Input" value="Cannot edit" onChange={() => {}} disabled />;
  },
};