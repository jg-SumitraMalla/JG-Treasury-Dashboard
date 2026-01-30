import type { Meta, StoryObj } from '@storybook/react';
import { Dropdown } from './Dropdown';
import { Button, Space, MenuProps, DropdownProps } from 'antd';
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import { colors } from '../../theme';

const meta: Meta<typeof Dropdown> = {
  title: 'Components/Dropdown',
  component: Dropdown,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    trigger: {
      control: 'select',
      options: ['click', 'hover', 'contextMenu'],
    },
    placement: {
      control: 'select',
      options: ['bottomLeft', 'bottomCenter', 'bottomRight', 'topLeft', 'topCenter', 'topRight'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

const items: MenuProps['items'] = [
  {
    key: '1',
    label: '1st menu item',
  },
  {
    key: '2',
    label: '2nd menu item',
  },
  {
    key: '3',
    label: '3rd menu item',
  },
];

export const Default: Story = {
  render: () => (
    <Dropdown menu={{ items }}>
      <Button>
        Hover me <DownOutlined />
      </Button>
    </Dropdown>
  ),
};

export const ClickTrigger: Story = {
  render: () => (
    <Dropdown menu={{ items }} trigger={['click']}>
      <Button>
        Click me <DownOutlined />
      </Button>
    </Dropdown>
  ),
};

export const ContextMenu: Story = {
  render: () => (
    <Dropdown menu={{ items }} trigger={['contextMenu']}>
      <div
        style={{
          padding: '50px',
          background: colors.bgDisabled,
          borderRadius: '4px',
          textAlign: 'center',
          color: colors.textPrimary,
        }}
      >
        Right click here
      </div>
    </Dropdown>
  ),
};

export const WithIcons: Story = {
  render: () => {
    const iconItems: MenuProps['items'] = [
      {
        key: '1',
        label: 'Profile',
        icon: <UserOutlined />,
      },
      {
        key: '2',
        label: 'Settings',
      },
      {
        key: '3',
        label: 'Logout',
        danger: true,
      },
    ];

    return (
      <Dropdown menu={{ items: iconItems }}>
        <Button>
          Menu with Icons <DownOutlined />
        </Button>
      </Dropdown>
    );
  },
};

export const Placements: Story = {
  render: () => {
    const placements: DropdownProps['placement'][] = [
      'topLeft',
      'topCenter',
      'topRight',
      'bottomLeft',
      'bottomCenter',
      'bottomRight',
    ];

    return (
      <Space direction="vertical" size="large">
        {placements.map((placement) => (
          <Dropdown key={placement} menu={{ items }} placement={placement}>
            <Button>
              {placement} <DownOutlined />
            </Button>
          </Dropdown>
        ))}
      </Space>
    );
  },
};

export const Disabled: Story = {
  render: () => (
    <Dropdown menu={{ items }} disabled>
      <Button disabled>
        Disabled Dropdown <DownOutlined />
      </Button>
    </Dropdown>
  ),
};

export const WithDivider: Story = {
  render: () => {
    const itemsWithDivider: MenuProps['items'] = [
      {
        key: '1',
        label: '1st menu item',
      },
      {
        key: '2',
        label: '2nd menu item',
      },
      {
        type: 'divider',
      },
      {
        key: '3',
        label: '3rd menu item',
        danger: true,
      },
    ];

    return (
      <Dropdown menu={{ items: itemsWithDivider }}>
        <Button>
          Menu with Divider <DownOutlined />
        </Button>
      </Dropdown>
    );
  },
};
