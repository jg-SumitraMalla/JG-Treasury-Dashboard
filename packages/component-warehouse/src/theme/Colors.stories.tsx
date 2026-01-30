import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { colors } from './colors';
import { Card, Space, Row, Col, Typography, Divider } from 'antd';

const { Text, Title } = Typography;

const meta: Meta = {
  title: 'Theme/Colors',
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Color Swatch Component
const ColorSwatch: React.FC<{ name: string; color: string; value: string }> = ({
  name,
  color,
  value,
}) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      padding: '16px',
      borderRadius: '8px',
      border: '1px solid #e8e8e8',
      backgroundColor: '#fff',
    }}
  >
    <div
      style={{
        width: '100%',
        height: '80px',
        backgroundColor: color,
        borderRadius: '4px',
        border: color === '#ffffff' ? '1px solid #e8e8e8' : 'none',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      }}
    />
    <div>
      <Text strong style={{ display: 'block', marginBottom: '4px' }}>
        {name}
      </Text>
      <Text type="secondary" style={{ fontSize: '12px', fontFamily: 'monospace' }}>
        {value}
      </Text>
    </div>
  </div>
);

// Color Group Component
const ColorGroup: React.FC<{ title: string; colorKeys: string[] }> = ({ title, colorKeys }) => (
  <Card title={title} style={{ marginBottom: '24px' }}>
    <Row gutter={[16, 16]}>
      {colorKeys.map((key) => {
        const color = colors[key as keyof typeof colors];
        return (
          <Col xs={12} sm={8} md={6} lg={4} key={key}>
            <ColorSwatch name={key} color={color} value={color} />
          </Col>
        );
      })}
    </Row>
  </Card>
);

export const PrimaryColors: Story = {
  render: () => (
    <ColorGroup
      title="Primary Colors"
      colorKeys={[
        'primary',
        'primaryHover',
        'primaryLight',
        'primaryDark',
        'primaryLighter',
        'primaryDarker',
      ]}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Primary brand colors used for main actions, links, and key UI elements.',
      },
    },
  },
};

export const SecondaryColors: Story = {
  render: () => (
    <ColorGroup
      title="Secondary Colors"
      colorKeys={[
        'secondary',
        'secondaryHover',
        'secondaryLight',
        'secondaryDark',
        'secondaryLighter',
        'secondaryDarker',
      ]}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Secondary brand colors used for supporting actions and accents.',
      },
    },
  },
};

export const SemanticColors: Story = {
  render: () => (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <ColorGroup
        title="Success Colors"
        colorKeys={[
          'success',
          'successHover',
          'successLight',
          'successDark',
          'successLighter',
          'successDarker',
        ]}
      />
      <ColorGroup
        title="Warning Colors"
        colorKeys={[
          'warning',
          'warningHover',
          'warningLight',
          'warningDark',
          'warningLighter',
          'warningDarker',
        ]}
      />
      <ColorGroup
        title="Error Colors"
        colorKeys={[
          'error',
          'errorHover',
          'errorLight',
          'errorDark',
          'errorLighter',
          'errorDarker',
        ]}
      />
      <ColorGroup
        title="Info Colors"
        colorKeys={['info', 'infoHover', 'infoLight', 'infoDark', 'infoLighter', 'infoDarker']}
      />
    </Space>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Semantic colors used to communicate different states: success, warning, error, and info.',
      },
    },
  },
};

export const TextColors: Story = {
  render: () => (
    <ColorGroup
      title="Text Colors"
      colorKeys={['textPrimary', 'textSecondary', 'textTertiary', 'textDisabled', 'textInverse']}
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Text colors for different hierarchy levels. Use textPrimary for main content, textSecondary for supporting text, and textTertiary for less important information.',
      },
    },
  },
};

export const BackgroundColors: Story = {
  render: () => (
    <ColorGroup
      title="Background Colors"
      colorKeys={[
        'bgPrimary',
        'bgSecondary',
        'bgTertiary',
        'bgDisabled',
        'bgDark',
        'bgDarkSecondary',
      ]}
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Background colors for surfaces and containers. bgPrimary is the default white background, while bgSecondary and bgTertiary provide subtle variations for layering.',
      },
    },
  },
};

