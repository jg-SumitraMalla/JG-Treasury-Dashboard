import type { Meta, StoryObj } from '@storybook/react';
import { Login } from './Login';
import { SplashScreen } from '../SplashScreen/SplashScreen';
import { useState } from 'react';
import { Alert } from 'antd';
import { colors } from '../../theme';

import fullLogoWhite from '../../assets/full_logo_white.png';
import loginBackgroundImage from "../../assets/login_background_image.png"

// Image URLs - In production, these should be actual image assets
// For Storybook, using placeholder services that match the design
// Second image: Modern architectural building facade (blue-grey monochromatic)
const BACKGROUND_IMAGE = loginBackgroundImage;

const meta: Meta<typeof Login> = {
  title: 'Components/Login',
  component: Login,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'centered', 'split', 'minimal'],
      description: 'Visual variant of the login page',
    },
    showSplash: {
      control: 'boolean',
      description: 'Show splash screen before login',
    },
    splashDuration: {
      control: 'number',
      description: 'Duration of splash screen in milliseconds',
    },
    loading: {
      control: 'boolean',
      description: 'Loading state for the form',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Login>;

export const Default: Story = {
  render: (args) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showSplash, setShowSplash] = useState(args.showSplash || false);

    return (
      <>
        {fullLogoWhite && (
          <SplashScreen
            logoImage={fullLogoWhite}
            duration={args.splashDuration || 2000}
            backgroundColor={colors.primaryDarker}
            showLoading
            onComplete={() => setShowSplash(false)}
          />
        )}
        {!showSplash && (
          <Login
            {...args}
            loading={loading}
            backgroundImage={args.backgroundImage || BACKGROUND_IMAGE}
            logoImage={args.logoImage || fullLogoWhite}
            onLogin={(values) => {
              setLoading(true);
              setError(null);
              // Simulate API call
              setTimeout(() => {
                setLoading(false);
                if (values.username === 'admin' && values.password === 'password') {
                  alert(`Login successful! Welcome, ${values.username}`);
                } else {
                  setError('Invalid username or password');
                }
              }, 1500);
            }}
            footer={
              error && (
                <Alert
                  message={error}
                  type="error"
                  showIcon
                  closable
                  onClose={() => setError(null)}
                />
              )
            }
          />
        )}
      </>
    );
  },
  args: {
    variant: 'default',
    showSplash: true,
    splashDuration: 2000,
    loading: false,
  },
};

export const WithSplashScreen: Story = {
  render: (args) => {
    const [showSplash, setShowSplash] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    return (
      <>
        {showSplash && (
          <SplashScreen
            logoImage={fullLogoWhite}
            duration={args.splashDuration || 2500}
            backgroundColor={colors.primaryDarker}
            showLoading
            onComplete={() => setShowSplash(false)}
          />
        )}
        {!showSplash && (
          <Login
            {...args}
            loading={loading}
            backgroundImage={BACKGROUND_IMAGE}
            logoImage={fullLogoWhite}
            onLogin={(values) => {
              setLoading(true);
              setError(null);
              setTimeout(() => {
                setLoading(false);
                if (values.username === 'admin' && values.password === 'password') {
                  alert(`Login successful! Welcome, ${values.username}`);
                } else {
                  setError('Invalid username or password');
                }
              }, 1500);
            }}
            footer={
              error && (
                <Alert
                  message={error}
                  type="error"
                  showIcon
                  closable
                  onClose={() => setError(null)}
                />
              )
            }
          />
        )}
      </>
    );
  },
  args: {
    variant: 'default',
    splashDuration: 2500,
  },
};

export const Centered: Story = {
  render: (args) => {
    const [showSplash, setShowSplash] = useState(true);
    const [loading, setLoading] = useState(false);

    return (
      <>
        {showSplash && (
          <SplashScreen
            logoImage={fullLogoWhite}
            duration={args.splashDuration || 2000}
            backgroundColor={colors.primaryDarker}
            showLoading
            onComplete={() => setShowSplash(false)}
          />
        )}
        {!showSplash && (
          <Login
            {...args}
            variant="centered"
            loading={loading}
            backgroundImage={BACKGROUND_IMAGE}
            logoImage={fullLogoWhite}
            onLogin={(values) => {
              setLoading(true);
              setTimeout(() => {
                setLoading(false);
                alert(`Login successful! Welcome, ${values.username}`);
              }, 1500);
            }}
          />
        )}
      </>
    );
  },
  args: {
    showSplash: true,
    splashDuration: 2000,
  },
};

export const SplitLayout: Story = {
  render: (args) => {
    const [showSplash, setShowSplash] = useState(true);
    const [loading, setLoading] = useState(false);

    return (
      <>
        {showSplash && (
          <SplashScreen
            logoImage={fullLogoWhite}
            duration={args.splashDuration || 2000}
            backgroundColor={colors.primaryDarker}
            showLoading
            onComplete={() => setShowSplash(false)}
          />
        )}
        {!showSplash && (
          <Login
            {...args}
            variant="split"
            loading={loading}
            backgroundImage={BACKGROUND_IMAGE}
            logoImage={fullLogoWhite}
            onLogin={(values) => {
              setLoading(true);
              setTimeout(() => {
                setLoading(false);
                alert(`Login successful! Welcome, ${values.username}`);
              }, 1500);
            }}
          />
        )}
      </>
    );
  },
  args: {
    showSplash: true,
    splashDuration: 2000,
  },
};

