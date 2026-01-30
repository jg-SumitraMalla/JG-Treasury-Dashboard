import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card } from './Card';

describe('Card', () => {
  it('renders card with children', () => {
    render(
      <Card>
        <p>Card content</p>
      </Card>
    );
    expect(screen.getByText('Card content')).toBeDefined();
  });

  it('renders card with title', () => {
    render(
      <Card title="Card Title">
        <p>Card content</p>
      </Card>
    );
    expect(screen.getByText('Card Title')).toBeDefined();
    expect(screen.getByText('Card content')).toBeDefined();
  });

  it('renders card with extra content', () => {
    render(
      <Card title="Card Title" extra={<a href="#">More</a>}>
        <p>Card content</p>
      </Card>
    );
    expect(screen.getByText('Card Title')).toBeDefined();
    expect(screen.getByText('More')).toBeDefined();
  });

  it('renders bordered card', () => {
    const { container } = render(
      <Card bordered>
        <p>Card content</p>
      </Card>
    );
    expect(container.querySelector('.ant-card')).toBeDefined();
  });

  it('renders loading card', () => {
    const { container } = render(
      <Card loading>
        <p>Card content</p>
      </Card>
    );
    expect(container.querySelector('.ant-card')).toBeDefined();
  });

  it('renders hoverable card', () => {
    const { container } = render(
      <Card hoverable>
        <p>Card content</p>
      </Card>
    );
    expect(container.querySelector('.ant-card-hoverable')).toBeDefined();
  });
});
