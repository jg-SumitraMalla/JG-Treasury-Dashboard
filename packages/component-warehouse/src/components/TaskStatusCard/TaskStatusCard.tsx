import * as React from 'react';
import { Card as AntCard, Progress, Tag, Space, Alert, Button, Popconfirm, Spin, Tooltip } from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  LoadingOutlined,
  StopOutlined,
  ClearOutlined,
  CopyOutlined,
} from '@ant-design/icons';
import { H3, BodyText, SmallText } from '../Typography';
import { colors } from '../../theme';
import { useTheme } from '../../theme/ThemeContext';

export type TaskStatus = 'pending' | 'success' | 'failure' | 'progress' | 'started' | 'retry';

export interface TaskMetadata {
  current: number | null;
  total: number | null;
  status: string;
}

export interface TaskStatusCardProps {
  /** Unique task identifier */
  taskId: string;
  /** Current status of the task */
  status: TaskStatus | string;
  /** Progress metadata (current, total, status message) */
  metadata?: TaskMetadata | null;
  /** Error message if task failed */
  error?: string | null;
  /** Whether the cancel operation is in progress */
  cancelling?: boolean;
  /** Callback when cancel button is clicked */
  onCancel?: (taskId: string) => void;
  /** Callback when clear button is clicked */
  onClear?: () => void;
  /** Additional className */
  className?: string;
  /** Show the clear button */
  showClearButton?: boolean;
}

const getStatusConfig = (status: string) => {
  const normalizedStatus = status.toLowerCase();
  switch (normalizedStatus) {
    case 'success':
      return {
        icon: <CheckCircleOutlined style={{ color: colors.success, fontSize: 24 }} />,
        color: 'success' as const,
        progressStatus: 'success' as const,
        label: 'SUCCESS',
      };
    case 'failure':
      return {
        icon: <CloseCircleOutlined style={{ color: colors.error, fontSize: 24 }} />,
        color: 'error' as const,
        progressStatus: 'exception' as const,
        label: 'FAILURE',
      };
    case 'progress':
    case 'started':
      return {
        icon: <Spin indicator={<LoadingOutlined spin style={{ fontSize: 24 }} />} />,
        color: 'processing' as const,
        progressStatus: 'active' as const,
        label: normalizedStatus.toUpperCase(),
      };
    case 'retry':
      return {
        icon: <ClockCircleOutlined style={{ color: colors.warning, fontSize: 24 }} />,
        color: 'warning' as const,
        progressStatus: 'active' as const,
        label: 'RETRY',
      };
    case 'pending':
    default:
      return {
        icon: <ClockCircleOutlined style={{ color: colors.textSecondary, fontSize: 24 }} />,
        color: 'default' as const,
        progressStatus: 'normal' as const,
        label: 'PENDING',
      };
  }
};

const isTaskRunning = (status: string): boolean => {
  const normalizedStatus = status.toLowerCase();
  return ['pending', 'progress', 'started', 'retry'].includes(normalizedStatus);
};

export const TaskStatusCard: React.FC<TaskStatusCardProps> = ({
  taskId,
  status,
  metadata,
  error,
  cancelling = false,
  onCancel,
  onClear,
  className,
  showClearButton = true,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [copied, setCopied] = React.useState(false);
  const statusConfig = getStatusConfig(status);
  const running = isTaskRunning(status);

  const progressPercent = React.useMemo(() => {
    if (!metadata || metadata.total == null || metadata.current == null || metadata.total === 0) {
      // For pending/started, show indeterminate
      if (running && status.toLowerCase() !== 'progress') {
        return undefined;
      }
      return 0;
    }
    return Math.round((metadata.current / metadata.total) * 100);
  }, [metadata, running, status]);

  const handleCopyTaskId = () => {
    navigator.clipboard.writeText(taskId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AntCard
      className={className}
      styles={{
        body: { padding: 24 },
      }}
    >
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        {/* Header: Status Icon + Title + Tag */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Space align="center" size="middle">
            {statusConfig.icon}
            <H3 style={{ margin: 0 }}>Task Status</H3>
            <Tag color={statusConfig.color}>{statusConfig.label}</Tag>
          </Space>

          {/* Cancel Button for running tasks */}
          {running && onCancel && (
            <Popconfirm
              title="Cancel Task"
              description="Are you sure you want to cancel this task?"
              onConfirm={() => onCancel(taskId)}
              okText="Yes"
              cancelText="No"
              okButtonProps={{ danger: true }}
            >
              <Button
                type="primary"
                danger
                icon={<StopOutlined />}
                loading={cancelling}
              >
                Cancel Task
              </Button>
            </Popconfirm>
          )}
        </div>

        {/* Task ID */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <BodyText type="secondary">Task ID:</BodyText>
          <code
            style={{
              fontFamily: 'monospace',
              fontSize: 13,
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : colors.bgSecondary,
              color: isDark ? colors.textInverse : colors.textPrimary,
              padding: '2px 8px',
              borderRadius: 4,
              maxWidth: 300,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {taskId}
          </code>
          <Tooltip title={copied ? 'Copied!' : 'Copy Task ID'}>
            <Button
              type="text"
              size="small"
              icon={<CopyOutlined />}
              onClick={handleCopyTaskId}
              style={{ color: copied ? colors.success : undefined }}
            />
          </Tooltip>
        </div>

        {/* Progress Bar */}
        <div>
          <Progress
            percent={progressPercent}
            status={statusConfig.progressStatus}
            strokeColor={
              status.toLowerCase() === 'success'
                ? colors.success
                : status.toLowerCase() === 'failure'
                  ? colors.error
                  : colors.primary
            }
            showInfo={progressPercent !== undefined}
          />
          {metadata && (
            <div style={{ marginTop: 4 }}>
              <SmallText
                type="secondary"
                style={{ color: isDark ? 'rgba(255, 255, 255, 0.65)' : colors.textSecondary }}
              >
                {metadata.status}
                {metadata.current != null && metadata.total != null && (
                  <> ({metadata.current.toLocaleString()} / {metadata.total.toLocaleString()})</>
                )}
              </SmallText>
            </div>
          )}
        </div>

        {/* Error Alert */}
        {error && (
          <Alert
            message="Task Error"
            description={error}
            type="error"
            showIcon
          />
        )}

        {/* Clear Button */}
        {showClearButton && onClear && (
          <div style={{ marginTop: 8 }}>
            <Button
              type="default"
              icon={<ClearOutlined />}
              onClick={onClear}
            >
              Clear Task & Start New
            </Button>
          </div>
        )}
      </Space>
    </AntCard>
  );
};

TaskStatusCard.displayName = 'TaskStatusCard';

