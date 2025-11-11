import React from 'react';

const HeroIllustration = ({ className = '' }) => {
  return (
    <svg
      viewBox="0 0 600 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Gradients */}
        <linearGradient id="phoneGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1F2937" />
          <stop offset="100%" stopColor="#111827" />
        </linearGradient>
        <linearGradient id="screenGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#EF4444" />
        </linearGradient>
        <linearGradient id="plateGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#F9FAFB" />
        </linearGradient>
        
        {/* Shadows */}
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="10" stdDeviation="20" floodOpacity="0.15" />
        </filter>
      </defs>

      {/* Background Circles */}
      <circle cx="450" cy="150" r="80" fill="#FEF3C7" opacity="0.3" />
      <circle cx="100" cy="450" r="60" fill="#FED7AA" opacity="0.3" />
      <circle cx="500" cy="500" r="50" fill="#FECACA" opacity="0.3" />

      {/* Main Smartphone */}
      <g transform="translate(200, 100)" filter="url(#shadow)">
        {/* Phone Body */}
        <rect
          x="0"
          y="0"
          width="200"
          height="400"
          rx="25"
          fill="url(#phoneGradient)"
        />
        
        {/* Screen */}
        <rect
          x="10"
          y="20"
          width="180"
          height="360"
          rx="15"
          fill="#FFFFFF"
        />
        
        {/* Status Bar */}
        <rect x="20" y="30" width="160" height="20" fill="#F3F4F6" rx="5" />
        <circle cx="30" cy="40" r="3" fill="#10B981" />
        <rect x="150" y="35" width="20" height="10" fill="#E5E7EB" rx="2" />
        
        {/* App Header */}
        <rect x="20" y="60" width="160" height="40" fill="url(#screenGradient)" rx="8" />
        <text x="100" y="85" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">
          Cartita
        </text>
        
        {/* Menu Items Cards */}
        <g transform="translate(20, 110)">
          {/* Card 1 - Pizza */}
          <rect x="0" y="0" width="160" height="70" rx="10" fill="#FEF3C7" />
          <circle cx="30" cy="35" r="20" fill="#FBBF24" />
          <rect x="60" y="15" width="80" height="8" rx="4" fill="#D97706" />
          <rect x="60" y="35" width="60" height="6" rx="3" fill="#F59E0B" />
          
          {/* Card 2 - Burger */}
          <rect x="0" y="80" width="160" height="70" rx="10" fill="#FED7AA" />
          <circle cx="30" cy="115" r="20" fill="#FB923C" />
          <rect x="60" y="95" width="80" height="8" rx="4" fill="#EA580C" />
          <rect x="60" y="115" width="60" height="6" rx="3" fill="#F97316" />
          
          {/* Card 3 - Drink */}
          <rect x="0" y="160" width="160" height="70" rx="10" fill="#FECACA" />
          <circle cx="30" cy="195" r="20" fill="#EF4444" />
          <rect x="60" y="175" width="80" height="8" rx="4" fill="#DC2626" />
          <rect x="60" y="195" width="60" height="6" rx="3" fill="#EF4444" />
        </g>
        
        {/* Bottom Nav */}
        <rect x="20" y="350" width="160" height="20" rx="10" fill="#F3F4F6" />
        <circle cx="50" cy="360" r="4" fill="#EF4444" />
        <circle cx="100" cy="360" r="4" fill="#9CA3AF" />
        <circle cx="150" cy="360" r="4" fill="#9CA3AF" />
      </g>

      {/* Floating Food Icons */}
      
      {/* Pizza Slice */}
      <g transform="translate(80, 200)" filter="url(#shadow)">
        <path
          d="M0 0 L50 0 L25 60 Z"
          fill="#FBBF24"
          stroke="#F59E0B"
          strokeWidth="3"
        />
        <circle cx="15" cy="20" r="4" fill="#DC2626" />
        <circle cx="30" cy="25" r="4" fill="#DC2626" />
        <circle cx="20" cy="40" r="4" fill="#DC2626" />
      </g>

      {/* Burger */}
      <g transform="translate(450, 280)" filter="url(#shadow)">
        <ellipse cx="25" cy="10" rx="30" ry="15" fill="#F59E0B" />
        <rect x="0" y="15" width="50" height="8" fill="#10B981" />
        <rect x="0" y="23" width="50" height="12" fill="#92400E" />
        <rect x="0" y="35" width="50" height="8" fill="#FBBF24" />
        <ellipse cx="25" cy="48" rx="30" ry="15" fill="#D97706" />
        <circle cx="12" cy="8" r="2" fill="#FCD34D" />
        <circle cx="38" cy="8" r="2" fill="#FCD34D" />
      </g>

      {/* QR Code */}
      <g transform="translate(420, 120)" filter="url(#shadow)">
        <rect x="0" y="0" width="80" height="80" rx="8" fill="white" />
        
        {/* QR Pattern */}
        <rect x="8" y="8" width="12" height="12" fill="#1F2937" rx="2" />
        <rect x="24" y="8" width="8" height="8" fill="#1F2937" rx="1" />
        <rect x="36" y="8" width="8" height="8" fill="#1F2937" rx="1" />
        <rect x="48" y="8" width="12" height="12" fill="#1F2937" rx="2" />
        <rect x="64" y="8" width="8" height="8" fill="#1F2937" rx="1" />
        
        <rect x="8" y="24" width="8" height="8" fill="#1F2937" rx="1" />
        <rect x="24" y="24" width="12" height="12" fill="#EF4444" rx="2" />
        <rect x="48" y="24" width="8" height="8" fill="#1F2937" rx="1" />
        <rect x="64" y="24" width="8" height="8" fill="#1F2937" rx="1" />
        
        <rect x="8" y="40" width="8" height="8" fill="#1F2937" rx="1" />
        <rect x="24" y="40" width="8" height="8" fill="#1F2937" rx="1" />
        <rect x="36" y="40" width="12" height="12" fill="#1F2937" rx="2" />
        <rect x="56" y="40" width="8" height="8" fill="#1F2937" rx="1" />
        
        <rect x="8" y="56" width="12" height="12" fill="#1F2937" rx="2" />
        <rect x="24" y="60" width="8" height="8" fill="#1F2937" rx="1" />
        <rect x="40" y="60" width="8" height="8" fill="#1F2937" rx="1" />
        <rect x="60" y="56" width="12" height="12" fill="#1F2937" rx="2" />
      </g>

      {/* Floating Stars/Sparkles */}
      <g opacity="0.6">
        <circle cx="150" cy="100" r="3" fill="#FBBF24" />
        <circle cx="480" cy="450" r="4" fill="#FB923C" />
        <circle cx="120" cy="350" r="2" fill="#EF4444" />
        <circle cx="520" cy="200" r="3" fill="#FBBF24" />
      </g>

      {/* Checkmark Badge */}
      <g transform="translate(130, 320)" filter="url(#shadow)">
        <circle cx="20" cy="20" r="20" fill="#10B981" />
        <path
          d="M12 20 L17 25 L28 14"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </g>
    </svg>
  );
};

export default HeroIllustration;
