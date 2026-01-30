import type { Meta, StoryObj } from '@storybook/react';
import { TaskStatusCard } from './TaskStatusCard';
import { ThemeProvider } from '../../theme/ThemeContext';
import { Space } from 'antd';

const meta: Meta<typeof TaskStatusCard> = {
  title: 'Components/TaskStatusCard',
  component: TaskStatusCard,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'select',
      options: ['pending', 'progress', 'started', 'success', 'failure', 'retry'],
    },
    cancelling: {
      control: 'boolean',
    },
    showClearButton: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof TaskStatusCard>;

export const Pending: Story = {
  args: {
    taskId: 'abc123-def456-ghi789-jkl012',
    status: 'pending',
    metadata: null,
    error: null,
    onCancel: (taskId) => console.log('Cancel:', taskId),
    onClear: () => console.log('Clear'),
  },
};

export const InProgress: Story = {
  args: {
    taskId: 'abc123-def456-ghi789-jkl012',
    status: 'progress',
    metadata: {
      current: 45,
      total: 100,
      status: 'Processing CSV files',
    },
    error: null,
    onCancel: (taskId) => console.log('Cancel:', taskId),
    onClear: () => console.log('Clear'),
  },
};

export const Started: Story = {
  args: {
    taskId: 'abc123-def456-ghi789-jkl012',
    status: 'started',
    metadata: {
      current: 0,
      total: 100,
      status: 'Initializing task',
    },
    error: null,
    onCancel: (taskId) => console.log('Cancel:', taskId),
    onClear: () => console.log('Clear'),
  },
};

export const Success: Story = {
  args: {
    taskId: 'abc123-def456-ghi789-jkl012',
    status: 'success',
    metadata: {
      current: 100,
      total: 100,
      status: 'Completed',
    },
    error: null,
    onCancel: undefined,
    onClear: () => console.log('Clear'),
  },
};

export const Failure: Story = {
  args: {
    taskId: 'abc123-def456-ghi789-jkl012',
    status: 'failure',
    metadata: {
      current: 67,
      total: 100,
      status: 'Failed at step 67',
    },
    error: 'Connection timeout while processing file: broker_data_20251119.csv. The S3 bucket may be unavailable.',
    onCancel: undefined,
    onClear: () => console.log('Clear'),
  },
};

export const Retry: Story = {
  args: {
    taskId: 'abc123-def456-ghi789-jkl012',
    status: 'retry',
    metadata: {
      current: 30,
      total: 100,
      status: 'Retrying after error',
    },
    error: null,
    onCancel: (taskId) => console.log('Cancel:', taskId),
    onClear: () => console.log('Clear'),
  },
};

export const Cancelling: Story = {
  args: {
    taskId: 'abc123-def456-ghi789-jkl012',
    status: 'progress',
    metadata: {
      current: 50,
      total: 100,
      status: 'Processing CSV files',
    },
    error: null,
    cancelling: true,
    onCancel: (taskId) => console.log('Cancel:', taskId),
    onClear: () => console.log('Clear'),
  },
};

export const WithoutClearButton: Story = {
  args: {
    taskId: 'abc123-def456-ghi789-jkl012',
    status: 'success',
    metadata: {
      current: 100,
      total: 100,
      status: 'Completed',
    },
    error: null,
    showClearButton: false,
    onClear: () => console.log('Clear'),
  },
};

export const LargeNumbers: Story = {
  args: {
    taskId: 'abc123-def456-ghi789-jkl012-mno345-pqr678',
    status: 'progress',
    metadata: {
      current: 1234567,
      total: 5000000,
      status: 'Processing rows',
    },
    error: null,
    onCancel: (taskId) => console.log('Cancel:', taskId),
    onClear: () => console.log('Clear'),
  },
};

export const AllStates: Story = {
  render: () => (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <TaskStatusCard
        taskId="task-pending-001"
        status="pending"
        onCancel={(id) => console.log('Cancel:', id)}
        onClear={() => console.log('Clear')}
      />
      <TaskStatusCard
        taskId="task-started-002"
        status="started"
        metadata={{ current: 0, total: 100, status: 'Initializing' }}
        onCancel={(id) => console.log('Cancel:', id)}
        onClear={() => console.log('Clear')}
      />
      <TaskStatusCard
        taskId="task-progress-003"
        status="progress"
        metadata={{ current: 45, total: 100, status: 'Processing files' }}
        onCancel={(id) => console.log('Cancel:', id)}
        onClear={() => console.log('Clear')}
      />
      <TaskStatusCard
        taskId="task-success-004"
        status="success"
        metadata={{ current: 100, total: 100, status: 'Completed' }}
        onClear={() => console.log('Clear')}
      />
      <TaskStatusCard
        taskId="task-failure-005"
        status="failure"
        metadata={{ current: 67, total: 100, status: 'Failed' }}
        error="Connection timeout"
        onClear={() => console.log('Clear')}
      />
      <TaskStatusCard
        taskId="task-retry-006"
        status="retry"
        metadata={{ current: 30, total: 100, status: 'Retrying' }}
        onCancel={(id) => console.log('Cancel:', id)}
        onClear={() => console.log('Clear')}
      />
    </Space>
  ),
};

