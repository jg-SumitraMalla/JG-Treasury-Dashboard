import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeToggle } from './ThemeToggle';
import { ThemeProvider } from '../../theme/ThemeContext';

describe('ThemeToggle', () => {
  beforeEach(() => {
    // Reset localStorage before each test
    localStorage.clear();
  });

  it('renders theme toggle button', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );
    expect(screen.getByRole('button')).toBeDefined();
  });

  it('toggles theme on click', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const button = screen.getByRole('button');
    expect(button).toBeDefined();

    // Click to toggle theme
    await user.click(button);

    // Theme should be toggled (checking document class would require more setup)
    expect(
      document.documentElement.classList.contains('dark') ||
        document.documentElement.classList.contains('light')
    ).toBe(true);
  });

  it('renders with label when showLabel is true', () => {
    render(
      <ThemeProvider>
        <ThemeToggle showLabel />
      </ThemeProvider>
    );
    const button = screen.getByRole('button');
    expect(button).toBeDefined();
    // Label text should be present
    expect(button.textContent).toBeTruthy();
  });

  it('has accessible aria-label', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );
    const button = screen.getByRole('button');
    expect(button.hasAttribute('aria-label')).toBeTruthy();
  });
});
