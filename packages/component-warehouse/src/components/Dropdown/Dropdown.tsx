import * as React from 'react';
import { Dropdown as AntDropdown, DropdownProps as AntDropdownProps } from 'antd';

export type DropdownProps = AntDropdownProps;

export const Dropdown = React.forwardRef<HTMLElement, DropdownProps>((props: AntDropdownProps) => {
  return <AntDropdown {...props} />;
});

Dropdown.displayName = 'Dropdown';
