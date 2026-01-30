# Changelog

All notable changes to the Container UI application will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.6] - 2026-01-14

### Added
- **Datadog RUM Integration**: Real User Monitoring for tracking user sessions and performance
  - Page views and navigation tracking across all routes
  - User session recordings with 20% sample rate in production
  - Core Web Vitals and performance metrics
  - User identification with role and email
  - Custom event tracking for business actions (searches, queries, exports)
  - Error tracking for JavaScript and API errors
  - New `useDatadog` hook for easy tracking in components
  - Environment-specific configuration (disabled in local, enabled in dev/prod)

## [0.2.0] - 2026-01-08

### Added
- **Role-Based Access Control (RBAC)**: Integrated Azure AD App Roles for permission management
  - Three security groups supported:
    - `apac-central-dashboard-admin` - Full access to all screens and features
    - `apac-central-dashboard-treasury-tenant` - Access to Treasury module
    - `apac-central-dashboard-pm` - Limited access to Bulk Query tab only
  - Roles read from ID token's `roles` claim (no additional API permissions required)
  
- **New Configuration Files**:
  - `src/common/config/roles.ts` - Role definitions, route permissions, and tab permissions
  - `src/common/components/RoleProtectedRoute.tsx` - Route protection component with "Access Denied" UI

- **Dynamic Sidebar Menu**: Menu items shown/hidden based on user permissions
  - Treasury menu only shown if user has access to any treasury items
  - Settings only visible to admin users

### Changed
- **AuthContext Enhanced**: Added role-based permission checking
  - `userRole` - User's primary role (highest privilege)
  - `userRoles` - All roles assigned to user
  - `hasAccess(path)` - Check route access
  - `hasTabPermission(path, tabKey)` - Check tab-level access
  - `getPermittedTabs(path)` - Get list of allowed tabs
  - `isAdmin` - Quick admin check

- **Dashboard Component**: Added `menuItems` prop to allow custom menu configuration
  - Enables role-based menu filtering from parent application

## [0.1.8] - 2026-01-05

### Changed
- **Codebase Restructuring**: Organized files by business verticals
  - Created `common/` module for shared functionality across all verticals
  - Created `treasury/` module for treasury-specific functionality
  - Created empty `operations/` and `risk/` modules for future development
  - Each module contains: `components/`, `config/`, `contexts/`, `queries/`, `services/`, `types/`, `utils/`, `views/`

### Added
- **Module Barrel Exports**: Each module now exports via `index.ts` for cleaner imports
  - `import { useAuth } from './common'`

### Technical
- Query keys now namespaced by business vertical (e.g., `["treasury", "tasks", ...]`)
- Health check queries moved to common module
- Treasury-specific services split from common health services

## [0.1.7] - 2026-01-05

### Added
- **Microsoft SSO Authentication**: Replaced password-based authentication with Azure AD SSO
  - Single sign-on using Microsoft organizational accounts
  - "Sign in with Microsoft" button on login page
  - Automatic user profile fetching (name, email, photo) from Microsoft Graph API
  - User avatar and name displayed in navigation header
  - Logout dropdown menu with user info and sign-out option

- **Environment Configuration**: Multi-environment support for different deployments
  - New `src/config/environment.ts` configuration file
  - Support for `local`, `development`, and `production` environments
  - Automatic environment detection based on hostname
  - Environment-specific redirect URIs for Azure AD

- **Environment Indicator**: Visual indicator showing current build environment
  - Tag displayed on login page (bottom of login card)
  - Color-coded: Blue (local), Orange (development), Green (production)

- **New Build Scripts**: Environment-specific build commands
  - `npm run dev` - Local development (localhost:5173)
  - `npm run dev:dev` - Development with remote URLs
  - `npm run build:dev` - Build for development environment
  - `npm run build:prod` - Build for production environment
  - `npm run package:prod` - Package for production deployment

### Changed
- **Login Page**: Simplified to SSO-only authentication
  - Removed username/password form
  - Clean card design with logo, welcome message, and SSO button
  - Uses theme-consistent styling from component library

- **AuthContext**: Streamlined for SSO-only flow
  - Removed local authentication logic
  - Added `userInfo` object with name, email, and photo URL
  - Integrated Microsoft Graph API for user photo fetching

- **Protected Routes**: Simplified authentication checks
  - Removed session checking for local auth
  - Uses MSAL authentication state directly

- **AuthCallback**: Updated to use theme-aware typography and colors
  - Uses `H4`, `BodyText`, `SmallText` from component library
  - CSS variables for proper light/dark mode support

