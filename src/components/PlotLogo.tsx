import React from 'react';
import { motion } from 'motion/react';

export type LogoVariant = 'full' | 'icon' | 'wordmark';
export type LogoSize = 'sm' | 'md' | 'lg' | 'xl' | 'responsive' | 'custom';
export type LogoTheme = 'dark' | 'light';
export type LogoLayout = 'horizontal' | 'vertical';
export type LogoMotionMode = 'none' | 'startup' | 'breathe' | 'hover';

export interface PlotLogoProps {
  variant?: LogoVariant;
  size?: LogoSize;
  theme?: LogoTheme;
  layout?: LogoLayout;
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  showBg?: boolean;
  animate?: LogoMotionMode;
  hoverGlow?: boolean;
  delay?: number;
  onClick?: () => void;
}

/**
 * Official Plot Design System Spacing & Brand Guidelines
 */
export const LOGO_SPACING_RULES = {
  clearSpaceRatio: 0.25, // Minimum clear space equal to 25% of the icon height
  minIconSizePx: 18,
  maxIconSizePx: 120,
  minFontSizePx: 11,
  maxFontSizePx: 64,
  aspectRatio: '1 / 1',
  brandColors: {
    dark: {
      wordmark: '#FFFFFF',
      bgSquircleStart: '#12111E',
      bgSquircleEnd: '#07060D',
      borderGlowStart: 'rgba(138, 123, 255, 0.45)',
      borderGlowEnd: 'rgba(255, 255, 255, 0.08)',
    },
    light: {
      wordmark: '#0F0E17',
      bgSquircleStart: '#F0EFFC',
      bgSquircleEnd: '#E5E3FA',
      borderGlowStart: 'rgba(65, 41, 227, 0.45)',
      borderGlowEnd: 'rgba(65, 41, 227, 0.12)',
    },
    pGradient: ['#4129E3', '#6448FF', '#8A7BFF'],
  },
  safeguards: [
    'Lock 1:1 square aspect ratio on mark — strictly prevent stretching or distortion',
    'Enforce shrink-0 layout constraints in flex containers',
    'Enforce clear space padding around wordmark and icon',
    'Lock official brand gradient vector fills to prevent unauthorized recoloring',
  ],
};

/**
 * Official Plot Icon Component (P mark with film sprockets)
 */
