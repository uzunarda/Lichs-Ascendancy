import React from 'react';

/**
 * Grimore temasının karakteristik köşe süslemesi.
 * SVG tabanlıdır ve farklı pozisyonlar için döndürülebilir.
 */
interface RuneCornerProps {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  opacity?: number;
  className?: string;
  size?: number;
}

export default function RuneCorner({ position, opacity = 0.3, className = '', size = 28 }: RuneCornerProps) {
  const getTransform = () => {
    switch (position) {
      case 'top-right': return 'scaleX(-1)';
      case 'bottom-left': return 'scaleY(-1)';
      case 'bottom-right': return 'scale(-1, -1)';
      default: return 'none';
    }
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'top-left': return 'top-1 left-1';
      case 'top-right': return 'top-1 right-1';
      case 'bottom-left': return 'bottom-1 left-1';
      case 'bottom-right': return 'bottom-1 right-1';
      default: return '';
    }
  };

  return (
    <div 
      className={`absolute pointer-events-none transition-opacity ${getPositionClasses()} ${className}`}
      style={{ opacity, transform: getTransform() }}
    >
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
        <path d="M2 2 L2 14 M2 2 L14 2" stroke="#c9a85c" strokeWidth="1.5" />
        <path d="M6 6 L6 10 M6 6 L10 6" stroke="#c9a85c" strokeWidth="0.75" />
        <circle cx="2" cy="2" r="1.5" fill="#c9a85c" />
      </svg>
    </div>
  );
}
