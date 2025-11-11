import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, QrCode, Download, Printer, ExternalLink, Copy, Check } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

const AdminQRCode = () => {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const qrRef = useRef(null);

  // URL del menú del cliente
  const menuUrl = `${window.location.origin}/menu/${user?.localId}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(menuUrl);
    setCopied(true);
    toast.success('URL copiada al portapapeles');
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQR = () => {
    const svg = qrRef.current.querySelector('svg');
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      
      const downloadLink = document.createElement('a');
      downloadLink.download = `qr-menu-${user?.local?.nombre || 'local'}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
      
      toast.success('QR descargado exitosamente');
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const printLabel = () => {
    window.open(`/admin/qr-label`, '_blank');
  };

  if (!user?.localId) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <QrCode size={64} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Sin Local Seleccionado</h2>
          <p className="text-gray-600 mb-6">
            Debes seleccionar un local para ver su código QR
          </p>
          <Link
            to="/admin"
            className="inline-block bg-primary text-white px-6 py-2 rounded-lg hover:opacity-90"
          >
            Volver al Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/admin" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft size={24} />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Código QR</h1>
                <p className="text-sm text-gray-600 mt-1">{user?.local?.nombre}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Visualización del QR */}
          <div className="bg-white rounded-xl shadow-md p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <div className="bg-gradient-to-br from-orange-100 to-red-100 p-2 rounded-lg">
                <QrCode size={24} className="text-orange-600" />
              </div>
              Tu Código QR
            </h2>

            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-8 mb-6 flex items-center justify-center">
              <div ref={qrRef} className="bg-white p-6 rounded-xl shadow-lg">
                <QRCodeSVG
                  value={menuUrl}
                  size={256}
                  level="H"
                  includeMargin={true}
                  imageSettings={{
                    src: "/logo192.png",
                    height: 40,
                    width: 40,
                    excavate: true,
                  }}
                />
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={downloadQR}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <Download size={20} />
                <span>Descargar QR</span>
              </button>

              <button
                onClick={printLabel}
                className="w-full bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition flex items-center justify-center gap-2"
              >
                <Printer size={20} />
                <span>Imprimir Etiqueta</span>
              </button>
            </div>
          </div>

          {/* Información y URL */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">¿Cómo usar el QR?</h3>
              <div className="space-y-4 text-gray-700">
                <div className="flex items-start gap-3">
                  <div className="bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center flex-shrink-0 text-sm font-bold shadow-md">
                    1
                  </div>
                  <p>Descarga o imprime el código QR</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center flex-shrink-0 text-sm font-bold shadow-md">
                    2
                  </div>
                  <p>Colócalo en lugares visibles: mesas, entrada, ventanas</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center flex-shrink-0 text-sm font-bold shadow-md">
                    3
                  </div>
                  <p>Tus clientes lo escanean con su celular</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center flex-shrink-0 text-sm font-bold shadow-md">
                    4
                  </div>
                  <p>Acceden directamente a tu menú digital y pueden hacer pedidos</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">URL del Menú</h3>
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-600 mb-2 font-medium">Enlace directo:</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-white px-3 py-2 rounded-lg border border-gray-300 text-sm break-all">
                    {menuUrl}
                  </code>
                  <button
                    onClick={copyToClipboard}
                    className="bg-orange-100 hover:bg-orange-200 text-orange-600 p-2 rounded-lg transition"
                    title="Copiar URL"
                  >
                    {copied ? <Check size={20} className="text-green-600" /> : <Copy size={20} />}
                  </button>
                </div>
              </div>
              
              <a
                href={menuUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition flex items-center justify-center gap-2"
              >
                <ExternalLink size={20} />
                <span>Ver Menú</span>
              </a>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl shadow-md p-6 border border-orange-200">
              <h3 className="text-lg font-bold text-orange-900 mb-2 flex items-center gap-2">
                <span>💡</span> Consejo
              </h3>
              <p className="text-orange-800 text-sm">
                Imprime varias etiquetas y colócalas en diferentes ubicaciones. 
                Cuanto más visible sea el QR, más clientes usarán tu menú digital.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminQRCode;
