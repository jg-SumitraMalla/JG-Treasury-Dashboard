import * as React from 'react';
import { Button as AntButton, ButtonProps as AntButtonProps } from 'antd';

export type ButtonProps = AntButtonProps;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  return <AntButton ref={ref} {...props} />;
});

Button.displayName = 'Button';
