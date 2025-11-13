'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, QrCode as QrCodeIcon, Download, Copy, Check, ExternalLink } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'react-toastify';
import { useAuth } from '@/context/AuthContext';
import PrivateRoute from '@/components/shared/PrivateRoute';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function AdminQRCode() {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [localSlug, setLocalSlug] = useState('');
  const [loading, setLoading] = useState(true);
  const qrRef = useRef(null);

  useEffect(() => {
    if (user?.localId) {
      loadLocalData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.localId]);

  const loadLocalData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/locales/${user.localId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLocalSlug(response.data.local.slug);
    } catch (error) {
      console.error('Error al cargar local:', error);
      toast.error('Error al cargar datos del local');
    } finally {
      setLoading(false);
    }
  };

  // URL del menú del cliente usando el SLUG
  const menuUrl = typeof window !== 'undefined' && localSlug
    ? `${window.location.origin}/menu/${localSlug}` 
    : '';

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
      downloadLink.download = `qr-menu-local.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
      
      toast.success('QR descargado exitosamente');
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  if (!user?.localId || loading) {
    return (
      <PrivateRoute>
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
            <QrCodeIcon size={64} className="mx-auto text-gray-400 mb-4" />
            {loading ? (
              <>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Cargando...</h2>
                <p className="text-gray-600">Obteniendo datos del local</p>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Sin Local Seleccionado</h2>
                <p className="text-gray-600 mb-6">
                  Debes seleccionar un local para ver su código QR
                </p>
                <Link
                  href="/admin"
                  className="inline-block bg-primary text-white px-6 py-2 rounded-lg hover:opacity-90"
                >
                  Volver al Dashboard
                </Link>
              </>
            )}
          </div>
        </div>
      </PrivateRoute>
    );
  }

  return (
    <PrivateRoute>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link href="/admin" className="text-gray-600 hover:text-gray-900">
                  <ArrowLeft size={24} />
                </Link>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Código QR</h1>
                  <p className="text-sm text-gray-600 mt-1">Menú Digital</p>
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
                  <QrCodeIcon size={24} className="text-orange-600" />
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
                  />
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={downloadQR}
                  className="w-full bg-primary text-white px-6 py-3 rounded-lg hover:opacity-90 transition flex items-center justify-center gap-2"
                >
                  <Download size={20} />
                  Descargar QR
                </button>

                <button
                  onClick={copyToClipboard}
                  className="w-full bg-white border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2"
                >
                  {copied ? (
                    <>
                      <Check size={20} className="text-green-600" />
                      <span>¡Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={20} />
                      <span>Copiar URL</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Instrucciones */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-md p-8 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  📱 ¿Cómo usar el código QR?
                </h3>
                <ol className="space-y-3 text-gray-700">
                  <li className="flex gap-3">
                    <span className="font-bold text-primary">1.</span>
                    <span>Descarga el código QR usando el botón de arriba</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-primary">2.</span>
                    <span>Imprime el QR en tamaño A4 o más grande</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-primary">3.</span>
                    <span>Colócalo en las mesas de tu local</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-primary">4.</span>
                    <span>Los clientes escanean y ven tu menú digital</span>
                  </li>
                </ol>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
                <h4 className="font-bold text-blue-900 mb-2">💡 URL de tu menú</h4>
                <div className="bg-white rounded-lg p-3 mb-3">
                  <code className="text-sm text-gray-700 break-all">{menuUrl}</code>
                </div>
                <a
                  href={menuUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  <ExternalLink size={16} />
                  Ver menú en nueva pestaña
                </a>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
                <h4 className="font-bold text-green-900 mb-2">✨ Consejos</h4>
                <ul className="space-y-2 text-sm text-green-800">
                  <li>• Usa un tamaño mínimo de 10x10 cm para el QR</li>
                  <li>• Asegúrate de que haya buena iluminación</li>
                  <li>• Plastifica el QR para mayor durabilidad</li>
                  <li>• Coloca un texto como &quot;Escanea para ver el menú&quot;</li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </PrivateRoute>
  );
}
