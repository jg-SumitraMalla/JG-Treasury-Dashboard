import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';
import { Space } from 'antd';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['default', 'small'],
    },
    bordered: {
      control: 'boolean',
    },
    hoverable: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    title: 'Default Card',
    children: 'This is a default card with some content.',
  },
};

export const WithExtra: Story = {
  args: {
    title: 'Card with Extra',
    extra: <a href="#">More</a>,
    children: 'This card has an extra action in the header.',
  },
};

export const Bordered: Story = {
  args: {
    title: 'Bordered Card',
    bordered: true,
    children: 'This card has a border.',
  },
};

export const Hoverable: Story = {
  args: {
    title: 'Hoverable Card',
    hoverable: true,
    children: 'Hover over this card to see the effect.',
  },
};

export const Small: Story = {
  args: {
    title: 'Small Card',
    size: 'small',
    children: 'This is a small sized card.',
  },
};

export const WithActions: Story = {
  render: () => (
    <Card title="Card with Actions" actions={[<a key="edit">Edit</a>, <a key="more">More</a>]}>
      <p>Card content</p>
      <p>Card content</p>
      <p>Card content</p>
    </Card>
  ),
};

export const Grid: Story = {
  render: () => (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      <Card title="Card Grid" style={{ width: 300 }}>
        <p>Card content</p>
        <p>Card content</p>
        <p>Card content</p>
      </Card>
      <Card title="Card Grid" style={{ width: 300 }}>
        <p>Card content</p>
        <p>Card content</p>
        <p>Card content</p>
      </Card>
    </Space>
  ),
};

export const Loading: Story = {
  args: {
    title: 'Loading Card',
    loading: true,
    children: 'This card is in a loading state.',
  },
};
