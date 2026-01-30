import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  BodyText,
  SmallText,
  Caption,
  Body,
  TypographyLink,
} from './Typography';

describe('Typography', () => {
  describe('Heading Components', () => {
    it('renders H1', () => {
      render(<H1>Heading 1</H1>);
      expect(screen.getByText('Heading 1')).toBeDefined();
    });

    it('renders H2', () => {
      render(<H2>Heading 2</H2>);
      expect(screen.getByText('Heading 2')).toBeDefined();
    });

    it('renders H3', () => {
      render(<H3>Heading 3</H3>);
      expect(screen.getByText('Heading 3')).toBeDefined();
    });

    it('renders H4', () => {
      render(<H4>Heading 4</H4>);
      expect(screen.getByText('Heading 4')).toBeDefined();
    });

    it('renders H5', () => {
      render(<H5>Heading 5</H5>);
      expect(screen.getByText('Heading 5')).toBeDefined();
    });

    it('renders H6', () => {
      render(<H6>Heading 6</H6>);
      expect(screen.getByText('Heading 6')).toBeDefined();
    });
  });

  describe('Text Components', () => {
    it('renders BodyText', () => {
      render(<BodyText>Body text content</BodyText>);
      expect(screen.getByText('Body text content')).toBeDefined();
    });

    it('renders SmallText', () => {
      render(<SmallText>Small text content</SmallText>);
      expect(screen.getByText('Small text content')).toBeDefined();
    });

    it('renders Caption', () => {
      render(<Caption>Caption text</Caption>);
      expect(screen.getByText('Caption text')).toBeDefined();
    });

    it('renders Body', () => {
      render(<Body>Body paragraph content</Body>);
      expect(screen.getByText('Body paragraph content')).toBeDefined();
    });

    it('renders TypographyLink', () => {
      render(<TypographyLink href="https://example.com">Link text</TypographyLink>);
      const link = screen.getByRole('link');
      expect(link).toBeDefined();
      expect(link.getAttribute('href')).toBe('https://example.com');
    });
  });

  describe('Text Props', () => {
    it('renders BodyText with type prop', () => {
      render(<BodyText type="secondary">Secondary text</BodyText>);
      expect(screen.getByText('Secondary text')).toBeDefined();
    });

    it('renders BodyText with strong prop', () => {
      render(<BodyText strong>Strong text</BodyText>);
      expect(screen.getByText('Strong text')).toBeDefined();
    });

    it('renders BodyText with code prop', () => {
      render(<BodyText code>Code text</BodyText>);
      expect(screen.getByText('Code text')).toBeDefined();
    });
  });
});
