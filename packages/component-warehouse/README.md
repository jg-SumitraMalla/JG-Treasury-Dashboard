# Component Warehouse

<div>
  <img src="../../splash.png" alt="Login Demo" width="1440px" />
</div>

A shared component library for the APAC UI Warehouse monorepo.

## Features

- 🌳 **Tree Shaking** - Import only what you need
- 🎨 **Bundled Styles** - Styles are automatically included (no extra imports)
- 📚 **Storybook** - Visual component development
- 🧪 **Vitest** - Fast unit testing
- ⚡ **oxlint** - Ultra-fast linting
- 💅 **Prettier** - Code formatting
- 📦 **Alias Exports** - Convenient named exports

## Installation

This package is part of the monorepo and is automatically available to other packages.

## Usage

```tsx
import { Button, Card, Dashboard, ThemeProvider } from '@apac-ui-warehouse/components';
import { colors, useTheme } from '@apac-ui-warehouse/components';

function MyComponent() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <ThemeProvider>
      <Card title="My Card">
        <Button variant="primary" size="large">
          Click me
        </Button>
      </Card>
    </ThemeProvider>
  );
}
```

Styles are automatically included - no need to import CSS separately!

## Available Components

### Layout & Navigation
- **Dashboard** - Main dashboard layout with sidebar navigation
  - `user` prop: Display user info (name, email, photo) in header
  - `onLogout` prop: Callback for logout action
  - User dropdown menu with profile info and sign-out option
- **Layout** / **LayoutItem** - Flexible layout components

### Forms & Inputs
- **Button** - Customizable button component
- **Dropdown** - Dropdown menu component
- **SearchableIdentifier** - Advanced search component for Bloomberg Ticker, ISIN, or SEDOL
- **TickerSearch** - Simplified ticker search wrapper
- **IdentifierSearch** - Identifier search component

### Display Components
- **Card** - Card container component
- **Typography** - Typography components (H1-H6, BodyText, SmallText, Caption, Body, TypographyLink)
- **Skeleton** - Loading skeleton components (Skeleton, SkeletonButton, SkeletonInput, SkeletonImage, SkeletonAvatar)
- **ProcessedFilesList** - List component for displaying processed files
- **Tabs** - Tab navigation component with simple, editable, and duplicatable variants
  - Simple variant for basic tab navigation
  - Editable variant for dynamic add/remove tabs
  - Duplicatable variant with copy icon for creating tab copies
  - Duplicated tabs follow naming: "Tab Name -1", "-2", etc.
- **TaskStatusCard** - Task status display with progress bar, cancel button, and metadata
- **HealthStatusDashboard** - System health monitoring dashboard
  - Displays FastAPI server health status
  - Shows component-level health checks (/healthz, /readyz, /livez)
  - Theme-aware styling with CSS variables
  - Supports light/dark mode automatically

### Filtering Components
- **BrokerFilter** - Multi-broker filter component
  - Two variants: `default` (dropdown) and `tags` (clickable tags)
  - Select All / Deselect All functionality
  - Searchable by broker name, key, ISIN, or SEDOL
  - Customizable styling and behavior

### Authentication
- **Login** - Login form component
- **SplashScreen** - Splash screen component with loading animation

### Theme
- **ThemeToggle** - Theme toggle button component
- **ThemeProvider** - Theme context provider
- **useTheme** - Hook for accessing theme state
- **colors** - Color palette object for use in TypeScript/JavaScript
- **getColor** - Helper function to get color values

### Theme Colors (SCSS)

Import theme colors in your SCSS files:

```scss
@import '@apac-ui-warehouse/component-warehouse/theme/colors.scss';

.my-component {
  background-color: $color-primary;
  color: $color-text-inverse;
}
```

## Development

### Build

```bash
pnpm build
```

### Storybook

```bash
pnpm storybook
```

Starts Storybook on `http://localhost:6006`

### Testing

```bash
# Run tests
pnpm test

# Run tests with UI
pnpm test:ui

# Run tests with coverage
pnpm test:coverage
```

### Linting

```bash
# Lint code
pnpm lint

# Fix linting issues
pnpm lint:fix
```

### Formatting

```bash
# Format code
pnpm format

# Check formatting
pnpm format:check
```

## Adding New Components

1. Create component directory: `src/components/MyComponent/`
2. Create component file: `MyComponent.tsx`
3. Create styles file: `myComponent.less`
4. Create index file: `index.ts`
5. Add to main export: `src/index.ts`
6. Add Storybook stories: `MyComponent.stories.tsx`
7. Add tests: `MyComponent.test.tsx`

## Component Structure

```
src/components/MyComponent/
├── MyComponent.tsx          # Component implementation
├── myComponent.less         # Component styles
├── MyComponent.stories.tsx  # Storybook stories
├── MyComponent.test.tsx     # Unit tests
└── index.ts                 # Component exports
```

## Tree Shaking

The library is configured for optimal tree shaking. When you import a component, only that component and its dependencies are included in your bundle.

```tsx
// ✅ Good - only Button is included
import { Button } from '@apac-ui-warehouse/components';

// ✅ Also good - only Button and Card are included
import { Button, Card } from '@apac-ui-warehouse/components';

// ❌ Avoid - imports everything
import * from '@apac-ui-warehouse/components';
```

## Styles

Styles are automatically bundled with components. Each component imports its own styles, and they're all bundled together in the final build. You don't need to import styles separately.

The main styles file (`src/styles/index.less`) imports all component styles, which are then bundled into a single CSS file during build.

## Theme System

The component library includes a comprehensive theme system:

### Using Theme in Components

```tsx
import { ThemeProvider, useTheme, ThemeToggle } from '@apac-ui-warehouse/components';

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <MyApp />
    </ThemeProvider>
  );
}

function MyApp() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div>
      <ThemeToggle />
      <p>Current theme: {theme}</p>
    </div>
  );
}
```

### Using Colors in TypeScript/JavaScript

```tsx
import { colors } from '@apac-ui-warehouse/components';

const style = {
  backgroundColor: colors.bgPrimary,
  color: colors.textPrimary,
  border: `1px solid ${colors.border}`,
};
```

### Using Colors in SCSS

```scss
@import '@apac-ui-warehouse/component-warehouse/theme/colors.scss';

.my-component {
  background-color: $color-bg-primary;
  color: $color-text-primary;
  padding: $spacing-md;
  border-radius: $radius-md;
  box-shadow: $shadow-md;
}
```

### Using CSS Variables (Recommended for Theme Support)

For components that need to adapt to light/dark themes automatically, use CSS variables:

```scss
.my-component {
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border-light);
}
```

Available CSS variables:
- `--color-text-primary`, `--color-text-secondary`, `--color-text-tertiary`
- `--color-bg-primary`, `--color-bg-secondary`, `--color-bg-tertiary`
- `--color-border`, `--color-border-light`, `--color-border-dark`
- `--color-sidebar-bg`, `--color-sidebar-text`

These variables automatically update when the theme changes.

See the [Theme README](./src/theme/README.md) for a complete list of available colors, spacing, and other theme variables.
