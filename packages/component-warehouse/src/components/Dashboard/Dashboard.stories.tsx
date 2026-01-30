import type { Meta, StoryObj } from '@storybook/react';
import { Dashboard } from './Dashboard';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../../theme/ThemeContext';

const meta: Meta<typeof Dashboard> = {
  title: 'Components/Dashboard',
  component: Dashboard,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ThemeProvider>
        <BrowserRouter>
          <Story />
        </BrowserRouter>
      </ThemeProvider>
    ),
  ],
  argTypes: {
    defaultCollapsed: {
      control: 'boolean',
      description: 'Whether the sidebar is collapsed by default',
    },
    defaultSelectedKey: {
      control: 'select',
      options: [
        '/homepage',
        '/treasury/pnl-dashboard',
        '/settings',
      ],
      description: 'Default selected menu item',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Dashboard>;

export const Default: Story = {
  args: {
    defaultCollapsed: false,
    defaultSelectedKey: '/homepage',
  },
};

export const Collapsed: Story = {
  args: {
    defaultCollapsed: true,
    defaultSelectedKey: '/homepage',
  },
};

export const WithTreasurySelected: Story = {
  args: {
    defaultCollapsed: false,
    defaultSelectedKey: '/treasury/ingest-manager',
  },
};

export const WithSettingsSelected: Story = {
  args: {
    defaultCollapsed: false,
    defaultSelectedKey: '/settings',
  },
};
