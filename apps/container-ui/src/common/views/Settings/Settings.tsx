import * as React from "react";
import {
  Card,
  H3,
  BodyText,
  Layout,
  LayoutItem,
} from "@apac-ui-warehouse/component-warehouse";
import { Space, Alert, Button, Tag } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import { useApiConfig } from "../../contexts/ApiConfigContext";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { getEnvironmentInfo } from "../../config/environment";
import styles from "../views.module.scss";

export const Settings: React.FC = () => {
  const { apiBaseUrl, environment } = useApiConfig();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const envInfo = getEnvironmentInfo();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const getEnvTagColor = () => {
    switch (environment) {
      case 'local':
        return 'blue';
      case 'development':
        return 'orange';
      case 'production':
        return 'green';
      default:
        return 'default';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.2,
      }}
      className={styles.viewContainer}
    >
      <Layout gap={16}>
        <LayoutItem span={12}>
          <Card 
            title="Application Configuration" 
            className={styles.card}
            extra={
              <Button
                icon={<LogoutOutlined />}
                onClick={handleLogout}
                danger
              >
                Logout
              </Button>
            }
          >
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              <div>
                <H3>Current Environment</H3>
                <BodyText type="secondary">
                  The application environment is determined at build time.
                </BodyText>
              </div>

              <Alert
                message={
                  <Space>
                    <span>Environment:</span>
                    <Tag color={getEnvTagColor()}>{envInfo.displayName}</Tag>
                  </Space>
                }
                description={
                  <Space direction="vertical" size="small">
                    <BodyText>
                      <strong>API Base URL:</strong>{" "}
                      <BodyText code>{apiBaseUrl}</BodyText>
                    </BodyText>
                  </Space>
                }
                type="info"
                showIcon
              />

              <BodyText type="secondary">
                To change the environment, rebuild the application with the appropriate VITE_APP_ENV flag:
              </BodyText>
              <BodyText code>
                VITE_APP_ENV=development npm run build
              </BodyText>
            </Space>
          </Card>
        </LayoutItem>
      </Layout>
    </motion.div>
  );
};
