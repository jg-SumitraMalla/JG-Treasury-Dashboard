import * as React from 'react';
import { 
  Skeleton as AntSkeleton, 
  SkeletonProps as AntSkeletonProps,
} from 'antd';

export type SkeletonProps = AntSkeletonProps;

/**
 * Skeleton component for displaying loading placeholders.
 * Wraps Ant Design's Skeleton with consistent styling.
 */
export const Skeleton: React.FC<SkeletonProps> = (props) => {
  return <AntSkeleton {...props} />;
};

Skeleton.displayName = 'Skeleton';

// Export convenience components
// Using React.ComponentProps to extract the correct prop types
export const SkeletonButton: React.FC<React.ComponentProps<typeof AntSkeleton.Button>> = (props) => {
  return <AntSkeleton.Button {...props} />;
};

SkeletonButton.displayName = 'SkeletonButton';

export const SkeletonInput: React.FC<React.ComponentProps<typeof AntSkeleton.Input>> = (props) => {
  return <AntSkeleton.Input {...props} />;
};

SkeletonInput.displayName = 'SkeletonInput';

export const SkeletonImage: React.FC<React.ComponentProps<typeof AntSkeleton.Image>> = (props) => {
  return <AntSkeleton.Image {...props} />;
};

SkeletonImage.displayName = 'SkeletonImage';

export const SkeletonAvatar: React.FC<React.ComponentProps<typeof AntSkeleton.Avatar>> = (props) => {
  return <AntSkeleton.Avatar {...props} />;
};

SkeletonAvatar.displayName = 'SkeletonAvatar';