export const Minimal: Story = {
  render: (args) => {
    const [showSplash, setShowSplash] = useState(true);
    const [loading, setLoading] = useState(false);

    return (
      <>
        {showSplash && (
          <SplashScreen
            logoImage={fullLogoWhite}
            duration={args.splashDuration || 2000}
            backgroundColor={colors.primaryDarker}
            showLoading
            onComplete={() => setShowSplash(false)}
          />
        )}
        {!showSplash && (
          <Login
            {...args}
            variant="minimal"
            loading={loading}
            backgroundImage={BACKGROUND_IMAGE}
            logoImage={fullLogoWhite}
            onLogin={(values) => {
              setLoading(true);
              setTimeout(() => {
                setLoading(false);
                alert(`Login successful! Welcome, ${values.username}`);
              }, 1500);
            }}
          />
        )}
      </>
    );
  },
  args: {
    showSplash: true,
    splashDuration: 2000,
  },
};

export const WithCustomFooter: Story = {
  render: (args) => { 
    const [showSplash, setShowSplash] = useState(true);
    const [loading, setLoading] = useState(false);

    return (
      <>
        {showSplash && (
          <SplashScreen
            logoImage={fullLogoWhite}
            duration={args.splashDuration || 2000}
            backgroundColor={colors.primaryDarker}
            showLoading
            onComplete={() => setShowSplash(false)}
          />
        )}
        {!showSplash && (
          <Login
            {...args}
            loading={loading}
            backgroundImage={BACKGROUND_IMAGE}
            logoImage={fullLogoWhite}
            onLogin={(values) => {
              setLoading(true);
              setTimeout(() => {
                setLoading(false);
                alert(`Login successful! Welcome, ${values.username}`);
              }, 1500);
            }}
            footer={
              <div style={{ textAlign: 'center', marginTop: '16px' }}>
                <a href="#" style={{ color: colors.primary, textDecoration: 'none' }}>
                  Forgot password?
                </a>
                <div style={{ marginTop: '8px', fontSize: '12px', color: colors.textDisabled }}>
                  Don't have an account? <a href="#" style={{ color: colors.primary }}>Sign up</a>
                </div>
              </div>
            }
          />
        )}
      </>
    );
  },
  args: {
    showSplash: true,
    splashDuration: 2000,
  },
};

export const LoadingState: Story = {
  render: (args) => {
    const [showSplash, setShowSplash] = useState(false);

    return (
      <>
        {showSplash && (
          <SplashScreen
            logoImage={fullLogoWhite}
            duration={2000}
            backgroundColor={colors.primaryDarker}
            showLoading
            onComplete={() => setShowSplash(false)}
          />
        )}
        {!showSplash && (
          <Login
            {...args}
            loading={true}
            backgroundImage={BACKGROUND_IMAGE}
            logoImage={fullLogoWhite}
            onLogin={() => {}}
          />
        )}
      </>
    );
  },
  args: {
    variant: 'default',
    showSplash: false,
  },
};

export const DarkTheme: Story = {
  render: (args) => {
    const [showSplash, setShowSplash] = useState(true);
    const [loading, setLoading] = useState(false);

    return (
      <div style={{ backgroundColor: colors.bgDarkSecondary, minHeight: '100vh' }}>
        {showSplash && (
          <SplashScreen
            logoImage={fullLogoWhite}
            duration={args.splashDuration || 2000}
            backgroundColor={colors.bgDarkSecondary}
            showLoading
            onComplete={() => setShowSplash(false)}
          />
        )}
        {!showSplash && (
          <Login
            {...args}
            variant="centered"
            loading={loading}
            backgroundImage={BACKGROUND_IMAGE}
            logoImage={fullLogoWhite}
            onLogin={(values) => {
              setLoading(true);
              setTimeout(() => {
                setLoading(false);
                alert(`Login successful! Welcome, ${values.username}`);
              }, 1500);
            }}
          />
        )}
      </div>
    );
  },
  args: {
    showSplash: true,
    splashDuration: 2000,
  },
};

export const NoBackground: Story = {
  render: (args) => {
    const [showSplash, setShowSplash] = useState(true);
    const [loading, setLoading] = useState(false);

    return (
      <>
        {showSplash && (
          <SplashScreen
            logoImage={fullLogoWhite}
            duration={args.splashDuration || 2000}
            backgroundColor={colors.primaryDarker}
            showLoading
            onComplete={() => setShowSplash(false)}
          />
        )}
        {!showSplash && (
          <Login
            {...args}
            variant="minimal"
            loading={loading}
            logoImage={fullLogoWhite}
            onLogin={(values) => {
              setLoading(true);
              setTimeout(() => {
                setLoading(false);
                alert(`Login successful! Welcome, ${values.username}`);
              }, 1500);
            }}
          />
        )}
      </>
    );
  },
  args: {
    showSplash: true,
    splashDuration: 2000,
  },
};
