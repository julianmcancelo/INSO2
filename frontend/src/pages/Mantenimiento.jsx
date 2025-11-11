import React, { useState, useEffect } from 'react';
import { Wrench, Rocket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BrandLogo from '../components/BrandLogo';

const Mantenimiento = ({ tipo = 'countdown', fechaLanzamiento, mensaje }) => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [clickCount, setClickCount] = useState(0);

useEffect(() => {
    if (!fechaLanzamiento || tipo !== 'countdown') return;

    const calculateTimeLeft = () => {
      const difference = new Date(fechaLanzamiento) - new Date();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [fechaLanzamiento, tipo]);

  // Resetear contador de clicks después de 3 segundos de inactividad
  useEffect(() => {
    if (clickCount === 0) return;
    
    const resetTimer = setTimeout(() => {
      setClickCount(0);
    }, 3000);

    return () => clearTimeout(resetTimer);
  }, [clickCount]);

  // Redirigir al login después de 3 clicks
  useEffect(() => {
    if (clickCount >= 3) {
      navigate('/admin/login');
    }
  }, [clickCount, navigate]);

  const handleLogoClick = () => {
    setClickCount(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-400 via-orange-400 to-red-500 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Logo */}
        <div className="flex justify-center mb-12">
          <div 
            onClick={handleLogoClick}
            className="bg-white px-8 py-4 rounded-2xl shadow-2xl cursor-pointer hover:scale-105 transition-transform relative"
          >
            <BrandLogo size="lg" showText={true} />
            {clickCount > 0 && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold animate-bounce">
                {clickCount}
              </div>
            )}
          </div>
        </div>

        {/* Card Principal */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center">
          {/* Icono */}
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center">
              {tipo === 'countdown' ? (
                <Rocket className="text-primary" size={48} />
              ) : (
                <Wrench className="text-primary" size={48} />
              )}
            </div>
          </div>

          {/* Título */}
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            {tipo === 'countdown' ? '¡Muy Pronto!' : 'En Mantenimiento'}
          </h1>

          {/* Mensaje */}
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto">
            {mensaje || (tipo === 'countdown' 
              ? 'Estamos preparando algo increíble para ti. ¡No te lo pierdas!'
              : 'Estamos trabajando en mejoras para ofrecerte una mejor experiencia.'
            )}
          </p>

          {/* Cuenta Regresiva */}
          {tipo === 'countdown' && fechaLanzamiento && (
            <div className="mb-12">
              <div className="grid grid-cols-4 gap-4 md:gap-8 max-w-2xl mx-auto">
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border-2 border-orange-200">
                  <div className="text-4xl md:text-6xl font-bold text-primary mb-2">
                    {String(timeLeft.days).padStart(2, '0')}
                  </div>
                  <div className="text-sm md:text-base text-gray-600 font-semibold uppercase">
                    Días
                  </div>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border-2 border-orange-200">
                  <div className="text-4xl md:text-6xl font-bold text-primary mb-2">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </div>
                  <div className="text-sm md:text-base text-gray-600 font-semibold uppercase">
                    Horas
                  </div>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border-2 border-orange-200">
                  <div className="text-4xl md:text-6xl font-bold text-primary mb-2">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </div>
                  <div className="text-sm md:text-base text-gray-600 font-semibold uppercase">
                    Minutos
                  </div>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border-2 border-orange-200">
                  <div className="text-4xl md:text-6xl font-bold text-primary mb-2">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </div>
                  <div className="text-sm md:text-base text-gray-600 font-semibold uppercase">
                    Segundos
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Features Preview */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="p-6 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Menú Digital</h3>
              <p className="text-sm text-gray-600">Escanea y ordena desde tu celular</p>
            </div>

            <div className="p-6 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Súper Rápido</h3>
              <p className="text-sm text-gray-600">Pedidos en tiempo real</p>
            </div>

            <div className="p-6 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Sin Comisiones</h3>
              <p className="text-sm text-gray-600">0% de comisión en pedidos</p>
            </div>
          </div>

          {/* Contacto */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-gray-600 mb-4">
              ¿Tienes alguna pregunta?
            </p>
            <a 
              href="mailto:hola@cartita.digital" 
              className="inline-flex items-center space-x-2 text-primary hover:underline font-semibold"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>hola@cartita.digital</span>
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-white">
          <p className="text-sm opacity-90">
            © 2025 Cartita. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Mantenimiento;
