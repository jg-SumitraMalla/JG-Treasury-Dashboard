import * as React from 'react';
import { Card as AntCard, Space, Tag, Spin, Badge } from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  ApiOutlined,
  DatabaseOutlined,
  CloudServerOutlined,
  HeartOutlined,
  ClusterOutlined,
} from '@ant-design/icons';
import { H3, H4, BodyText, SmallText, Caption } from '../Typography';
import { colors } from '../../theme';
import styles from './HealthStatusDashboard.module.scss';

// Types for health status responses
export type HealthStatus = 'healthy' | 'degraded' | 'unhealthy';
export type ReadyStatus = 'ready' | 'not_ready';
export type LiveStatus = 'alive';

export interface FastAPIHealthResponse {
  status: HealthStatus;
  components: {
    api: string;
    database: string;
    security_cache: string;
    celery: string;
  };
}

export interface FastAPIReadyResponse {
  status: ReadyStatus;
  database: string;
}

export interface FastAPILiveResponse {
  status: LiveStatus;
}

export interface HealthStatusDashboardProps {
  /** FastAPI /healthz response */
  fastApiHealth?: FastAPIHealthResponse | null;
  /** FastAPI /readyz response */
  fastApiReady?: FastAPIReadyResponse | null;
  /** FastAPI /livez response */
  fastApiLive?: FastAPILiveResponse | null;
  /** Loading state */
  loading?: boolean;
  /** Error message */
  error?: string | null;
  /** Callback to refresh data */
  onRefresh?: () => void;
  /** Additional className */
  className?: string;
}

const getStatusIcon = (status: string | undefined, size: number = 16) => {
  if (!status) return <ExclamationCircleOutlined style={{ color: colors.textDisabled, fontSize: size }} />;
  
  const statusLower = status.toLowerCase();
  if (statusLower === 'healthy' || statusLower === 'ready' || statusLower === 'alive' || statusLower === 'ok' || statusLower.startsWith('ok')) {
    return <CheckCircleOutlined style={{ color: colors.success, fontSize: size }} />;
  }
  if (statusLower === 'degraded' || statusLower === 'warning') {
    return <ExclamationCircleOutlined style={{ color: colors.warning, fontSize: size }} />;
  }
  if (statusLower === 'unhealthy' || statusLower === 'not_ready' || statusLower.includes('error') || statusLower.includes('not_')) {
    return <CloseCircleOutlined style={{ color: colors.error, fontSize: size }} />;
  }
  return <ExclamationCircleOutlined style={{ color: colors.textDisabled, fontSize: size }} />;
};

const getStatusTagColor = (status: string | undefined): string => {
  if (!status) return 'default';
  
  const statusLower = status.toLowerCase();
  if (statusLower === 'healthy' || statusLower === 'ready' || statusLower === 'alive' || statusLower === 'ok' || statusLower.startsWith('ok') || statusLower === 'connected') {
    return 'success';
  }
  if (statusLower === 'degraded' || statusLower === 'warning') {
    return 'warning';
  }
  if (statusLower === 'unhealthy' || statusLower === 'not_ready' || statusLower.includes('error') || statusLower.includes('not_')) {
    return 'error';
  }
  return 'default';
};

const getComponentIcon = (component: string) => {
  const componentLower = component.toLowerCase();
  if (componentLower === 'api') return <ApiOutlined />;
  if (componentLower === 'database') return <DatabaseOutlined />;
  if (componentLower === 'celery') return <ClusterOutlined />;
  if (componentLower === 'security_cache') return <CloudServerOutlined />;
  return <HeartOutlined />;
};

interface ComponentStatusProps {
  name: string;
  status: string;
}

const ComponentStatus: React.FC<ComponentStatusProps> = ({ name, status }) => {
  const displayName = name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  return (
    <div className={styles.componentItem}>
      <Space align="center" size="small">
        <span className={styles.componentIcon} style={{ color: 'var(--color-text-secondary)' }}>
          {getComponentIcon(name)}
        </span>
        <BodyText style={{ color: 'var(--color-text-primary)' }}>
          {displayName}
        </BodyText>
      </Space>
      <Tag color={getStatusTagColor(status)} className={styles.statusTag}>
        {status}
      </Tag>
    </div>
  );
};

