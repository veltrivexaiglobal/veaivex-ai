import React from 'react';

interface VeaivexLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  showText?: boolean;
  isRotating?: boolean;
  className?: string;
  variant?: 'full' | 'symbol' | 'badge';
}

export const VeaivexLogo: React.FC<VeaivexLogoProps> = ({
  size = 'md',
  showText = false,
  isRotating = false,
  className = '',
  variant = 'symbol',
}) => {
  const sizeDimensions: Record<string, { icon: number; text: string; subtext: string }> = {
    xs: { icon: 20, text: 'text-sm', subtext: 'text-[9px]' },
    sm: { icon: 28, text: 'text-base font-bold', subtext: 'text-[10px]' },
    md: { icon: 36, text: 'text-lg font-bold', subtext: 'text-[11px]' },
    lg: { icon: 48, text: 'text-2xl font-bold', subtext: 'text-xs' },
    xl: { icon: 72, text: 'text-3xl font-extrabold', subtext: 'text-sm' },
    hero: { icon: 100, text: 'text-4xl font-extrabold', subtext: 'text-base' },
  };

  const dim = sizeDimensions[size] || sizeDimensions.md;

  const svgIcon = (
    <svg
      width={dim.icon}
      height={dim.icon}
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 transition-transform duration-300 ${isRotating ? 'animate-spin' : ''} drop-shadow-md`}
      style={{ animationDuration: isRotating ? '2.5s' : undefined }}
    >
      <defs>
        {/* Background rounded squircle gradient */}
        <linearGradient id="vx-bg-grad" x1="0" y1="0" x2="512" y2="512" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#080e1a" />
          <stop offset="100%" stopColor="#02060d" />
        </linearGradient>

        {/* Left cyan-blue ribbon fold */}
        <linearGradient id="vx-cyan-blue" x1="50" y1="120" x2="260" y2="440" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="45%" stopColor="#0284c7" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>

        {/* Inner bright cyan curve */}
        <linearGradient id="vx-bright-cyan" x1="160" y1="280" x2="280" y2="400" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00f2fe" />
          <stop offset="100%" stopColor="#4facfe" />
        </linearGradient>

        {/* Right purple-magenta wing */}
        <linearGradient id="vx-purple-wing" x1="220" y1="420" x2="450" y2="140" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="35%" stopColor="#4f46e5" />
          <stop offset="70%" stopColor="#9333ea" />
          <stop offset="100%" stopColor="#c084fc" />
        </linearGradient>

        {/* Chart bars neon blue gradient */}
        <linearGradient id="vx-bar-grad" x1="240" y1="120" x2="360" y2="280" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>

        {/* Orb glowing gradient */}
        <radialGradient id="vx-orb-grad" cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
          <stop offset="0%" stopColor="#67e8f9" />
          <stop offset="60%" stopColor="#0284c7" />
          <stop offset="100%" stopColor="#1e3a8a" />
        </radialGradient>

        {/* Glow filter */}
        <filter id="vx-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Rounded Squircle Container */}
      <rect width="512" height="512" rx="108" fill="url(#vx-bg-grad)" />
      <rect width="512" height="512" rx="108" stroke="#1e293b" strokeWidth="6" />

      {/* 3 Rising Business Intelligence Chart Bars */}
      {/* Bar 1 (Left - Shortest) */}
      <polygon points="246,204 272,186 272,274 246,274" fill="url(#vx-bar-grad)" rx="4" />
      {/* Bar 2 (Center - Medium) */}
      <polygon points="282,156 316,134 316,258 282,258" fill="url(#vx-bar-grad)" rx="4" />
      {/* Bar 3 (Right - Tallest) */}
      <polygon points="327,118 362,94 362,228 327,228" fill="url(#vx-bar-grad)" rx="4" />

      {/* Floating Glowing Orb above right wing */}
      <circle cx="402" cy="100" r="25" fill="url(#vx-orb-grad)" filter="url(#vx-glow)" />

      {/* Right Violet-Magenta Wing */}
      <path
        d="M228 424 C270 380 370 240 450 142 C410 186 320 286 268 344 C244 370 226 392 216 404 Z"
        fill="url(#vx-purple-wing)"
      />

      {/* Main Stylized 3D Ribbon 'V' - Left Wing & Central Base */}
      <path
        d="M52 154 C92 152 140 184 186 244 C226 296 250 360 258 428 C242 432 216 422 188 386 C152 340 108 266 52 154 Z"
        fill="url(#vx-cyan-blue)"
      />

      {/* Inner Cyan Fold Accent Ribbon */}
      <path
        d="M136 264 C176 304 212 362 258 428 C248 376 218 320 184 278 C158 246 142 248 136 264 Z"
        fill="url(#vx-bright-cyan)"
      />
    </svg>
  );

  if (!showText) {
    return <div className={`inline-flex items-center justify-center ${className}`}>{svgIcon}</div>;
  }

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {svgIcon}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 tracking-tight">
          <span className={`text-slate-900 font-extrabold tracking-wider ${dim.text}`}>
            VEAIVEX
          </span>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm">
            AI
          </span>
        </div>
        <span className={`text-slate-500 font-medium tracking-tight ${dim.subtext}`}>
          Business Intelligence & Decision Support
        </span>
      </div>
    </div>
  );
};
