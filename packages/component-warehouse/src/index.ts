// Import styles so they're included in the build
import './styles';

// Main entry point - exports all components
export * from './components/Button';
export * from './components/Card';
export * from './components/Dropdown';
export * from './components/Dashboard';
export * from './components/Layout';
export * from './components/Tabs';
export * from './components/Typography';
export * from './components/ThemeToggle';
export * from './components/Skeleton';
export * from './components/ProcessedFilesList';
export * from './components/IdentifierSearch';
export * from './components/SearchableIdentifier';
export * from './components/TickerSearch';
export * from './components/Login';
export * from './components/SplashScreen';
export * from './components/TaskStatusCard';
export * from './components/BrokerFilter';

// Export theme
export * from './theme';
export { colors, getColor, type ColorKey } from './theme';

// Alias exports for components
export { Button } from './components/Button';
export type { ButtonProps } from './components/Button';

export { Card } from './components/Card';
export type { CardProps } from './components/Card';

export { Dropdown } from './components/Dropdown';
export type { DropdownProps } from './components/Dropdown';

export { Dashboard } from './components/Dashboard';
export type { DashboardProps } from './components/Dashboard';

export { Tabs, TabPane } from './components/Tabs';
export type { TabsProps } from './components/Tabs';

export { Layout, LayoutItem } from './components/Layout';
export type { LayoutProps, LayoutItemProps } from './components/Layout';

export {
  Typography,
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
} from './components/Typography';
export type {
  TypographyProps,
  TitleProps,
  TextProps,
  ParagraphProps,
  LinkProps,
} from './components/Typography';

export { ThemeToggle } from './components/ThemeToggle';
export type { ThemeToggleProps } from './components/ThemeToggle';

export {
  Skeleton,
  SkeletonButton,
  SkeletonInput,
  SkeletonImage,
  SkeletonAvatar,
} from './components/Skeleton';
export type { SkeletonProps } from './components/Skeleton';

export { ProcessedFilesList } from './components/ProcessedFilesList';
export type { ProcessedFilesListProps } from './components/ProcessedFilesList';

export { IdentifierSearch } from './components/IdentifierSearch';
export type { IdentifierSearchProps } from './components/IdentifierSearch';

export { SearchableIdentifier } from './components/SearchableIdentifier';
export type { SearchableIdentifierProps, SearchableIdentifierRef, SearchResult } from './components/SearchableIdentifier';

export { TickerSearch } from './components/TickerSearch';
export type { TickerSearchProps, TickerSearchResult } from './components/TickerSearch';

export { Login } from './components/Login';
export type { LoginProps } from './components/Login';

export { SplashScreen } from './components/SplashScreen';
export type { SplashScreenProps } from './components/SplashScreen';

export { TaskStatusCard } from './components/TaskStatusCard';
export type { TaskStatusCardProps, TaskStatus, TaskMetadata } from './components/TaskStatusCard';

export { BrokerFilter } from './components/BrokerFilter';
export type { BrokerFilterProps, BrokerOption } from './components/BrokerFilter';

export { HealthStatusDashboard } from './components/HealthStatusDashboard';
export type {
  HealthStatusDashboardProps,
  HealthStatus,
  ReadyStatus,
  LiveStatus,
  FastAPIHealthResponse,
  FastAPIReadyResponse,
  FastAPILiveResponse,
} from './components/HealthStatusDashboard';
