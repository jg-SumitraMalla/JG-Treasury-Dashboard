# APAC UI Warehouse

<div>
  <img src="./splash.png" alt="Login Demo" width="1440px" />
</div>


A monorepo application built with React, TypeScript, and Vitest.

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Vitest** - Unit testing framework
- **Less & SCSS** - CSS preprocessors for styling
- **pnpm** - Package manager with workspaces
- **Ant Design (antd)** - UI component library
- **AG Grid** - Data grid and charts
- **React Router** - Client-side routing
- **Framer Motion** - Animation library
- **Storybook** - Component development and documentation

## Project Structure

```
apac-ui-warehouse/
├── apps/
│   └── container-ui/           # React application
│       ├── src/                # Source code
│       └── package.json
├── packages/
│   └── component-warehouse/    # Shared component library
│       ├── src/
│       │   ├── components/     # React components
│       │   ├── styles/         # Global styles
│       │   └── index.ts        # Main export file
│       ├── .storybook/         # Storybook configuration
│       └── package.json
├── package.json                # Root package.json
├── pnpm-workspace.yaml         # Workspace configuration
└── tsconfig.json               # Root TypeScript config
```

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0 (for workspaces support)

### Installation

```bash
# Install dependencies
pnpm install
```

### Development

```bash
# Start the development server
pnpm run dev

# Or run from the container-ui app directly
cd apps/container-ui
pnpm run dev
```

The app will be available at `http://localhost:5173/ui`

## Testing

### Unit Tests (Vitest)

```bash
# Run unit tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## Building

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Styling

This project uses **Less** and **SCSS** for styling. You can import `.less` or `.scss` files directly in your components:

```tsx
import "./MyComponent.less";
// or
import "./MyComponent.module.scss";
```

The component-warehouse package also provides a theme system with color variables that can be imported in SCSS files.

## Adding New Apps

To add a new app to the monorepo:

1. Create a new directory under `apps/`
2. Set up the app with its own `package.json`
3. The workspace will automatically include it

## Container UI Application

The `container-ui` app is the main React application that provides:

### Features

- 🔐 **Authentication** - Login system with protected routes
- 📊 **Dashboard** - Main navigation and layout
- 🏠 **Homepage** - Welcome page with quick stats
- 💰 **Treasury Module**:
  - **PnL Dashboard** - PnL visualization and reporting
- ⚙️ **Settings** - API configuration and backend environment toggle
- 🎨 **Theme System** - Light/dark mode support

### Available Routes

- `/ui/login` - Login page
- `/ui/homepage` - Homepage dashboard
- `/ui/treasury/pnl-dashboard` - pnl visualization
- `/ui/settings` - Application settings

## Component Warehouse Package

The `component-warehouse` package is a shared component library that can be used across different applications in the monorepo.

### Features

- ✅ **Tree Shaking** - Only import what you need
- ✅ **Alias Exports** - Convenient named exports for components
- ✅ **Bundled Styles** - Styles are automatically included with components (no extra imports needed)
- ✅ **Storybook** - Visual component development and documentation
- ✅ **Vitest** - Unit testing framework
- ✅ **oxlint** - Fast linting
- ✅ **Prettier** - Code formatting
- ✅ **Theme System** - Light/dark theme support with ThemeProvider

### Available Components

- **Layout & Navigation**: `Dashboard`, `Layout`, `LayoutItem`
- **Forms & Inputs**: `Button`, `Dropdown`, `SearchableIdentifier`, `TickerSearch`, `IdentifierSearch`
- **Display**: `Card`, `Typography` (H1-H6, BodyText, SmallText, Caption, etc.), `Skeleton`, `ProcessedFilesList`
- **Authentication**: `Login`, `SplashScreen`
- **Theme**: `ThemeToggle`, `ThemeProvider`, `useTheme` hook
- **Theme Colors**: Exported color palette for use in SCSS and TypeScript

### Using Components

```tsx
// Import components (styles are automatically included)
import { Button, Card, Dashboard, ThemeProvider } from "@apac-ui-warehouse/components";

// Import theme utilities
import { colors, useTheme } from "@apac-ui-warehouse/components";

// Example usage
function MyComponent() {
  return (
    <ThemeProvider>
      <Card title="My Card">
        <Button variant="primary">Click me</Button>
      </Card>
    </ThemeProvider>
  );
}
```

### Component Warehouse Scripts

```bash
# Build the component library
pnpm run components:build

# Start Storybook (runs on http://localhost:6006)
pnpm run components:storybook

# Build Storybook for production
pnpm run components:build-storybook

# Run tests
pnpm run components:test

# Run tests with UI
pnpm run components:test:ui

# Run tests with coverage
pnpm run components:test:coverage

# Lint with oxlint
pnpm run components:lint

# Format code with Prettier
pnpm run components:format
```

### Adding New Components

1. Create a new component directory under `packages/component-warehouse/src/components/`
2. Create the component file (e.g., `MyComponent.tsx`)
3. Create the styles file (e.g., `myComponent.less`)
4. Create an `index.ts` file to export the component
5. Add the component to `packages/component-warehouse/src/index.ts`
6. Add Storybook stories (e.g., `MyComponent.stories.tsx`)
7. Add tests (e.g., `MyComponent.test.tsx`)

## Scripts

### Root Level

#### Container UI

- `pnpm run dev` - Start development server
- `pnpm run build` - Build for production
- `pnpm test` - Run unit tests
- `pnpm run test:ui` - Run tests with UI
- `pnpm run test:coverage` - Run tests with coverage
- `pnpm run lint` - Run linter
- `pnpm run preview` - Preview production build
- `pnpm run package` - Build and copy to apac-realtime-process-manager

#### Component Warehouse

- `pnpm run components:dev` - Build components in watch mode
- `pnpm run components:build` - Build component library
- `pnpm run components:storybook` - Start Storybook (port 6006)
- `pnpm run components:build-storybook` - Build Storybook for production
- `pnpm run components:test` - Run component tests
- `pnpm run components:test:ui` - Run tests with UI
- `pnpm run components:test:coverage` - Run tests with coverage
- `pnpm run components:lint` - Lint with oxlint
- `pnpm run components:format` - Format code with Prettier
- `pnpm run components:package` - Build Storybook and copy to apac-realtime-process-manager

### App Level

All scripts can be run from the root using `pnpm run <script> --filter <package-name>` or from within the package directory.

## License

Private

# apac-ui-warehouse
