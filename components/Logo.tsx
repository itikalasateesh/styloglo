import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      {/* Vibrant Neon Gradients */}
      <linearGradient id="glassGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#22d3ee" stopOpacity="1" /> {/* Cyan */}
        <stop offset="50%" stopColor="#e879f9" stopOpacity="1" /> {/* Purple */}
        <stop offset="100%" stopColor="#f472b6" stopOpacity="1" /> {/* Pink */}
      </linearGradient>
      
      <linearGradient id="shineGradient" x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor="white" stopOpacity="0.9" />
        <stop offset="100%" stopColor="white" stopOpacity="0" />
      </linearGradient>

      {/* 3D Lighting Filters */}
      <filter id="glassGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
        <feColorMatrix in="blur" type="matrix" values="
          1 0 0 0 0
          0 1 0 0 0
          0 0 1 0 0
          0 0 0 18 -7
        " result="glow" />
        <feBlend in="SourceGraphic" in2="glow" mode="screen" />
      </filter>

      <filter id="innerShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur"/>
        <feOffset dx="1" dy="2"/>
        <feComposite in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.5 0"/>
      </filter>
    </defs>
    
    {/* Main Shape Group with Glow */}
    <g filter="url(#glassGlow)">
      {/* Abstract S Shape - 3D Ribbon */}
      <path 
        d="M65 25C50 10 25 20 25 45C25 70 45 70 55 70" 
        stroke="url(#glassGradient)" 
        strokeWidth="14" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      
      {/* Abstract G Shape - Interlocking */}
      <path 
        d="M45 55C35 65 35 85 55 85C75 85 80 65 80 45C80 35 70 30 60 30" 
        stroke="url(#glassGradient)" 
        strokeWidth="14" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        strokeOpacity="0.8"
      />
    </g>

    {/* High Gloss Highlights (simulating glass surface) */}
    <path 
      d="M65 25C50 10 25 20 25 45" 
      stroke="url(#shineGradient)" 
      strokeWidth="4" 
      strokeLinecap="round" 
      fill="none"
      opacity="0.6"
      transform="translate(-2, -2)"
    />
    <path 
      d="M55 85C75 85 80 65 80 45" 
      stroke="url(#shineGradient)" 
      strokeWidth="4" 
      strokeLinecap="round" 
      fill="none"
      opacity="0.6"
      transform="translate(2, -2)"
    />

    {/* Floating Particles */}
    <circle cx="85" cy="20" r="3" fill="#22d3ee" filter="url(#glassGlow)" />
    <circle cx="20" cy="80" r="2" fill="#e879f9" filter="url(#glassGlow)" />
  </svg>
);