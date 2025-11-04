import type { Meta, StoryObj } from '@storybook/react';
import { Modal } from './Modal';
import { useState } from 'react';
import { Button } from '../Button/Button';

const meta: Meta<typeof Modal> = {
  title: 'Components/Modal',
  component: Modal,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const Default: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Modal Title">
          <p>This is the modal content. You can put anything here!</p>
        </Modal>
      </>
    );
  },
};

export const WithForm: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Form Modal</Button>
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Contact Form">
          <form>
            <input type="text" placeholder="Name" style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
            <input type="email" placeholder="Email" style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
            <textarea placeholder="Message" rows={4} style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
            <Button type="submit" fullWidth>
              Submit
            </Button>
          </form>
        </Modal>
      </>
    );
  },
};