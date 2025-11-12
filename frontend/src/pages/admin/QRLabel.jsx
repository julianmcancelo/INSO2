import React, { useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useAuth } from '../../context/AuthContext';

const QRLabel = () => {
  const { user } = useAuth();
  const menuUrl = `${window.location.origin}/menu/${user?.localId}`;

  useEffect(() => {
    const timer = setTimeout(() => {
      window.print();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="print-container">
      <style>{`
        @page {
          size: A4;
          margin: 10mm;
        }
        
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          body {
            margin: 0;
            padding: 0;
          }
          
          .no-print {
            display: none !important;
          }
          
          .page-break {
            page-break-after: always;
          }
        }
        
        @media screen {
          .print-container {
            min-height: 100vh;
            background: #f3f4f6;
            padding: 2rem;
          }
          
          .qr-page {
            max-width: 210mm;
            margin: 0 auto 2rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
        }
      `}</style>

      {/* Póster Principal - Para publicitar */}
      <div className="qr-page bg-white rounded-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-2">
            {user?.local?.nombre || 'Menú Digital'}
          </h1>
          <p className="text-2xl text-gray-600">
            Escanea el código QR para ver nuestro menú
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="bg-white p-6 rounded-xl border-4 border-gray-200">
            <QRCodeSVG
              value={menuUrl}
              size={300}
              level="H"
              includeMargin={true}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-3xl mb-2">📱</div>
            <p className="font-semibold">Sin App</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-3xl mb-2">⚡</div>
            <p className="font-semibold">Rápido</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-3xl mb-2">🛒</div>
            <p className="font-semibold">Fácil</p>
          </div>
        </div>

        <div className="text-center bg-gray-100 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">O visita:</p>
          <p className="text-lg font-mono text-gray-900 break-all">{menuUrl}</p>
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

      {/* Etiquetas para Mesas - 4 por página */}
      <div className="page-break"></div>
      <div className="qr-page bg-white p-6">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
          Etiquetas para Mesa (Recortar con tijera)
        </h2>
        <div className="grid grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((num) => (
            <div key={num} className="border-2 border-dashed border-gray-400 rounded-lg p-6 text-center bg-white">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {user?.local?.nombre}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Escanea para ver el menú
              </p>
              <div className="bg-gray-50 p-4 rounded-lg inline-block">
                <QRCodeSVG
                  value={menuUrl}
                  size={180}
                  level="H"
                  includeMargin={true}
                />
              </div>
              <p className="text-xs text-gray-500 mt-4">
                Mesa #{num}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QRLabel;
