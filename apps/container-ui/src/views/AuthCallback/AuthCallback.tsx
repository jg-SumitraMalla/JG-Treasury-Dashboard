import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useMsal } from "@azure/msal-react";
import { InteractionStatus } from "@azure/msal-browser";
import { Spin } from "antd";
import { colors, H4, BodyText, SmallText } from "@apac-ui-warehouse/component-warehouse";

// Theme-aware styles using CSS variables
const containerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
  backgroundColor: "var(--color-bg-primary)",
  color: "var(--color-text-primary)",
  gap: "24px",
};

export const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { instance, inProgress, accounts } = useMsal();
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const handleRedirect = async () => {
      try {
        // Handle any redirect response
        const response = await instance.handleRedirectPromise();
        
        if (response) {
          // Successfully authenticated
          instance.setActiveAccount(response.account);
        }
        
        // Check if we have accounts (either from redirect or existing session)
        if (inProgress === InteractionStatus.None) {
          if (accounts.length > 0 || response) {
            // Successfully authenticated, redirect to homepage
            navigate("/homepage", { replace: true });
          } else {
            // No accounts found, redirect to login
            navigate("/login", { replace: true });
          }
        }
      } catch (err) {
        console.error("Error handling redirect:", err);
        setError(err instanceof Error ? err.message : "Authentication failed");
        // Redirect to login after a short delay
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 5000);
      }
    };

    handleRedirect();
  }, [instance, inProgress, accounts, navigate]);

  if (error) {
    return (
      <div
        style={{
          ...containerStyle,
          padding: "20px",
          textAlign: "center",
        }}
      >
        <H4 style={{ color: colors.error, margin: 0 }}>Authentication Error</H4>
        <BodyText>{error}</BodyText>
        <SmallText style={{ color: "var(--color-text-secondary)" }}>Redirecting to login...</SmallText>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <Spin size="large" />
      <BodyText>Completing sign-in...</BodyText>
    </div>
  );
};
