import * as React from "react";
import { Navigate } from "react-router-dom";
import { Spin } from "antd";
import { BodyText } from "@apac-ui-warehouse/component-warehouse";
import { useAuth } from "../contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading while MSAL is processing authentication
  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          backgroundColor: "var(--color-bg-primary)",
          color: "var(--color-text-primary)",
          gap: "24px",
        }}
      >
        <Spin size="large" />
        <BodyText>Loading...</BodyText>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

