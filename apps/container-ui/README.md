# Container UI

The main React application for the APAC UI Warehouse monorepo.

## Features

- 🔐 **Microsoft SSO Authentication** - Azure AD single sign-on with organizational accounts
- 🛡️ **Role-Based Access Control (RBAC)** - Azure AD App Roles for permission management
- 👤 **User Profile** - User name and photo displayed in navigation header with logout dropdown
- 📊 **Dashboard** - Main navigation and layout with collapsible sidebar
- 🏠 **Homepage** - System health dashboard with service status monitoring
- 📈 **Datadog RUM** - Real User Monitoring for performance and user journey tracking
- 💰 **Treasury Module**:
- ⚙️ **Settings** - API configuration and backend environment toggle (Admin only)
- 🎨 **Theme System** - Light/dark mode support with Ant Design integration
- 🌐 **Multi-Environment** - Support for local, development, and production deployments

## Project Structure

The codebase is organized by business verticals with shared functionality in the `common` module.

```
container-ui/
├── src/
│   ├── common/              # Shared across all business verticals
│   │   ├── components/      # Common components (ProtectedRoute)
│   │   ├── config/          # Environment & MSAL configuration
│   │   ├── contexts/        # Auth & API config contexts
│   │   ├── queries/         # Query client & health queries
│   │   ├── services/        # Health check services
│   │   ├── types/           # Common types (errors, health)
│   │   ├── utils/           # CSV export utilities
│   │   ├── views/           # Shared views (Home, Login, Settings, AuthCallback)
│   │   └── index.ts         # Barrel export
│   │
│   ├── treasury/            # Treasury business vertical
│   │   ├── components/      # Treasury-specific components
│   │   ├── queries/         # Treasury queries (if any)
│   │   ├── services/        # Treasury services (PnL)
│   │   ├── types/           # Treasury-specific types
│   │   ├── utils/           # Treasury utilities
│   │   ├── views/           # PnlDashboard
│   │   └── index.ts         # Barrel export
│   │
│   ├── operations/          # Operations business vertical (empty)
│   │   ├── components/
│   │   ├── queries/
│   │   ├── services/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── views/
│   │   └── index.ts
│   │
│   ├── risk/                # Risk business vertical (empty)
│   │   ├── components/
│   │   ├── queries/
│   │   ├── services/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── views/
│   │   └── index.ts
│   │
│   ├── views/               # Legacy views (being migrated)
│   │   └── IngestManager/
│   │
│   ├── App.tsx              # Main application with routing
│   └── main.tsx             # Entry point
│
├── public/                  # Static assets
├── package.json
├── vite.config.ts
└── tsconfig.json
```

### Module Organization

Each business vertical (treasury, operations, risk) follows the same structure:

| Folder | Purpose |
|--------|---------|
| `components/` | UI components specific to the vertical |
| `config/` | Vertical-specific configuration |
| `contexts/` | React contexts for state management |
| `queries/` | TanStack Query hooks for data fetching |
| `services/` | API service functions |
| `types/` | TypeScript type definitions |
| `utils/` | Utility functions |
| `views/` | Page components/views |

### Import Convention

```typescript
// Common module imports
import { useAuth, AuthProvider } from './common/contexts';
import { HomePage, LoginPage } from './common/views';
import { queryClient } from './common/queries';

// Treasury module imports
import { PnlDashboard } from './treasury/views';

// Operations module imports (when ready)
import { SomeView } from './operations/views';

// Risk module imports (when ready)
import { RiskDashboard } from './risk/views';
```

## Available Routes

| Route | Description | Access |
|-------|-------------|--------|
| `/ui/login` | Login page with Microsoft SSO | Public |
| `/ui/auth/callback` | Azure AD authentication callback | Public |
| `/ui/homepage` | Homepage with system health dashboard | All roles |
|`/ui/treasury/pnl-dashboard` | pnl visualization | All roles* |
| `/ui/settings` | Application settings | Admin only |

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0

### Installation

```bash
# From monorepo root
pnpm install
```

### Development

```bash
# Start development server (local environment)
pnpm run dev

# Start development server with dev environment URLs
pnpm run dev:dev

# Or from this directory
cd apps/container-ui
pnpm run dev
```

The app will be available at `http://localhost:5173/ui`

### Testing

```bash
# Run unit tests
pnpm test

# Run tests in watch mode
pnpm test -- --watch

# Run tests with UI
pnpm run test:ui

# Run tests with coverage
pnpm run test:coverage
```

### Building

```bash
# Build for local environment (default)
pnpm run build

# Build for development environment
pnpm run build:dev

# Build for production environment
pnpm run build:prod

# Preview production build
pnpm run preview
```

### Packaging for Deployment

```bash
# Package for local environment
pnpm run package

# Package for development environment
pnpm run package:dev

# Package for production environment
pnpm run package:prod

# Clean package output
pnpm run clean-package
```

## Authentication

The application uses Microsoft Azure AD for Single Sign-On (SSO) authentication.

### Azure AD Configuration

The MSAL (Microsoft Authentication Library) is configured in `src/config/msalConfig.ts`:

- **Client ID**: Azure AD Application (client) ID
- **Tenant ID**: Azure AD Directory (tenant) ID
- **Redirect URI**: Environment-specific callback URL
- **Scopes**: `User.Read`, `openid`, `profile`, `email`

### User Profile

After authentication, the application:
- Fetches user information from Microsoft Graph API
- Displays user name and photo in the navigation header
- Provides a logout dropdown menu

