import * as React from 'react';
import { Typography as AntTypography } from 'antd';
import { colors } from '../../theme';

const { Title: AntTitle, Text: AntText, Paragraph: AntParagraph, Link: AntLink } = AntTypography;

export interface TypographyProps {
  children?: React.ReactNode;
  className?: string;
}

export interface TitleProps extends TypographyProps {
  level?: 1 | 2 | 3 | 4 | 5;
  [key: string]: any;
}

export interface TextProps extends TypographyProps {
  type?: 'secondary' | 'success' | 'warning' | 'danger';
  strong?: boolean;
  italic?: boolean;
  underline?: boolean;
  delete?: boolean;
  code?: boolean;
  mark?: boolean;
  keyboard?: boolean;
  [key: string]: any;
}

export interface ParagraphProps extends TypographyProps {
  type?: 'secondary' | 'success' | 'warning' | 'danger';
  strong?: boolean;
  italic?: boolean;
  underline?: boolean;
  delete?: boolean;
  code?: boolean;
  mark?: boolean;
  ellipsis?: boolean | { rows?: number; expandable?: boolean };
}

export interface LinkProps extends TypographyProps {
  href?: string;
  target?: string;
}

// Heading Components
export const H1: React.FC<TitleProps> = ({ children, level = 1, className, ...props }) => (
  <AntTitle level={level} className={className} {...(props as any)}>
    {children}
  </AntTitle>
);

export const H2: React.FC<TitleProps> = ({ children, level = 2, className, ...props }) => (
  <AntTitle level={level} className={className} {...(props as any)}>
    {children}
  </AntTitle>
);

export const H3: React.FC<TitleProps> = ({ children, level = 3, className, ...props }) => (
  <AntTitle level={level} className={className} {...(props as any)}>
    {children}
  </AntTitle>
);

export const H4: React.FC<TitleProps> = ({ children, level = 4, className, ...props }) => (
  <AntTitle level={level} className={className} {...(props as any)}>
    {children}
  </AntTitle>
);

export const H5: React.FC<TitleProps> = ({ children, level = 5, className, ...props }) => (
  <AntTitle level={level} className={className} {...(props as any)}>
    {children}
  </AntTitle>
);

export const H6: React.FC<TitleProps> = ({ children, level = 5, className, ...props }) => (
  <AntTitle
    level={5}
    className={className}
    style={{
      fontSize: '14px',
      fontWeight: 600,
      color: colors.textPrimary,
    }}
    {...(props as any)}
  >
    {children}
  </AntTitle>
);

// Text Components
export const BodyText: React.FC<TextProps> = ({ children, className, ...props }) => (
  <AntText className={className} {...props}>
    {children}
  </AntText>
);

export const SmallText: React.FC<TextProps> = ({ children, className, ...props }) => (
  <AntText
    className={className}
    style={{
      fontSize: '12px',
      color: colors.textPrimary,
    }}
    {...props}
  >
    {children}
  </AntText>
);

export const Caption: React.FC<TextProps> = ({ children, className, ...props }) => (
  <AntText
    className={className}
    type="secondary"
    style={{
      fontSize: '11px',
      color: colors.textSecondary,
    }}
    {...props}
  >
    {children}
  </AntText>
);

// Paragraph Component
export const Body: React.FC<ParagraphProps> = ({ children, className, ...props }) => (
  <AntParagraph className={className} {...props}>
    {children}
  </AntParagraph>
);

// Link Component
export const TypographyLink: React.FC<LinkProps> = ({ children, className, ...props }) => (
  <AntLink className={className} {...(props as any)}>
    {children}
  </AntLink>
);

// Main Typography export (wrapper)
export const Typography: React.FC<TypographyProps> = ({ children, className }) => (
  <AntTypography className={className}>{children}</AntTypography>
);

// Display names
H1.displayName = 'H1';
H2.displayName = 'H2';
H3.displayName = 'H3';
H4.displayName = 'H4';
H5.displayName = 'H5';
H6.displayName = 'H6';
BodyText.displayName = 'BodyText';
SmallText.displayName = 'SmallText';
Caption.displayName = 'Caption';
Body.displayName = 'Body';
TypographyLink.displayName = 'TypographyLink';
Typography.displayName = 'Typography';
