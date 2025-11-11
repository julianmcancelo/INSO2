import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

const PhoneMockup = ({ className = '' }) => {
  const qrCanvasRef = useRef(null);

  useEffect(() => {
    if (qrCanvasRef.current) {
      QRCode.toCanvas(
        qrCanvasRef.current,
        'https://cartita.digital',
        { 
          width: 90, 
          margin: 1, 
          color: { 
            dark: '#0f172a', 
            light: '#ffffff' 
          } 
        }
      );
    }
  }, []);

  return (
    <div className={`relative ${className}`}>
      {/* Phone Frame */}
      <div 
        className="relative w-[340px] h-[640px] bg-slate-900 rounded-[34px] mx-auto"
        style={{ filter: 'drop-shadow(0 10px 24px rgba(0,0,0,.25))' }}
      >
        {/* Screen */}
        <div 
          className="absolute inset-[12px] rounded-[26px]"
          style={{ 
            background: 'rgba(255,255,255,.9)', 
            backdropFilter: 'blur(4px)' 
          }}
        >
          {/* Status Bar */}
          <div className="flex items-center justify-between px-4 pt-3">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <span className="inline-block w-6 h-3 rounded bg-slate-200"></span>
          </div>

          {/* App Header */}
          <div className="px-4 mt-3">
            <div 
              className="h-11 rounded-xl flex items-center justify-center text-white font-bold text-lg"
              style={{ background: 'linear-gradient(180deg,#ffb75e 0%, #ff7a18 100%)' }}
            >
              Cartita
            </div>
          </div>

          {/* Menu Items */}
          <div className="px-4 pt-4 space-y-4">
            {/* Pizza Card */}
            <div className="h-24 rounded-2xl flex items-center px-4 bg-[#fff3d6]">
              <div className="w-12 h-12 rounded-full bg-[#f59e0b] mr-4 flex items-center justify-center text-2xl">
                🍕
              </div>
              <div className="flex-1">
                <div className="h-2.5 w-40 rounded bg-[#c2410c] mb-3"></div>
                <div className="h-2 w-28 rounded bg-[#d97706]"></div>
              </div>
            </div>

            {/* Burger Card */}
            <div className="h-24 rounded-2xl flex items-center px-4 bg-[#ffe0c9]">
              <div className="w-12 h-12 rounded-full bg-[#fb923c] mr-4 flex items-center justify-center text-2xl">
                🍔
              </div>
              <div className="flex-1">
                <div className="h-2.5 w-40 rounded bg-[#ea580c] mb-3"></div>
                <div className="h-2 w-28 rounded bg-[#f97316]"></div>
              </div>
            </div>

            {/* Drink Card */}
            <div className="h-24 rounded-2xl flex items-center px-4 bg-[#ffd6d6]">
              <div className="w-12 h-12 rounded-full bg-[#ef4444] mr-4 flex items-center justify-center text-2xl">
                🥤
              </div>
              <div className="flex-1">
                <div className="h-2.5 w-40 rounded bg-[#ef4444] mb-3"></div>
                <div className="h-2 w-28 rounded bg-[#f87171]"></div>
              </div>
            </div>
          </div>

          {/* QR Code Badge */}
          <div 
            className="absolute right-6 bottom-6 w-24 h-24 bg-white p-2 rounded-xl hidden md:block"
            style={{ filter: 'drop-shadow(0 10px 24px rgba(0,0,0,.25))' }}
          >
            <canvas 
              ref={qrCanvasRef} 
              className="w-full h-full"
            ></canvas>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhoneMockup;
