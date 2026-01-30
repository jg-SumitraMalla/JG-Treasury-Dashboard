import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Layout, LayoutItem } from './Layout';

describe('Layout', () => {
  it('renders layout with children', () => {
    render(
      <Layout>
        <LayoutItem span={12}>
          <div>Item 1</div>
        </LayoutItem>
        <LayoutItem span={12}>
          <div>Item 2</div>
        </LayoutItem>
      </Layout>
    );
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  it('renders layout with custom gap', () => {
    const { container } = render(
      <Layout gap={24}>
        <LayoutItem span={12}>
          <div>Item</div>
        </LayoutItem>
      </Layout>
    );
    expect(container.querySelector('.ant-row')).toBeInTheDocument();
  });

  it('renders layout item with span', () => {
    render(
      <Layout>
        <LayoutItem span={6}>
          <div>Half width</div>
        </LayoutItem>
      </Layout>
    );
    expect(screen.getByText('Half width')).toBeInTheDocument();
  });

  it('renders layout item with offset', () => {
    render(
      <Layout>
        <LayoutItem span={6} offset={3}>
          <div>Offset item</div>
        </LayoutItem>
      </Layout>
    );
    expect(screen.getByText('Offset item')).toBeInTheDocument();
  });

  it('renders responsive layout items', () => {
    render(
      <Layout>
        <LayoutItem span={12} xs={12} sm={6} md={4}>
          <div>Responsive item</div>
        </LayoutItem>
      </Layout>
    );
    expect(screen.getByText('Responsive item')).toBeInTheDocument();
  });
});
