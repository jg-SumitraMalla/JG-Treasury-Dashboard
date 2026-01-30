import * as React from "react";
import {
  Card,
  H2,
  Body,
  HealthStatusDashboard,
} from "@apac-ui-warehouse/component-warehouse";
import { Button, Space, Alert } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import { useAllHealthStatus } from "../../common/queries/useHealth";
import styles from "../views.module.scss";

export const HomePage: React.FC = () => {
  const {
    fastApiHealth,
    fastApiReady,
    fastApiLive,
    isLoading,
    isError,
    error,
    refetchAll,
  } = useAllHealthStatus({
    refetchInterval: 30 * 60 * 1000, // Refresh every 30 minutes
  });

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
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        {/* Welcome Section */}
        <Card className={styles.card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <H2>System Health Dashboard</H2>
              <Body>
                Monitor the health status of the FastAPI server.
                Click the refresh button to check the latest status.
              </Body>
            </div>
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              onClick={refetchAll}
              loading={isLoading}
            >
              Refresh
            </Button>
          </div>
        </Card>

        {/* Error Alert */}
        {isError && (
          <Alert
            message="Health Check Error"
            description={error instanceof Error ? error.message : "Failed to fetch health status. Some services may be unavailable."}
            type="warning"
            showIcon
            closable
          />
        )}

        {/* Health Status Dashboard */}
        <HealthStatusDashboard
          fastApiHealth={fastApiHealth}
          fastApiReady={fastApiReady}
          fastApiLive={fastApiLive}
          loading={isLoading}
          error={isError ? (error instanceof Error ? error.message : "Unknown error") : null}
        />
      </Space>
    </motion.div>
  );
};
