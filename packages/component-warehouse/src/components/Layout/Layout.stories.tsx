import type { Meta, StoryObj } from '@storybook/react';
import { Layout, LayoutItem } from './Layout';
import { Card, Skeleton } from 'antd';
import { Body } from '../Typography';

const meta: Meta<typeof Layout> = {
  title: 'Components/Layout',
  component: Layout,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    gap: {
      control: 'number',
      description: 'Gap between grid items (number or [x, y])',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Layout>;

// Helper component for demo cards
const DemoCard: React.FC<{ title: string; loading?: boolean }> = ({ title, loading = false }) => (
  <Card title={title} style={{ height: '100%' }}>
    {loading ? (
      <Skeleton active paragraph={{ rows: 4 }} />
    ) : (
      <div>
        <Body>This is a sample card content.</Body>
        <Body>It demonstrates the layout grid system.</Body>
      </div>
    )}
  </Card>
);

export const Default: Story = {
  render: () => (
    <Layout gap={16}>
      <LayoutItem span={12}>
        <DemoCard title="Full Width (12 columns)" />
      </LayoutItem>
      <LayoutItem span={6}>
        <DemoCard title="Half Width (6 columns)" />
      </LayoutItem>
      <LayoutItem span={6}>
        <DemoCard title="Half Width (6 columns)" />
      </LayoutItem>
    </Layout>
  ),
};

export const ThreeColumns: Story = {
  render: () => (
    <Layout gap={16}>
      <LayoutItem span={4}>
        <DemoCard title="4 Columns" />
      </LayoutItem>
      <LayoutItem span={4}>
        <DemoCard title="4 Columns" />
      </LayoutItem>
      <LayoutItem span={4}>
        <DemoCard title="4 Columns" />
      </LayoutItem>
    </Layout>
  ),
};

export const FourColumns: Story = {
  render: () => (
    <Layout gap={16}>
      <LayoutItem span={3}>
        <DemoCard title="3 Columns" />
      </LayoutItem>
      <LayoutItem span={3}>
        <DemoCard title="3 Columns" />
      </LayoutItem>
      <LayoutItem span={3}>
        <DemoCard title="3 Columns" />
      </LayoutItem>
      <LayoutItem span={3}>
        <DemoCard title="3 Columns" />
      </LayoutItem>
    </Layout>
  ),
};

export const MixedLayout: Story = {
  render: () => (
    <Layout gap={16}>
      <LayoutItem span={8}>
        <DemoCard title="8 Columns" />
      </LayoutItem>
      <LayoutItem span={4}>
        <DemoCard title="4 Columns" />
      </LayoutItem>
      <LayoutItem span={6}>
        <DemoCard title="6 Columns" />
      </LayoutItem>
      <LayoutItem span={6}>
        <DemoCard title="6 Columns" />
      </LayoutItem>
      <LayoutItem span={4}>
        <DemoCard title="4 Columns" />
      </LayoutItem>
      <LayoutItem span={4}>
        <DemoCard title="4 Columns" />
      </LayoutItem>
      <LayoutItem span={4}>
        <DemoCard title="4 Columns" />
      </LayoutItem>
    </Layout>
  ),
};

export const WithSkeletons: Story = {
  render: () => (
    <Layout gap={16}>
      <LayoutItem span={6}>
        <DemoCard title="Loading Card 1" loading />
      </LayoutItem>
      <LayoutItem span={6}>
        <DemoCard title="Loading Card 2" loading />
      </LayoutItem>
      <LayoutItem span={6}>
        <DemoCard title="Content Card" />
      </LayoutItem>
      <LayoutItem span={6}>
        <DemoCard title="Loading Card 3" loading />
      </LayoutItem>
      <LayoutItem span={12}>
        <DemoCard title="Wide Loading Card" loading />
      </LayoutItem>
      <LayoutItem span={12}>
        <DemoCard title="Wide Content Card" />
      </LayoutItem>
    </Layout>
  ),
};

export const ResponsiveLayout: Story = {
  render: () => (
    <Layout gap={16}>
      <LayoutItem span={12} xs={12} sm={6} md={4} lg={3}>
        <DemoCard title="Responsive 1" />
      </LayoutItem>
      <LayoutItem span={12} xs={12} sm={6} md={4} lg={3}>
        <DemoCard title="Responsive 2" />
      </LayoutItem>
      <LayoutItem span={12} xs={12} sm={6} md={4} lg={3}>
        <DemoCard title="Responsive 3" />
      </LayoutItem>
      <LayoutItem span={12} xs={12} sm={6} md={4} lg={3}>
        <DemoCard title="Responsive 4" />
      </LayoutItem>
    </Layout>
  ),
};

export const WithOffsets: Story = {
  render: () => (
    <Layout gap={16}>
      <LayoutItem span={6} offset={3}>
        <DemoCard title="Offset 3, Span 6" />
      </LayoutItem>
      <LayoutItem span={4} offset={2}>
        <DemoCard title="Offset 2, Span 4" />
      </LayoutItem>
      <LayoutItem span={8} offset={2}>
        <DemoCard title="Offset 2, Span 8" />
      </LayoutItem>
    </Layout>
  ),
};

export const DashboardLayout: Story = {
  render: () => (
    <Layout gap={16}>
      <LayoutItem span={12}>
        <Card title="Main Content Area" style={{ minHeight: 300 }}>
          <Skeleton active paragraph={{ rows: 6 }} />
        </Card>
      </LayoutItem>
      <LayoutItem span={12}>
        <Card title="Secondary Content" style={{ minHeight: 300 }}>
          <Skeleton active paragraph={{ rows: 4 }} />
        </Card>
      </LayoutItem>
      <LayoutItem span={4}>
        <Card title="Metric 1">
          <Skeleton active paragraph={{ rows: 2 }} />
        </Card>
      </LayoutItem>
      <LayoutItem span={4}>
        <Card title="Metric 2">
          <Skeleton active paragraph={{ rows: 2 }} />
        </Card>
      </LayoutItem>
      <LayoutItem span={4}>
        <Card title="Metric 3">
          <Skeleton active paragraph={{ rows: 2 }} />
        </Card>
      </LayoutItem>
    </Layout>
  ),
};

export const ComplexLayout: Story = {
  render: () => (
    <Layout gap={16}>
      <LayoutItem span={12}>
        <Card title="Header Section" style={{ minHeight: 150 }}>
          <Skeleton active avatar paragraph={{ rows: 2 }} />
        </Card>
      </LayoutItem>
      <LayoutItem span={12}>
        <Card title="Stats Section" style={{ minHeight: 150 }}>
          <Skeleton active paragraph={{ rows: 3 }} />
        </Card>
      </LayoutItem>
      <LayoutItem span={8}>
        <Card title="Left Sidebar" style={{ minHeight: 400 }}>
          <Skeleton active paragraph={{ rows: 8 }} />
        </Card>
      </LayoutItem>
      <LayoutItem span={4}>
        <Card title="Main Content" style={{ minHeight: 400 }}>
          <Skeleton active paragraph={{ rows: 10 }} />
        </Card>
      </LayoutItem>
      <LayoutItem span={3}>
        <Card title="Right Sidebar" style={{ minHeight: 400 }}>
          <Skeleton active paragraph={{ rows: 6 }} />
        </Card>
      </LayoutItem>
      <LayoutItem span={12}>
        <Card title="Footer Section">
          <Skeleton active paragraph={{ rows: 2 }} />
        </Card>
      </LayoutItem>
      <LayoutItem span={12}>
        <Card title="Footer Section">
          <Skeleton active paragraph={{ rows: 2 }} />
        </Card>
      </LayoutItem>
    </Layout>
  ),
};
