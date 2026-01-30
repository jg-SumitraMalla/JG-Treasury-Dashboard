import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { BrokerFilter, BrokerOption } from './BrokerFilter';
import { Space, Typography, Card, Table, Tag } from 'antd';

const { Title, Text } = Typography;

const meta: Meta<typeof BrokerFilter> = {
  title: 'Components/BrokerFilter',
  component: BrokerFilter,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
A flexible broker filter component that allows users to filter data by brokers.

### Features
- Multi-select broker filtering
- Two variants: Select dropdown and clickable Tags
- Search within options
- Select All / Deselect All functionality
- Customizable styling and behavior
- Supports broker metadata (ISIN, SEDOL)

### Usage
\`\`\`tsx
import { BrokerFilter, BrokerOption } from '@apac-ui-warehouse/component-warehouse';

const brokers: BrokerOption[] = [
  { key: 'gs', name: 'Goldman Sachs' },
  { key: 'ms', name: 'Morgan Stanley' },
];

const [selected, setSelected] = useState<string[]>([]);

<BrokerFilter
  brokers={brokers}
  selectedBrokers={selected}
  onChange={setSelected}
/>
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'radio',
      options: ['default', 'tags'],
      description: 'Display variant',
    },
    size: {
      control: 'radio',
      options: ['small', 'middle', 'large'],
    },
    width: {
      control: 'number',
    },
    showClearAll: {
      control: 'boolean',
    },
    showLabel: {
      control: 'boolean',
    },
    showSelectAll: {
      control: 'boolean',
    },
    allowSearch: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof BrokerFilter>;

// Sample broker data
const sampleBrokers: BrokerOption[] = [
  { key: 'gs', name: 'Goldman Sachs', isin: 'US38141G1040', sedol: 'B0YQ3H4' },
  { key: 'ms', name: 'Morgan Stanley', isin: 'US6174464486', sedol: 'B6174C8' },
  { key: 'jpm', name: 'JP Morgan', isin: 'US46625H1005', sedol: 'B46625H' },
  { key: 'bofa', name: 'Bank of America', isin: 'US0605051046', sedol: 'B605051' },
  { key: 'citi', name: 'Citigroup', isin: 'US1729674242', sedol: 'B1Y2BN4' },
  { key: 'ubs', name: 'UBS', isin: 'CH0244767585', sedol: 'BDT8SK8' },
  { key: 'cs', name: 'Credit Suisse', isin: 'CH0012138530', sedol: 'B01FLT7' },
  { key: 'barclays', name: 'Barclays', isin: 'GB0031348658', sedol: '3134865' },
];

// Interactive story with state
const InteractiveTemplate = (args: any) => {
  const [selected, setSelected] = React.useState<string[]>([]);

  return (
    <div>
      <BrokerFilter {...args} selectedBrokers={selected} onChange={setSelected} />
      <div style={{ marginTop: 16 }}>
        <Text type="secondary">
          Selected: {selected.length > 0 ? selected.join(', ') : 'None'}
        </Text>
      </div>
    </div>
  );
};

export const Default: Story = {
  render: InteractiveTemplate,
  args: {
    brokers: sampleBrokers,
    placeholder: 'Select brokers to filter...',
    showLabel: true,
    label: 'Filter Brokers',
    showClearAll: true,
    showSelectAll: true,
    allowSearch: true,
    width: 400,
  },
};

export const TagsVariant: Story = {
  render: InteractiveTemplate,
  args: {
    brokers: sampleBrokers,
    variant: 'tags',
    showLabel: true,
    label: 'Filter Brokers',
    showClearAll: true,
    showSelectAll: true,
  },
};

export const SmallSize: Story = {
  render: InteractiveTemplate,
  args: {
    brokers: sampleBrokers.slice(0, 4),
    size: 'small',
    width: 300,
    showLabel: false,
    placeholder: 'Filter...',
  },
};

export const WithoutLabel: Story = {
  render: InteractiveTemplate,
  args: {
    brokers: sampleBrokers,
    showLabel: false,
    width: 350,
  },
};

export const Disabled: Story = {
  render: () => {
    const [selected] = React.useState<string[]>(['gs', 'ms']);
    return (
      <BrokerFilter
        brokers={sampleBrokers}
        selectedBrokers={selected}
        onChange={() => {}}
        disabled
      />
    );
  },
};

export const PreSelected: Story = {
  render: () => {
    const [selected, setSelected] = React.useState<string[]>(['gs', 'ms', 'jpm']);
    return (
      <BrokerFilter
        brokers={sampleBrokers}
        selectedBrokers={selected}
        onChange={setSelected}
        width={450}
      />
    );
  },
};

// Comprehensive demo showing both variants
export const ComprehensiveDemo: Story = {
  render: () => {
    const [selectedDefault, setSelectedDefault] = React.useState<string[]>([]);
    const [selectedTags, setSelectedTags] = React.useState<string[]>([]);

    return (
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Title level={4}>Broker Filter Variants</Title>

        <Card title="Select Dropdown Variant" size="small">
          <BrokerFilter
            brokers={sampleBrokers}
            selectedBrokers={selectedDefault}
            onChange={setSelectedDefault}
            variant="default"
            width={400}
          />
          <div style={{ marginTop: 12 }}>
            <Text type="secondary">
              Selected ({selectedDefault.length}): {selectedDefault.join(', ') || 'None'}
            </Text>
          </div>
        </Card>

        <Card title="Tags Variant" size="small">
          <BrokerFilter
            brokers={sampleBrokers}
            selectedBrokers={selectedTags}
            onChange={setSelectedTags}
            variant="tags"
          />
          <div style={{ marginTop: 12 }}>
            <Text type="secondary">
              Selected ({selectedTags.length}): {selectedTags.join(', ') || 'None'}
            </Text>
          </div>
        </Card>
      </Space>
    );
  },
};

// Demo showing filter affecting table data
export const FilterWithTableDemo: Story = {
  render: () => {
    const [selectedBrokers, setSelectedBrokers] = React.useState<string[]>([]);

    // Sample table data
    const fullData = [
      { date: '2024-01-15', ticker: 'AAPL', gs: 100000, ms: 85000, jpm: 120000, bofa: 95000 },
      { date: '2024-01-14', ticker: 'AAPL', gs: 98000, ms: 87000, jpm: 118000, bofa: 96000 },
      { date: '2024-01-13', ticker: 'AAPL', gs: 102000, ms: 84000, jpm: 122000, bofa: 94000 },
    ];

    const brokerMap: Record<string, string> = {
      gs: 'Goldman Sachs',
      ms: 'Morgan Stanley',
      jpm: 'JP Morgan',
      bofa: 'Bank of America',
    };

    const tableBrokers: BrokerOption[] = Object.entries(brokerMap).map(([key, name]) => ({
      key,
      name,
    }));

    // Filter columns based on selection
    const visibleBrokerKeys = selectedBrokers.length > 0 
      ? selectedBrokers 
      : tableBrokers.map(b => b.key);

    const columns = [
      { title: 'Date', dataIndex: 'date', key: 'date' },
      { title: 'Ticker', dataIndex: 'ticker', key: 'ticker' },
      ...visibleBrokerKeys.map(key => ({
        title: brokerMap[key],
        dataIndex: key,
        key,
        render: (val: number) => val?.toLocaleString() || '-',
      })),
    ];

    return (
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Title level={4}>Filter Brokers in Table</Title>
        
        <BrokerFilter
          brokers={tableBrokers}
          selectedBrokers={selectedBrokers}
          onChange={setSelectedBrokers}
          variant="tags"
          label="Show Brokers"
        />

        <Card size="small">
          <div style={{ marginBottom: 8 }}>
            <Text type="secondary">
              Showing {visibleBrokerKeys.length} of {tableBrokers.length} brokers
            </Text>
          </div>
          <Table
            dataSource={fullData}
            columns={columns}
            rowKey="date"
            pagination={false}
            size="small"
          />
        </Card>
      </Space>
    );
  },
};

// Demo showing searchable filter
export const SearchableDemo: Story = {
  render: () => {
    const [selected, setSelected] = React.useState<string[]>([]);
    
    const manyBrokers: BrokerOption[] = [
      { key: 'gs', name: 'Goldman Sachs', isin: 'US38141G1040' },
      { key: 'ms', name: 'Morgan Stanley', isin: 'US6174464486' },
      { key: 'jpm', name: 'JP Morgan Chase', isin: 'US46625H1005' },
      { key: 'bofa', name: 'Bank of America', isin: 'US0605051046' },
      { key: 'citi', name: 'Citigroup Inc', isin: 'US1729674242' },
      { key: 'wf', name: 'Wells Fargo', isin: 'US9497461015' },
      { key: 'ubs', name: 'UBS Group AG', isin: 'CH0244767585' },
      { key: 'db', name: 'Deutsche Bank', isin: 'DE0005140008' },
      { key: 'hsbc', name: 'HSBC Holdings', isin: 'GB0005405286' },
      { key: 'barc', name: 'Barclays PLC', isin: 'GB0031348658' },
      { key: 'bnp', name: 'BNP Paribas', isin: 'FR0000131104' },
      { key: 'sg', name: 'Societe Generale', isin: 'FR0000130809' },
    ];

    return (
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Title level={4}>Searchable Broker Filter</Title>
        <Text type="secondary">
          Try searching by broker name or ISIN (e.g., "Goldman", "JP", "US38141")
        </Text>
        
        <BrokerFilter
          brokers={manyBrokers}
          selectedBrokers={selected}
          onChange={setSelected}
          allowSearch
          width={450}
          maxTagCount={3}
          placeholder="Search and select brokers..."
        />

        <div>
          <Text strong>Selected: </Text>
          {selected.length > 0 ? (
            <Space wrap>
              {selected.map(key => {
                const broker = manyBrokers.find(b => b.key === key);
                return (
                  <Tag key={key} color="blue">
                    {broker?.name}
                  </Tag>
                );
              })}
            </Space>
          ) : (
            <Text type="secondary">None selected (showing all)</Text>
          )}
        </div>
      </Space>
    );
  },
};

