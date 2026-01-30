import type { Meta, StoryObj } from '@storybook/react';
import { Tabs } from './Tabs';
import { Card } from '../Card';
import { BodyText } from '../Typography';
import { useState, useCallback } from 'react';
import type { TabsProps as AntTabsProps } from 'antd';
import { Button, Space, Dropdown, Typography } from 'antd';
import { CopyOutlined, MoreOutlined } from '@ant-design/icons';

const meta: Meta<typeof Tabs> = {
  title: 'Components/Tabs',
  component: Tabs,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['simple', 'editable'],
      description: 'Variant of tabs - simple or editable (with add/close)',
    },
    type: {
      control: 'select',
      options: ['line', 'card', 'editable-card'],
      description: 'Type of tabs',
    },
    size: {
      control: 'select',
      options: ['small', 'middle', 'large'],
    },
    
  },
};

export default meta;
type Story = StoryObj<typeof Tabs>;

// Simple tabs examples
const simpleItems: AntTabsProps['items'] = [
  {
    key: '1',
    label: 'Overview',
    children: (
      <Card>
        <BodyText>This is the Overview tab content.</BodyText>
        <BodyText>You can add any content here.</BodyText>
      </Card>
    ),
  },
  {
    key: '2',
    label: 'Details',
    children: (
      <Card>
        <BodyText>This is the Details tab content.</BodyText>
        <BodyText>More detailed information goes here.</BodyText>
      </Card>
    ),
  },
  {
    key: '3',
    label: 'Settings',
    children: (
      <Card>
        <BodyText>This is the Settings tab content.</BodyText>
        <BodyText>Configure your preferences here.</BodyText>
      </Card>
    ),
  },
];

export const Simple: Story = {
  args: {
    variant: 'simple',
    items: simpleItems,
    defaultActiveKey: '1',
  },
};

export const SimpleWithCard: Story = {
  args: {
    variant: 'simple',
    type: 'card',
    items: simpleItems,
    defaultActiveKey: '1',
  },
};

export const SimpleSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <BodyText strong style={{ marginBottom: '8px', display: 'block' }}>
          Small
        </BodyText>
        <Tabs variant="simple" size="small" items={simpleItems} />
      </div>
      <div>
        <BodyText strong style={{ marginBottom: '8px', display: 'block' }}>
          Middle (Default)
        </BodyText>
        <Tabs variant="simple" size="middle" items={simpleItems} />
      </div>
      <div>
        <BodyText strong style={{ marginBottom: '8px', display: 'block' }}>
          Large
        </BodyText>
        <Tabs variant="simple" size="large" items={simpleItems} />
      </div>
    </div>
  ),
};

export const SimplePositions: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <BodyText strong style={{ marginBottom: '8px', display: 'block' }}>
          Top (Default)
        </BodyText>
        <Tabs variant="simple"  items={simpleItems} />
      </div>
      <div>
        <BodyText strong style={{ marginBottom: '8px', display: 'block' }}>
          Bottom
        </BodyText>
        <Tabs variant="simple"  items={simpleItems} />
      </div>
    </div>
  ),
};

// Editable tabs component
const EditableTabsExample = () => {
  const [items, setItems] = useState<AntTabsProps['items']>([
    {
      key: '1',
      label: 'Tab 1',
      children: (
        <Card>
          <BodyText>Content of Tab 1</BodyText>
        </Card>
      ),
    },
    {
      key: '2',
      label: 'Tab 2',
      children: (
        <Card>
          <BodyText>Content of Tab 2</BodyText>
        </Card>
      ),
    },
  ]);
  const [activeKey, setActiveKey] = useState<string>('1');
  const [newTabIndex, setNewTabIndex] = useState(3);

  const onChange = (newActiveKey: string) => {
    setActiveKey(newActiveKey);
  };

  const onEdit = (
    targetKey: React.MouseEvent | React.KeyboardEvent | string,
    action: 'add' | 'remove'
  ) => {
    if (action === 'add') {
      const newActiveKey = `newTab${newTabIndex}`;
      const newItems = [
        ...(items || []),
        {
          key: newActiveKey,
          label: `New Tab ${newTabIndex}`,
          children: (
            <Card>
              <BodyText>Content of New Tab {newTabIndex}</BodyText>
            </Card>
          ),
        },
      ];
      setItems(newItems);
      setActiveKey(newActiveKey);
      setNewTabIndex(newTabIndex + 1);
    } else {
      const newItems = items?.filter((item) => item.key !== targetKey) || [];
      setItems(newItems);
      if (newItems.length > 0) {
        if (activeKey === targetKey) {
          const index = newItems.findIndex((item) => item.key === targetKey);
          const nextKey =
            index > 0
              ? newItems[index - 1].key
              : newItems[0]?.key || '';
          setActiveKey(nextKey);
        }
      } else {
        setActiveKey('');
      }
    }
  };

  return (
    <Tabs
      variant="editable"
      type="editable-card"
      activeKey={activeKey}
      items={items}
      onChange={onChange}
      onEdit={onEdit}
    />
  );
};

