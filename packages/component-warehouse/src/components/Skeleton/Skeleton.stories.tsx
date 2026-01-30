import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton, SkeletonButton, SkeletonInput, SkeletonImage, SkeletonAvatar } from './Skeleton';
import { Card } from '../Card';
import { Layout, LayoutItem } from '../Layout';
import { Space } from 'antd';

const meta: Meta<typeof Skeleton> = {
  title: 'Components/Skeleton',
  component: Skeleton,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    active: {
      control: 'boolean',
      description: 'Show animation effect',
    },
    loading: {
      control: 'boolean',
      description: 'Display skeleton when true',
    },
    paragraph: {
      control: 'object',
      description: 'Paragraph skeleton configuration',
    },
    title: {
      control: 'object',
      description: 'Title skeleton configuration',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Default: Story = {
  args: {
    active: true,
  },
};

export const WithTitle: Story = {
  args: {
    active: true,
    title: true,
    paragraph: { rows: 4 },
  },
};

export const WithAvatar: Story = {
  args: {
    active: true,
    avatar: true,
    paragraph: { rows: 4 },
  },
};

export const CustomRows: Story = {
  args: {
    active: true,
    title: { width: '60%' },
    paragraph: { rows: 6 },
  },
};

export const InCard: Story = {
  render: () => (
    <Card title="Loading Content">
      <Skeleton active paragraph={{ rows: 4 }} />
    </Card>
  ),
};

export const MultipleCards: Story = {
  render: () => (
    <Layout gap={16}>
      <LayoutItem span={4}>
        <Card>
          <Skeleton active paragraph={{ rows: 3 }} />
        </Card>
      </LayoutItem>
      <LayoutItem span={4}>
        <Card>
          <Skeleton active paragraph={{ rows: 3 }} />
        </Card>
      </LayoutItem>
      <LayoutItem span={4}>
        <Card>
          <Skeleton active paragraph={{ rows: 3 }} />
        </Card>
      </LayoutItem>
    </Layout>
  ),
};

export const ButtonSkeleton: Story = {
  render: () => (
    <Space>
      <SkeletonButton active />
      <SkeletonButton active block />
    </Space>
  ),
};

export const InputSkeleton: Story = {
  render: () => (
    <Space direction="vertical" style={{ width: '100%' }}>
      <SkeletonInput active />
      <SkeletonInput active />
    </Space>
  ),
};

export const ImageSkeleton: Story = {
  render: () => (
    <Space>
      <SkeletonImage active />
    </Space>
  ),
};

export const AvatarSkeleton: Story = {
  render: () => (
    <Space>
      <SkeletonAvatar active />
      <SkeletonAvatar active />
      <SkeletonAvatar active />
    </Space>
  ),
};

