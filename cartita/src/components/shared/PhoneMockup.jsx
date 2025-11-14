import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Utensils } from 'lucide-react';
import milanesaImg from '../../../fotos/1.jpg';

const PhoneMockup = () => {
  const [currentTime, setCurrentTime] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showCart, setShowCart] = useState(false);

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
      <div className="relative w-[300px] h-[600px] bg-gray-900 rounded-[45px] p-3 shadow-2xl ring-8 ring-gray-800/50 overflow-hidden">
        {/* Screen */}
        <div className="w-full h-full bg-white rounded-[36px] overflow-hidden relative transform scale-[0.96] origin-center">
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

          {/* Content wrapper with slide animation */}
          <div className="relative h-full">
            {/* Menu Screen */}
            <div
              className={`absolute inset-0 p-5 space-y-3 pb-24 overflow-y-auto transition-transform duration-500 ${
                showCart ? '-translate-x-full' : 'translate-x-0'
              }`}
            >
              {/* Header */}
              <div className="text-center mb-5">
                <h3 className="text-xl font-bold text-gray-900">Menú Digital</h3>
                <p className="text-xs text-gray-500 mt-1">Sabores Caseros</p>
              </div>

              {/* Menu Items */}
              {[
                { name: 'Milanesa con papas', desc: 'Milanesa casera con papas fritas y ensalada mixta', price: '$2.500', image: milanesaImg },
                { name: 'QUINTUPLE Hamburgesa', desc: 'Cinco medallones de carne, queso cheddar, panceta y papas fritas', price: '$2.800', image: 'https://dx49ypn7lfv84.cloudfront.net/479/54BHEfFuou-AlMQH.jpg' },
                { name: 'Milanesa a caballo', desc: 'Milanesa con dos huevos fritos y papas rústicas', price: '$2.900', image: 'https://hoycocino.com.ar/wp-content/uploads/2023/08/milanesa-a-caballo-1024x681.jpg' }
              ].map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSelectedItem(item);
                    setShowImage(true);
                  }}
                  className="w-full text-left bg-white border-2 border-gray-100 rounded-xl p-3 flex gap-3 hover:border-orange-300 hover:shadow-md transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500/60"
                >
                  {item.image ? (
                    <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 shadow-md">
                      <img
                        src={item.image?.src ?? item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex-shrink-0 shadow-md"></div>
                  )}
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-gray-900">{item.name}</h4>
                    <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">{item.desc}</p>
                    <p className="text-base font-bold text-orange-600 mt-1">{item.price}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Cart Screen */}
            <div
              className={`absolute inset-0 p-5 pb-24 flex flex-col items-center justify-between transition-transform duration-500 ${
                showCart ? 'translate-x-0' : 'translate-x-full'
              }`}
            >
              <div className="w-full">
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-gray-900">Tu carrito</h3>
                  <p className="text-xs text-gray-500 mt-1">Mesa 4 · 3 productos</p>
                </div>

                <div className="bg-orange-50 border border-orange-100 rounded-2xl p-3 mb-4">
                  <div className="flex justify-between text-xs text-gray-700 mb-1">
                    <span>Milanesa con papas</span>
                    <span>$2.500</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-700 mb-1">
                    <span>QUINTUPLE Hamburgesa</span>
                    <span>$2.800</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-700 mb-1">
                    <span>Milanesa a caballo</span>
                    <span>$2.900</span>
                  </div>
                  <div className="border-t border-orange-100 mt-2 pt-2 flex justify-between text-xs font-semibold text-gray-900">
                    <span>Total</span>
                    <span>$8.200</span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-3 flex flex-col items-center">
                  <p className="text-xs text-gray-600 mb-2 text-center">
                    Escaneá este QR para confirmar y pagar tu pedido
                  </p>
                  <div className="bg-white p-2 rounded-xl border border-gray-100 mb-2">
                    <QRCodeSVG
                      value="https://cartita.digital"
                      size={120}
                      level="H"
                      includeMargin={false}
                      fgColor="#FF6B35"
                    />
                  </div>
                  <span className="text-xs font-medium text-gray-500">cartita.digital</span>
                </div>
              </div>

              <div className="w-full space-y-2">
                <button
                  type="button"
                  onClick={() => setShowCart(false)}
                  className="w-full bg-gray-100 text-gray-800 py-3 rounded-xl text-xs font-semibold hover:bg-gray-200 transition"
                >
                  Volver al menú
                </button>
              </div>
            </div>

            {/* Bottom Button (only visible en menú) */}
            {!showCart && (
              <div className="absolute bottom-4 left-6 right-6">
                <button
                  onClick={() => setShowCart(true)}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-semibold text-[13px] shadow-lg hover:shadow-xl transition-all transform hover:scale-102"
                >
                  Ver carrito (3)
                </button>
              </div>
            )}
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

      {/* Modal QR Code */}
      {showQR && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fadeIn"
            onClick={() => setShowQR(false)}
          />
          
          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 pointer-events-none">
            <div 
              className="bg-white rounded-3xl shadow-2xl px-5 py-6 sm:px-6 sm:py-7 max-w-xs sm:max-w-sm w-full pointer-events-auto animate-fadeIn relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setShowQR(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>

              {/* Logo */}
              <div className="flex justify-center mb-4">
                <div className="bg-gradient-to-br from-orange-500 to-red-500 p-3 rounded-2xl shadow-lg">
                  <Utensils size={38} className="text-white" />
                </div>
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-center text-gray-900 mb-1">
                Cartita
              </h3>
              <p className="text-center text-gray-600 text-sm mb-4">
                Escanea el código QR para visitar nuestra web
              </p>

              {/* QR Code */}
              <div className="flex justify-center mb-4 bg-white p-4 rounded-2xl border-2 border-gray-100">
                <QRCodeSVG 
                  value="https://cartita.digital"
                  size={140}
                  level="H"
                  includeMargin={true}
                  fgColor="#FF6B35"
                />
              </div>

              {/* URL */}
              <div className="text-center">
                <a 
                  href="https://cartita.digital" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-orange-600 font-semibold hover:text-orange-700 transition-colors"
                >
                  cartita.digital
                </a>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Modal Imagen Milanesa */}
      {showImage && (
        <>
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 animate-fadeIn"
            onClick={() => setShowImage(false)}
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div
              className="bg-white rounded-3xl shadow-2xl p-4 sm:p-6 max-w-md w-full pointer-events-auto animate-fadeIn relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowImage(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>

              <h3 className="text-lg sm:text-xl font-bold text-center text-gray-900 mb-2">
                {selectedItem?.name || 'Milanesa con papas'}
              </h3>

              <div className="rounded-2xl overflow-hidden shadow-lg mb-3">
                <img
                  src={(selectedItem?.image && (selectedItem.image.src ?? selectedItem.image)) || (milanesaImg?.src ?? milanesaImg)}
                  alt={selectedItem?.name || 'Milanesa con papas'}
                  className="w-full h-auto object-cover"
                />
              </div>

              <div className="text-center space-y-1">
                <p className="text-xs sm:text-sm text-gray-600">
                  {selectedItem?.desc || 'Plato casero preparado en el momento.'}
                </p>
                <p className="text-sm sm:text-base font-semibold text-orange-600">
                  {selectedItem?.price || '$0,00'}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PhoneMockup;