export const Editable: Story = {
  render: () => <EditableTabsExample />,
};

export const EditableWithInitialTabs: Story = {
  render: () => {
    const [items, setItems] = useState<AntTabsProps['items']>([
      {
        key: 'dashboard',
        label: 'Dashboard',
        children: (
          <Card>
            <BodyText>Dashboard content goes here</BodyText>
          </Card>
        ),
      },
      {
        key: 'analytics',
        label: 'Analytics',
        children: (
          <Card>
            <BodyText>Analytics content goes here</BodyText>
          </Card>
        ),
      },
      {
        key: 'reports',
        label: 'Reports',
        children: (
          <Card>
            <BodyText>Reports content goes here</BodyText>
          </Card>
        ),
      },
    ]);
    const [activeKey, setActiveKey] = useState<string>('dashboard');
    const [newTabIndex, setNewTabIndex] = useState(1);

    const onChange = (newActiveKey: string) => {
      setActiveKey(newActiveKey);
    };

    const onEdit = (
      targetKey: React.MouseEvent | React.KeyboardEvent | string,
      action: 'add' | 'remove'
    ) => {
      if (action === 'add') {
        const newActiveKey = `tab-${newTabIndex}`;
        const newItems = [
          ...(items || []),
          {
            key: newActiveKey,
            label: `New Tab ${newTabIndex}`,
            children: (
              <Card>
                <BodyText>Content of New Tab {newTabIndex}</BodyText>
              </Card>
            ),
          },
        ];
        setItems(newItems);
        setActiveKey(newActiveKey);
        setNewTabIndex(newTabIndex + 1);
      } else {
        const newItems = items?.filter((item) => item.key !== targetKey) || [];
        setItems(newItems);
        if (newItems.length > 0) {
          if (activeKey === targetKey) {
            const index = newItems.findIndex((item) => item.key === targetKey);
            const nextKey =
              index > 0
                ? newItems[index - 1].key
                : newItems[0]?.key || '';
            setActiveKey(nextKey);
          }
        } else {
          setActiveKey('');
        }
      }
    };

    return (
      <Tabs
        variant="editable"
        type="editable-card"
        activeKey={activeKey}
        items={items}
        onChange={onChange}
        onEdit={onEdit}
      />
    );
  },
};

export const DisabledTab: Story = {
  args: {
    variant: 'simple',
    items: [
      {
        key: '1',
        label: 'Active Tab',
        children: (
          <Card>
            <BodyText>This tab is active and enabled.</BodyText>
          </Card>
        ),
      },
      {
        key: '2',
        label: 'Disabled Tab',
        disabled: true,
        children: (
          <Card>
            <BodyText>This tab is disabled.</BodyText>
          </Card>
        ),
      },
      {
        key: '3',
        label: 'Another Active Tab',
        children: (
          <Card>
            <BodyText>This is another active tab.</BodyText>
          </Card>
        ),
      },
    ],
    defaultActiveKey: '1',
  },
};

// Duplicatable Tabs Example
interface TabItem {
  key: string;
  label: string;
  baseName: string;
  duplicateIndex?: number;
  children: React.ReactNode;
}

