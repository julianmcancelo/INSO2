import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { toast } from 'react-toastify';
import ProductoModal from './ProductoModal';

const ProductoCard = ({ producto }) => {
  const { addToCart } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAgregarRapido = () => {
    if (producto.opciones && producto.opciones.length > 0) {
      // Si tiene opciones, abrir modal
      setIsModalOpen(true);
    } else {
      // Si no tiene opciones, agregar directamente
      addToCart(producto, 1, {}, '');
      toast.success(`${producto.nombre} agregado al carrito`);
    }
  };

  const handleAgregarDesdeModal = (cantidad, personalizaciones, notas) => {
    addToCart(producto, cantidad, personalizaciones, notas);
    setIsModalOpen(false);
    toast.success(`${producto.nombre} agregado al carrito`);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition overflow-hidden">
        {producto.imagenBase64 && (
          <div className="relative h-48 bg-gray-200">
            <img
              src={producto.imagenBase64}
              alt={producto.nombre}
              className="w-full h-full object-cover"
            />
            {producto.destacado && (
              <span className="absolute top-2 right-2 bg-secondary text-white text-xs px-2 py-1 rounded-full font-semibold">
                Destacado
              </span>
            )}
          </div>
        )}

        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">{producto.nombre}</h3>
          
          {producto.descripcion && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{producto.descripcion}</p>
          )}

          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-primary">
                ${parseFloat(producto.precio).toFixed(2)}
              </p>
              {producto.tiempoPreparacion && (
                <p className="text-xs text-gray-500">
                  ~{producto.tiempoPreparacion} min
                </p>
              )}
            </div>

            <button
              onClick={handleAgregarRapido}
              className="bg-primary text-white p-2 rounded-full hover:opacity-90 transition flex items-center space-x-1"
            >
              <Plus size={20} />
              <span className="text-sm font-medium pr-1">Agregar</span>
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
