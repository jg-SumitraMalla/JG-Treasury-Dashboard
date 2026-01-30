// APAC UI Warehouse Color Theme - TypeScript Constants
// Standard color palette used across the entire project

export const colors = {
  // Primary Colors - Blue
  primary: '#4E738A',
  primaryHover: '#3e5c6f',
  primaryLight: '#6b8fa3',
  primaryDark: '#3a5566',
  primaryLighter: '#8ba5b8',
  primaryDarker: '#2d4250',

  // Secondary Colors - Provence
  secondary: '#7A97AB',
  secondaryHover: '#6a87a1',
  secondaryLight: '#8ba5b8',
  secondaryDark: '#5a7a8f',
  secondaryLighter: '#9cb5c7',
  secondaryDarker: '#4a6a7d',

  // Semantic Colors
  success: '#52c41a',
  successHover: '#389e0d',
  successLight: '#73d13d',
  successDark: '#389e0d',
  successLighter: '#95de64',
  successDarker: '#237804',

  warning: '#faad14',
  warningHover: '#d48806',
  warningLight: '#ffc53d',
  warningDark: '#d48806',
  warningLighter: '#ffd666',
  warningDarker: '#ad6800',

  error: '#ff4d4f',
  errorHover: '#cf1322',
  errorLight: '#ff7875',
  errorDark: '#cf1322',
  errorLighter: '#ffa39e',
  errorDarker: '#a8071a',

  info: '#1890ff',
  infoHover: '#096dd9',
  infoLight: '#40a9ff',
  infoDark: '#096dd9',
  infoLighter: '#69c0ff',
  infoDarker: '#0050b3',

  // Neutral Colors
  textPrimary: '#231F20', // Black - primary text on light backgrounds
  textSecondary: '#323E48', // Muted Blue - secondary text
  textTertiary: '#4E738A', // Blue - tertiary text
  textDisabled: '#7A97AB', // Provence - disabled text
  textInverse: '#FFFFFF', // White - text on dark backgrounds

  bgPrimary: '#FFFFFF', // White - main background
  bgSecondary: '#E7E7E0', // Limestone - secondary background
  bgTertiary: '#F5F5F5', // Light gray for subtle backgrounds
  bgDisabled: '#E7E7E0', // Limestone - disabled background
  bgDark: '#323E48', // Muted Blue - dark background (sidebar)
  bgDarkSecondary: '#231F20', // Black - darker background

  border: '#7A97AB', // Provence - default borders
  borderLight: '#E7E7E0', // Limestone - light borders
  borderDark: '#4E738A', // Blue - dark borders
  borderHover: '#4E738A', // Blue - hover borders

  // Grayscale - proper progression
  gray50: '#F5F5F5', // Very light gray
  gray100: '#E7E7E0', // Limestone
  gray200: '#D9D9D9', // Light gray
  gray300: '#7A97AB', // Provence
  gray400: '#4E738A', // Blue
  gray500: '#323E48', // Muted Blue
  gray600: '#323E48', // Muted Blue
  gray700: '#231F20', // Black
  gray800: '#231F20', // Black
  gray900: '#231F20', // Black

  // Shadows (as CSS strings for box-shadow)
  shadowSm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  shadowMd: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  shadowLg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  shadowXl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  
  // Drop-shadow compatible shadows (single shadow values for filter: drop-shadow())
  dropShadowSm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  dropShadowMd: '0 4px 6px rgba(0, 0, 0, 0.1)',
  dropShadowLg: '0 10px 15px rgba(0, 0, 0, 0.1)',
  dropShadowXl: '0 20px 25px rgba(0, 0, 0, 0.1)',
} as const;

// Type for color keys
export type ColorKey = keyof typeof colors;

// Helper function to get color value
export const getColor = (key: ColorKey): string => colors[key];

// Export default
export default colors;
