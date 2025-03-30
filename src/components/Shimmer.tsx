
import React from 'react';
import { cn } from '@/lib/utils';

interface ShimmerProps {
  className?: string;
}

const Shimmer: React.FC<ShimmerProps> = ({ className }) => {
  return (
    <div className={cn('bg-gray-200 animate-pulse shimmer rounded', className)} />
  );
};

export default Shimmer;
