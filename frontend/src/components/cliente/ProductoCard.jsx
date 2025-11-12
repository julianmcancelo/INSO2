import React, { useState, useRef } from 'react';
import { Plus, Star } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { toast } from 'react-toastify';
import ProductoModal from './ProductoModal';

const ProductoCard = ({ producto }) => {
  const { addToCart } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const cardRef = useRef(null);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const handleAgregarRapido = () => {
    if (producto.opciones && producto.opciones.length > 0) {
      // Si tiene opciones, abrir modal
      setIsModalOpen(true);
    } else {
      // Si no tiene opciones, agregar directamente
      addToCart(producto, 1, {}, '');
      toast.success(`${producto.nombre} agregado al carrito`, {
        position: 'bottom-center',
        autoClose: 2000,
        hideProgressBar: true,
      });
    }
  };

  // Gestos táctiles para abrir modal
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    setIsPressed(true);
  };

  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const diffX = Math.abs(touchEndX - touchStartX.current);
    const diffY = Math.abs(touchEndY - touchStartY.current);
    
    setIsPressed(false);
    
    // Si es un tap (no un swipe)
    if (diffX < 10 && diffY < 10) {
      setIsModalOpen(true);
    }
  };

  const handleAgregarDesdeModal = (cantidad, personalizaciones, notas) => {
    addToCart(producto, cantidad, personalizaciones, notas);
    setIsModalOpen(false);
    toast.success(`${producto.nombre} agregado al carrito`);
  };

  return (
    <>
      <div 
        ref={cardRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={() => setIsModalOpen(true)}
        className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer transform ${
          isPressed ? 'scale-95' : 'hover:scale-[1.02]'
        } active:scale-95`}
      >
        {producto.imagenBase64 && (
          <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse"></div>
            )}
            <img
              src={producto.imagenBase64}
              alt={producto.nombre}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
              className={`w-full h-full object-cover transition-opacity duration-500 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
            {producto.destacado && (
              <span className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-lg flex items-center gap-1 animate-bounce">
                <Star size={12} fill="currentColor" />
                Destacado
              </span>
            )}
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        )}

        <div className="p-4">
          <h3 className="text-lg font-bold text-gray-900 mb-1.5 line-clamp-1">{producto.nombre}</h3>
          
          {producto.descripcion && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">{producto.descripcion}</p>
          )}

          <div className="flex items-center justify-between mt-4">
            <div>
              <p className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                ${parseFloat(producto.precio).toFixed(2)}
              </p>
              {producto.tiempoPreparacion && (
                <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                  {producto.tiempoPreparacion} min
                </p>
              )}
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAgregarRapido();
              }}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2.5 rounded-full hover:from-orange-600 hover:to-red-600 transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center gap-2 font-semibold text-sm"
            >
              <Plus size={18} strokeWidth={3} />
              <span>Agregar</span>
            </button>
          </div>
        </div>
      </div>

      <ProductoModal
        producto={producto}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAgregar={handleAgregarDesdeModal}
      />
    </>
  );
};

export default ProductoCard;