export const HealthStatusDashboard: React.FC<HealthStatusDashboardProps> = ({
  fastApiHealth,
  fastApiReady,
  fastApiLive,
  loading = false,
  error,
  className,
}) => {

  // Calculate overall system status based on FastAPI only
  const getOverallStatus = (): { status: string; color: string } => {
    const allStatuses = [
      fastApiHealth?.status,
      fastApiReady?.status,
    ];
    const statuses = allStatuses.filter((s): s is NonNullable<typeof s> => Boolean(s));

    if (statuses.length === 0) return { status: 'Unknown', color: 'default' };
    
    if (statuses.some(s => s === 'unhealthy' || s === 'not_ready')) {
      return { status: 'Unhealthy', color: 'error' };
    }
    if (statuses.some(s => s === 'degraded')) {
      return { status: 'Degraded', color: 'warning' };
    }
    const healthyStatuses = ['healthy', 'ready', 'alive'];
    if (statuses.every(s => healthyStatuses.includes(s))) {
      return { status: 'Healthy', color: 'success' };
    }
    return { status: 'Unknown', color: 'default' };
  };

  const overall = getOverallStatus();
  const getServiceStatus = (): string => {
    if (fastApiHealth?.status) return fastApiHealth.status;
    if (fastApiReady?.status === 'ready') return 'healthy';
    if (fastApiReady?.status) return fastApiReady.status;
    return 'unknown';
  };
  const overallServiceStatus = getServiceStatus();

  return (
    <div className={`${styles.dashboard} ${className || ''}`}>
      {/* Overall Status Header */}
      <div className={styles.overallHeader}>
        <Space align="center" size="large">
          <div className={styles.overallIcon}>
            {getStatusIcon(overall.status, 32)}
          </div>
          <div>
            <H3 style={{ margin: 0, color: 'var(--color-text-primary)' }}>
              System Health Status
            </H3>
            <Space size="small" style={{ marginTop: 4 }}>
              <Tag color={overall.color} style={{ fontSize: 14, padding: '4px 12px' }}>
                {overall.status.toUpperCase()}
              </Tag>
              <Caption style={{ color: 'var(--color-text-secondary)' }}>Last checked: {new Date().toLocaleTimeString()}</Caption>
            </Space>
          </div>
        </Space>
      </div>

      {error && (
        <div className={styles.errorBanner}>
          <Tag 
            color="error" 
            icon={<CloseCircleOutlined />}
            style={{ 
              whiteSpace: 'normal', 
              wordBreak: 'break-word', 
              maxWidth: '100%',
              height: 'auto',
              lineHeight: 1.5,
            }}
          >
            Error: {error}
          </Tag>
        </div>
      )}

      {/* FastAPI Server Card */}
      <AntCard
        className={styles.serviceCard}
        styles={{
          body: { padding: 20 },
        }}
      >
        {loading ? (
          <div className={styles.loading}>
            <Spin size="large" />
            <SmallText style={{ color: 'var(--color-text-secondary)' }}>Loading health status...</SmallText>
          </div>
        ) : (
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            {/* Header */}
            <div className={styles.serviceHeader}>
              <Space align="center" size="middle">
                <span className={styles.serviceIcon} style={{ color: colors.primary }}>
                  <ApiOutlined style={{ fontSize: 24 }} />
                </span>
                <div>
                  <H4 style={{ margin: 0, color: 'var(--color-text-primary)' }}>
                    FastAPI Server
                  </H4>
                  
                </div>
              </Space>
              <Badge
                status={
                  overallServiceStatus === 'healthy' || overallServiceStatus === 'ready' ? 'success' :
                  overallServiceStatus === 'degraded' ? 'warning' :
                  overallServiceStatus === 'unhealthy' || overallServiceStatus === 'not_ready' ? 'error' : 'default'
                }
                text={
                  <Tag color={getStatusTagColor(overallServiceStatus)} style={{ marginLeft: 0 }}>
                    {overallServiceStatus.toUpperCase()}
                  </Tag>
                }
              />
            </div>

            {/* Health Check (/healthz) */}
            {fastApiHealth && (
              <div className={styles.endpointSection}>
                <div className={styles.endpointHeader}>
                  <SmallText strong style={{ color: 'var(--color-text-primary)' }}>
                    /healthz - Comprehensive Health
                  </SmallText>
                  {getStatusIcon(fastApiHealth.status, 14)}
                </div>
                <div className={styles.componentsGrid}>
                  {fastApiHealth.components && (
                    Object.entries(fastApiHealth.components).map(([key, value]) => (
                      <ComponentStatus key={key} name={key} status={value} />
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Ready Check (/readyz) */}
            {fastApiReady && (
              <div className={styles.endpointSection}>
                <div className={styles.endpointHeader}>
                  <SmallText strong style={{ color: 'var(--color-text-primary)' }}>
                    /readyz - Readiness
                  </SmallText>
                  {getStatusIcon(fastApiReady.status, 14)}
                </div>
                <div className={styles.readyContent}>
                  <ComponentStatus name="database" status={fastApiReady.database} />
                </div>
              </div>
            )}

            {/* Live Check (/livez) */}
            {fastApiLive && (
              <div className={styles.endpointSection}>
                <div className={styles.endpointHeader}>
                  <SmallText strong style={{ color: 'var(--color-text-primary)' }}>
                    /livez - Liveness
                  </SmallText>
                  {getStatusIcon(fastApiLive.status, 14)}
                </div>
                <Tag color={getStatusTagColor(fastApiLive.status)}>
                  {fastApiLive.status.toUpperCase()}
                </Tag>
              </div>
            )}
          </Space>
        )}
      </AntCard>

      {/* Endpoints Summary Table */}
      <div className={styles.summarySection}>
        <H4 style={{ marginBottom: 16, color: 'var(--color-text-primary)' }}>
          Endpoint Summary
        </H4>
        <div className={styles.summaryTable}>
          <div className={styles.summaryHeader}>
            <SmallText strong style={{ color: colors.textInverse }}>Endpoint</SmallText>
            <SmallText strong style={{ color: colors.textInverse }}>Port</SmallText>
            <SmallText strong style={{ color: colors.textInverse }}>Purpose</SmallText>
            <SmallText strong style={{ color: colors.textInverse }}>Status</SmallText>
          </div>
          <div className={styles.summaryRow}>
            <Caption style={{ fontFamily: 'monospace', color: 'var(--color-text-primary)' }}>/healthz</Caption>
            <SmallText style={{ color: 'var(--color-text-secondary)' }}>8000</SmallText>
            <SmallText style={{ color: 'var(--color-text-secondary)' }}>Full health check</SmallText>
            <Tag color={getStatusTagColor(fastApiHealth?.status)}>{fastApiHealth?.status || 'N/A'}</Tag>
          </div>
          <div className={styles.summaryRow}>
            <Caption style={{ fontFamily: 'monospace', color: 'var(--color-text-primary)' }}>/readyz</Caption>
            <SmallText style={{ color: 'var(--color-text-secondary)' }}>8000</SmallText>
            <SmallText style={{ color: 'var(--color-text-secondary)' }}>Ready for traffic</SmallText>
            <Tag color={getStatusTagColor(fastApiReady?.status)}>{fastApiReady?.status || 'N/A'}</Tag>
          </div>
          <div className={styles.summaryRow}>
            <Caption style={{ fontFamily: 'monospace', color: 'var(--color-text-primary)' }}>/livez</Caption>
            <SmallText style={{ color: 'var(--color-text-secondary)' }}>8000</SmallText>
            <SmallText style={{ color: 'var(--color-text-secondary)' }}>Process alive</SmallText>
            <Tag color={getStatusTagColor(fastApiLive?.status)}>{fastApiLive?.status || 'N/A'}</Tag>
          </div>
        </div>
      </div>
    </div>
  );
};

HealthStatusDashboard.displayName = 'HealthStatusDashboard';
