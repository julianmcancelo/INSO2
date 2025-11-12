import React, { useState } from 'react';
import { X, Plus, Minus } from 'lucide-react';

const ProductoModal = ({ producto, isOpen, onClose, onAgregar }) => {
  const [cantidad, setCantidad] = useState(1);
  const [personalizaciones, setPersonalizaciones] = useState({});
  const [notas, setNotas] = useState('');

  if (!isOpen) return null;

  const handlePersonalizacionChange = (tipo, opcion) => {
    setPersonalizaciones(prev => {
      const nuevas = { ...prev };
      if (!nuevas[tipo]) {
        nuevas[tipo] = [];
      }

      const index = nuevas[tipo].findIndex(item => item.nombre === opcion.nombre);
      if (index !== -1) {
        nuevas[tipo].splice(index, 1);
      } else {
        nuevas[tipo].push(opcion);
      }

      return nuevas;
    });
  };

  const handleAgregar = () => {
    onAgregar(cantidad, personalizaciones, notas);
    // Resetear estado
    setCantidad(1);
    setPersonalizaciones({});
    setNotas('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Fullscreen en mobile, centrado en desktop */}
      <div className="min-h-screen flex items-end md:items-center justify-center md:p-4">
        {/* Overlay - solo visible en desktop */}
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity hidden md:block" onClick={onClose}></div>

        {/* Modal - fullscreen en mobile, centrado en desktop */}
        <div className="relative w-full md:max-w-lg bg-white md:rounded-2xl shadow-xl transform transition-all max-h-screen overflow-y-auto"
             onClick={(e) => e.stopPropagation()}>
          
          {/* Header */}
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
            <div className="flex items-start justify-between">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {producto.nombre}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={24} />
              </button>
            </div>

            {producto.imagenBase64 && (
              <img
                src={producto.imagenBase64}
                alt={producto.nombre}
                className="w-full h-48 object-cover rounded-lg mt-4"
              />
            )}

            {producto.descripcion && (
              <p className="mt-3 text-sm text-gray-600">{producto.descripcion}</p>
            )}

            {/* Opciones */}
            {producto.opciones && Array.isArray(producto.opciones) && producto.opciones.length > 0 && (
              <div className="mt-4 space-y-4">
                {producto.opciones.map((grupo, idx) => (
                  <div key={idx}>
                    <h4 className="font-medium text-gray-900 mb-2 capitalize">
                      {grupo.tipo.replace('_', ' ')}
                    </h4>
                    <div className="space-y-2">
                      {grupo.opciones.map((opcion, opIdx) => (
                        <label key={opIdx} className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-primary focus:ring-primary"
                            onChange={() => handlePersonalizacionChange(grupo.tipo, opcion)}
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            {opcion.nombre}
                            {opcion.precio > 0 && (
                              <span className="text-primary ml-1">
                                +${parseFloat(opcion.precio).toFixed(2)}
                              </span>
                            )}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Notas */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notas adicionales (opcional)
              </label>
              <textarea
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                placeholder="Ej: Sin cebolla, cocción término medio, etc."
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Cantidad */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cantidad
              </label>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                  className="bg-gray-200 p-2 rounded-full hover:bg-gray-300"
                  disabled={cantidad <= 1}
                >
                  <Minus size={20} />
                </button>
                <span className="text-xl font-semibold w-12 text-center">{cantidad}</span>
                <button
                  onClick={() => setCantidad(cantidad + 1)}
                  className="bg-gray-200 p-2 rounded-full hover:bg-gray-300"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              onClick={handleAgregar}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:opacity-90 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
            >
              Agregar ${(parseFloat(producto.precio) * cantidad).toFixed(2)}
            </button>
            <button
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductoModal;
