# APAC UI Warehouse Theme

<div>
  <img src="../../../../splash.png" alt="Login Demo" width="1440px" />
</div>

This directory contains the color theme system used across the entire project.

The theme system includes:
- **Color Palette** - Comprehensive color variables for SCSS and TypeScript
- **Theme Context** - React context for light/dark theme switching
- **ThemeProvider** - Context provider component
- **useTheme** - Hook for accessing theme state

## Usage

### Theme Context (Light/Dark Mode)

Wrap your application with `ThemeProvider` to enable theme switching:

```tsx
import { ThemeProvider, useTheme, ThemeToggle } from '@apac-ui-warehouse/component-warehouse';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="my-app-theme">
      <MyApp />
    </ThemeProvider>
  );
}

function MyApp() {
  const { theme, toggleTheme, setTheme } = useTheme();
  
  return (
    <div>
      <ThemeToggle />
      <button onClick={toggleTheme}>Toggle Theme</button>
      <button onClick={() => setTheme('dark')}>Set Dark</button>
      <p>Current theme: {theme}</p>
    </div>
  );
}
```

The `ThemeProvider` automatically:
- Applies theme classes (`light` or `dark`) to the document root
- Persists theme preference in localStorage
- Detects system preference on first load

### In SCSS/SCSS Modules

Import the colors in your SCSS files:

```scss
@import '@apac-ui-warehouse/component-warehouse/theme/colors.scss';

.my-component {
  background-color: $color-primary;
  color: $color-text-inverse;
  border: 1px solid $color-border;
}
```

### In TypeScript/JavaScript

Import the colors object:

```typescript
import { colors, getColor } from '@apac-ui-warehouse/component-warehouse';

// Use directly
const primaryColor = colors.primary;

// Or use the helper function
const secondaryColor = getColor('secondary');
```

### Available Colors

#### Primary Colors

- `$color-primary` / `colors.primary`
- `$color-primary-hover` / `colors.primaryHover`
- `$color-primary-light` / `colors.primaryLight`
- `$color-primary-dark` / `colors.primaryDark`

#### Secondary Colors

- `$color-secondary` / `colors.secondary`
- `$color-secondary-hover` / `colors.secondaryHover`
- `$color-secondary-light` / `colors.secondaryLight`
- `$color-secondary-dark` / `colors.secondaryDark`

#### Semantic Colors

- Success: `$color-success` / `colors.success`
- Warning: `$color-warning` / `colors.warning`
- Error: `$color-error` / `colors.error`
- Info: `$color-info` / `colors.info`

#### Text Colors

- `$color-text-primary` / `colors.textPrimary`
- `$color-text-secondary` / `colors.textSecondary`
- `$color-text-tertiary` / `colors.textTertiary`
- `$color-text-disabled` / `colors.textDisabled`
- `$color-text-inverse` / `colors.textInverse`

#### Background Colors

- `$color-bg-primary` / `colors.bgPrimary`
- `$color-bg-secondary` / `colors.bgSecondary`
- `$color-bg-tertiary` / `colors.bgTertiary`
- `$color-bg-disabled` / `colors.bgDisabled`
- `$color-bg-dark` / `colors.bgDark`
- `$color-bg-dark-secondary` / `colors.bgDarkSecondary`

#### Border Colors

- `$color-border` / `colors.border`
- `$color-border-light` / `colors.borderLight`
- `$color-border-dark` / `colors.borderDark`
- `$color-border-hover` / `colors.borderHover`

#### Grayscale

- `$color-gray-50` through `$color-gray-900` / `colors.gray50` through `colors.gray900`

#### Shadows

- `$shadow-sm` / `colors.shadowSm`
- `$shadow-md` / `colors.shadowMd`
- `$shadow-lg` / `colors.shadowLg`
- `$shadow-xl` / `colors.shadowXl`

#### Spacing

- `$spacing-xs` (4px)
- `$spacing-sm` (8px)
- `$spacing-md` (16px)
- `$spacing-lg` (24px)
- `$spacing-xl` (32px)
- `$spacing-2xl` (48px)

#### Border Radius

- `$radius-sm` (4px)
- `$radius-md` (6px)
- `$radius-lg` (8px)
- `$radius-xl` (12px)
- `$radius-full` (9999px)

## CSS Variables (Recommended for Theme-Aware Components)

For components that need to automatically adapt to light/dark themes, use CSS variables instead of SCSS variables:

### Available CSS Variables

```scss
// Text Colors
var(--color-text-primary)
var(--color-text-secondary)
var(--color-text-tertiary)
var(--color-text-disabled)
var(--color-text-inverse)

// Background Colors
var(--color-bg-primary)
var(--color-bg-secondary)
var(--color-bg-tertiary)
var(--color-bg-disabled)

// Border Colors
var(--color-border)
var(--color-border-light)
var(--color-border-dark)
var(--color-border-hover)
var(--color-card-border)

// Sidebar Colors
var(--color-sidebar-bg)
var(--color-sidebar-text)
var(--color-sidebar-hover)
var(--color-sidebar-selected)
```

### Using CSS Variables in SCSS

```scss
.my-component {
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border-light);
  transition: background-color 0.3s ease, color 0.3s ease;
}
```

### Using CSS Variables in Inline Styles

```tsx
const MyComponent = () => {
  return (
    <div
      style={{
        backgroundColor: 'var(--color-bg-primary)',
        color: 'var(--color-text-primary)',
        border: '1px solid var(--color-border-light)',
      }}
    >
      Theme-aware content
    </div>
  );
};
```

The CSS variables are defined in `theme.scss` and automatically switch values based on the presence of the `.dark` class on the document root.

## Examples

### Using in a React Component with Inline Styles

```tsx
import { colors } from '@apac-ui-warehouse/component-warehouse';

const MyComponent = () => {
  return (
    <div
      style={{
        backgroundColor: colors.bgPrimary,
        color: colors.textPrimary,
        border: `1px solid ${colors.border}`,
      }}
    >
      Content
    </div>
  );
};
```

### Using Theme-Aware Inline Styles (Recommended)

```tsx
const MyComponent = () => {
  return (
    <div
      style={{
        backgroundColor: 'var(--color-bg-primary)',
        color: 'var(--color-text-primary)',
        border: '1px solid var(--color-border)',
      }}
    >
      Auto-switching theme content
    </div>
  );
};
```

### Using in SCSS Module

```scss
// MyComponent.module.scss
@import '@apac-ui-warehouse/component-warehouse/theme/colors.scss';

.container {
  background-color: $color-bg-primary;
  color: $color-text-primary;
  padding: $spacing-md;
  border-radius: $radius-md;
  box-shadow: $shadow-md;

  &:hover {
    background-color: $color-bg-secondary;
    border-color: $color-border-hover;
  }
}
```

### Using Theme-Aware SCSS (Recommended)

```scss
// MyComponent.module.scss
@import '@apac-ui-warehouse/component-warehouse/theme/colors.scss';

.container {
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
  padding: $spacing-md;
  border-radius: $radius-md;
  box-shadow: $shadow-md;
  border: 1px solid var(--color-border-light);
  transition: background-color 0.3s ease, border-color 0.3s ease;

  &:hover {
    background-color: var(--color-bg-secondary);
    border-color: var(--color-border-hover);
  }
}
```
