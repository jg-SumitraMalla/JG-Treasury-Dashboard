import * as React from 'react';
import { Layout, Menu, MenuProps, Avatar, Dropdown, Space } from 'antd';
import {
  HomeOutlined,
  BankOutlined,
  DashboardOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
// Import logos - these will be bundled as assets
import shortLogoWhite from '../../assets/short_logo_white.png';
import fullLogoWhite from '../../assets/full_logo_white.png';
import { BodyText, SmallText, Caption } from '../Typography';
import { ThemeToggle } from '../ThemeToggle';
import { colors } from '../../theme';
import styles from './Dashboard.module.scss';

const { Sider, Content, Footer } = Layout;

export interface UserInfo {
  name: string;
  email: string;
  photoUrl?: string | null;
}

export interface DashboardProps {
  defaultCollapsed?: boolean;
  defaultSelectedKey?: string;
  children?: React.ReactNode;
  version?: string;
  /** User information to display in header */
  user?: UserInfo | null;
  /** Callback when logout is clicked */
  onLogout?: () => void;
  /** Custom menu items (overrides default menu) */
  menuItems?: MenuProps['items'];
}

export const Dashboard: React.FC<DashboardProps> = ({
  defaultCollapsed = false,
  defaultSelectedKey = '/homepage',
  children,
  version,
  user,
  onLogout,
  menuItems: customMenuItems,
}) => {
  const [collapsed, setCollapsed] = React.useState(defaultCollapsed);
  const navigate = useNavigate();
  const location = useLocation();

  // Default menu items (used if no custom items provided)
  const defaultMenuItems: MenuProps['items'] = [
    {
      key: '/homepage',
      icon: <HomeOutlined />,
      label: 'Homepage',
    },
    {
      key: 'treasury',
      icon: <BankOutlined />,
      label: 'Treasury',
      children: [
          {
          key: '/treasury/pnl-dashboard',
          icon: <DashboardOutlined />,
          label: 'PnL',
        },
      ],
    },
    {
      type: 'divider',
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
  ];

  // Use custom menu items if provided, otherwise use defaults
  const menuItems = customMenuItems || defaultMenuItems;

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key && !key.startsWith('treasury')) {
      navigate(key);
    }
  };

  // Set initial route if not already set
  React.useEffect(() => {
    if (location.pathname === '/' || location.pathname === '') {
      navigate(defaultSelectedKey, { replace: true });
    }
  }, [location.pathname, navigate, defaultSelectedKey]);

  const logoImage = collapsed ? shortLogoWhite : fullLogoWhite;

  // User dropdown menu items - using inline styles with CSS variables for portal rendering
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'user-info',
      label: (
        <div style={{ padding: '4px 0' }}>
          <BodyText 
            strong 
            style={{ 
              color: 'var(--color-text-primary)', 
              display: 'block',
              marginBottom: '2px',
            }}
          >
            {user?.name}
          </BodyText>
          <Caption 
            style={{ 
              color: 'var(--color-text-secondary)', 
              display: 'block',
            }}
          >
            {user?.email}
          </Caption>
        </div>
      ),
      disabled: true,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Sign out',
      onClick: onLogout,
    },
  ];

  return (
    <Layout className={styles.dashboardLayout}>
      <Sider trigger={null} collapsible collapsed={collapsed} className={styles.sider}>
        <div className={styles.logoContainer}>
          <AnimatePresence mode="wait">
            <motion.img
              key={logoImage}
              src={logoImage}
              alt="Jain Global"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 0.9 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30,
                duration: 0.1,
              }}
              className={styles.logoImage}
            />
          </AnimatePresence>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          defaultOpenKeys={['treasury']}
          items={menuItems}
          onClick={handleMenuClick}
          className={styles.menu}
        />
      </Sider>
      <Layout className={`${styles.mainLayout} ${collapsed ? styles.collapsed : styles.expanded}`}>
        <div className={styles.header}>
          <div className={styles.headerIcon}>
            {collapsed ? (
              <MenuUnfoldOutlined
                onClick={() => setCollapsed(!collapsed)}
                className={styles.headerIconButton}
              />
            ) : (
              <MenuFoldOutlined
                onClick={() => setCollapsed(!collapsed)}
                className={styles.headerIconButton}
              />
            )}
          </div>
          <div className={styles.headerRight}>
            <ThemeToggle />
            {user && (
              <Dropdown
                menu={{ items: userMenuItems }}
                trigger={['click']}
                placement="bottomRight"
              >
                <div className={styles.userProfile}>
                  <Space size="small">
                    <SmallText 
                      className={styles.userName}
                      style={{ color: 'var(--color-text-primary)' }}
                    >
                      {user.name}
                    </SmallText>
                    <Avatar
                      size={32}
                      src={user.photoUrl}
                      icon={!user.photoUrl ? <UserOutlined /> : undefined}
                      className={styles.userAvatar}
                      style={{
                        backgroundColor: user.photoUrl ? 'transparent' : colors.primary,
                      }}
                    />
                  </Space>
                </div>
              </Dropdown>
            )}
          </div>
        </div>
        <Content className={styles.content}>
          <div className={styles.contentWrapper}>
            <AnimatePresence mode="wait">{children}</AnimatePresence>
          </div>
        </Content>
        {version && (
          <Footer className={styles.footer}>
            <BodyText code>Version: {version}</BodyText>
          </Footer>
        )}
      </Layout>
    </Layout>
  );
};
