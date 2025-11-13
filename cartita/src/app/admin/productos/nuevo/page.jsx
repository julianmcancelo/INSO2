'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Upload, X, Image as ImageIcon } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '@/context/AuthContext';
import { productoAPI, categoriaAPI } from '@/lib/api';
import PrivateRoute from '@/components/shared/PrivateRoute';

export default function NuevoProducto() {
  const { user } = useAuth();
  const router = useRouter();
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imagenPreview, setImagenPreview] = useState(null);
  
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    categoriaId: '',
    imagenBase64: '',
    disponible: true
  });

  useEffect(() => {
    cargarCategorias();
  }, [user?.localId]);

  const cargarCategorias = async () => {
    if (!user?.localId) return;
    try {
      const response = await categoriaAPI.getByLocal(user.localId);
      setCategorias(response.data.categorias || []);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
      toast.error('Error al cargar categorías');
    }
  };

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

    // Convertir a base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      setFormData(prev => ({
        ...prev,
        imagenBase64: base64String
      }));
      setImagenPreview(base64String);
    };
    reader.readAsDataURL(file);
  };

  const eliminarImagen = () => {
    setFormData(prev => ({ ...prev, imagenBase64: '' }));
    setImagenPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    if (!formData.nombre.trim()) {
      toast.error('El nombre es requerido');
      return;
    }

    if (!formData.precio || parseFloat(formData.precio) <= 0) {
      toast.error('El precio debe ser mayor a 0');
      return;
    }

    if (!formData.categoriaId) {
      toast.error('Debes seleccionar una categoría');
      return;
    }

    try {
      setLoading(true);

      const productoData = {
        ...formData,
        precio: parseFloat(formData.precio),
        categoriaId: parseInt(formData.categoriaId),
        localId: user.localId
      };

      await productoAPI.create(productoData);
      
      toast.success('Producto creado exitosamente');
      router.push('/admin/productos');
    } catch (error) {
      console.error('Error al crear producto:', error);
      toast.error(error.response?.data?.error || 'Error al crear producto');
    } finally {
      setLoading(false);
    }
  };

  if (!user?.localId) {
    return (
      <PrivateRoute>
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Sin Local Seleccionado</h2>
            <p className="text-gray-600 mb-6">
              Debes seleccionar un local para crear productos
            </p>
            <Link 
              href="/admin" 
              className="inline-block bg-primary text-white px-6 py-2 rounded-lg hover:opacity-90"
            >
              Volver al Dashboard
            </Link>
          </div>
        </div>
      </PrivateRoute>
    );
  }

  return (
    <PrivateRoute>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center space-x-4">
              <Link href="/admin/productos" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft size={24} />
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Nuevo Producto</h1>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 space-y-6">
            
            {/* Imagen del Producto */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imagen del Producto
              </label>
              
              {imagenPreview ? (
                <div className="relative">
                  <img 
                    src={imagenPreview} 
                    alt="Preview" 
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={eliminarImagen}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                  >
                    <X size={20} />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="imagen-input"
                  />
                  <label 
                    htmlFor="imagen-input" 
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <ImageIcon size={48} className="text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600 mb-1">
                      Click para seleccionar una imagen
                    </span>
                    <span className="text-xs text-gray-500">
                      PNG, JPG, GIF hasta 5MB
                    </span>
                  </label>
                </div>
              )}
            </div>

            {/* Nombre */}
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Producto *
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Ej: Pizza Margarita"
              />
            </div>

            {/* Descripción */}
            <div>
              <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Describe tu producto..."
              />
            </div>

            {/* Precio y Categoría */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Precio */}
              <div>
                <label htmlFor="precio" className="block text-sm font-medium text-gray-700 mb-2">
                  Precio *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">$</span>
                  <input
                    type="number"
                    id="precio"
                    name="precio"
                    value={formData.precio}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Categoría */}
              <div>
                <label htmlFor="categoriaId" className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría *
                </label>
                <select
                  id="categoriaId"
                  name="categoriaId"
                  value={formData.categoriaId}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Selecciona una categoría</option>
                  {categorias.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Disponibilidad */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="disponible"
                name="disponible"
                checked={formData.disponible}
                onChange={handleInputChange}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="disponible" className="ml-2 block text-sm text-gray-700">
                Producto disponible para la venta
              </label>
            </div>

            {/* Botones */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t">
              <Link
                href="/admin/productos"
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition disabled:opacity-50 flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Creando...</span>
                  </>
                ) : (
                  <>
                    <Upload size={18} />
                    <span>Crear Producto</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </main>
      </div>
    </PrivateRoute>
  );
}
