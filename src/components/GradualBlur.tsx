import React, { useMemo } from 'react';

export interface GradualBlurProps {
  /**
   * Position of the gradual blur relative to the container.
   * @default 'bottom'
   */
  position?: 'top' | 'bottom' | 'left' | 'right';
  /**
   * Number of layered blur divisions to compute smooth gradient.
   * @default 5
   */
  divCount?: number;
  /**
   * Base blur strength multiplier (light & elegant: 0.5–1).
   * @default 0.8
   */
  strength?: number;
  /**
   * Maximum blur in pixels.
   * @default 6
   */
  maxBlurPx?: number;
  /**
   * Height of the blur area (when position is 'top' or 'bottom').
   * @default '3.5rem'
   */
  height?: string;
  /**
   * Width of the blur area (when position is 'left' or 'right').
   * @default '3.5rem'
   */
  width?: string;
  /**
   * Layer opacity (0.5–0.8 for subtle luxury look).
   * @default 0.7
   */
  opacity?: number;
  /**
   * Exponential distribution vs linear/smooth bezier curve.
   * @default false
   */
  exponential?: boolean;
  /**
   * Optional background color tint (e.g., 'rgba(11, 11, 10, 0.4)').
   */
  color?: string;
  /**
   * Optional custom z-index.
   * @default 10
   */
  zIndex?: number;
  /**
   * Custom CSS class name for the wrapper.
   */
  className?: string;
  /**
   * Additional inline styles.
   */
  style?: React.CSSProperties;
}

/**
 * ReactBits GradualBlur Component
 * Renders a lightweight, progressive backdrop-filter blur mask across section boundaries.
 */
export const GradualBlur: React.FC<GradualBlurProps> = ({
  position = 'bottom',
  divCount = 5,
  strength = 0.8,
  maxBlurPx = 6,
  height = '3.5rem',
  width = '3.5rem',
  opacity = 0.7,
  exponential = false,
  color,
  zIndex = 10,
  className = '',
  style = {},
}) => {
  const isVertical = position === 'top' || position === 'bottom';

  // Compute layered slices with smooth cubic-bezier or linear progression
  const slices = useMemo(() => {
    const totalDivs = Math.max(2, Math.min(divCount, 8)); // clamp for mobile GPU efficiency
    const effectiveMaxBlur = maxBlurPx * strength;

    return Array.from({ length: totalDivs }, (_, i) => {
      // Normalized progression 0 -> 1
      const progress = (i + 1) / totalDivs;

      // Smooth step factor (cubic-bezier like ease-out distribution if not exponential)
      const factor = exponential 
        ? Math.pow(progress, 2) 
        : Math.sin((progress * Math.PI) / 2);

      const blurVal = Math.max(0.5, factor * effectiveMaxBlur);

      // Mask gradient percentage range
      const stepStart = Math.max(0, (i / totalDivs) * 100);
      const stepEnd = Math.min(100, ((i + 1) / totalDivs) * 100);

      const gradientDirection = {
        top: 'to top',
        bottom: 'to bottom',
        left: 'to left',
        right: 'to right',
      }[position];

      return {
        key: i,
        blurVal: Number(blurVal.toFixed(2)),
        mask: `linear-gradient(${gradientDirection}, rgba(0, 0, 0, 0) ${stepStart}%, rgba(0, 0, 0, 1) ${stepEnd}%)`,
      };
    });
  }, [divCount, strength, maxBlurPx, exponential, position]);

  // Positioning classes
  const positionClasses = {
    top: 'top-0 left-0 right-0',
    bottom: 'bottom-0 left-0 right-0',
    left: 'top-0 bottom-0 left-0',
    right: 'top-0 bottom-0 right-0',
  }[position];

  return (
    <div
      aria-hidden="true"
      className={`absolute ${positionClasses} pointer-events-none select-none overflow-hidden ${className}`}
      style={{
        height: isVertical ? height : '100%',
        width: !isVertical ? width : '100%',
        zIndex,
        ...style,
      }}
    >
      {slices.map(({ key, blurVal, mask }) => (
        <div
          key={key}
          className="absolute inset-0 pointer-events-none"
          style={{
            backdropFilter: `blur(${blurVal}px)`,
            WebkitBackdropFilter: `blur(${blurVal}px)`,
            maskImage: mask,
            WebkitMaskImage: mask,
            opacity,
            backgroundColor: color || undefined,
          }}
        />
      ))}
    </div>
  );
};

export default GradualBlur;
