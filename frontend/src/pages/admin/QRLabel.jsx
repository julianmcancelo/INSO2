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
        <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white py-10 px-8 text-center">
          <h1 className="text-6xl font-bold mb-4">
            {user?.local?.nombre || 'Menú Digital'}
          </h1>
          <p className="text-3xl text-red-100 font-medium">
            Escanea y ordena desde tu celular
          </p>
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
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-10 inline-block">
              <div className="bg-white p-6 rounded-2xl shadow-xl">
                <QRCodeSVG
                  value={menuUrl}
                  size={350}
                  level="H"
                  includeMargin={true}
                  imageSettings={{
                    src: "/logo192.png",
                    height: 50,
                    width: 50,
                    excavate: true,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Beneficios */}
          <div className="grid grid-cols-3 gap-8 max-w-5xl mx-auto mb-10">
            <div className="bg-green-50 rounded-xl p-8 border-2 border-green-200">
              <div className="text-5xl mb-4">📱</div>
              <h3 className="font-bold text-2xl text-gray-900 mb-3">Sin App</h3>
              <p className="text-lg text-gray-700">No necesitas descargar nada</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-8 border-2 border-blue-200">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="font-bold text-2xl text-gray-900 mb-3">Rápido</h3>
              <p className="text-lg text-gray-700">Acceso instantáneo al menú</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-8 border-2 border-purple-200">
              <div className="text-5xl mb-4">🛒</div>
              <h3 className="font-bold text-2xl text-gray-900 mb-3">Fácil</h3>
              <p className="text-lg text-gray-700">Ordena con un toque</p>
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
        <div className="bg-gradient-to-r from-red-500 to-orange-500 h-4"></div>
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
      <div className="qr-page bg-white p-10" style={{ width: '210mm', height: '297mm' }}>
        <h2 className="text-4xl font-bold text-center mb-10 text-gray-900">
          Etiquetas para Mesa (Recortar)
        </h2>
        <div className="grid grid-cols-2 gap-10 h-full" style={{ gridTemplateRows: 'repeat(2, 1fr)' }}>
          {[1, 2, 3, 4].map((num) => (
            <div key={num} className="border-4 border-dashed border-gray-400 rounded-2xl p-8 text-center bg-white flex flex-col justify-center">
              <h3 className="text-3xl font-bold text-primary mb-4">
                {user?.local?.nombre}
              </h3>
              <p className="text-xl text-gray-700 mb-6 font-medium">
                Escanea para ver el menú
              </p>
              <div className="bg-gray-50 p-6 rounded-xl inline-block mx-auto">
                <QRCodeSVG
                  value={menuUrl}
                  size={200}
                  level="H"
                  includeMargin={true}
                />
              </div>
              <p className="text-base text-gray-600 mt-6 font-medium">
                📱 Sin app • ⚡ Rápido • 🛒 Fácil
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QRLabel;
