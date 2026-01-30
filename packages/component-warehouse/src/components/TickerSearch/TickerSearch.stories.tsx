import type { Meta, StoryObj } from '@storybook/react';
import { TickerSearch } from './TickerSearch';
import type { TickerSearchResult } from './TickerSearch';
import { Card, Space } from 'antd';
import { useState } from 'react';

const meta: Meta<typeof TickerSearch> = {
  title: 'Components/TickerSearch',
  component: TickerSearch,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    useTickers: {
      control: 'boolean',
      description: 'Whether to use tickers mode (true) or ISIN/SEDOL mode (false)',
    },
    identifierType: {
      control: 'select',
      options: ['isin', 'sedol'],
      description: 'Current identifier type (when not using tickers)',
    },
    debounceMs: {
      control: 'number',
      description: 'Debounce delay in milliseconds',
    },
    minSearchLength: {
      control: 'number',
      description: 'Minimum characters before searching',
    },
  },
};

export default meta;
type Story = StoryObj<typeof TickerSearch>;

// API base URL - can be configured via environment variable or default to production
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://rpm-fastapi-dev.tech1dev.jainglobal.net';

/**
 * Search function that calls the actual API endpoint
 * This matches the signature expected by TickerSearch component
 */
const createSearchFunction = (baseUrl: string = API_BASE_URL) => {
  return async (
    query: string,
    type: 'isin' | 'sedol' | 'bbg_ticker',
    signal?: AbortSignal,
  ): Promise<TickerSearchResult[]> => {
    const param = type === 'isin' ? 'isin' : type === 'sedol' ? 'sedol' : 'bbg_ticker';
    
    try {
      const response = await fetch(
        `${baseUrl}/search?${param}=${encodeURIComponent(query)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          signal,
        },
      );

      // Check if request was aborted
      if (signal?.aborted) {
        throw new Error('Search request was cancelled');
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to search identifiers');
      }

      const data = await response.json();

      // Transform API response to TickerSearchResult[] format
      const results: TickerSearchResult[] = [];

      // Handle BBG Ticker format: { tickers: string[] }
      if (Array.isArray(data.tickers)) {
        data.tickers.forEach((bbg_ticker: string) => {
          results.push({ bbg_ticker });
        });
      }

      // Handle ISIN/SEDOL format: { isin: string[], sedol: string[] }
      if (Array.isArray(data.isin)) {
        data.isin.forEach((isin: string) => {
          results.push({ isin });
        });
      }

      if (Array.isArray(data.sedol)) {
        data.sedol.forEach((sedol: string) => {
          results.push({ sedol });
        });
      }

      // If response already has results array (legacy format)
      if (Array.isArray(data.results)) {
        return data.results;
      }

      return results;
    } catch (error: any) {
      // Ignore abort errors
      if (error?.name === 'AbortError' || error?.message?.includes('cancelled') || error?.message?.includes('aborted')) {
        return [];
      }
      throw error;
    }
  };
};

// Default search function using production API
const defaultSearchFunction = createSearchFunction();

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState('');
    const [selectedResult, setSelectedResult] = useState<TickerSearchResult | null>(null);

    return (
      <Card style={{ width: 600, padding: '20px' }}>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <TickerSearch
            {...args}
            value={value}
            onChange={setValue}
            onSelect={(val, result) => {
              setSelectedResult(result || null);
              console.log('Selected:', val, result);
            }}
            onSearch={defaultSearchFunction}
          />
          {selectedResult && (
            <div style={{ marginTop: '16px', padding: '12px', background: '#f5f5f5', borderRadius: '4px' }}>
              <strong>Selected Result:</strong>
              <pre style={{ marginTop: '8px', fontSize: '12px' }}>
                {JSON.stringify(selectedResult, null, 2)}
              </pre>
            </div>
          )}
        </Space>
      </Card>
    );
  },
  args: {
    useTickers: true,
    debounceMs: 300,
    minSearchLength: 2,
  },
};

export const TickerMode: Story = {
  render: (args) => {
    const [value, setValue] = useState('');
    const [useTickers, setUseTickers] = useState(true);

    return (
      <Card style={{ width: 600, padding: '20px' }}>
        <div style={{ marginBottom: '16px', padding: '8px', background: '#e6f7ff', borderRadius: '4px', fontSize: '12px' }}>
          <strong>Tip:</strong> Use arrow keys to navigate dropdown, then press Enter to select the highlighted option.
        </div>
        <TickerSearch
          {...args}
          value={value}
          onChange={setValue}
          onSelect={(val, result) => {
            console.log('Selected ticker:', val, result);
          }}
          onSearch={defaultSearchFunction}
          useTickers={useTickers}
          onToggleMode={setUseTickers}
        />
      </Card>
    );
  },
  args: {
    useTickers: true,
    debounceMs: 300,
    minSearchLength: 2,
  },
};

export const ISINSEDOLMode: Story = {
  render: (args) => {
    const [value, setValue] = useState('');
    const [useTickers, setUseTickers] = useState(false);
    const [identifierType, setIdentifierType] = useState<'isin' | 'sedol'>('isin');

    return (
      <Card style={{ width: 600, padding: '20px' }}>
        <div style={{ marginBottom: '16px', padding: '8px', background: '#e6f7ff', borderRadius: '4px', fontSize: '12px' }}>
          <strong>Tip:</strong> Use arrow keys to navigate dropdown, then press Enter to select the highlighted option.
        </div>
        <TickerSearch
          {...args}
          value={value}
          onChange={setValue}
          onSelect={(val, result) => {
            console.log('Selected identifier:', val, result);
          }}
          onSearch={defaultSearchFunction}
          useTickers={useTickers}
          onToggleMode={setUseTickers}
          identifierType={identifierType}
          onIdentifierTypeChange={setIdentifierType}
        />
      </Card>
    );
  },
  args: {
    useTickers: false,
    identifierType: 'isin',
    debounceMs: 300,
    minSearchLength: 2,
  },
};

export const WithLocalhostAPI: Story = {
  render: (args) => {
    const [value, setValue] = useState('');
    // Use localhost API for this story
    const localhostSearchFunction = createSearchFunction('http://localhost:9000');

    return (
      <Card style={{ width: 600, padding: '20px' }}>
        <div style={{ marginBottom: '16px', padding: '8px', background: '#e6f7ff', borderRadius: '4px', fontSize: '12px' }}>
          Using localhost API: http://localhost:9000
        </div>
        <TickerSearch
          {...args}
          value={value}
          onChange={setValue}
          onSelect={(val, result) => {
            console.log('Selected:', val, result);
          }}
          onSearch={localhostSearchFunction}
        />
      </Card>
    );
  },
  args: {
    useTickers: true,
    debounceMs: 300,
    minSearchLength: 2,
  },
};

export const Interactive: Story = {
  render: () => {
    const [value, setValue] = useState('');
    const [useTickers, setUseTickers] = useState(true);
    const [identifierType, setIdentifierType] = useState<'isin' | 'sedol'>('isin');
    const [selectedResult, setSelectedResult] = useState<TickerSearchResult | null>(null);
    const [searchHistory, setSearchHistory] = useState<Array<{ query: string; result: TickerSearchResult | null }>>([]);

    return (
      <Card style={{ width: 800, padding: '20px' }}>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <div>
            <h3 style={{ marginBottom: '8px' }}>Interactive TickerSearch</h3>
            <div style={{ marginBottom: '16px', padding: '8px', background: '#e6f7ff', borderRadius: '4px', fontSize: '12px' }}>
              <strong>Keyboard Navigation:</strong>
              <ul style={{ margin: '4px 0 0 20px', padding: 0 }}>
                <li>Type to search</li>
                <li>Use ↑/↓ arrow keys to navigate dropdown</li>
                <li>Press <strong>Enter</strong> to select highlighted option (not the typed text)</li>
                <li>Press <strong>Tab</strong> to select highlighted option</li>
              </ul>
            </div>
            <TickerSearch
              value={value}
              onChange={setValue}
              onSelect={(val, result) => {
                setSelectedResult(result || null);
                setSearchHistory((prev) => [{ query: val, result: result || null }, ...prev.slice(0, 4)]);
              }}
              onSearch={defaultSearchFunction}
              useTickers={useTickers}
              onToggleMode={setUseTickers}
              identifierType={identifierType}
              onIdentifierTypeChange={setIdentifierType}
              debounceMs={300}
              minSearchLength={2}
            />
          </div>

          {selectedResult && (
            <div style={{ padding: '12px', background: '#f5f5f5', borderRadius: '4px' }}>
              <strong>Last Selected:</strong>
              <pre style={{ marginTop: '8px', fontSize: '12px' }}>
                {JSON.stringify(selectedResult, null, 2)}
              </pre>
            </div>
          )}

          {searchHistory.length > 0 && (
            <div style={{ padding: '12px', background: '#fafafa', borderRadius: '4px' }}>
              <strong>Recent Searches:</strong>
              <ul style={{ marginTop: '8px', fontSize: '12px', paddingLeft: '20px' }}>
                {searchHistory.map((item, idx) => (
                  <li key={idx}>
                    <strong>{item.query}</strong>
                    {item.result && (
                      <span style={{ marginLeft: '8px', color: '#666' }}>
                        - {item.result.bbg_ticker || item.result.isin || item.result.sedol}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Space>
      </Card>
    );
  },
};
