import { describe, it, expect } from 'vitest';
import { colors, getColor, type ColorKey } from './colors';

describe('colors', () => {
  it('exports colors object', () => {
    expect(colors).toBeDefined();
    expect(typeof colors).toBe('object');
  });

  it('has primary color', () => {
    expect(colors.primary).toBe('#4E738A');
  });

  it('has secondary color', () => {
    expect(colors.secondary).toBe('#7A97AB');
  });

  it('has semantic colors', () => {
    expect(colors.success).toBe('#52c41a');
    expect(colors.warning).toBe('#faad14');
    expect(colors.error).toBe('#ff4d4f');
    expect(colors.info).toBe('#1890ff');
  });

  it('has text colors', () => {
    expect(colors.textPrimary).toBe('#231F20');
    expect(colors.textSecondary).toBe('#323E48');
    expect(colors.textInverse).toBe('#FFFFFF');
  });

  it('has background colors', () => {
    expect(colors.bgPrimary).toBe('#FFFFFF');
    expect(colors.bgSecondary).toBe('#E7E7E0');
    expect(colors.bgDark).toBe('#323E48');
  });

  it('has border colors', () => {
    expect(colors.border).toBe('#7A97AB');
    expect(colors.borderLight).toBe('#E7E7E0');
  });

  it('has grayscale colors', () => {
    expect(colors.gray50).toBe('#F5F5F5');
    expect(colors.gray900).toBe('#231F20');
  });

  it('has shadow styles', () => {
    expect(colors.shadowSm).toBeDefined();
    expect(colors.shadowMd).toBeDefined();
    expect(colors.shadowLg).toBeDefined();
    expect(colors.shadowXl).toBeDefined();
  });
});

describe('getColor', () => {
  it('returns color value for valid key', () => {
    expect(getColor('primary')).toBe('#4E738A');
    expect(getColor('secondary')).toBe('#7A97AB');
    expect(getColor('success')).toBe('#52c41a');
  });

  it('returns color for text colors', () => {
    expect(getColor('textPrimary')).toBe('#231F20');
    expect(getColor('textSecondary')).toBe('#323E48');
  });

  it('returns color for background colors', () => {
    expect(getColor('bgPrimary')).toBe('#FFFFFF');
    expect(getColor('bgDark')).toBe('#323E48');
  });
});
