import * as React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider, theme as antdTheme, MenuProps } from "antd";
import {
  HomeOutlined,
  BankOutlined,
  SettingOutlined,
  LineChartOutlined,
} from "@ant-design/icons";
import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication, EventType, EventMessage, AuthenticationResult } from "@azure/msal-browser";
import {
  Dashboard,
  ThemeProvider,
  useTheme,
  colors,
} from "@apac-ui-warehouse/component-warehouse";

// Common module imports
import { HomePage, LoginPage, AuthCallback, Settings } from "./common/views";
import { ApiConfigProvider, AuthProvider, useAuth } from "./common/contexts";
import { ProtectedRoute, RoleProtectedRoute } from "./common/components";
import { queryClient } from "./common/queries";
import { msalConfig } from "./common/config";

// Treasury module imports
import { PnlDashboard } from "./treasury/views";

import packageJson from "../package.json";

// Initialize MSAL instance
const msalInstance = new PublicClientApplication(msalConfig);

// Handle redirect promise and set active account
msalInstance.initialize().then(() => {
  // Handle redirect response
  msalInstance.handleRedirectPromise().then((response) => {
    if (response) {
      msalInstance.setActiveAccount(response.account);
    }
  }).catch((error) => {
    console.error("Error handling redirect:", error);
  });

  // Set active account from cache if available
  const accounts = msalInstance.getAllAccounts();
  if (accounts.length > 0) {
    msalInstance.setActiveAccount(accounts[0]);
  }

  // Listen for sign-in events
  msalInstance.addEventCallback((event: EventMessage) => {
    if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
      const payload = event.payload as AuthenticationResult;
      msalInstance.setActiveAccount(payload.account);
    }
  });
});

function AppContent() {
  const { theme } = useTheme();
  const { userInfo, logout, hasAccess } = useAuth();

  // Generate role-based menu items
  const menuItems = React.useMemo((): MenuProps['items'] => {
    const items: MenuProps['items'] = [
      {
        key: '/homepage',
        icon: <HomeOutlined />,
        label: 'Homepage',
      },
    ];

    // Treasury submenu - build based on permissions
    const treasuryChildren: MenuProps['items'] = [];
    
    if (hasAccess('/treasury/pnl-dashboard')) {
      treasuryChildren.push({
        key: '/treasury/pnl-dashboard',
        icon: <LineChartOutlined />,
        label: 'PnL',
      });
    }

    // Only add Treasury menu if user has access to any treasury items
    if (treasuryChildren.length > 0) {
      items.push({
        key: 'treasury',
        icon: <BankOutlined />,
        label: 'Treasury',
        children: treasuryChildren,
      });
    }

    // Add divider and settings (admin only)
    items.push({ type: 'divider' });
    
    if (hasAccess('/settings')) {
      items.push({
        key: '/settings',
        icon: <SettingOutlined />,
        label: 'Settings',
      });
    }

    return items;
  }, [hasAccess]);

  return (
    <ConfigProvider
      theme={{
        algorithm:
          theme === "dark"
            ? antdTheme.darkAlgorithm
            : antdTheme.defaultAlgorithm,
        token: {
          colorPrimary: colors.primary, // Blue
          colorSuccess: colors.success,
          colorWarning: colors.warning,
          colorError: colors.error,
          colorInfo: colors.primary, // Blue
          borderRadius: 2, // Flat design - reduced from default 6
          borderRadiusLG: 4, // Flat design
          borderRadiusSM: 2, // Flat design
          borderRadiusXS: 2, // Flat design
          fontFamily:
            "'Sequel Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif",
        },
        components: {
          Button: {
            borderRadius: 2, // Flat design
          },
          Card: {
            borderRadius: 2, // Flat design
            borderRadiusLG: 4, // Flat design
          },
          Input: {
            borderRadius: 2, // Flat design
          },
          Select: {
            borderRadius: 2, // Flat design
          },
          DatePicker: {
            borderRadius: 2, // Flat design
          },
          Table: {
            borderRadius: 2, // Flat design
          },
          Modal: {
            borderRadius: 2, // Flat design
          },
          Tabs: {
            borderRadius: 2, // Flat design
            itemActiveColor: colors.primary, // Blue for active tab
            itemSelectedColor: colors.primary, // Blue for selected tab
            itemHoverColor: theme === "dark" ? colors.primaryLight : colors.primaryDark, // Hover color - lighter in dark mode, darker in light mode
            inkBarColor: colors.primary, // Blue for active indicator
            cardBg: theme === "dark" ? colors.bgDark : colors.bgPrimary, // Card background
            itemColor: theme === "dark" ? colors.textInverse : colors.textSecondary, // Text color for inactive tabs - white in dark mode, muted blue in light mode
          },
          Menu: {
            // Sidebar menu colors
            darkItemBg: colors.bgDark, // Muted Blue
            darkSubMenuItemBg: colors.bgDark, // Muted Blue
            darkItemSelectedBg: colors.primary, // Blue for selected
            darkItemHoverBg: colors.primaryDark, // Darker blue for hover
            darkItemSelectedColor: colors.textInverse, // White text for selected
            darkItemColor: colors.textInverse, // White text
            darkItemHoverColor: colors.textInverse, // White text on hover
            itemHoverBg: colors.primaryDark, // Hover background
            itemSelectedBg: colors.primary, // Selected background
            itemActiveBg: colors.primary, // Active background
            subMenuItemBg: colors.bgDark, // Submenu background
            borderRadius: 2, // Flat design
          },
          Layout: {
            siderBg: colors.bgDark, // Muted Blue for sidebar
            headerBg: theme === "dark" ? colors.bgDark : colors.bgPrimary, // Header background
            bodyBg: theme === "dark" ? colors.bgDark : colors.bgPrimary, // Body background
          },
        },
      }}
    >
      
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Dashboard
                  defaultCollapsed={false}
                  defaultSelectedKey="/homepage"
                  version={packageJson.version}
                  user={userInfo}
                  onLogout={logout}
                  menuItems={menuItems}
                >
                  <Routes>
                    <Route path="/" element={<Navigate to="/homepage" replace />} />
                    <Route path="/homepage" element={<HomePage />} />
                    {/* Treasury routes - Admin, Treasury Tenant, PM */}
                    <Route
                      path="/treasury/pnl-dashboard"
                      element={
                        <RoleProtectedRoute allowedRoles={['admin', 'treasury_tenant', 'pm']}>
                          <PnlDashboard />
                        </RoleProtectedRoute>
                      }
                    />
                    {/* Operations routes - add here when ready */}
                    {/* Risk routes - add here when ready */}
                    {/* Settings - Admin only */}
                    <Route
                      path="/settings"
                      element={
                        <RoleProtectedRoute allowedRoles={['admin']}>
                          <Settings />
                        </RoleProtectedRoute>
                      }
                    />
                    <Route path="*" element={<Navigate to="/homepage" replace />} />
                  </Routes>
                </Dashboard>
              </ProtectedRoute>
            }
          />
        </Routes>
      
    </ConfigProvider>
  );
}

function App() {
  try { 
    return (
      <BrowserRouter basename="/ui">
        <MsalProvider instance={msalInstance}>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider>
              <AuthProvider>
                <ApiConfigProvider>
                  <AppContent />
                </ApiConfigProvider>
              </AuthProvider>
            </ThemeProvider>
          </QueryClientProvider>
        </MsalProvider>
      </BrowserRouter>
    );
  } catch (error) {
    console.error(error);
    return <div>Error: {(error as Error).message}</div>;
  }
}
export default App;
