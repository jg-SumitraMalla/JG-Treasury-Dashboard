import * as React from "react";
import { motion } from "framer-motion";
import { colors } from "../../theme";
import { SmallText } from "../Typography";

export interface SplashScreenProps {
  /** Logo image URL */
  logoImage?: string;
  /** Duration in milliseconds before hiding */
  duration?: number;
  /** Callback when splash screen finishes */
  onComplete?: () => void;
  /** Background color */
  backgroundColor?: string;
  /** Show loading indicator */
  showLoading?: boolean;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  logoImage,
  duration = 2000,
  onComplete,
  backgroundColor = colors.primaryDarker, // Use theme color
  showLoading = false,
}) => {
  const [isVisible, setIsVisible] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  if (!isVisible) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 25,
          mass: 0.8,
        }}
        style={{
          textAlign: "center",
        }}
      >
        {logoImage && (
          <motion.img
            src={logoImage}
            alt="JAIN GLOBAL"
            style={{
              maxWidth: "400px",
              width: "100%",
              height: "auto",
              filter: `drop-shadow(${colors.dropShadowLg})`,
            }}
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 30,
              delay: 0.2,
              mass: 0.5,
            }}
          />
        )}
        {showLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{
              marginTop: "24px",
              color: colors.textInverse,
            }}
          >
            <SmallText style={{color: colors.textInverse}}>Loading...</SmallText>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