### Protected Routes

All routes except `/login` and `/auth/callback` are protected and require authentication.

## Role-Based Access Control (RBAC)

The application uses Azure AD App Roles for permission management. Roles are read from the ID token's `roles` claim.

### Security Groups / App Roles

| Role Name | Internal Role | Description |
|-----------|---------------|-------------|
| `apac-central-dashboard-admin` | `admin` | Full access to all screens and features |
| `apac-central-dashboard-treasury-tenant` | `treasury_tenant` | Access to Treasury module |
| `apac-central-dashboard-pm` | `pm` | Limited access to Bulk Query only |

### Access Matrix

| Feature | Admin | Treasury Tenant | PM |
|---------|-------|-----------------|-----|
| Homepage | ✅ | ✅ | ✅ |
| Settings | ✅ | ❌ | ❌ |
### Configuration

Role permissions are configured in `src/common/config/roles.ts`:

```typescript
// Route-level permissions
export const ROUTE_PERMISSIONS: RoutePermission[] = [
  {
    path: '/homepage',
    allowedRoles: ['admin', 'treasury_tenant', 'pm'],
  },
    {
    path: '/treasury/pnl-dashboard',
    allowedRoles: ['admin', 'treasury_tenant', 'pm'],
  },
  // ...
];
```

### Using Permission Hooks

```typescript
import { useAuth } from './common/contexts';

function MyComponent() {
  const { userRole, hasAccess, hasTabPermission, isAdmin } = useAuth();
  
  // Check if user can access a route
  // Quick admin check
  if (isAdmin) {
    // Show admin features
  }
}
```

### Azure AD Setup

To enable RBAC, the Azure AD app must be configured with App Roles:

1. Go to **Azure Portal** → **App registrations** → Your app
2. Go to **App roles** → **Create app role**
3. Create roles matching the names above
4. Assign users to security groups that are linked to these app roles
5. Users must log out and log back in to receive updated roles in their token

## Environment Configuration

The application supports multiple deployment environments configured in `src/config/environment.ts`:

| Environment | Base URL | Description |
|-------------|----------|-------------|
| `local` | `http://localhost:5173` | Local development |
| `development` | `https://apac-rpm-fastapi-dev.tech1dev.jainglobal.net` | Development server |
| `production` | `https://apac-rpm-fastapi.jainglobal.net` | Production server |

The environment is determined by:
1. `VITE_APP_ENV` environment variable (set during build)
2. Hostname detection as fallback

### Environment Indicator

The login page displays a color-coded tag indicating the current environment:
- 🔵 **Blue**: Local
- 🟠 **Orange**: Development
- 🟢 **Green**: Production

## API Configuration

The application supports two backend API environments:

- **Production**: `https://apac-rpm-fastapi-dev.tech1dev.jainglobal.net`
- **Localhost**: `http://localhost:9000`

Users can switch between environments in the Settings page. The preference is persisted in localStorage.

## Key Features

## Datadog Real User Monitoring (RUM)

The application integrates Datadog RUM for monitoring user experience and performance.

### What's Monitored

| Category | Details |
|----------|---------|
| **Page Views** | Route changes, page load times, time on page |
| **User Sessions** | Session recordings, user journeys (20% sample in prod) |
| **Performance** | Core Web Vitals (LCP, FID, CLS), API latency |
| **User Actions** | Button clicks, searches, exports, tab switches |
| **Errors** | JavaScript errors, network failures |
| **User Identity** | Name, email, role (set on login) |

### Configuration

Datadog is configured differently per environment:

| Environment | Enabled | Session Rate | Replay Rate |
|-------------|---------|--------------|-------------|
| Local | ❌ No | - | - |
| Development | ✅ Yes | 100% | 50% |
| Production | ✅ Yes | 100% | 20% |

### Custom Event Tracking

Use the `useDatadog` hook to track custom events:

```typescript
import { useDatadog } from './common/hooks';

function MyComponent() {
  const { trackSearch, trackExport, trackBulkQuery } = useDatadog();

  const handleSearch = (value: string) => {
    trackSearch({
      searchType: 'ticker',
      searchValue: value,
      resultsCount: results.length,
    });
  };

  const handleExport = () => {
    trackExport({
      format: 'csv',
      rowCount: data.length,
      source: 'bulk_query',
    });
  };
}
```

### Available Tracking Methods

- `trackSearch()` - Search execution with type and results
- `trackQueryByDate()` - Date-based queries
- `trackBulkQuery()` - Bulk ticker queries
- `trackPMRatesQuery()` - PM Rates queries
- `trackExport()` - CSV/XLSX exports
- `trackTabSwitch()` - Tab navigation
- `trackFileView()` - File viewing
- `trackTaskTrigger()` - Task triggers
- `trackBrokerFilter()` - Broker filter changes
- `trackError()` - Error tracking

## Dependencies

- **React 18** - UI library
- **React Router DOM** - Client-side routing
- **Ant Design** - UI component library
- **AG Charts** - Data visualization (charts only)
- **TanStack Query** - Data fetching and caching
- **Framer Motion** - Animations
- **Day.js** - Date manipulation
- **xlsx** - Excel file generation with formula support
- **@datadog/browser-rum** - Datadog Real User Monitoring
- **@datadog/browser-rum-react** - Datadog React integration
- **@apac-ui-warehouse/component-warehouse** - Shared component library

## License

Private

