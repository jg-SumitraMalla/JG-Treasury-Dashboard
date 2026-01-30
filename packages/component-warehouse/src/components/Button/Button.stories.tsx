import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';
import { Space } from 'antd';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['default', 'primary', 'dashed', 'link', 'text'],
    },
    size: {
      control: 'select',
      options: ['small', 'middle', 'large'],
    },
    shape: {
      control: 'select',
      options: ['default', 'circle', 'round'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: 'Default Button',
  },
};

export const Primary: Story = {
  args: {
    type: 'primary',
    children: 'Primary Button',
  },
};

export const Types: Story = {
  render: () => (
    <Space wrap>
      <Button type="primary">Primary</Button>
      <Button>Default</Button>
      <Button type="dashed">Dashed</Button>
      <Button type="text">Text</Button>
      <Button type="link">Link</Button>
    </Space>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Space wrap>
      <Button type="primary" size="large">
        Large
      </Button>
      <Button type="primary" size="middle">
        Middle
      </Button>
      <Button type="primary" size="small">
        Small
      </Button>
    </Space>
  ),
};

export const Shapes: Story = {
  render: () => (
    <Space wrap>
      <Button type="primary" shape="default">
        Default
      </Button>
      <Button type="primary" shape="round">
        Round
      </Button>
      <Button type="primary" shape="circle">
        A
      </Button>
    </Space>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Space wrap>
      <Button type="primary" disabled>
        Primary Disabled
      </Button>
      <Button disabled>Default Disabled</Button>
    </Space>
  ),
};

export const Loading: Story = {
  render: () => (
    <Space wrap>
      <Button type="primary" loading>
        Loading
      </Button>
      <Button type="primary" loading>
        Click me
      </Button>
    </Space>
  ),
};
