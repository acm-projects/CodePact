// src/utils/constants.jsx

import React from 'react';

// --- Color Palette and Styles (The values needed across the app) ---
export const BACKGROUND_COLOR = "bg-[#05001A]";
export const ACCENT_GRADIENT = "bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-pink-500";
export const FEATURE_BG = "bg-[#0A071E]";
export const BORDER_COLOR = "border-[#331166]";

// --- Utility Component (Used by pages for the background effect) ---
export const GridOverlay = () => (
  <div 
    className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none" 
    style={{ 
      backgroundImage: 'linear-gradient(to right, #2c0b4d 1px, transparent 1px), linear-gradient(to bottom, #2c0b4d 1px, transparent 1px)', 
      backgroundSize: '40px 40px' 
    }}
  />
);