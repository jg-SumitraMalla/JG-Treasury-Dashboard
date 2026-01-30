import * as React from 'react';
import { Button } from 'antd';
import { SunOutlined, MoonOutlined } from '@ant-design/icons';
import { useTheme } from '../../theme/ThemeContext';
import styles from './ThemeToggle.module.scss';

export interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className, showLabel = false }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      type="text"
      icon={theme === 'light' ? <MoonOutlined /> : <SunOutlined />}
      onClick={toggleTheme}
      className={`${styles.themeToggle} ${className || ''}`}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {showLabel && (theme === 'light' ? 'Dark Mode' : 'Light Mode')}
    </Button>
  );
};

ThemeToggle.displayName = 'ThemeToggle';
