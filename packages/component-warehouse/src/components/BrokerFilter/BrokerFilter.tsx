import * as React from 'react';
import { Select, Tag, Space, Button, Typography } from 'antd';
import { FilterOutlined, ClearOutlined } from '@ant-design/icons';
import { useTheme } from '../../theme/ThemeContext';
import { colors } from '../../theme/colors';

const { Text } = Typography;

export interface BrokerOption {
  /** Unique broker key/identifier */
  key: string;
  /** Display name for the broker */
  name: string;
  /** Optional additional info (e.g., ISIN, SEDOL) */
  isin?: string | null;
  sedol?: string | null;
}

export interface BrokerFilterProps {
  /** List of available brokers to filter */
  brokers: BrokerOption[];
  /** Currently selected broker keys */
  selectedBrokers: string[];
  /** Callback when selection changes */
  onChange: (selectedKeys: string[]) => void;
  /** Placeholder text for the select */
  placeholder?: string;
  /** Whether to show the clear all button */
  showClearAll?: boolean;
  /** Whether to show a label */
  showLabel?: boolean;
  /** Custom label text */
  label?: string;
  /** Whether the filter is disabled */
  disabled?: boolean;
  /** Whether to allow search within options */
  allowSearch?: boolean;
  /** Max tag count before showing "+N more" */
  maxTagCount?: number | 'responsive';
  /** Size of the select */
  size?: 'small' | 'middle' | 'large';
  /** Custom width for the select */
  width?: number | string;
  /** Custom style */
  style?: React.CSSProperties;
  /** Custom class name */
  className?: string;
  /** Variant: 'default' shows Select, 'tags' shows clickable tags */
  variant?: 'default' | 'tags';
  /** Whether to show "Select All" option */
  showSelectAll?: boolean;
}

export const BrokerFilter: React.FC<BrokerFilterProps> = ({
  brokers,
  selectedBrokers,
  onChange,
  placeholder = 'Filter by broker...',
  showClearAll = true,
  showLabel = true,
  label = 'Filter Brokers',
  disabled = false,
  allowSearch = true,
  maxTagCount = 'responsive',
  size = 'middle',
  width = 320,
  style,
  className,
  variant = 'default',
  showSelectAll = true,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Handle select all / deselect all
  const handleSelectAll = React.useCallback(() => {
    if (selectedBrokers.length === brokers.length) {
      onChange([]);
    } else {
      onChange(brokers.map((b) => b.key));
    }
  }, [brokers, selectedBrokers, onChange]);

  // Handle clear all
  const handleClearAll = React.useCallback(() => {
    onChange([]);
  }, [onChange]);

  // Handle individual broker toggle (for tags variant)
  const handleTagClick = React.useCallback(
    (brokerKey: string) => {
      if (selectedBrokers.includes(brokerKey)) {
        onChange(selectedBrokers.filter((k) => k !== brokerKey));
      } else {
        onChange([...selectedBrokers, brokerKey]);
      }
    },
    [selectedBrokers, onChange]
  );

  // Filter options for search
  const filterOption = React.useCallback(
    (input: string, option?: { label?: string; value?: string; data?: BrokerOption }): boolean => {
      if (!option) return false;
      const searchLower = input.toLowerCase();
      const broker = option.data;
      if (!broker) return (option.label || '').toLowerCase().includes(searchLower);
      
      const nameMatch = broker.name.toLowerCase().includes(searchLower);
      const keyMatch = broker.key.toLowerCase().includes(searchLower);
      const isinMatch = broker.isin ? broker.isin.toLowerCase().includes(searchLower) : false;
      const sedolMatch = broker.sedol ? broker.sedol.toLowerCase().includes(searchLower) : false;
      
      return nameMatch || keyMatch || isinMatch || sedolMatch;
    },
    []
  );

  // Determine if all are selected
  const allSelected = selectedBrokers.length === brokers.length && brokers.length > 0;
  const noneSelected = selectedBrokers.length === 0;

  // Styles
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
    ...style,
  };

  const labelStyle: React.CSSProperties = {
    color: isDark ? colors.textInverse : colors.textPrimary,
    fontWeight: 500,
    fontSize: 13,
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  };

  const selectStyle: React.CSSProperties = {
    width,
  };

  // Render tags variant
  if (variant === 'tags') {
    return (
      <div className={className} style={containerStyle}>
        {showLabel && (
          <Text style={labelStyle}>
            <FilterOutlined />
            {label}:
          </Text>
        )}
        <Space wrap size={[4, 4]}>
          {showSelectAll && (
            <Tag
              color={allSelected ? colors.primary : undefined}
              style={{
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled ? 0.5 : 1,
                borderStyle: allSelected ? 'solid' : 'dashed',
              }}
              onClick={disabled ? undefined : handleSelectAll}
            >
              {allSelected ? 'Deselect All' : 'Select All'}
            </Tag>
          )}
          {brokers.map((broker) => {
            const isSelected = selectedBrokers.includes(broker.key);
            return (
              <Tag
                key={broker.key}
                color={isSelected ? 'blue' : undefined}
                style={{
                  cursor: disabled ? 'not-allowed' : 'pointer',
                  opacity: disabled ? 0.5 : 1,
                  borderColor: isSelected ? colors.primary : undefined,
                }}
                onClick={disabled ? undefined : () => handleTagClick(broker.key)}
              >
                {broker.name}
              </Tag>
            );
          })}
        </Space>
        {showClearAll && selectedBrokers.length > 0 && (
          <Button
            type="text"
            size="small"
            icon={<ClearOutlined />}
            onClick={handleClearAll}
            disabled={disabled}
            style={{ color: isDark ? colors.textInverse : colors.textSecondary }}
          >
            Clear
          </Button>
        )}
      </div>
    );
  }

  // Render default Select variant
  return (
    <div className={className} style={containerStyle}>
      {showLabel && (
        <Text style={labelStyle}>
          <FilterOutlined />
          {label}:
        </Text>
      )}
      <Select
        mode="multiple"
        placeholder={placeholder}
        value={selectedBrokers}
        onChange={onChange}
        disabled={disabled}
        showSearch={allowSearch}
        filterOption={filterOption}
        maxTagCount={maxTagCount}
        size={size}
        style={selectStyle}
        allowClear
        optionFilterProp="label"
        dropdownRender={(menu) => (
          <>
            {showSelectAll && brokers.length > 1 && (
              <div
                style={{
                  padding: '8px 12px',
                  borderBottom: `1px solid ${isDark ? colors.borderDark : colors.borderLight}`,
                }}
              >
                <Button
                  type="link"
                  size="small"
                  onClick={handleSelectAll}
                  style={{ padding: 0 }}
                >
                  {allSelected ? 'Deselect All' : 'Select All'} ({brokers.length})
                </Button>
              </div>
            )}
            {menu}
          </>
        )}
        tagRender={(props) => {
          const { label: tagLabel, closable, onClose } = props;
          return (
            <Tag
              color="blue"
              closable={closable}
              onClose={onClose}
              style={{ marginRight: 3 }}
            >
              {tagLabel}
            </Tag>
          );
        }}
        options={brokers.map((broker) => ({
          label: broker.name,
          value: broker.key,
          data: broker,
        }))}
      />
      {showClearAll && !noneSelected && (
        <Button
          type="text"
          size="small"
          icon={<ClearOutlined />}
          onClick={handleClearAll}
          disabled={disabled}
          style={{ color: isDark ? colors.textInverse : colors.textSecondary }}
        >
          Clear
        </Button>
      )}
    </div>
  );
};

BrokerFilter.displayName = 'BrokerFilter';

