import type { Meta, StoryObj } from '@storybook/react';
import { SplashScreen } from './SplashScreen';
import { useState } from 'react';
import { colors } from '../../theme';
import fullLogoWhite from '../../assets/full_logo_white.png';

// Note: In a real application, this image should be placed in the assets folder
// JAIN GLOBAL logo - dark blue-gray background with white serif text
const LOGO_IMAGE = fullLogoWhite;

const meta: Meta<typeof SplashScreen> = {
  title: 'Components/SplashScreen',
  component: SplashScreen,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    duration: {
      control: 'number',
      description: 'Duration in milliseconds before hiding',
    },
    backgroundColor: {
      control: 'color',
      description: 'Background color',
    },
    showLoading: {
      control: 'boolean',
      description: 'Show loading indicator',
    },
  },
};

export default meta;
type Story = StoryObj<typeof SplashScreen>;

export const Default: Story = {
  render: (args) => {
    const [visible, setVisible] = useState(true);

    return (
      <>
        {visible && (
          <SplashScreen
            {...args}
            logoImage={LOGO_IMAGE}
            onComplete={() => {
              setVisible(false);
              console.log('Splash screen completed');
            }}
          />
        )}
        {!visible && (
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <h2>Splash screen has finished!</h2>
            <button onClick={() => setVisible(true)}>Show again</button>
          </div>
        )}
      </>
    );
  },
  args: {
    duration: 2000,
    backgroundColor: colors.primaryDarker,
    showLoading: false,
  },
};

export const WithLoading: Story = {
  render: (args) => {
    const [visible, setVisible] = useState(true);

    return (
      <>
        {visible && (
          <SplashScreen
            {...args}
            logoImage={LOGO_IMAGE}
            showLoading
            onComplete={() => {
              setVisible(false);
            }}
          />
        )}
        {!visible && (
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <h2>Splash screen has finished!</h2>
            <button onClick={() => setVisible(true)}>Show again</button>
          </div>
        )}
      </>
    );
  },
  args: {
    duration: 2000,
    backgroundColor: colors.primaryDarker,
    showLoading: true,
  },
};

export const CustomDuration: Story = {
  render: (args) => {
    const [visible, setVisible] = useState(true);

    return (
      <>
        {visible && (
          <SplashScreen
            {...args}
            logoImage={LOGO_IMAGE}
            duration={5000}
            onComplete={() => {
              setVisible(false);
            }}
          />
        )}
        {!visible && (
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <h2>Splash screen has finished!</h2>
            <button onClick={() => setVisible(true)}>Show again</button>
          </div>
        )}
      </>
    );
  },
  args: {
    backgroundColor: colors.primaryDarker,
    showLoading: false,
  },
};

export const CustomBackground: Story = {
  render: (args) => {
    const [visible, setVisible] = useState(true);

    return (
      <>
        {visible && (
          <SplashScreen
            {...args}
            logoImage={LOGO_IMAGE}
            backgroundColor={colors.primary}
            onComplete={() => {
              setVisible(false);
            }}
          />
        )}
        {!visible && (
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <h2>Splash screen has finished!</h2>
            <button onClick={() => setVisible(true)}>Show again</button>
          </div>
        )}
      </>
    );
  },
  args: {
    duration: 2000,
    showLoading: false,
  },
};

