import { addons } from '@storybook/manager-api';
import { create } from '@storybook/theming/create';

const theme = create({
  base: 'light',
  brandTitle: 'APAC UI Warehouse',
  brandUrl: './',
  brandImage: '/jain_global.png',
  brandTarget: '_self',

  // Color palette
  colorPrimary: '#646cff',
  colorSecondary: '#7a91ff',

  // UI
  appBg: '#323E48',
  appContentBg: '#3D4A56',
  appPreviewBg: '#3D4A56',
  appBorderColor: '#475563',
  appBorderRadius: 8,

  // Text colors
  textColor: '#F5F7FA',
  textInverseColor: '#171717',
  textMutedColor: '#D1D5DB',

  // Toolbar default and active colors
  barTextColor: '#D1D5DB',
  barSelectedColor: '#646cff',
  barBg: '#3D4A56',

  // Form colors
  inputBg: '#475563',
  inputBorder: '#52616F',
  inputTextColor: '#F5F7FA',
  inputBorderRadius: 6,
});

addons.setConfig({
  theme,
});
