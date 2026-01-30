import * as React from "react";
import { Form, Input, Button, Card } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import { BodyText, H3 } from "../Typography";
import { colors } from "../../theme";
import type { FormProps } from "antd";


export interface LoginProps {
  /** Background image URL */
  backgroundImage?: string;
  /** Logo image URL */
  logoImage?: string;
  /** Callback when form is submitted */
  onLogin?: (values: { username: string; password: string }) => void;
  /** Loading state */
  loading?: boolean;
  /** Show splash screen before login */
  showSplash?: boolean;
  /** Splash screen duration in milliseconds */
  splashDuration?: number;
  /** Variant style */
  variant?: "default" | "centered" | "split" | "minimal";
  /** Additional form props */
  formProps?: FormProps;
  /** Custom footer content */
  footer?: React.ReactNode;
}

export const Login: React.FC<LoginProps> = ({
  backgroundImage,
  logoImage,
  onLogin,
  loading = false,
  showSplash = false,
  splashDuration = 2000,
  variant = "default",
  formProps,
  footer,
}) => {
  const [showLogin, setShowLogin] = React.useState(!showSplash);
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (showSplash) {
      const timer = setTimeout(() => {
        setShowLogin(true);
      }, splashDuration);
      return () => clearTimeout(timer);
    }
  }, [showSplash, splashDuration]);

  const handleSubmit = (values: { username: string; password: string }) => {
    onLogin?.(values);
  };

  const containerStyle: React.CSSProperties = {
    height: "100vh",
    width: "100%",
    maxHeight: "100vh",
    maxWidth: "100vw",
    position: "relative",
    display: "flex",
    alignItems: "center", // Always center vertically
    justifyContent: "center", // Always center horizontally
    padding: variant === "minimal" ? "20px" : "20px",
    boxSizing: "border-box",
    overflow: "auto",
    backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
    backgroundColor: backgroundImage ? undefined : colors.bgDark, // Use bgDark when no background image
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };

  const overlayStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: variant === "minimal" 
      ? `${colors.bgPrimary}F0` // 95% opacity white
      : backgroundImage 
        ? `rgba(0, 0, 0, 0.6)` // Darker overlay for better contrast when background image exists
        : "transparent", // No overlay when using solid background color
    zIndex: 0,
  };

  const cardStyle: React.CSSProperties = {
    position: "relative",
    zIndex: 1,
    width: variant === "minimal" ? "100%" : variant === "split" ? "450px" : "400px",
    maxWidth: "calc(100% - 40px)", // Account for container padding
    maxHeight: "calc(100vh - 40px)", // Account for container padding
    boxSizing: "border-box",
    overflow: "auto",
    boxShadow: variant === "minimal" 
      ? "none" 
      : colors.shadowXl, // Use theme shadow for dark card
    borderRadius: variant === "minimal" ? 0 : 8,
    backgroundColor: variant === "minimal" 
      ? "transparent" 
      : colors.bgDark, // Dark background for login card
    backdropFilter: variant === "minimal" ? "none" : "blur(10px)",
    border: variant === "minimal" ? "none" : `1px solid ${colors.borderDark}`,
  };

  const contentStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: variant === "split" ? "32px" : "24px",
  };

  if (!showLogin && showSplash) {
    return null; // Splash screen will be handled by parent or separate component
  }

  return (
    <div style={containerStyle} className="login-container">
      {backgroundImage && <div style={overlayStyle} />}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
          duration: 0.3,
        }}
        style={{ width: variant === "split" ? "100%" : "auto", maxWidth: "100%", maxHeight: "100%" }}
        className="login-card"
      >
        <Card style={cardStyle} bordered={variant !== "minimal"}>
          <div style={contentStyle}>
            {logoImage && (
              <div style={{ textAlign: "center", marginBottom: variant === "split" ? 0 : "16px" }}>
                <img
                  src={logoImage}
                  alt="Logo"
                  style={{
                    maxWidth: variant === "split" ? "200px" : "150px",
                    height: "auto",
                    filter: variant === "minimal" ? "none" : `drop-shadow(${colors.dropShadowSm})`,
                  }}
                />
              </div>
            )}

            <div style={{ textAlign: "center" }} >
              <div style={{ marginBottom: "8px" }}>
                <H3 style={{color: colors.textInverse}}>Welcome Back</H3>
              </div>
              <div style={{ marginBottom: variant === "split" ? 0 : "24px" }}>
                <BodyText type="secondary" style={{color: colors.textInverse}}>
                  Sign in to your account
                </BodyText>
              </div>
            </div>

            <Form
              form={form}
              name="login"
              onFinish={handleSubmit}
              layout="vertical"
              size="large"
              {...formProps}
            >
              <Form.Item
                name="username"
                rules={[{ required: true, message: "Please input your username!" }]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Username"
                  autoComplete="username"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: "Please input your password!" }]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Password"
                  autoComplete="current-password"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  style={{
                    height: "44px",
                    fontSize: "16px",
                    fontWeight: 500,
                  }}
                >
                  Sign In
                </Button>
              </Form.Item>
            </Form>

            {footer && <div>{footer}</div>}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

