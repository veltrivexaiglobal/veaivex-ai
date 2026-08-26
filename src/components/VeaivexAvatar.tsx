import React from 'react';

interface VeaivexAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  state?: 'idle' | 'thinking' | 'speaking' | 'listening' | 'verified';
  className?: string;
  showBadge?: boolean;
}

export const VeaivexAvatar: React.FC<VeaivexAvatarProps> = ({
  size = 'md',
  state = 'idle',
  className = '',
  showBadge = true,
}) => {
  const sizeMap = {
    sm: { container: 'w-8 h-8', icon: 18, glow: 'p-0.5' },
    md: { container: 'w-10 h-10', icon: 24, glow: 'p-0.5' },
    lg: { container: 'w-14 h-14', icon: 34, glow: 'p-1' },
    xl: { container: 'w-20 h-20', icon: 48, glow: 'p-1.5' },
    '2xl': { container: 'w-28 h-28', icon: 68, glow: 'p-2' },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  const stateColors = {
    idle: {
      ring: 'from-blue-500 via-indigo-500 to-sky-400',
      glow: 'shadow-blue-500/20',
      badge: 'bg-emerald-500',
      badgeText: 'Live',
    },
    thinking: {
      ring: 'from-indigo-500 via-purple-500 to-pink-500 animate-spin',
      glow: 'shadow-indigo-500/30',
      badge: 'bg-indigo-500 animate-pulse',
      badgeText: 'Reasoning',
    },
    speaking: {
      ring: 'from-cyan-400 via-blue-500 to-emerald-400 animate-pulse',
      glow: 'shadow-cyan-500/30',
      badge: 'bg-cyan-500',
      badgeText: 'Voice',
    },
    listening: {
      ring: 'from-rose-500 via-amber-500 to-orange-400 animate-pulse',
      glow: 'shadow-rose-500/30',
      badge: 'bg-rose-500 animate-ping',
      badgeText: 'Listening',
    },
    verified: {
      ring: 'from-emerald-400 via-teal-500 to-blue-500',
      glow: 'shadow-emerald-500/25',
      badge: 'bg-emerald-400',
      badgeText: 'Verified Math',
    },
  };

  const st = stateColors[state] || stateColors.idle;

  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
      {/* Outer Glow Ring */}
      <div
        className={`absolute inset-0 rounded-2xl bg-gradient-to-tr ${st.ring} opacity-80 blur-[6px] ${st.glow} transition-all duration-500`}
      />

      {/* Main Avatar Container */}
      <div
        className={`relative ${currentSize.container} rounded-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border border-slate-700/80 flex items-center justify-center shadow-lg overflow-hidden`}
      >
        {/* Animated Background Mesh */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-600/30 via-indigo-900/20 to-transparent pointer-events-none" />

        {/* Vector 3D Neural 'V' Glyph */}
        <svg
          width={currentSize.icon}
          height={currentSize.icon}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10 transition-transform duration-300 drop-shadow-md"
        >
          <defs>
            <linearGradient id="v-wing-left" x1="10" y1="20" x2="50" y2="90" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#1e3a8a" />
            </linearGradient>
            <linearGradient id="v-wing-right" x1="50" y1="90" x2="90" y2="20" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#4f46e5" />
              <stop offset="60%" stopColor="#9333ea" />
              <stop offset="100%" stopColor="#c084fc" />
            </linearGradient>
            <radialGradient id="v-core-light" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#67e8f9" />
              <stop offset="100%" stopColor="#0284c7" />
            </radialGradient>
          </defs>

          {/* Glowing Neural Core Node */}
          <circle cx="50" cy="36" r="8" fill="url(#v-core-light)" />
          <circle cx="50" cy="36" r="14" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />

          {/* Left Dynamic Wing Ribbon */}
          <path
            d="M20 28 C30 35 42 55 50 82 C44 68 32 46 16 38 C14 34 16 30 20 28 Z"
            fill="url(#v-wing-left)"
          />

          {/* Right Elevated Intelligence Wing Ribbon */}
          <path
            d="M80 20 C72 32 58 60 50 82 C56 65 68 40 84 28 C86 24 84 21 80 20 Z"
            fill="url(#v-wing-right)"
          />

          {/* Floating Diagnostic Bar Accents */}
          <rect x="42" y="48" width="4" height="12" rx="2" fill="#38bdf8" opacity="0.9" />
          <rect x="48" y="42" width="4" height="18" rx="2" fill="#60a5fa" opacity="0.9" />
          <rect x="54" y="38" width="4" height="22" rx="2" fill="#a78bfa" opacity="0.9" />
        </svg>

        {/* Ambient Activity Scanline */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent h-full w-full pointer-events-none" />
      </div>

      {/* Optional Status Pill or Dot */}
      {showBadge && (
        <span
          className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slate-900 ${st.badge} shadow-sm`}
          title={`VEAIVEX Status: ${st.badgeText}`}
        />
      )}
    </div>
  );
};
