import React from 'react';
import { LOGO_ASSET_URL } from '../lib/assets';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true, className = '' }) => {
  const sizeClasses = {
    sm: 'w-7 h-7 sm:w-8 sm:h-8',
    md: 'w-9 h-9 sm:w-11 sm:h-11',
    lg: 'w-12 h-12 sm:w-14 sm:h-14'
  };

  const textClasses = {
    sm: 'text-sm sm:text-base',
    md: 'text-base sm:text-xl',
    lg: 'text-xl sm:text-2xl'
  };

  return (
    <div className={`flex items-center gap-2 sm:gap-3 group select-none ${className}`}>
      {/* 3D Enhanced PZ Logo Badge */}
      <div
        className={`relative ${sizeClasses[size]} rounded-xl sm:rounded-2xl p-0.5 bg-gradient-to-tr from-blue-700 via-emerald-500 to-cyan-400 shadow-md shadow-blue-500/30 group-hover:shadow-xl group-hover:shadow-blue-500/50 group-hover:scale-105 transition-all duration-300 flex items-center justify-center overflow-hidden preserve-3d shrink-0`}
        style={{
          perspective: '600px',
          boxShadow: '0 8px 20px -4px rgba(37, 99, 235, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.6)'
        }}
      >
        {/* Inner Glass pedestal with dark backdrop */}
        <div className="relative w-full h-full rounded-[10px] sm:rounded-[14px] bg-slate-950 flex items-center justify-center overflow-hidden p-0.5 sm:p-1">
          {/* Enhanced 3D PZ logo image */}
          <img
            src={LOGO_ASSET_URL}
            alt="PAK ZON Electronics Logo"
            className="w-full h-full object-cover rounded-[8px] sm:rounded-[10px] filter contrast-125 brightness-105 group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_2px_8px_rgba(37,99,235,0.7)]"
          />

          {/* Realistic 3D glass gloss reflection highlight overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none rounded-[10px] sm:rounded-[14px]" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-400/30 rounded-full blur-xs pointer-events-none" />
        </div>
      </div>

      {/* Typography Brand Labels */}
      {showText && (
        <div className="flex flex-col text-left leading-none min-w-0">
          <div className="flex items-center gap-1 sm:gap-1.5">
            <span
              className={`font-black tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors whitespace-nowrap ${textClasses[size]}`}
            >
              PAK ZON
            </span>
            <span className="hidden min-[420px]:inline-block text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider px-1 sm:px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600 border border-emerald-200">
              Official
            </span>
          </div>
          <span className="text-[9px] sm:text-[11px] font-extrabold tracking-widest text-slate-500 uppercase mt-0.5">
            Electronics
          </span>
        </div>
      )}
    </div>
  );
};
