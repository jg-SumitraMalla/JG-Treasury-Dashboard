import * as React from 'react';
import { Tabs as AntTabs } from 'antd';
import type { TabsProps as AntTabsProps } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { TabPane } = AntTabs;

export interface TabsProps extends Omit<AntTabsProps, 'items'> {
  items?: AntTabsProps['items'];
  variant?: 'simple' | 'editable';
  onAdd?: () => void;
  onEdit?: (
    targetKey: React.MouseEvent | React.KeyboardEvent | string,
    action: 'add' | 'remove'
  ) => void;
}

export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ variant = 'simple', onAdd, onEdit, items, ...props }, _) => {
    // For editable tabs, we need to handle add/remove functionality
    if (variant === 'editable') {
      return (
        <AntTabs
          type="editable-card"
          onEdit={onEdit}
          addIcon={onAdd ? <PlusOutlined /> : undefined}
          items={items}
          {...props}
        />
      );
    }

    // Simple tabs - just pass through with items
    return <AntTabs items={items} {...props} />;
  }
);

Tabs.displayName = 'Tabs';

// Export TabPane for backward compatibility if needed
export { TabPane };

