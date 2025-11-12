import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useAuth } from '../../context/AuthContext';
import { Printer, Store, Utensils } from 'lucide-react';

const QRLabel = () => {
  const { user } = useAuth();
  const menuUrl = `${window.location.origin}/menu/${user?.localId}`;
  const [showConfig, setShowConfig] = useState(true);
  const [config, setConfig] = useState({
    tipo: 'publicidad', // 'publicidad' o 'mesas'
    cantidad: 1
  });

  const handlePrint = () => {
    setShowConfig(false);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const renderPublicidad = () => (
    <div className="qr-page bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-8 border-4 border-orange-200">
      <div className="bg-white rounded-xl p-8 shadow-lg">
        <div className="text-center mb-6">
          <div className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-2xl mb-4">
            <h1 className="text-4xl font-black">
              {user?.local?.nombre || 'Menú Digital'}
            </h1>
          </div>
          <p className="text-xl text-gray-700 font-semibold">
            📱 Escanea el QR y ordena desde tu celular
          </p>
        </div>

        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-br from-orange-100 to-red-100 p-6 rounded-2xl">
            <div className="bg-white p-4 rounded-xl shadow-lg">
              <QRCodeSVG
                value={menuUrl}
                size={280}
                level="H"
                includeMargin={true}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center mb-6">
          <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-4 border-2 border-green-200">
            <div className="text-4xl mb-2">📱</div>
            <p className="font-bold text-gray-800">Sin App</p>
            <p className="text-xs text-gray-600">Directo desde tu celular</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-cyan-100 rounded-xl p-4 border-2 border-blue-200">
            <div className="text-4xl mb-2">⚡</div>
            <p className="font-bold text-gray-800">Rápido</p>
            <p className="text-xs text-gray-600">En segundos</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-pink-100 rounded-xl p-4 border-2 border-purple-200">
            <div className="text-4xl mb-2">🛒</div>
            <p className="font-bold text-gray-800">Fácil</p>
            <p className="text-xs text-gray-600">Un solo toque</p>
          </div>
        </div>

        <div className="text-center bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl p-4 border-2 border-gray-300">
          <p className="text-sm text-gray-600 font-semibold mb-1">🌐 También en:</p>
          <p className="text-base font-mono text-gray-900 font-bold break-all">{menuUrl}</p>
        </div>
      </div>
    </div>
  );

  const renderMesas = (cantidad) => {
    const mesas = [];
    const mesasPorPagina = 4;
    const totalPaginas = Math.ceil(cantidad / mesasPorPagina);

    for (let pagina = 0; pagina < totalPaginas; pagina++) {
      const mesasEnPagina = [];
      const inicio = pagina * mesasPorPagina + 1;
      const fin = Math.min(inicio + mesasPorPagina - 1, cantidad);

      for (let num = inicio; num <= fin; num++) {
        mesasEnPagina.push(
          <div key={num} className="border-3 border-dashed border-orange-400 rounded-xl p-6 text-center bg-white">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 px-4 rounded-lg mb-3 inline-block">
              <h3 className="text-lg font-black">
                {user?.local?.nombre}
              </h3>
            </div>
            <p className="text-sm text-gray-700 font-semibold mb-4">
              📱 Escanea para ver el menú
            </p>
            <div className="bg-gradient-to-br from-orange-50 to-red-50 p-4 rounded-xl inline-block border-2 border-orange-200">
              <QRCodeSVG
                value={menuUrl}
                size={160}
                level="H"
                includeMargin={true}
              />
            </div>
            <div className="mt-4 bg-gray-100 rounded-lg py-2 px-3">
              <p className="text-xs text-gray-600 font-bold">Mesa #{num}</p>
            </div>
          </div>
        );
      }

      mesas.push(
        <div key={pagina}>
          {pagina > 0 && <div className="page-break"></div>}
          <div className="qr-page bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-center mb-4 text-gray-900">
              ✂️ Etiquetas para Mesa (Recortar)
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {mesasEnPagina}
            </div>
          </div>
        </div>
      );
    }

    return mesas;
  };

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

      {/* Panel de configuración (solo en pantalla) */}
      {showConfig && (
        <div className="no-print fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              🖨️ Configurar Impresión
            </h2>

            {/* Tipo de etiqueta */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Tipo de Etiqueta:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setConfig({ ...config, tipo: 'publicidad', cantidad: 1 })}
                  className={`p-4 rounded-xl border-2 transition ${
                    config.tipo === 'publicidad'
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <Store className="mx-auto mb-2" size={32} />
                  <p className="font-semibold">Publicidad</p>
                  <p className="text-xs text-gray-600">Póster completo</p>
                </button>
                <button
                  onClick={() => setConfig({ ...config, tipo: 'mesas' })}
                  className={`p-4 rounded-xl border-2 transition ${
                    config.tipo === 'mesas'
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <Utensils className="mx-auto mb-2" size={32} />
                  <p className="font-semibold">Mesas</p>
                  <p className="text-xs text-gray-600">Etiquetas pequeñas</p>
                </button>
              </div>
            </div>

            {/* Cantidad (solo para mesas) */}
            {config.tipo === 'mesas' && (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Cantidad de Mesas:
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={config.cantidad}
                  onChange={(e) => setConfig({ ...config, cantidad: parseInt(e.target.value) || 1 })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none text-lg font-semibold text-center"
                />
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Se imprimirán {Math.ceil(config.cantidad / 4)} página(s) (4 etiquetas por página)
                </p>
              </div>
            )}

            {/* Botones */}
            <div className="flex gap-3">
              <button
                onClick={() => window.close()}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={handlePrint}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition font-semibold flex items-center justify-center gap-2"
              >
                <Printer size={20} />
                Imprimir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contenido para imprimir */}
      {!showConfig && (
        <>
          {config.tipo === 'publicidad' ? renderPublicidad() : renderMesas(config.cantidad)}
        </>
      )}
    </div>
  );
};

export default QRLabel;
