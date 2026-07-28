/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export default function CinemaAtmosphere() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none gpu-accelerated">
      {/* Deep Rich Dark Base */}
      <div className="absolute inset-0 bg-[#05070D]" />

      {/* Subtle Top Center Radial Ambient Glow */}
      <div 
        className="absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[800px] h-[450px] rounded-full blur-[120px] opacity-40 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, rgba(124, 140, 255, 0.18) 0%, rgba(124, 140, 255, 0.04) 50%, transparent 80%)'
        }}
      />

      {/* Soft Bottom Gradient Falloff */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#05070D] to-transparent pointer-events-none" />
    </div>
  );
}

