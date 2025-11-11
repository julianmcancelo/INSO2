import React from 'react';

const BrandLogo = ({ size = 'md', showText = true, className = '' }) => {
  const sizes = {
    sm: { icon: 32, text: 'text-xl' },
    md: { icon: 48, text: 'text-2xl' },
    lg: { icon: 64, text: 'text-3xl' },
    xl: { icon: 96, text: 'text-5xl' }
  };

  const currentSize = sizes[size];

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Icon Logo */}
      <svg
        width={currentSize.icon}
        height={currentSize.icon}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background Circle with Gradient */}
        <defs>
          <linearGradient id="brandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FCD34D" />
            <stop offset="50%" stopColor="#FB923C" />
            <stop offset="100%" stopColor="#EF4444" />
          </linearGradient>
          <linearGradient id="plateGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#F3F4F6" />
          </linearGradient>
        </defs>

        {/* Main Circle */}
        <circle cx="50" cy="50" r="48" fill="url(#brandGradient)" />
        
        {/* Plate */}
        <ellipse cx="50" cy="55" rx="32" ry="28" fill="url(#plateGradient)" />
        <ellipse cx="50" cy="55" rx="28" ry="24" fill="white" stroke="#E5E7EB" strokeWidth="2" />
        
        {/* QR Code Pattern on Plate */}
        <g transform="translate(38, 43)">
          {/* Simplified QR pattern */}
          <rect x="0" y="0" width="4" height="4" fill="#EF4444" rx="1" />
          <rect x="5" y="0" width="4" height="4" fill="#EF4444" rx="1" />
          <rect x="10" y="0" width="4" height="4" fill="#EF4444" rx="1" />
          <rect x="15" y="0" width="4" height="4" fill="#EF4444" rx="1" />
          <rect x="20" y="0" width="4" height="4" fill="#EF4444" rx="1" />
          
          <rect x="0" y="5" width="4" height="4" fill="#EF4444" rx="1" />
          <rect x="10" y="5" width="4" height="4" fill="#EF4444" rx="1" />
          <rect x="20" y="5" width="4" height="4" fill="#EF4444" rx="1" />
          
          <rect x="0" y="10" width="4" height="4" fill="#EF4444" rx="1" />
          <rect x="5" y="10" width="4" height="4" fill="#EF4444" rx="1" />
          <rect x="10" y="10" width="4" height="4" fill="#EF4444" rx="1" />
          <rect x="15" y="10" width="4" height="4" fill="#EF4444" rx="1" />
          <rect x="20" y="10" width="4" height="4" fill="#EF4444" rx="1" />
          
          <rect x="0" y="15" width="4" height="4" fill="#EF4444" rx="1" />
          <rect x="10" y="15" width="4" height="4" fill="#EF4444" rx="1" />
          <rect x="20" y="15" width="4" height="4" fill="#EF4444" rx="1" />
          
          <rect x="0" y="20" width="4" height="4" fill="#EF4444" rx="1" />
          <rect x="5" y="20" width="4" height="4" fill="#EF4444" rx="1" />
          <rect x="10" y="20" width="4" height="4" fill="#EF4444" rx="1" />
          <rect x="15" y="20" width="4" height="4" fill="#EF4444" rx="1" />
          <rect x="20" y="20" width="4" height="4" fill="#EF4444" rx="1" />
        </g>

        {/* Utensils - Fork and Knife */}
        <g transform="translate(28, 20)">
          {/* Fork */}
          <path
            d="M4 0 L4 8 M2 0 L2 6 M6 0 L6 6 M4 8 L4 12"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Knife */}
          <path
            d="M38 0 L38 12 M38 0 L40 3 L38 5"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />
        </g>
      </svg>

      {/* Brand Text */}
      {showText && (
        <div>
          <h1 className={`font-bold ${currentSize.text} leading-none`}>
            <span className="text-gray-900">Carti</span><span className="text-primary">ta</span>
          </h1>
          <p className="text-xs text-gray-500 font-medium">Tu restaurante online</p>
        </div>
      )}
    </div>
  );
};

export default BrandLogo;
