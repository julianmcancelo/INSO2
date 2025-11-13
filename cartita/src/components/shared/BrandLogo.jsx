import React from 'react';
import { Utensils } from 'lucide-react';

const BrandLogo = ({ size = 'md', showText = true, className = '' }) => {
  const sizes = {
    sm: { icon: 24, text: 'text-xl' },
    md: { icon: 32, text: 'text-2xl' },
    lg: { icon: 40, text: 'text-3xl' },
    xl: { icon: 48, text: 'text-4xl' }
  };

  const currentSize = sizes[size] || sizes.md;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="bg-gradient-to-br from-orange-500 to-red-500 p-2 rounded-lg shadow-lg">
        <Utensils size={currentSize.icon} className="text-white" />
      </div>
      {showText && (
        <span className={`font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent ${currentSize.text}`}>
          Cartita
        </span>
      )}
    </div>
  );
};

export default BrandLogo;