### Removed
- **Password Authentication**: Removed local username/password login
  - Removed `login()` function from AuthContext
  - Removed `authType` tracking (local vs SSO)
  - Removed session expiration logic for local auth
  - Removed localStorage keys for local authentication

### Technical
- Added `postLogoutRedirectUri` from environment config
- MSAL redirect URIs configured per environment
- User photo cleanup on component unmount (blob URL revocation)

## [0.0.8] - 2025-12-11

### Added

### Changed
- **Views Folder Structure**: Reorganized views into individual folders
  - Each view now has its own folder with component, test, and index files
  - Shared styles remain in `views.module.scss` at views root
  - Barrel export via `views/index.ts`
- **Status Checks**: All status comparisons now use lowercase for consistency
  - `getStatusIcon` and `getStatusColor` functions use `status.toLowerCase()`
  - Status display uses `.toUpperCase()` for user-facing labels
- **Tabs Color Scheme**: Updated tab styling for better dark mode support
  - Active/selected tab colors use primary theme color
  - Proper text contrast in both light and dark modes

### Fixed
- **Dark Mode Contrast**: Fixed visibility issues in dark mode
  - Tab text now properly visible in dark mode
  - Task ID code block has proper contrast
  - Progress bar metadata text readable in dark mode

## [0.0.7] - 2025-12-03
### Added
- **Settings Panel**: Added API configuration settings page with backend environment toggle
  - Users can switch between Production (`https://rpm-fastapi-dev.tech1dev.jainglobal.net`) and Localhost (`http://localhost:9000`)
  - Preference is saved in localStorage and persists across page reloads
  - Default backend is set to Production
- **SearchableIdentifier Component Integration**: Integrated reusable search component from component-warehouse
  - Supports searching by Bloomberg Ticker, ISIN, or SEDOL
  - AutoComplete dropdown with debounced search
  - Toggle between ticker mode and ISIN/SEDOL mode
- **Cancellable API Calls**: Implemented request cancellation for better performance
  - Search API calls are cancelled when new searches are triggered
  - Timeseries API calls are cancelled when new searches are initiated
  - Prevents duplicate API calls and race conditions
  - Uses AbortController for proper request cancellation

### Changed
- **Router Base Path**: Changed base path from `/UI` to `/ui` (lowercase)
- **Router Fallback**: Added fallback route to `/homepage` for unmatched routes
- **Bloomberg Ticker Normalization**: Fixed ticker normalization to append "2" suffix
  - Tickers matching pattern "space + single letter" now automatically get "2" appended
  - Example: "002371 C" becomes "002371 C2" before API call
- **AutoComplete Enter Key Handling**: Improved Enter key behavior
  - Enter key now triggers search with typed value when no dropdown selection is active
  - Enter key triggers search with selected dropdown value when selection is active
  - Prevents double-triggering of search events
- **API Base URL Management**: Refactored to use dynamic API base URL from settings
  - All API calls now use the selected backend from Settings
  - Service functions updated to read from localStorage or use default
  - Real-time switching between backends without page reload

### Fixed
- **Test Errors**: Fixed router basename issues in tests
  - Mocked `window.location.pathname` to match router basename
  - Updated test assertions to use proper testing library queries
- **Search Type Toggle**: Fixed issue where search type wasn't updating when toggling between ticker and ISIN/SEDOL modes
- **Dropdown Results Display**: Fixed issue where search results weren't displaying in AutoComplete dropdown
- **Enter Key Search**: Fixed issue where pressing Enter after typing directly didn't trigger search
- **Dashboard Storybook Story**: Fixed component-warehouse Dashboard Storybook story failing with "useTheme must be in a provider" error
  - Added ThemeProvider wrapper to Dashboard story decorators in component-warehouse
  - Story now properly wraps component with both ThemeProvider and BrowserRouter

### Removed
- **Task History Page**: Removed standalone Task History page
  - Removed route `/treasury/task-history`
  - Removed menu item from navigation
- **Search Identifiers from HomePage**: Removed search identifiers box from dashboard home page
- **IdentifiersProvider**: Removed unused IdentifiersContext and IdentifiersProvider
  - No longer needed as search functionality uses direct API calls
  - Simplified component tree

### Technical
- Updated all service functions to support AbortSignal for request cancellation
- Added cleanup effects to cancel pending requests on component unmount
- Improved error handling for aborted requests (no error messages for cancelled requests)
- Updated test files to include ApiConfigProvider wrapper where needed
- Simplified test mocks and removed unused dependencies

## [0.0.5] - Previous Version

### Added
- Initial release with basic dashboard structure
- HomePage with welcome section and quick stats
- Basic routing and navigation

