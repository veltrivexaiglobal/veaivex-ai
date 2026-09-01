import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const revealTimer = window.setTimeout(() => setLeaving(true), reducedMotion ? 350 : 2300);
    const completeTimer = window.setTimeout(onComplete, reducedMotion ? 500 : 2700);

    return () => {
      window.clearTimeout(revealTimer);
      window.clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={`veltripay-splash ${leaving ? 'veltripay-splash--leaving' : ''}`}
      role="status"
      aria-label="Opening VeltriPay"
    >
      <div className="veltripay-splash__glow" aria-hidden="true" />
      <div className="veltripay-splash__logo-wrap">
        <div className="veltripay-splash__logo-frame">
          <img
            src="/assets/brand/veltripay-logo.png"
            alt="VeltriPay"
            className="veltripay-splash__logo"
          />
          <span className="veltripay-splash__shine" aria-hidden="true" />
        </div>
      </div>
      <div className="veltripay-splash__brand">VeltriPay</div>
      <div className="veltripay-splash__powered">Powered by VELTRIVEX AI GLOBAL</div>
      <div className="veltripay-splash__loader" aria-hidden="true">
        <span />
      </div>
    </div>
  );
};
