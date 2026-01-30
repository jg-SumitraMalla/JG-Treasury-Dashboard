import * as React from "react";
import { SplashScreen, H3, BodyText } from "@apac-ui-warehouse/component-warehouse";
import { colors } from "@apac-ui-warehouse/component-warehouse";
import { useAuth } from "../../common/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Alert, Button, Card, Spin, Tag } from "antd";
import { WindowsOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import { currentEnvironment } from "../../common/config/environment";

// Images from public folder - Vite serves these at the root
// Since base path is /ui, we need to use /ui/ prefix
const fullLogoWhite = "/ui/full_logo_white.png";

export const LoginPage: React.FC = () => {
  const { loginWithSSO, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [ssoLoading, setSsoLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [showSplash, setShowSplash] = React.useState(true);

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate("/homepage", { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleSSOLogin = async () => {
    setSsoLoading(true);
    setError(null);

    try {
      await loginWithSSO();
      // Redirect will be handled by MSAL
    } catch (err) {
      setError("An error occurred during SSO login. Please try again.");
      setSsoLoading(false);
    }
  };

  if (showSplash) {
    return (
      <SplashScreen
        logoImage={fullLogoWhite}
        duration={2000}
        backgroundColor={colors.bgDarkSecondary}
        showLoading
        onComplete={() => setShowSplash(false)}
      />
    );
  }

  // Show loading while MSAL is processing
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
        <BodyText>Checking authentication...</BodyText>
      </div>
    );
  }

  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        maxHeight: "100vh",
        maxWidth: "100vw",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        boxSizing: "border-box",
        overflow: "auto",
        backgroundColor: colors.bgDark,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
          duration: 0.3,
        }}
        style={{ width: "auto", maxWidth: "100%", maxHeight: "100%" }}
      >
        <Card
          style={{
            position: "relative",
            zIndex: 1,
            width: "400px",
            maxWidth: "calc(100% - 40px)",
            maxHeight: "calc(100vh - 40px)",
            boxSizing: "border-box",
            overflow: "auto",
            boxShadow: colors.shadowXl,
            borderRadius: 8,
            backgroundColor: colors.bgDark,
            backdropFilter: "blur(10px)",
            border: `1px solid ${colors.borderDark}`,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "24px",
            }}
          >
            {/* Environment Tag */}


            {/* Logo */}
            <div style={{ textAlign: "center", marginBottom: "16px" }}>
              <img
                src={fullLogoWhite}
                alt="Logo"
                style={{
                  maxWidth: "150px",
                  height: "auto",
                  filter: `drop-shadow(${colors.dropShadowSm})`,
                }}
              />
            </div>

            {/* Title */}
            <div style={{ textAlign: "center" }}>
              <div style={{ marginBottom: "8px" }}>
                <H3 style={{ color: colors.textInverse }}>Welcome</H3>
              </div>
              <div style={{ marginBottom: "24px" }}>
                <BodyText type="secondary" style={{ color: colors.textInverse }}>
                  Sign in with your organization account
                </BodyText>
              </div>
            </div>

            {/* Error Alert */}
            {error && (
              <Alert
                message={error}
                type="error"
                showIcon
                closable
                onClose={() => setError(null)}
                style={{ marginBottom: "8px", textAlign: "left" }}
              />
            )}

            {/* SSO Button */}
            <Button
              type="primary"
              icon={<WindowsOutlined />}
              onClick={handleSSOLogin}
              loading={ssoLoading}
              block
              size="large"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                backgroundColor: "#0078d4",
                borderColor: "#0078d4",
                color: colors.textInverse,
                height: "44px",
                fontWeight: 500,
                fontSize: "16px",
              }}
            >
              Sign in with Microsoft
            </Button>

            {/* Help text */}
            <div style={{ textAlign: "center" }}>
              <BodyText
                type="secondary"
                style={{
                  fontSize: "12px",
                  color: colors.textInverse,
                  opacity: 0.7,
                }}
              >
                Use your organization's Microsoft account
              </BodyText>
            </div>
            <div >
              <Tag
                color={currentEnvironment === "local" ? "blue" : currentEnvironment === "development" ? "orange" : "green"}
                style={{
                  fontSize: "10px",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  letterSpacing: "0.5px",
                }}
              >
                {currentEnvironment}
              </Tag>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};
