import * as React from 'react';
import { Row, Col } from 'antd';

export interface LayoutProps {
  children?: React.ReactNode;
  gap?: number | [number, number];
  className?: string;
}

export interface LayoutItemProps {
  span?: number;
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  xxl?: number;
  offset?: number;
  children?: React.ReactNode;
  className?: string;
}

// Layout Container Component
export const Layout: React.FC<LayoutProps> = ({ children, gap = 16, className }) => {
  const [gutterX, gutterY] = Array.isArray(gap) ? gap : [gap, gap];

  return (
    <Row gutter={[gutterX, gutterY]} className={className} style={{ width: '100%' }}>
      {children}
    </Row>
  );
};

// Layout Item Component (wraps Col with 12-column system)
export const LayoutItem: React.FC<LayoutItemProps> = ({
  span = 12,
  xs,
  sm,
  md,
  lg,
  xl,
  xxl,
  offset = 0,
  children,
  className,
}) => {
  // Convert 12-column system to Ant Design's 24-column system
  const convertSpan = (val?: number) => (val ? (val / 12) * 24 : undefined);

  return (
    <Col
      span={convertSpan(span)}
      xs={convertSpan(xs)}
      sm={convertSpan(sm)}
      md={convertSpan(md)}
      lg={convertSpan(lg)}
      xl={convertSpan(xl)}
      xxl={convertSpan(xxl)}
      offset={convertSpan(offset)}
      className={className}
    >
      {children}
    </Col>
  );
};

Layout.displayName = 'Layout';
LayoutItem.displayName = 'LayoutItem';
