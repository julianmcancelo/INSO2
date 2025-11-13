import React, { useState, useEffect } from 'react';

const PhoneMockup = () => {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative animate-float">
      {/* Phone Frame */}
      <div className="relative w-[300px] h-[600px] bg-gray-900 rounded-[45px] p-3 shadow-2xl ring-8 ring-gray-800/50">
        {/* Screen */}
        <div className="w-full h-full bg-white rounded-[36px] overflow-hidden relative">
          {/* Status Bar */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 h-7 flex items-center justify-between px-5">
            <span className="text-white text-xs font-bold">{currentTime || '9:41'}</span>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 01.808 6.808c5.076-5.077 13.308-5.077 18.384 0a1 1 0 01-1.414 1.414zM14.95 11.05a7 7 0 00-9.9 0 1 1 0 01-1.414-1.414 9 9 0 0112.728 0 1 1 0 01-1.414 1.414zM12.12 13.88a3 3 0 00-4.242 0 1 1 0 01-1.415-1.415 5 5 0 017.072 0 1 1 0 01-1.415 1.415zM9 16a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              <div className="w-5 h-3 border-2 border-white rounded-sm relative">
                <div className="absolute inset-0.5 bg-white rounded-sm"></div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-5 space-y-3 h-full overflow-y-auto pb-24">
            {/* Header */}
            <div className="text-center mb-5">
              <h3 className="text-xl font-bold text-gray-900">Menú Digital</h3>
              <p className="text-xs text-gray-500 mt-1">Restaurante Demo</p>
            </div>

            {/* Menu Items */}
            {[
              { name: 'Milanesa 1', desc: 'Con papas fritas y ensalada', price: '$2.500' },
              { name: 'Milanesa 2', desc: 'Napolitana con guarnición', price: '$2.800' },
              { name: 'Milanesa 3', desc: 'A caballo con huevo frito', price: '$2.900' }
            ].map((item, idx) => (
              <div key={idx} className="bg-white border-2 border-gray-100 rounded-xl p-3 flex gap-3 hover:border-orange-300 transition-all shadow-sm">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex-shrink-0 shadow-md"></div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-gray-900">{item.name}</h4>
                  <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">{item.desc}</p>
                  <p className="text-base font-bold text-orange-600 mt-1">{item.price}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Button */}
          <div className="absolute bottom-5 left-5 right-5">
            <button className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3.5 rounded-xl font-bold text-sm shadow-xl hover:shadow-2xl transition-all transform hover:scale-105">
              Ver Carrito (3)
            </button>
          </div>
        </div>

        {/* Notch */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-36 h-7 bg-gray-900 rounded-b-3xl z-10">
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gray-700 rounded-full"></div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute -top-6 -right-6 w-24 h-24 bg-yellow-300 rounded-full opacity-40 blur-2xl animate-pulse"></div>
      <div className="absolute -bottom-6 -left-6 w-28 h-28 bg-red-300 rounded-full opacity-40 blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 -right-8 w-20 h-20 bg-orange-300 rounded-full opacity-30 blur-xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
    </div>
  );
};

export default PhoneMockup;
