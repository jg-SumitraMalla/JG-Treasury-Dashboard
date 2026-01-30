import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeDefined();
  });

  it('handles click events', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    render(<Button onClick={handleClick}>Click me</Button>);

    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders with different types', () => {
    const { rerender } = render(<Button type="primary">Primary</Button>);
    expect(screen.getByRole('button')).toBeDefined();

    rerender(<Button type="dashed">Dashed</Button>);
    expect(screen.getByRole('button')).toBeDefined();

    rerender(<Button type="link">Link</Button>);
    expect(screen.getByRole('button')).toBeDefined();
  });

  it('renders loading button', () => {
    render(<Button loading>Loading</Button>);
    expect(screen.getByRole('button')).toBeDefined();
  });

  it('renders with different sizes', () => {
    const { rerender } = render(<Button size="small">Small</Button>);
    expect(screen.getByRole('button')).toBeDefined();

    rerender(<Button size="middle">Middle</Button>);
    expect(screen.getByRole('button')).toBeDefined();

    rerender(<Button size="large">Large</Button>);
    expect(screen.getByRole('button')).toBeDefined();
  });
});
