import * as React from 'react';
import { Card as AntCard, CardProps as AntCardProps } from 'antd';

export type CardProps = AntCardProps;

export const Card = React.forwardRef<HTMLDivElement, CardProps>((props, ref) => {
  return <AntCard ref={ref} {...props} />;
});

Card.displayName = 'Card';
