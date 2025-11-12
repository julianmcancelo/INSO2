import React, { useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useAuth } from '../../context/AuthContext';
import { Smartphone, Wifi } from 'lucide-react';

const QRLabel = () => {
  const { user } = useAuth();
  const menuUrl = `${window.location.origin}/menu/${user?.localId}`;

  useEffect(() => {
    // Auto-abrir diálogo de impresión después de cargar
    const timer = setTimeout(() => {
      window.print();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="print-container">
      {/* Estilos específicos para impresión */}
      <style>{`
        @page {
          size: A4;
          margin: 0;
        }
        
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          
          body {
            margin: 0;
            padding: 0;
            width: 210mm;
            height: 297mm;
          }
          
          .no-print {
            display: none !important;
          }
          
          .print-container {
            width: 210mm;
            height: auto;
          }
          
          .page-break {
            page-break-after: always;
            break-after: page;
          }
          
          .qr-page {
            width: 210mm;
            height: 297mm;
            page-break-after: always;
            break-after: page;
          }
        }
        
        @media screen {
          .print-container {
            min-height: 100vh;
            background: #f3f4f6;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
            padding: 2rem;
            gap: 2rem;
          }
          
          .qr-page {
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
        }
      `}</style>

      {/* Etiqueta Principal - Tamaño A4 */}
      <div className="qr-page bg-white shadow-2xl rounded-lg overflow-hidden" style={{ width: '210mm', height: '297mm' }}>
        {/* Header con gradiente */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-12 px-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-32 -translate-y-32"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-48 translate-y-48"></div>
          </div>
          <div className="relative z-10">
            <h1 className="text-7xl font-black mb-4 drop-shadow-lg">
              {user?.local?.nombre || 'Menú Digital'}
            </h1>
            <p className="text-4xl text-orange-100 font-bold tracking-wide">
              🍽️ Escanea y ordena desde tu celular
            </p>
          </div>
        </div>

        {/* Contenido Principal */}
        <div className="py-10 px-12 text-center flex flex-col justify-between" style={{ minHeight: 'calc(297mm - 180px)' }}>
          {/* Instrucciones */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <Smartphone size={40} className="text-primary" />
              <h2 className="text-4xl font-bold text-gray-900">¡Es muy fácil!</h2>
            </div>
            <p className="text-2xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
              Abre la cámara de tu celular y apunta al código QR
            </p>
          </div>

          {/* QR Code Grande */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-red-400 rounded-3xl blur-2xl opacity-30"></div>
              <div className="relative bg-gradient-to-br from-orange-50 via-white to-red-50 rounded-3xl p-12 inline-block border-4 border-orange-200">
                <div className="bg-white p-8 rounded-2xl shadow-2xl ring-4 ring-orange-100">
                  <QRCodeSVG
                    value={menuUrl}
                    size={380}
                    level="H"
                    includeMargin={true}
                    fgColor="#ea580c"
                  />
                </div>
                <div className="mt-6 text-center">
                  <p className="text-2xl font-bold text-orange-600">👆 Apunta aquí</p>
                </div>
              </div>
            </div>
          </div>

          {/* Beneficios */}
          <div className="grid grid-cols-3 gap-8 max-w-5xl mx-auto mb-10">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border-3 border-green-300 shadow-lg transform hover:scale-105 transition">
              <div className="text-6xl mb-4">📱</div>
              <h3 className="font-black text-2xl text-gray-900 mb-3">Sin App</h3>
              <p className="text-xl text-gray-700 font-medium">No necesitas descargar nada</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 border-3 border-blue-300 shadow-lg transform hover:scale-105 transition">
              <div className="text-6xl mb-4">⚡</div>
              <h3 className="font-black text-2xl text-gray-900 mb-3">Rápido</h3>
              <p className="text-xl text-gray-700 font-medium">Acceso instantáneo</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border-3 border-purple-300 shadow-lg transform hover:scale-105 transition">
              <div className="text-6xl mb-4">🛒</div>
              <h3 className="font-black text-2xl text-gray-900 mb-3">Fácil</h3>
              <p className="text-xl text-gray-700 font-medium">Ordena con un toque</p>
            </div>
          </div>

          {/* Footer con URL */}
          <div className="bg-gray-100 rounded-xl p-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-center space-x-3 mb-3">
              <Wifi size={28} className="text-gray-600" />
              <p className="text-lg text-gray-600 font-medium">También puedes visitar:</p>
            </div>
            <p className="text-2xl font-mono text-gray-800 break-all font-semibold">
              {menuUrl}
            </p>
          </div>
        </div>

        {/* Footer decorativo */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 h-6 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex space-x-8 text-white text-sm font-bold opacity-70">
              <span>✨ Menú Digital</span>
              <span>•</span>
              <span>🚀 Pedidos Online</span>
              <span>•</span>
              <span>💳 Pagos Seguros</span>
            </div>
          </div>
        </div>
      </div>

      {/* Botón para cerrar (solo en pantalla) */}
      <div className="no-print fixed top-4 right-4">
        <button
          onClick={() => window.close()}
          className="bg-white text-gray-800 px-6 py-3 rounded-lg shadow-lg hover:bg-gray-100 transition font-medium"
        >
          Cerrar
        </button>
      </div>

      {/* Etiquetas pequeñas adicionales (para cortar) */}
      <div className="qr-page bg-gradient-to-br from-gray-50 to-gray-100 p-10" style={{ width: '210mm', height: '297mm' }}>
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-6 px-8 rounded-2xl mb-8 text-center shadow-xl">
          <h2 className="text-4xl font-black">
            ✂️ Etiquetas para Mesa (Recortar)
          </h2>
          <p className="text-lg mt-2 opacity-90">Coloca una en cada mesa de tu local</p>
        </div>
        <div className="grid grid-cols-2 gap-8" style={{ gridTemplateRows: 'repeat(2, 1fr)' }}>
          {[1, 2, 3, 4].map((num) => (
            <div key={num} className="border-4 border-dashed border-orange-400 rounded-3xl p-8 text-center bg-white flex flex-col justify-center shadow-xl relative overflow-hidden">
              {/* Decoración de fondo */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-red-100 rounded-full translate-y-12 -translate-x-12 opacity-50"></div>
              
              <div className="relative z-10">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-6 rounded-xl mb-4 inline-block">
                  <h3 className="text-3xl font-black">
                    {user?.local?.nombre}
                  </h3>
                </div>
                <p className="text-2xl text-gray-800 mb-6 font-bold">
                  📱 Escanea el QR
                </p>
                <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-2xl inline-block mx-auto border-4 border-orange-200 shadow-lg">
                  <QRCodeSVG
                    value={menuUrl}
                    size={220}
                    level="H"
                    includeMargin={true}
                    fgColor="#ea580c"
                  />
                </div>
                <div className="mt-6 bg-gray-50 rounded-xl py-3 px-4">
                  <p className="text-lg text-gray-700 font-bold">
                    ✨ Sin app • ⚡ Rápido • 🛒 Fácil
                  </p>
                </div>
                <p className="text-sm text-gray-500 mt-3 font-medium">
                  Mesa #{num}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QRLabel;
