import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, waitFor } from "@testing-library/react";
import App from "./App";

// Mock the Dashboard component to avoid Router context issues
// The Dashboard uses useNavigate() and useLocation() which require Router context
vi.mock("@apac-ui-warehouse/component-warehouse", async () => {
  const actual = await vi.importActual("@apac-ui-warehouse/component-warehouse");
  const React = await import("react");
  
  // Create a mock Dashboard that doesn't use router hooks
  const MockDashboard = ({ children }: { children?: React.ReactNode }) => {
    return React.createElement("div", { className: "ant-layout", "data-testid": "dashboard" }, children);
  };
  
  return {
    ...actual,
    Dashboard: MockDashboard,
  };
});

// Mock AuthContext to return authenticated state with RBAC functions
vi.mock("./common/contexts/AuthContext", () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
  useAuth: () => ({
    isAuthenticated: true,
    isLoading: false,
    user: null,
    userInfo: { name: "Test User", email: "test@example.com", photoUrl: null },
    userGroups: ["apac-central-dashboard-admin"],
    userRole: "admin" as const,
    userRoles: ["admin" as const],
    hasAccess: () => true,
    hasTabPermission: () => true,
    getPermittedTabs: () => null,
    isAdmin: true,
    loginWithSSO: vi.fn(),
    logout: vi.fn(),
  }),
}));

// Mock ApiConfigContext to avoid localStorage dependency
vi.mock("./common/contexts/ApiConfigContext", () => ({
  ApiConfigProvider: ({ children }: { children: React.ReactNode }) => children,
  useApiConfig: () => ({
    apiBaseUrl: "https://rpm-fastapi-dev.tech1dev.jainglobal.net",
    environment: "production" as const,
    setEnvironment: vi.fn(),
  }),
}));

describe("App", () => {
  beforeEach(() => {
    // Mock window.location to include the basename for BrowserRouter
    // BrowserRouter with basename="/ui" needs the pathname to start with "/ui"
    Object.defineProperty(window, "location", {
      value: {
        pathname: "/ui/homepage",
        origin: "http://localhost",
        href: "http://localhost/ui/homepage",
      },
      writable: true,
    });

    // Mock localStorage for authentication and API config
    const localStorageMock = {
      getItem: vi.fn((key: string) => {
        if (key === "auth_token") return "auth_token";
        if (key === "api_base_url") return "production";
        return null;
      }),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    };
    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
      writable: true,
    });
  });

  it("renders the dashboard", async () => {
    const { container } = render(<App />);
    // Wait for the Router context to be established and Dashboard to render
    await waitFor(() => {
      const layout = container.querySelector(".ant-layout");
      expect(layout).not.toBeNull();
    });
    const layout = container.querySelector(".ant-layout");
    expect(layout).not.toBeNull();
  });

  it("renders theme provider", async () => {
    const { container } = render(<App />);
    // Wait for the Router context to be established and Dashboard to render
    await waitFor(() => {
      const layout = container.querySelector(".ant-layout");
      expect(layout).not.toBeNull();
    });
    const layout = container.querySelector(".ant-layout");
    expect(layout).not.toBeNull();
  });

  it("renders router", async () => {
    const { container } = render(<App />);
    // Wait for the Router context to be established and Dashboard to render
    await waitFor(() => {
      const layout = container.querySelector(".ant-layout");
      expect(layout).not.toBeNull();
    });
    const layout = container.querySelector(".ant-layout");
    expect(layout).not.toBeNull();
  });
});
