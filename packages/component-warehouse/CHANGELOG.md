# Changelog

All notable changes to the Component Warehouse package will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.4.0] - 2026-01-05

### Added
- **Dashboard User Profile**: User information display in navigation header
  - New `user` prop accepting `UserInfo` object (name, email, photoUrl)
  - New `onLogout` callback prop for logout handling
  - User avatar with photo or default icon
  - User name displayed next to avatar (hidden on mobile)
  - Dropdown menu with user info and "Sign out" option
  - Exported `UserInfo` type from Dashboard component

### Changed
- **HealthStatusDashboard**: Removed gradients, using solid colors from palette
  - Dashboard container uses `var(--color-bg-secondary)` instead of gradient
  - Icon containers use solid `rgba($color-primary, 0.15)` background
  - Summary header uses solid `$color-primary` background
  - All sections now use CSS variables for theme-aware colors
  - Removed `isDark` conditional logic throughout component
  - Simplified `ComponentStatus` props (removed `isDark` parameter)

- **Theme System**: Improved dark mode contrast and layering
  - `--color-bg-secondary`: Changed from black to slightly darker blue (`#2a343d`)
  - `--color-bg-tertiary`: Changed from black to lighter blue (`#3a4a56`)
  - `--color-border-light`: Adjusted for better visibility in dark mode (`#4a5a66`)
  - Creates proper visual hierarchy with distinct background layers

- **Typography in Dashboard**: Uses CSS variables for theme compliance
  - All text colors use `var(--color-text-primary)` and `var(--color-text-secondary)`
  - Proper color inversion between light and dark modes
  - Dropdown menu content uses inline CSS variables for portal rendering

### Removed
- **HealthStatusDashboard**: Removed theme hook dependency
  - Removed `useTheme` import and `isDark` variable
  - Removed `.dark` and `.cardDark` CSS class selectors
  - All styling now handled via CSS variables automatically

### Technical
- Added smooth transitions for theme switching (`transition: 0.3s ease`)
- Dashboard header now uses flexbox with proper spacing for user profile
- User profile dropdown renders correctly in Ant Design portals
- Exported `UserInfo` type for external usage

## [1.3.0] - 2025-12-29

### Added
- **Duplicatable Tabs**: Enhanced Tabs component with tab duplication support
  - New `DuplicatableTabs` Storybook story demonstrating duplication functionality
  - New `DuplicatableEditableTabs` variant with copy icon for easy duplication
  - Duplicated tabs follow naming convention: "Original -1", "Original -2", etc.
  - Supports independent state for each duplicated tab
  - Works with editable tabs (add/remove/duplicate)

### Changed
- Updated Tabs component stories to showcase duplication patterns

## [1.2.0] - 2025-12-18

### Added
- **BrokerFilter Component**: New component for filtering data by brokers
  - Two variants: `default` (multi-select dropdown) and `tags` (clickable tags)
  - Select All / Deselect All functionality
  - Search by broker name, key, ISIN, or SEDOL
  - Customizable label, placeholder, and styling
  - Clear button to reset selection
  - Full dark mode support
  - Storybook stories demonstrating all variants and use cases

### Removed
- **DataGrid Component**: Removed AG Grid based DataGrid component
  - Component was replaced with simpler Ant Design Table implementation
  - Removed AG Grid dependencies (`ag-grid-community`, `ag-grid-react`)
  - Removed related Storybook stories

### Changed
- Reduced bundle size significantly by removing AG Grid dependencies
- Cleaned up Storybook configuration

## [1.1.0] - 2025-12-11

### Added
- **Tabs Component**: New tab navigation component using Ant Design Tabs
  - Supports `simple` and `editable` variants
  - Editable variant allows adding and removing tabs dynamically
  - Configurable tab position (top, bottom, left, right)
  - Multiple size options (small, middle, large)
  - Full TypeScript support with exported types
  - Storybook stories demonstrating all variants
- **TaskStatusCard Component**: New task status display component
  - Shows task status with visual icon (pending, progress, started, success, failure, retry)
  - Progress bar with percentage display
  - Task ID display with copy-to-clipboard functionality
  - Cancel button with confirmation dialog for running tasks
  - Clear button to reset and start new task
  - Error alert display for failed tasks
  - Metadata display showing current/total progress
  - Dark mode support with proper color contrast
  - Storybook stories for all states

### Changed
- Updated component exports in main index file
- Added `ag-charts-community` as peer dependency for chart components

### Fixed
- **TaskStatusCard**: Fixed text contrast issues in dark mode
  - Task ID code block now uses theme-aware colors
  - Progress metadata text uses proper contrast colors for dark/light themes

## [1.0.0] - 2025-12-03

### Added
- **SearchableIdentifier Component**: New reusable search component for identifier lookup
  - Supports searching by Bloomberg Ticker, ISIN, or SEDOL
  - AutoComplete dropdown with debounced search functionality
  - Toggle switch to switch between ticker mode and ISIN/SEDOL mode
  - ISIN/SEDOL selector dropdown when not in ticker mode
  - Loading states and error handling
  - Configurable debounce delay and minimum search length
  - Bloomberg ticker normalization (appends "2" suffix when needed)
  - Proper Enter key handling for both typed and selected values
  - Exposes `cancelSearch()` method via ref for cancelling pending requests
  - Full TypeScript support with exported types
- **TickerSearch Component**: Basic component wrapper for ticker search functionality
  - Storybook stories included
- **Request Cancellation Support**: SearchableIdentifier supports AbortController
  - Automatically cancels previous search requests when new ones are triggered
  - Prevents duplicate API calls and race conditions
  - Proper cleanup on component unmount

### Changed
- **Dashboard Navigation**: Updated menu items
  - Removed "Task History" menu item from Treasury submenu
  - Simplified navigation structure

### Fixed
- **Dashboard Storybook Story**: Fixed Storybook story failing with "useTheme must be in a provider" error
  - Added ThemeProvider wrapper to Dashboard story decorators
  - Story now properly wraps component with both ThemeProvider and BrowserRouter

### Technical
- Added forwardRef support to SearchableIdentifier for imperative handle access
- Implemented useImperativeHandle for exposing cancelSearch method
- Added proper TypeScript types for all component props and refs
- Exported SearchableIdentifierRef type for parent component usage
- Updated component exports in main index file

## [0.1.0] - Previous Version

### Added
- Initial component library structure
- Button component
- Card component
- Dropdown component
- Layout components (Layout, LayoutItem)
- Typography components (H1-H6, Body, BodyText, SmallText, Caption, TypographyLink)
- ThemeToggle component
- Skeleton components
- ProcessedFilesList component
- Dashboard component with navigation
- Theme system with color palette
- Storybook configuration
- TypeScript definitions

