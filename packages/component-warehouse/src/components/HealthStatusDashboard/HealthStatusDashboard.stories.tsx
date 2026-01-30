import type { Meta, StoryObj } from '@storybook/react';
import { HealthStatusDashboard } from './HealthStatusDashboard';
import { ThemeProvider } from '../../theme/ThemeContext';
import { Space, Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

const meta: Meta<typeof HealthStatusDashboard> = {
  title: 'Components/HealthStatusDashboard',
  component: HealthStatusDashboard,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
A health status dashboard component that displays the health, readiness, and liveness status of the FastAPI server.

### Endpoints Displayed

**FastAPI Server (Port 8000)**
- \`/healthz\` - Comprehensive health check (API, DB, Cache, Celery)
- \`/readyz\` - Readiness check (database connection)
- \`/livez\` - Liveness check (simple alive response)

### Usage
\`\`\`tsx
import { HealthStatusDashboard } from '@apac-ui-warehouse/component-warehouse';

<HealthStatusDashboard
  fastApiHealth={fastApiHealthData}
  fastApiReady={fastApiReadyData}
  fastApiLive={fastApiLiveData}
/>
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    loading: {
      control: 'boolean',
      description: 'Show loading state',
    },
    error: {
      control: 'text',
      description: 'Error message to display',
    },
  },
};

export default meta;
type Story = StoryObj<typeof HealthStatusDashboard>;

// Sample data for different states
const healthyFastApiHealth = {
  status: 'healthy' as const,
  components: {
    api: 'ok',
    database: 'ok',
    security_cache: 'ok (150000 records)',
    celery: 'ok (2 workers)',
  },
};

const healthyFastApiReady = {
  status: 'ready' as const,
  database: 'connected',
};

const healthyFastApiLive = {
  status: 'alive' as const,
};

// Degraded state data
const degradedFastApiHealth = {
  status: 'degraded' as const,
  components: {
    api: 'ok',
    database: 'ok',
    security_cache: 'not_loaded',
    celery: 'no_workers',
  },
};

// Not ready state data
const notReadyFastApiReady = {
  status: 'not_ready' as const,
  database: 'not_connected',
};

export const AllHealthy: Story = {
  args: {
    fastApiHealth: healthyFastApiHealth,
    fastApiReady: healthyFastApiReady,
    fastApiLive: healthyFastApiLive,
  },
};

export const Degraded: Story = {
  args: {
    fastApiHealth: degradedFastApiHealth,
    fastApiReady: healthyFastApiReady,
    fastApiLive: healthyFastApiLive,
  },
};

export const NotReady: Story = {
  args: {
    fastApiHealth: healthyFastApiHealth,
    fastApiReady: notReadyFastApiReady,
    fastApiLive: healthyFastApiLive,
  },
};

export const Loading: Story = {
  args: {
    loading: true,
  },
};

export const WithError: Story = {
  args: {
    fastApiHealth: healthyFastApiHealth,
    fastApiReady: healthyFastApiReady,
    fastApiLive: healthyFastApiLive,
    error: 'Failed to connect to health endpoint',
  },
};

export const InteractiveDemo: Story = {
  render: () => {
    return (
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div style={{ marginBottom: 16 }}>
          <Button type="primary" icon={<ReloadOutlined />}>
            Refresh Health Status
          </Button>
        </div>
        <HealthStatusDashboard
          fastApiHealth={healthyFastApiHealth}
          fastApiReady={healthyFastApiReady}
          fastApiLive={healthyFastApiLive}
        />
      </Space>
    );
  },
};

export const AllStates: Story = {
  render: () => (
    <Space direction="vertical" size={48} style={{ width: '100%' }}>
      <div>
        <h3 style={{ marginBottom: 16 }}>All Healthy</h3>
        <HealthStatusDashboard
          fastApiHealth={healthyFastApiHealth}
          fastApiReady={healthyFastApiReady}
          fastApiLive={healthyFastApiLive}
        />
      </div>
      
      <div>
        <h3 style={{ marginBottom: 16 }}>Degraded</h3>
        <HealthStatusDashboard
          fastApiHealth={degradedFastApiHealth}
          fastApiReady={healthyFastApiReady}
          fastApiLive={healthyFastApiLive}
        />
      </div>
      
      <div>
        <h3 style={{ marginBottom: 16 }}>Not Ready</h3>
        <HealthStatusDashboard
          fastApiHealth={healthyFastApiHealth}
          fastApiReady={notReadyFastApiReady}
          fastApiLive={healthyFastApiLive}
        />
      </div>
    </Space>
  ),
};
