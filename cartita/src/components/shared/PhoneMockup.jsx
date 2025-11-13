import React from 'react';

const PhoneMockup = () => {
  return (
    <div className="relative">
      {/* Phone Frame */}
      <div className="relative w-[280px] h-[560px] bg-gray-900 rounded-[40px] p-3 shadow-2xl">
        {/* Screen */}
        <div className="w-full h-full bg-white rounded-[32px] overflow-hidden">
          {/* Status Bar */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 h-6 flex items-center justify-between px-4">
            <span className="text-white text-xs font-semibold">9:41</span>
            <div className="flex gap-1">
              <div className="w-4 h-3 bg-white rounded-sm"></div>
              <div className="w-4 h-3 bg-white rounded-sm"></div>
              <div className="w-4 h-3 bg-white rounded-sm"></div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 space-y-3">
            {/* Header */}
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Menú Digital</h3>
              <p className="text-xs text-gray-500">Restaurante Demo</p>
            </div>

            {/* Menu Items */}
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-gray-50 rounded-lg p-3 flex gap-3">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex-shrink-0"></div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-gray-900">Producto {item}</h4>
                  <p className="text-xs text-gray-500 line-clamp-2">Descripción del producto</p>
                  <p className="text-sm font-bold text-primary mt-1">$1.500</p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Button */}
          <div className="absolute bottom-4 left-4 right-4">
            <button className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-lg font-semibold text-sm shadow-lg">
              Ver Carrito (3)
            </button>
          </div>
        </div>

        {/* Notch */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-2xl"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute -top-4 -right-4 w-20 h-20 bg-yellow-300 rounded-full opacity-50 blur-xl animate-pulse"></div>
      <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-red-300 rounded-full opacity-50 blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
    </div>
  );
};

export default PhoneMockup;
