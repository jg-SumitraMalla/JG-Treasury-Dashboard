import type { Meta, StoryObj } from '@storybook/react';
import { ThemeToggle } from './ThemeToggle';
import { ThemeProvider } from '../../theme/ThemeContext';
import { Card, Space } from 'antd';

const meta: Meta<typeof ThemeToggle> = {
  title: 'Components/ThemeToggle',
  component: ThemeToggle,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ThemeToggle>;

export const Default: Story = {
  render: () => <ThemeToggle />,
};

export const WithLabel: Story = {
  render: () => <ThemeToggle showLabel />,
};

export const InHeader: Story = {
  render: () => (
    <Card
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <span>Application Header</span>
      <ThemeToggle />
    </Card>
  ),
};

export const MultipleInstances: Story = {
  render: () => (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Card>
        <Space>
          <span>Theme Toggle 1:</span>
          <ThemeToggle />
        </Space>
      </Card>
      <Card>
        <Space>
          <span>Theme Toggle 2:</span>
          <ThemeToggle showLabel />
        </Space>
      </Card>
      <Card>
        <p>All toggles are synchronized through the ThemeContext.</p>
        <p>Click any toggle to see the theme change across all instances.</p>
      </Card>
    </Space>
  ),
};