const DuplicatableTabsExample = () => {
  const [items, setItems] = useState<TabItem[]>([
    {
      key: 'overview',
      label: 'Overview',
      baseName: 'Overview',
      children: (
        <Card>
          <BodyText>This is the Overview tab content.</BodyText>
          <BodyText>You can duplicate this tab using the dropdown menu.</BodyText>
        </Card>
      ),
    },
    {
      key: 'analytics',
      label: 'Analytics',
      baseName: 'Analytics',
      children: (
        <Card>
          <BodyText>This is the Analytics tab content.</BodyText>
          <BodyText>Duplicate this to create multiple analytics views.</BodyText>
        </Card>
      ),
    },
    {
      key: 'reports',
      label: 'Reports',
      baseName: 'Reports',
      children: (
        <Card>
          <BodyText>This is the Reports tab content.</BodyText>
          <BodyText>Create copies of this report tab as needed.</BodyText>
        </Card>
      ),
    },
  ]);
  const [activeKey, setActiveKey] = useState<string>('overview');

  // Track duplicate counts for each base name
  const getDuplicateCount = useCallback((baseName: string) => {
    return items.filter(item => item.baseName === baseName).length;
  }, [items]);

  const handleDuplicate = useCallback((tabKey: string) => {
    const tabToDuplicate = items.find(item => item.key === tabKey);
    if (!tabToDuplicate) return;

    const baseName = tabToDuplicate.baseName;
    const duplicateCount = getDuplicateCount(baseName);
    const newIndex = duplicateCount;
    const newKey = `${baseName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
    const newLabel = `${baseName} -${newIndex}`;

    const newTab: TabItem = {
      key: newKey,
      label: newLabel,
      baseName: baseName,
      duplicateIndex: newIndex,
      children: (
        <Card>
          <BodyText>This is a duplicate of <strong>{baseName}</strong>.</BodyText>
          <BodyText>Duplicate index: <strong>{newIndex}</strong></BodyText>
          <BodyText type="secondary" style={{ marginTop: 8 }}>
            Created from: {tabToDuplicate.label}
          </BodyText>
        </Card>
      ),
    };

    // Insert the new tab right after the duplicated tab
    const insertIndex = items.findIndex(item => item.key === tabKey) + 1;
    const newItems = [
      ...items.slice(0, insertIndex),
      newTab,
      ...items.slice(insertIndex),
    ];
    
    setItems(newItems);
    setActiveKey(newKey);
  }, [items, getDuplicateCount]);

  const handleRemove = useCallback((tabKey: string) => {
    const newItems = items.filter(item => item.key !== tabKey);
    setItems(newItems);
    
    // If removing the active tab, switch to the first tab
    if (activeKey === tabKey && newItems.length > 0) {
      setActiveKey(newItems[0].key);
    }
  }, [items, activeKey]);

  // Create tab items with dropdown menu for actions
  const tabItems: AntTabsProps['items'] = items.map(item => ({
    key: item.key,
    label: (
      <Space size={4}>
        <span>{item.label}</span>
        <Dropdown
          menu={{
            items: [
              {
                key: 'duplicate',
                icon: <CopyOutlined />,
                label: 'Duplicate Tab',
                onClick: (e) => {
                  e.domEvent.stopPropagation();
                  handleDuplicate(item.key);
                },
              },
              ...(items.length > 1 ? [{
                key: 'remove',
                label: 'Remove Tab',
                danger: true,
                onClick: (e: any) => {
                  e.domEvent.stopPropagation();
                  handleRemove(item.key);
                },
              }] : []),
            ],
          }}
          trigger={['click']}
        >
          <Button
            type="text"
            size="small"
            icon={<MoreOutlined />}
            onClick={(e) => e.stopPropagation()}
            style={{ marginLeft: 4, padding: '0 4px' }}
          />
        </Dropdown>
      </Space>
    ),
    children: item.children,
  }));

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Typography.Text type="secondary">
          Click the ⋯ menu on any tab to duplicate or remove it. Duplicated tabs are named with -1, -2, -3, etc.
        </Typography.Text>
      </div>
      <Tabs
        variant="simple"
        type="card"
        activeKey={activeKey}
        items={tabItems}
        onChange={setActiveKey}
      />
      <div style={{ marginTop: 16, padding: 12, background: '#f5f5f5', borderRadius: 4 }}>
        <Typography.Text strong>Tab Summary:</Typography.Text>
        <ul style={{ margin: '8px 0 0 0', paddingLeft: 20 }}>
          {items.map(item => (
            <li key={item.key}>
              <Typography.Text>
                {item.label} {item.duplicateIndex !== undefined && <Typography.Text type="secondary">(duplicate #{item.duplicateIndex})</Typography.Text>}
              </Typography.Text>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export const DuplicatableTabs: Story = {
  render: () => <DuplicatableTabsExample />,
  parameters: {
    docs: {
      description: {
        story: 'Tabs with the ability to duplicate. Click the ⋯ menu on any tab to duplicate it. Duplicated tabs are named with sequential suffixes: -1, -2, -3, etc.',
      },
    },
  },
};

// Duplicatable tabs with editable-card style
const DuplicatableEditableTabsExample = () => {
  const [items, setItems] = useState<TabItem[]>([
    {
      key: 'tab-1',
      label: 'Tab 1',
      baseName: 'Tab 1',
      children: (
        <Card>
          <BodyText>Content of Tab 1</BodyText>
        </Card>
      ),
    },
    {
      key: 'tab-2',
      label: 'Tab 2',
      baseName: 'Tab 2',
      children: (
        <Card>
          <BodyText>Content of Tab 2</BodyText>
        </Card>
      ),
    },
    {
      key: 'tab-3',
      label: 'Tab 3',
      baseName: 'Tab 3',
      children: (
        <Card>
          <BodyText>Content of Tab 3</BodyText>
        </Card>
      ),
    },
  ]);
  const [activeKey, setActiveKey] = useState<string>('tab-1');
  const [newTabIndex, setNewTabIndex] = useState(4);

  const getDuplicateCount = useCallback((baseName: string) => {
    return items.filter(item => item.baseName === baseName).length;
  }, [items]);

  const handleDuplicate = useCallback((tabKey: string) => {
    const tabToDuplicate = items.find(item => item.key === tabKey);
    if (!tabToDuplicate) return;

    const baseName = tabToDuplicate.baseName;
    const duplicateCount = getDuplicateCount(baseName);
    const newIndex = duplicateCount;
    const newKey = `${baseName.toLowerCase().replace(/\s+/g, '-')}-dup-${Date.now()}`;
    const newLabel = `${baseName} -${newIndex}`;

    const newTab: TabItem = {
      key: newKey,
      label: newLabel,
      baseName: baseName,
      duplicateIndex: newIndex,
      children: (
        <Card>
          <BodyText>Duplicate of <strong>{baseName}</strong></BodyText>
          <BodyText type="secondary">Index: {newIndex}</BodyText>
        </Card>
      ),
    };

    const insertIndex = items.findIndex(item => item.key === tabKey) + 1;
    const newItems = [
      ...items.slice(0, insertIndex),
      newTab,
      ...items.slice(insertIndex),
    ];
    
    setItems(newItems);
    setActiveKey(newKey);
  }, [items, getDuplicateCount]);

  const onEdit = (
    targetKey: React.MouseEvent | React.KeyboardEvent | string,
    action: 'add' | 'remove'
  ) => {
    if (action === 'add') {
      const newKey = `tab-${newTabIndex}`;
      const newLabel = `Tab ${newTabIndex}`;
      const newItems = [
        ...items,
        {
          key: newKey,
          label: newLabel,
          baseName: newLabel,
          children: (
            <Card>
              <BodyText>Content of {newLabel}</BodyText>
            </Card>
          ),
        },
      ];
      setItems(newItems);
      setActiveKey(newKey);
      setNewTabIndex(newTabIndex + 1);
    } else {
      const newItems = items.filter((item) => item.key !== targetKey);
      setItems(newItems);
      if (activeKey === targetKey && newItems.length > 0) {
        setActiveKey(newItems[0].key);
      }
    }
  };

  // Create tab items with duplicate button
  const tabItems: AntTabsProps['items'] = items.map(item => ({
    key: item.key,
    label: (
      <Space size={4}>
        <span>{item.label}</span>
        <Button
          type="text"
          size="small"
          icon={<CopyOutlined />}
          onClick={(e) => {
            e.stopPropagation();
            handleDuplicate(item.key);
          }}
          title="Duplicate tab"
          style={{ padding: '0 4px', opacity: 0.6 }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.6'; }}
        />
      </Space>
    ),
    children: item.children,
  }));

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Typography.Text type="secondary">
          Click the <CopyOutlined /> icon to duplicate a tab. Use the + button to add new tabs. Click × to remove tabs.
        </Typography.Text>
      </div>
      <Tabs
        variant="editable"
        type="editable-card"
        activeKey={activeKey}
        items={tabItems}
        onChange={setActiveKey}
        onEdit={onEdit}
      />
    </div>
  );
};

export const DuplicatableEditableTabs: Story = {
  render: () => <DuplicatableEditableTabsExample />,
  parameters: {
    docs: {
      description: {
        story: 'Editable tabs with duplicate functionality. Each tab has a copy icon to duplicate it. New tabs can also be added using the + button.',
      },
    },
  },
};