export const BorderColors: Story = {
  render: () => (
    <ColorGroup
      title="Border Colors"
      colorKeys={['border', 'borderLight', 'borderDark', 'borderHover']}
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Border colors for dividers, outlines, and borders. Use borderLight for subtle separations and borderDark for stronger emphasis.',
      },
    },
  },
};

export const Grayscale: Story = {
  render: () => (
    <ColorGroup
      title="Grayscale Palette"
      colorKeys={[
        'gray50',
        'gray100',
        'gray200',
        'gray300',
        'gray400',
        'gray500',
        'gray600',
        'gray700',
        'gray800',
        'gray900',
      ]}
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Complete grayscale palette from lightest (gray50) to darkest (gray900). Use these for neutral elements, backgrounds, and text when brand colors are not appropriate.',
      },
    },
  },
};

export const Shadows: Story = {
  render: () => (
    <Card title="Shadow Styles">
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Text strong style={{ display: 'block', marginBottom: '8px' }}>
            Small Shadow (shadowSm)
          </Text>
          <div
            style={{
              padding: '24px',
              backgroundColor: '#fff',
              borderRadius: '8px',
              boxShadow: colors.shadowSm,
            }}
          >
            <Text>Small shadow for subtle elevation</Text>
          </div>
        </div>
        <div>
          <Text strong style={{ display: 'block', marginBottom: '8px' }}>
            Medium Shadow (shadowMd)
          </Text>
          <div
            style={{
              padding: '24px',
              backgroundColor: '#fff',
              borderRadius: '8px',
              boxShadow: colors.shadowMd,
            }}
          >
            <Text>Medium shadow for cards and elevated surfaces</Text>
          </div>
        </div>
        <div>
          <Text strong style={{ display: 'block', marginBottom: '8px' }}>
            Large Shadow (shadowLg)
          </Text>
          <div
            style={{
              padding: '24px',
              backgroundColor: '#fff',
              borderRadius: '8px',
              boxShadow: colors.shadowLg,
            }}
          >
            <Text>Large shadow for modals and prominent elements</Text>
          </div>
        </div>
        <div>
          <Text strong style={{ display: 'block', marginBottom: '8px' }}>
            Extra Large Shadow (shadowXl)
          </Text>
          <div
            style={{
              padding: '24px',
              backgroundColor: '#fff',
              borderRadius: '8px',
              boxShadow: colors.shadowXl,
            }}
          >
            <Text>Extra large shadow for maximum elevation</Text>
          </div>
        </div>
      </Space>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Shadow styles for creating depth and elevation in the UI. Use progressively larger shadows for higher elevation levels.',
      },
    },
  },
};

