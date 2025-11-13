import React, { useState, useRef } from 'react';
import { X, Package, DollarSign, Clock, Image as ImageIcon, FileText, Sparkles } from 'lucide-react';
import { toast } from 'react-toastify';
import { productoAPI } from '../../services/api';
import axios from 'axios';

const ProductoFormModal = ({ producto, categorias, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [loadingIA, setLoadingIA] = useState(false);
  const [imagePreview, setImagePreview] = useState(producto?.imagenBase64 || null);
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    categoriaId: producto?.categoriaId || (categorias[0]?.id || ''),
    nombre: producto?.nombre || '',
    descripcion: producto?.descripcion || '',
    precio: producto?.precio || '',
    imagenBase64: producto?.imagenBase64 || '',
    tiempoPreparacion: producto?.tiempoPreparacion || '',
    disponible: producto?.disponible !== undefined ? producto.disponible : true,
    destacado: producto?.destacado || false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor selecciona una imagen válida');
      return;
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('La imagen no debe superar los 5MB');
      return;
    }

    // Convertir a Base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      setImagePreview(base64String);
      setFormData(prev => ({ ...prev, imagenBase64: base64String }));
    };
    reader.onerror = () => {
      toast.error('Error al cargar la imagen');
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    setFormData(prev => ({ ...prev, imagenBase64: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const generarDescripcionIA = async () => {
    // Validar que haya datos mínimos
    if (!formData.nombre.trim()) {
      toast.warning('Ingresa el nombre del producto primero');
      return;
    }
    if (!formData.precio || parseFloat(formData.precio) <= 0) {
      toast.warning('Ingresa el precio del producto primero');
      return;
    }

    setLoadingIA(true);
    try {
      const token = localStorage.getItem('token');
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      
      // Obtener nombre de la categoría
      const categoria = categorias.find(c => c.id === parseInt(formData.categoriaId));
      
      const response = await axios.post(
        `${API_URL}/api/ai/descripcion`,
        {
          nombre: formData.nombre,
          categoria: categoria?.nombre || 'General',
          precio: parseFloat(formData.precio),
          ingredientes: formData.descripcion || '' // Si ya hay algo escrito, usarlo como base
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setFormData(prev => ({
          ...prev,
          descripcion: response.data.data.descripcion
        }));
        toast.success('✨ Descripción generada con IA');
      }
    } catch (error) {
      console.error('Error al generar descripción:', error);
      
      // Error 429: Rate limit exceeded
      if (error.response?.status === 429) {
        const retryAfter = error.response.data?.retryAfter || 60;
        toast.error(
          `⏱️ Límite de solicitudes alcanzado. Por favor, espera ${retryAfter} segundos e intenta nuevamente.`,
          { autoClose: 5000 }
        );
      }
      // Error 503: Servicio no configurado
      else if (error.response?.status === 503) {
        toast.error('El servicio de IA no está configurado. Contacta al administrador.');
      }
      // Error 401: API Key inválida
      else if (error.response?.status === 401) {
        toast.error('API Key de IA inválida. Contacta al administrador.');
      }
      // Error genérico
      else {
        const message = error.response?.data?.message || 'Error al generar descripción con IA';
        toast.error(message);
      }
    } finally {
      setLoadingIA(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    if (!formData.categoriaId) {
      toast.error('Selecciona una categoría');
      return;
    }
    if (!formData.nombre.trim()) {
      toast.error('El nombre es requerido');
      return;
    }
    if (!formData.precio || parseFloat(formData.precio) <= 0) {
      toast.error('El precio debe ser mayor a 0');
      return;
    }

    setLoading(true);

    try {
      const dataToSend = {
        ...formData,
        precio: parseFloat(formData.precio),
        tiempoPreparacion: formData.tiempoPreparacion ? parseInt(formData.tiempoPreparacion) : null,
        categoriaId: parseInt(formData.categoriaId)
      };

      if (producto) {
        await productoAPI.update(producto.id, dataToSend);
        toast.success('Producto actualizado exitosamente');
      } else {
        await productoAPI.create(dataToSend);
        toast.success('Producto creado exitosamente');
      }
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.error || 'Error al guardar producto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full my-8">
        <div className="border-b px-6 py-4 flex items-center justify-between sticky top-0 bg-white rounded-t-lg">
          <h2 className="text-xl font-bold text-gray-900">
            {producto ? 'Editar Producto' : 'Nuevo Producto'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-5">
            {/* Categoría */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Package size={16} className="inline mr-1" />
                Categoría *
              </label>
              <select
                name="categoriaId"
                value={formData.categoriaId}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Selecciona una categoría</option>
                {categorias.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Package size={16} className="inline mr-1" />
                Nombre del Producto *
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                placeholder="Ej: Pizza Margarita, Hamburguesa Clásica..."
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Descripción */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  <FileText size={16} className="inline mr-1" />
                  Descripción
                </label>
                <button
                  type="button"
                  onClick={generarDescripcionIA}
                  disabled={loadingIA}
                  className="flex items-center space-x-1 px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-medium rounded-lg hover:from-purple-600 hover:to-pink-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Sparkles size={14} />
                  <span>{loadingIA ? 'Generando...' : 'Generar con IA'}</span>
                </button>
              </div>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                placeholder="Describe los ingredientes, características especiales... o usa IA para generar automáticamente"
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                💡 Tip: Completa el nombre, categoría y precio, luego haz clic en "Generar con IA"
              </p>
            </div>

            {/* Precio y Tiempo */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign size={16} className="inline mr-1" />
                  Precio *
                </label>
                <input
                  type="number"
                  name="precio"
                  value={formData.precio}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock size={16} className="inline mr-1" />
                  Tiempo de Preparación (min)
                </label>
                <input
                  type="number"
                  name="tiempoPreparacion"
                  value={formData.tiempoPreparacion}
                  onChange={handleInputChange}
                  placeholder="15"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            {/* Imagen */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <ImageIcon size={16} className="inline mr-1" />
                Imagen del Producto <span className="text-gray-400 text-xs">(Opcional)</span>
              </label>
              
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-lg border-2 border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 shadow-lg"
                  >
                    <X size={20} />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-orange-500 transition cursor-pointer relative">
                  <ImageIcon size={48} className="mx-auto text-gray-400 mb-3" />
                  <p className="text-sm text-gray-600 mb-2">
                    Haz clic para seleccionar una imagen (opcional)
                  </p>
                  <p className="text-xs text-gray-500">
                    JPG, PNG o GIF (máx. 5MB)
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              )}
            </div>

            {/* Checkboxes */}
            <div className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="disponible"
                  checked={formData.disponible}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <span className="text-sm font-medium text-gray-700">
                  Producto disponible para pedidos
                </span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="destacado"
                  checked={formData.destacado}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <span className="text-sm font-medium text-gray-700">
                  Marcar como producto destacado
                </span>
              </label>
            </div>
          </div>

          <div className="flex space-x-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary text-white py-3 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? 'Guardando...' : (producto ? 'Actualizar Producto' : 'Crear Producto')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductoFormModal;