export const PlotIcon: React.FC<{
  className?: string;
  showBg?: boolean;
  theme?: LogoTheme;
  animate?: LogoMotionMode;
  hoverGlow?: boolean;
  delay?: number;
}> = ({
  className = 'w-8 h-8',
  showBg = true,
  theme = 'dark',
  animate = 'none',
  hoverGlow = true,
  delay = 0,
}) => {
  const isLight = theme === 'light';

  const getMotionProps = () => {
    if (animate === 'startup') {
      return {
        initial: { opacity: 0, scale: 0.98 },
        animate: { opacity: 1, scale: 1 },
        transition: {
          duration: 0.75,
          delay: delay,
          ease: [0.16, 1, 0.3, 1],
        },
      };
    }
    if (animate === 'breathe') {
      return {
        animate: {
          opacity: [0.82, 1, 0.82],
          scale: [0.985, 1, 0.985],
        },
        transition: {
          duration: 2.4,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      };
    }
    return {};
  };

  const hoverProps = hoverGlow
    ? {
        whileHover: {
          scale: 1.025,
          filter: isLight
            ? 'drop-shadow(0 0 14px rgba(65, 41, 227, 0.35))'
            : 'drop-shadow(0 0 14px rgba(138, 123, 255, 0.45))',
        },
        transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
      }
    : {};

  // Generate unique IDs for gradients to avoid DOM collision when multiple icons render
  const instanceId = React.useId().replace(/:/g, '');

  return (
    <motion.svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      style={{ aspectRatio: '1 / 1' }}
      className={`${className} shrink-0 transform-gpu select-none object-contain pointer-events-auto`}
      aria-label="plot icon"
      {...getMotionProps()}
      {...hoverProps}
    >
      <defs>
        {/* Main "P" Gradient */}
        <linearGradient id={`plotPGradient_${instanceId}`} x1="30" y1="85" x2="80" y2="15" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4129E3" />
          <stop offset="50%" stopColor="#6448FF" />
          <stop offset="100%" stopColor="#8A7BFF" />
        </linearGradient>

        {/* Inner Fold Shadow Gradient */}
        <linearGradient id={`plotPFoldGradient_${instanceId}`} x1="46" y1="34" x2="70" y2="65" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={isLight ? '#28177D' : '#1B1052'} />
          <stop offset="100%" stopColor={isLight ? '#4129E3' : '#321D96'} />
        </linearGradient>

        {/* Background Squircle Gradient */}
        <linearGradient id={`plotSquircleBg_${instanceId}`} x1="10" y1="10" x2="90" y2="90" gradientUnits="userSpaceOnUse">
          <stop
            offset="0%"
            stopColor={
              isLight
                ? LOGO_SPACING_RULES.brandColors.light.bgSquircleStart
                : LOGO_SPACING_RULES.brandColors.dark.bgSquircleStart
            }
          />
          <stop
            offset="100%"
            stopColor={
              isLight
                ? LOGO_SPACING_RULES.brandColors.light.bgSquircleEnd
                : LOGO_SPACING_RULES.brandColors.dark.bgSquircleEnd
            }
          />
        </linearGradient>

        {/* Squircle Border Glow */}
        <linearGradient id={`plotBorderGlow_${instanceId}`} x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop
            offset="0%"
            stopColor={
              isLight
                ? LOGO_SPACING_RULES.brandColors.light.borderGlowStart
                : LOGO_SPACING_RULES.brandColors.dark.borderGlowStart
            }
          />
          <stop
            offset="50%"
            stopColor={isLight ? 'rgba(65, 41, 227, 0.2)' : 'rgba(80, 53, 230, 0.2)'}
          />
          <stop
            offset="100%"
            stopColor={
              isLight
                ? LOGO_SPACING_RULES.brandColors.light.borderGlowEnd
                : LOGO_SPACING_RULES.brandColors.dark.borderGlowEnd
            }
          />
        </linearGradient>
      </defs>

      {/* Dark or Light Squircle Container */}
      {showBg && (
        <>
          <rect x="2" y="2" width="96" height="96" rx="26" fill={`url(#plotSquircleBg_${instanceId})`} />
          <rect x="2.5" y="2.5" width="95" height="95" rx="25.5" stroke={`url(#plotBorderGlow_${instanceId})`} strokeWidth="1.2" />
        </>
      )}

      {/* Main "P" Body Silhouette */}
      <path
        d="M 33 76 L 33 28 C 33 21 38 16 48 16 C 67 16 80 25.5 80 43 C 80 60 67 69.5 48 69.5 L 43 69.5 C 41.5 69.5 41 68.5 41 67 L 41 49 C 41 46.5 43 44.5 45.5 44.5 L 48 44.5 C 57 44.5 63 39.5 63 32 C 63 24.5 57 20 48 20 L 41.5 20 L 41.5 76 C 41.5 78.5 39.5 80 37.25 80 L 37.25 80 C 34.9 80 33 78.5 33 76 Z"
        fill={`url(#plotPGradient_${instanceId})`}
      />

      {/* Folded Shadow Flap inside loop */}
      <path
        d="M 42 47.5 L 42 66 C 42 68.5 43.5 69.5 46.5 69.5 C 58 69.5 67 60 67 47.5 C 67 38 58 35 48.5 35 C 44 35 42 38 42 42 Z"
        fill={`url(#plotPFoldGradient_${instanceId})`}
      />

      {/* 3 Film Strip Sprocket Holes */}
      <rect x="44.5" y="38" width="3.2" height="4.5" rx="0.8" fill={isLight ? '#F0EFFC' : '#07060D'} />
      <rect x="44.5" y="45.5" width="3.2" height="4.5" rx="0.8" fill={isLight ? '#F0EFFC' : '#07060D'} />
      <rect x="44.5" y="53" width="3.2" height="4.5" rx="0.8" fill={isLight ? '#F0EFFC' : '#07060D'} />
    </motion.svg>
  );
};

/**
 * Official Brand Wordmark: tracked lowercase "p l o t"
 */
export const PlotWordmark: React.FC<{
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'responsive';
  theme?: LogoTheme;
}> = ({ className = '', size = 'md', theme = 'dark' }) => {
  const isLight = theme === 'light';

  const sizeClasses = {
    sm: 'text-xs tracking-[0.2em] font-medium opacity-85 group-hover:opacity-100 transition-opacity',
    md: 'text-xs sm:text-sm tracking-[0.22em] font-medium opacity-90 group-hover:opacity-100 transition-opacity',
    lg: 'text-sm sm:text-base tracking-[0.24em] font-medium',
    xl: 'text-lg sm:text-xl tracking-[0.26em] font-medium',
    responsive: 'text-xs sm:text-sm tracking-[0.2em]',
  };

  const themeTextColor = isLight ? 'text-[#0F0E17]' : 'text-white';

  return (
    <span
      className={`font-sans font-medium lowercase select-none antialiased ${themeTextColor} ${sizeClasses[size]} ${className}`}
      style={{
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        whiteSpace: 'nowrap',
      }}
    >
      p l o t
    </span>
  );
};

/**
 * Official Brand Logo Component
 * Primary: Full Logo (Icon + Wordmark)
 * Secondary: Icon Only, Wordmark Only
 */
export const PlotLogo: React.FC<PlotLogoProps> = ({
  variant = 'full',
  size = 'md',
  theme = 'dark',
  layout = 'horizontal',
  className = '',
  iconClassName = '',
  textClassName = '',
  showBg = true,
  animate = 'none',
  hoverGlow = true,
  delay = 0,
  onClick,
}) => {
  const isLight = theme === 'light';

  const iconSizes: Record<LogoSize, string> = {
    sm: 'w-6 h-6 min-w-[24px] max-w-[24px]',
    md: 'w-[26px] h-[26px] min-w-[26px] max-w-[26px]',
    lg: 'w-8 h-8 min-w-[32px] max-w-[32px]',
    xl: 'w-12 h-12 min-w-[48px] max-w-[48px]',
    responsive: 'w-6 h-6 sm:w-[26px] sm:h-[26px] min-w-[24px]',
    custom: '',
  };

  const wordmarkSizes: Record<LogoSize, 'sm' | 'md' | 'lg' | 'xl' | 'responsive'> = {
    sm: 'sm',
    md: 'md',
    lg: 'lg',
    xl: 'xl',
    responsive: 'responsive',
    custom: 'md',
  };

  if (variant === 'icon') {
    return (
      <div onClick={onClick} className={`inline-flex items-center justify-center ${onClick ? 'cursor-pointer' : ''} ${className}`}>
        <PlotIcon
          className={iconClassName || iconSizes[size]}
          showBg={showBg}
          theme={theme}
          animate={animate}
          hoverGlow={hoverGlow}
          delay={delay}
        />
      </div>
    );
  }

  if (variant === 'wordmark') {
    return (
      <div onClick={onClick} className={`inline-flex items-center ${onClick ? 'cursor-pointer' : ''} ${className}`}>
        <PlotWordmark className={textClassName} size={wordmarkSizes[size]} theme={theme} />
      </div>
    );
  }

  // Primary Brand: Full Logo (Icon + Wordmark)
  const isVertical = layout === 'vertical';

  const containerMotionProps =
    animate === 'startup'
      ? {
          initial: { opacity: 0, scale: 0.98 },
          animate: { opacity: 1, scale: 1 },
          transition: {
            duration: 0.75,
            delay: delay,
            ease: [0.16, 1, 0.3, 1],
          },
        }
      : animate === 'breathe'
      ? {
          animate: {
            opacity: [0.85, 1, 0.85],
            scale: [0.985, 1, 0.985],
          },
          transition: {
            duration: 2.4,
            repeat: Infinity,
            ease: 'easeInOut',
          },
        }
      : {};

  const fullHoverProps = hoverGlow
    ? {
        whileHover: {
          scale: 1.015,
          filter: isLight
            ? 'drop-shadow(0 0 16px rgba(65, 41, 227, 0.35))'
            : 'drop-shadow(0 0 16px rgba(138, 123, 255, 0.45)) brightness(1.06)',
        },
        transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
      }
    : {};

  const gapClasses: Record<LogoSize, string> = {
    sm: 'gap-2',
    md: 'gap-2.5 sm:gap-3',
    lg: 'gap-3.5 sm:gap-4',
    xl: 'gap-4 sm:gap-5',
    responsive: 'gap-2.5 sm:gap-3.5',
    custom: 'gap-3',
  };

  return (
    <motion.div
      onClick={onClick}
      className={`inline-flex items-center select-none ${onClick ? 'cursor-pointer' : ''} ${
        isVertical ? 'flex-col justify-center text-center gap-3' : `flex-row ${gapClasses[size]}`
      } ${className}`}
      {...containerMotionProps}
      {...fullHoverProps}
    >
      <PlotIcon
        className={iconClassName || iconSizes[size]}
        showBg={showBg}
        theme={theme}
        hoverGlow={false}
      />
      <PlotWordmark className={textClassName} size={wordmarkSizes[size]} theme={theme} />
    </motion.div>
  );
};

/**
 * Interactive Plot Logo Design System Showcase Component
 * Demonstrates all variants, themes, sizes, and spacing rules.
 */
export const PlotLogoDesignSystem: React.FC = () => {
  return (
    <div className="bg-[#0B0C12] border border-[#1A1C28] rounded-3xl p-6 sm:p-8 space-y-8 text-left select-none">
      {/* Header */}
      <div className="space-y-2 border-b border-[#1A1C28] pb-6">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#8A7BFF] bg-[#4129E3]/20 border border-[#6448FF]/30 px-2.5 py-0.5 rounded-full">
            Official Brand Design System
          </span>
        </div>
        <h3 className="text-xl sm:text-2xl font-sans font-bold text-white tracking-tight">
          Plot Logo Specifications & Tokens
        </h3>
        <p className="text-xs sm:text-sm text-zinc-400 font-normal leading-relaxed">
          Centralized brand component guidelines enforcing exact clear space, responsive sizing, non-distorting square aspect ratios, and theme adaptivity across dark and light surfaces.
        </p>
      </div>

      {/* Grid of Variants */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Dark Mode Variants Card */}
        <div className="bg-[#12131D] border border-white/10 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-300">
              Dark Theme (Default)
            </span>
            <span className="text-[10px] font-mono text-[#8A7BFF]">theme=&quot;dark&quot;</span>
          </div>

          <div className="space-y-4 pt-2">
            <div>
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mb-2">Full Logo (Horizontal)</span>
              <div className="bg-[#07060D] p-4 rounded-xl border border-white/5 flex items-center justify-center">
                <PlotLogo variant="full" size="md" theme="dark" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mb-2">Icon Only</span>
                <div className="bg-[#07060D] p-3 rounded-xl border border-white/5 flex items-center justify-center">
                  <PlotLogo variant="icon" size="md" theme="dark" />
                </div>
              </div>
              <div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mb-2">Wordmark Only</span>
                <div className="bg-[#07060D] p-3.5 rounded-xl border border-white/5 flex items-center justify-center">
                  <PlotLogo variant="wordmark" size="md" theme="dark" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Light Mode Variants Card */}
        <div className="bg-[#F8F8FC] border border-zinc-200 rounded-2xl p-5 space-y-4 text-zinc-900">
          <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-800">
              Light Theme
            </span>
            <span className="text-[10px] font-mono text-[#4129E3] font-bold">theme=&quot;light&quot;</span>
          </div>

          <div className="space-y-4 pt-2">
            <div>
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mb-2">Full Logo (Horizontal)</span>
              <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm flex items-center justify-center">
                <PlotLogo variant="full" size="md" theme="light" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mb-2">Icon Only</span>
                <div className="bg-white p-3 rounded-xl border border-zinc-200 shadow-sm flex items-center justify-center">
                  <PlotLogo variant="icon" size="md" theme="light" />
                </div>
              </div>
              <div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mb-2">Wordmark Only</span>
                <div className="bg-white p-3.5 rounded-xl border border-zinc-200 shadow-sm flex items-center justify-center">
                  <PlotLogo variant="wordmark" size="md" theme="light" />
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Size Scale Demonstration */}
      <div className="space-y-3 pt-2">
        <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400">
          Standard Scale Tokens (Small, Medium, Large, Responsive)
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-[#12131D] border border-white/5 rounded-xl p-3.5 space-y-2 text-center">
            <span className="text-[10px] font-mono text-zinc-500 uppercase">Small (size=&quot;sm&quot;)</span>
            <div className="flex justify-center pt-1">
              <PlotLogo variant="full" size="sm" />
            </div>
          </div>

          <div className="bg-[#12131D] border border-white/5 rounded-xl p-3.5 space-y-2 text-center">
            <span className="text-[10px] font-mono text-zinc-500 uppercase">Medium (size=&quot;md&quot;)</span>
            <div className="flex justify-center pt-1">
              <PlotLogo variant="full" size="md" />
            </div>
          </div>

          <div className="bg-[#12131D] border border-white/5 rounded-xl p-3.5 space-y-2 text-center">
            <span className="text-[10px] font-mono text-zinc-500 uppercase">Large (size=&quot;lg&quot;)</span>
            <div className="flex justify-center pt-1">
              <PlotLogo variant="full" size="lg" />
            </div>
          </div>
        </div>
      </div>

      {/* Spacing Rules & Safeguards */}
      <div className="bg-[#08080E] border border-white/10 rounded-2xl p-5 space-y-3 text-xs">
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#8A7BFF]">
          Spacing & Distortion Safeguard Rules
        </span>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-zinc-300 font-sans">
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8A7BFF]" />
            <span>Aspect Ratio: 1:1 fixed non-distortable square vector canvas</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8A7BFF]" />
            <span>Min Size: 18px icon / Max Size: 120px icon</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8A7BFF]" />
            <span>Clear Space Zone: 25% height buffer around mark</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8A7BFF]" />
            <span>Shrink Safeguard: Locked flex shrink-0 across layouts</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PlotLogo;