export const AllColors: Story = {
  render: () => (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Title level={2}>Complete Color Palette</Title>
      <ColorGroup
        title="Primary Colors"
        colorKeys={[
          'primary',
          'primaryHover',
          'primaryLight',
          'primaryDark',
          'primaryLighter',
          'primaryDarker',
        ]}
      />
      <ColorGroup
        title="Secondary Colors"
        colorKeys={[
          'secondary',
          'secondaryHover',
          'secondaryLight',
          'secondaryDark',
          'secondaryLighter',
          'secondaryDarker',
        ]}
      />
      <ColorGroup
        title="Success Colors"
        colorKeys={[
          'success',
          'successHover',
          'successLight',
          'successDark',
          'successLighter',
          'successDarker',
        ]}
      />
      <ColorGroup
        title="Warning Colors"
        colorKeys={[
          'warning',
          'warningHover',
          'warningLight',
          'warningDark',
          'warningLighter',
          'warningDarker',
        ]}
      />
      <ColorGroup
        title="Error Colors"
        colorKeys={[
          'error',
          'errorHover',
          'errorLight',
          'errorDark',
          'errorLighter',
          'errorDarker',
        ]}
      />
      <ColorGroup
        title="Info Colors"
        colorKeys={['info', 'infoHover', 'infoLight', 'infoDark', 'infoLighter', 'infoDarker']}
      />
      <Divider />
      <ColorGroup
        title="Text Colors"
        colorKeys={['textPrimary', 'textSecondary', 'textTertiary', 'textDisabled', 'textInverse']}
      />
      <ColorGroup
        title="Background Colors"
        colorKeys={[
          'bgPrimary',
          'bgSecondary',
          'bgTertiary',
          'bgDisabled',
          'bgDark',
          'bgDarkSecondary',
        ]}
      />
      <ColorGroup
        title="Border Colors"
        colorKeys={['border', 'borderLight', 'borderDark', 'borderHover']}
      />
      <Divider />
      <ColorGroup
        title="Grayscale Palette"
        colorKeys={[
          'gray50',
          'gray100',
          'gray200',
          'gray300',
          'gray400',
          'gray500',
          'gray600',
          'gray700',
          'gray800',
          'gray900',
        ]}
      />
      <Card title="Shadow Styles">
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <Text strong style={{ display: 'block', marginBottom: '8px' }}>
              Small Shadow (shadowSm)
            </Text>
            <div
              style={{
                padding: '24px',
                backgroundColor: '#fff',
                borderRadius: '8px',
                boxShadow: colors.shadowSm,
              }}
            >
              <Text>Small shadow for subtle elevation</Text>
            </div>
          </div>
          <div>
            <Text strong style={{ display: 'block', marginBottom: '8px' }}>
              Medium Shadow (shadowMd)
            </Text>
            <div
              style={{
                padding: '24px',
                backgroundColor: '#fff',
                borderRadius: '8px',
                boxShadow: colors.shadowMd,
              }}
            >
              <Text>Medium shadow for cards and elevated surfaces</Text>
            </div>
          </div>
          <div>
            <Text strong style={{ display: 'block', marginBottom: '8px' }}>
              Large Shadow (shadowLg)
            </Text>
            <div
              style={{
                padding: '24px',
                backgroundColor: '#fff',
                borderRadius: '8px',
                boxShadow: colors.shadowLg,
              }}
            >
              <Text>Large shadow for modals and prominent elements</Text>
            </div>
          </div>
          <div>
            <Text strong style={{ display: 'block', marginBottom: '8px' }}>
              Extra Large Shadow (shadowXl)
            </Text>
            <div
              style={{
                padding: '24px',
                backgroundColor: '#fff',
                borderRadius: '8px',
                boxShadow: colors.shadowXl,
              }}
            >
              <Text>Extra large shadow for maximum elevation</Text>
            </div>
          </div>
        </Space>
      </Card>
    </Space>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Complete overview of all available colors in the theme system.',
      },
    },
  },
};

export const UsageExamples: Story = {
  render: () => (
    <Card title="Usage Examples">
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={4}>SCSS Usage</Title>
          <pre
            style={{
              backgroundColor: '#f5f5f5',
              padding: '16px',
              borderRadius: '4px',
              overflow: 'auto',
            }}
          >
            {`@import '@apac-ui-warehouse/component-warehouse/theme/colors.scss';

.button {
  background-color: $color-primary;
  color: $color-text-inverse;
  border: 1px solid $color-border;
  box-shadow: $shadow-md;
  
  &:hover {
    background-color: $color-primary-hover;
  }
}`}
          </pre>
        </div>
        <Divider />
        <div>
          <Title level={4}>TypeScript Usage</Title>
          <pre
            style={{
              backgroundColor: '#f5f5f5',
              padding: '16px',
              borderRadius: '4px',
              overflow: 'auto',
            }}
          >
            {`import { colors } from '@apac-ui-warehouse/component-warehouse';

const Button = () => (
  <button
    style={{
      backgroundColor: colors.primary,
      color: colors.textInverse,
      border: \`1px solid \${colors.border}\`,
      boxShadow: colors.shadowMd,
    }}
  >
    Click me
  </button>
);`}
          </pre>
        </div>
        <Divider />
        <div>
          <Title level={4}>React Component with Theme Colors</Title>
          <div
            style={{
              display: 'flex',
              gap: '16px',
              flexWrap: 'wrap',
            }}
          >
            <button
              style={{
                padding: '8px 16px',
                backgroundColor: colors.primary,
                color: colors.textInverse,
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              Primary Button
            </button>
            <button
              style={{
                padding: '8px 16px',
                backgroundColor: colors.secondary,
                color: colors.textInverse,
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              Secondary Button
            </button>
            <button
              style={{
                padding: '8px 16px',
                backgroundColor: colors.success,
                color: colors.textInverse,
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              Success Button
            </button>
            <button
              style={{
                padding: '8px 16px',
                backgroundColor: colors.error,
                color: colors.textInverse,
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              Error Button
            </button>
          </div>
        </div>
      </Space>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Practical examples showing how to use the color theme in both SCSS and TypeScript/React components.',
      },
    },
  },
};
