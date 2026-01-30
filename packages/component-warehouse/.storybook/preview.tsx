import type { Preview } from '@storybook/react';
import React from 'react';
import { ConfigProvider } from 'antd';
import { ThemeProvider } from '../src/theme/ThemeContext';
import 'antd/dist/reset.css';
// AG Grid uses themeQuartz API in v32+ - no CSS imports needed

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <ThemeProvider defaultTheme="light">
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#4E738A', // Blue
              colorSuccess: '#52c41a',
              colorWarning: '#faad14',
              colorError: '#ff4d4f',
              colorInfo: '#4E738A', // Blue
              borderRadius: 2, // Flat design
              borderRadiusLG: 4,
              borderRadiusSM: 2,
              borderRadiusXS: 2,
              fontFamily: "'Sequel Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif",
            },
            components: {
              Button: {
                borderRadius: 2,
              },
              Card: {
                borderRadius: 2,
                borderRadiusLG: 4,
              },
              Input: {
                borderRadius: 2,
              },
              Select: {
                borderRadius: 2,
              },
              DatePicker: {
                borderRadius: 2,
              },
              Table: {
                borderRadius: 2,
              },
              Modal: {
                borderRadius: 2,
              },
            },
          }}
        >
          <Story />
        </ConfigProvider>
      </ThemeProvider>
    ),
  ],
};

export default preview;
