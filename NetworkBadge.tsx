import React from 'react';
import { NetworkId } from '../../types';
import { NETWORKS } from '../../data/mockData';

interface NetworkBadgeProps {
  network: NetworkId;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
  className?: string;
}

export const NetworkBadge: React.FC<NetworkBadgeProps> = ({
  network,
  size = 'md',
  showName = true,
  className = '',
}) => {
  const net = NETWORKS[network] || NETWORKS.mtn;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs font-semibold px-2.5 py-1',
    lg: 'text-sm font-bold px-3 py-1.5',
  };

  const dotSizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${net.bgLight} ${sizeClasses[size]} ${className}`}
    >
      <span
        className={`rounded-full shrink-0 ${dotSizes[size]}`}
        style={{ backgroundColor: net.color }}
      />
      <span className="font-medium tracking-wide">
        {showName ? net.name : net.badge}
      </span>
    </span>
  );
};
