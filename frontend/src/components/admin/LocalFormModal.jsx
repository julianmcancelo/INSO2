import React, { useState } from 'react';
import { X, Store, User, Mail, Lock, Palette, Upload, Image } from 'lucide-react';
import { toast } from 'react-toastify';
import { localAPI } from '../../services/api';

const LocalFormModal = ({ local, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState(local?.logoBase64 || null);
  const [formData, setFormData] = useState({
    // Datos del local
    nombre: local?.nombre || '',
    slug: local?.slug || '',
    descripcion: local?.descripcion || '',
    logoBase64: local?.logoBase64 || null,
    colorPrimario: local?.colorPrimario || '#ef4444',
    colorSecundario: local?.colorSecundario || '#f59e0b',
    direccion: local?.direccion || '',
    telefono: local?.telefono || '',
    email: local?.email || '',
    // Datos del administrador (solo al crear)
    nombreAdmin: '',
    emailAdmin: '',
    passwordAdmin: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Auto-generar slug desde el nombre del local
    if (name === 'nombre' && !local) {
      const autoSlug = value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData(prev => ({ ...prev, slug: autoSlug }));
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor selecciona una imagen válida');
      return;
    }

    // Validar tamaño (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('La imagen no debe superar 2MB');
      return;
    }

    // Convertir a base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      setLogoPreview(base64String);
      setFormData(prev => ({ ...prev, logoBase64: base64String }));
    };
    reader.onerror = () => {
      toast.error('Error al cargar la imagen');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setLogoPreview(null);
    setFormData(prev => ({ ...prev, logoBase64: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    if (!formData.nombre || !formData.slug) {
      toast.error('Nombre y slug son requeridos');
      return;
    }

    if (!local) {
      // Crear nuevo local - requiere admin
      if (!formData.nombreAdmin || !formData.emailAdmin || !formData.passwordAdmin) {
        toast.error('Debes crear un administrador para el local');
        return;
      }

      if (formData.passwordAdmin !== formData.confirmPassword) {
        toast.error('Las contraseñas no coinciden');
        return;
      }

      if (formData.passwordAdmin.length < 6) {
        toast.error('La contraseña debe tener al menos 6 caracteres');
        return;
      }
    }

    setLoading(true);

    try {
      if (local) {
        // Actualizar local existente
        await localAPI.update(local.id, {
          nombre: formData.nombre,
          descripcion: formData.descripcion,
          logoBase64: formData.logoBase64,
          colorPrimario: formData.colorPrimario,
          colorSecundario: formData.colorSecundario,
          direccion: formData.direccion,
          telefono: formData.telefono,
          email: formData.email
        });
        toast.success('Local actualizado exitosamente');
      } else {
        // Crear nuevo local con administrador
        await localAPI.createWithAdmin({
          nombre: formData.nombre,
          slug: formData.slug,
          descripcion: formData.descripcion,
          logoBase64: formData.logoBase64,
          colorPrimario: formData.colorPrimario,
          colorSecundario: formData.colorSecundario,
          direccion: formData.direccion,
          telefono: formData.telefono,
          email: formData.email,
          nombreAdmin: formData.nombreAdmin,
          emailAdmin: formData.emailAdmin,
          passwordAdmin: formData.passwordAdmin
        });
        toast.success('Local y administrador creados exitosamente');
      }
      onClose();
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.error || 'Error al guardar local');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {local ? 'Editar Local' : 'Crear Nuevo Local'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Datos del Local */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Store size={20} className="mr-2" />
              Información del Local
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Local *
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  placeholder="Ej: Restaurante El Buen Sabor"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug (URL) *
                </label>
                <div className="flex items-center">
                  <span className="text-gray-500 text-sm mr-2">tudominio.com/</span>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    placeholder="restaurante-el-buen-sabor"
                    required
                    disabled={!!local}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {local ? 'El slug no puede modificarse' : 'Solo letras minúsculas, números y guiones'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Image size={16} className="inline mr-1" />
                  Logo del Local
                </label>
                {logoPreview ? (
                  <div className="relative">
                    <img 
                      src={logoPreview} 
                      alt="Logo preview" 
                      className="w-full h-32 object-contain bg-gray-50 rounded-lg border-2 border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-10 h-10 mb-3 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click para subir</span> o arrastra
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG o GIF (Max. 2MB)</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleLogoChange}
                    />
                  </label>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  placeholder="Descripción del local..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Palette size={16} className="inline mr-1" />
                    Color Primario
                  </label>
                  <input
                    type="color"
                    name="colorPrimario"
                    value={formData.colorPrimario}
                    onChange={handleInputChange}
                    className="w-full h-12 rounded-lg border border-gray-300 cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Palette size={16} className="inline mr-1" />
                    Color Secundario
                  </label>
                  <input
                    type="color"
                    name="colorSecundario"
                    value={formData.colorSecundario}
                    onChange={handleInputChange}
                    className="w-full h-12 rounded-lg border border-gray-300 cursor-pointer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    placeholder="+54 11 1234-5678"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="contacto@local.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección
                </label>
                <input
                  type="text"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleInputChange}
                  placeholder="Calle 123, Ciudad"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Datos del Administrador - Solo al crear */}
          {!local && (
            <div className="mb-6 pb-6 border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User size={20} className="mr-2" />
                Administrador del Local
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    name="nombreAdmin"
                    value={formData.nombreAdmin}
                    onChange={handleInputChange}
                    placeholder="Nombre del administrador"
                    required={!local}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail size={16} className="inline mr-1" />
                    Email *
                  </label>
                  <input
                    type="email"
                    name="emailAdmin"
                    value={formData.emailAdmin}
                    onChange={handleInputChange}
                    placeholder="admin@email.com"
                    required={!local}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Lock size={16} className="inline mr-1" />
                    Contraseña *
                  </label>
                  <input
                    type="password"
                    name="passwordAdmin"
                    value={formData.passwordAdmin}
                    onChange={handleInputChange}
                    placeholder="Mínimo 6 caracteres"
                    required={!local}
                    minLength={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Lock size={16} className="inline mr-1" />
                    Confirmar Contraseña *
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Repite la contraseña"
                    required={!local}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Botones */}
          <div className="flex space-x-4">
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
              {loading ? 'Guardando...' : (local ? 'Actualizar Local' : 'Crear Local')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LocalFormModal;
