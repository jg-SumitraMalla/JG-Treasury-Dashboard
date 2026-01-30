import * as React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@apac-ui-warehouse/component-warehouse";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HomePage } from "./HomePage";

// Mock the useHealth hooks
vi.mock("../../common/queries/useHealth", () => ({
  useAllHealthStatus: () => ({
    fastApiHealth: {
      status: "healthy",
      components: {
        api: "ok",
        database: "ok",
        security_cache: "ok (150000 records)",
        celery: "ok (2 workers)",
      },
    },
    fastApiReady: {
      status: "ready",
      database: "connected",
    },
    fastApiLive: {
      status: "alive",
    },
    isLoading: false,
    isError: false,
    error: null,
    refetchAll: vi.fn(),
  }),
}));

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = createTestQueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>{children}</BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

describe("HomePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders system health dashboard title", () => {
    render(
      <Wrapper>
        <HomePage />
      </Wrapper>,
    );
    expect(screen.getByText(/System Health Dashboard/i)).toBeInTheDocument();
  });

  it("renders health monitoring description", () => {
    render(
      <Wrapper>
        <HomePage />
      </Wrapper>,
    );
    expect(
      screen.getByText(/Monitor the health status of the FastAPI server/i),
    ).toBeInTheDocument();
  });

  it("renders refresh button", () => {
    render(
      <Wrapper>
        <HomePage />
      </Wrapper>,
    );
    expect(screen.getByRole("button", { name: /Refresh/i })).toBeInTheDocument();
  });

  it("renders FastAPI Server section", () => {
    render(
      <Wrapper>
        <HomePage />
      </Wrapper>,
    );
    expect(screen.getByRole("heading", { name: /FastAPI Server/i })).toBeInTheDocument();
  });

  it("renders endpoint summary section", () => {
    render(
      <Wrapper>
        <HomePage />
      </Wrapper>,
    );
    expect(screen.getByText(/Endpoint Summary/i)).toBeInTheDocument();
  });
});
