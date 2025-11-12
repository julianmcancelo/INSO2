import React, { useState, useEffect } from 'react';
import { CreditCard, Save, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { localAPI } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminDatosBancarios = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [local, setLocal] = useState(null);
  const [datosBancarios, setDatosBancarios] = useState({
    cbu: '',
    alias: '',
    titular: '',
    banco: '',
    tipoCuenta: 'Caja de Ahorro',
    cuit: ''
  });

  useEffect(() => {
    cargarLocal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cargarLocal = async () => {
    try {
      setLoading(true);
      const response = await localAPI.getById(user.localId);
      setLocal(response.data.local);
      
      // Cargar datos bancarios si existen
      if (response.data.local.datosBancarios && Object.keys(response.data.local.datosBancarios).length > 0) {
        setDatosBancarios({
          cbu: response.data.local.datosBancarios.cbu || '',
          alias: response.data.local.datosBancarios.alias || '',
          titular: response.data.local.datosBancarios.titular || '',
          banco: response.data.local.datosBancarios.banco || '',
          tipoCuenta: response.data.local.datosBancarios.tipoCuenta || 'Caja de Ahorro',
          cuit: response.data.local.datosBancarios.cuit || ''
        });
      }
    } catch (error) {
      console.error('Error al cargar local:', error);
      toast.error('Error al cargar información del local');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDatosBancarios(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGuardar = async () => {
    try {
      // Validaciones
      if (!datosBancarios.cbu && !datosBancarios.alias) {
        toast.error('Debes ingresar al menos el CBU o el Alias');
        return;
      }

      if (datosBancarios.cbu && datosBancarios.cbu.length !== 22) {
        toast.error('El CBU debe tener 22 dígitos');
        return;
      }

      if (!datosBancarios.titular) {
        toast.error('Debes ingresar el nombre del titular');
        return;
      }

      setSaving(true);
      await localAPI.update(user.localId, {
        datosBancarios: datosBancarios
      });
      toast.success('Datos bancarios actualizados correctamente');
    } catch (error) {
      console.error('Error al guardar datos bancarios:', error);
      toast.error('Error al guardar datos bancarios');
    } finally {
      setSaving(false);
    }
  };

  const handleLimpiar = () => {
    setDatosBancarios({
      cbu: '',
      alias: '',
      titular: '',
      banco: '',
      tipoCuenta: 'Caja de Ahorro',
      cuit: ''
    });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!local) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No se pudo cargar la información del local</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <div className="bg-gradient-to-br from-orange-100 to-red-100 p-2 rounded-lg">
            <CreditCard className="text-orange-600" size={32} />
          </div>
          Datos Bancarios
        </h1>
        <p className="text-gray-600 mt-2">
          Configura tus datos bancarios para recibir pagos por transferencia
        </p>
      </div>

      {/* Alerta informativa */}
      <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
        <div className="text-sm text-blue-800">
          <p className="font-semibold mb-1">Información importante:</p>
          <p>Estos datos se mostrarán a los clientes cuando seleccionen "Transferencia" como método de pago. Asegúrate de que la información sea correcta.</p>
        </div>
      </div>

      {/* Formulario */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="space-y-6">
          {/* Titular */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titular de la Cuenta <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="titular"
              value={datosBancarios.titular}
              onChange={handleChange}
              placeholder="Nombre completo del titular"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          {/* CBU y Alias */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CBU
              </label>
              <input
                type="text"
                name="cbu"
                value={datosBancarios.cbu}
                onChange={handleChange}
                placeholder="22 dígitos"
                maxLength={22}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 font-mono"
              />
              <p className="text-xs text-gray-500 mt-1">
                {datosBancarios.cbu.length}/22 dígitos
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alias
              </label>
              <input
                type="text"
                name="alias"
                value={datosBancarios.alias}
                onChange={handleChange}
                placeholder="mi.alias.bancario"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>

          {/* Banco y Tipo de Cuenta */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Banco
              </label>
              <input
                type="text"
                name="banco"
                value={datosBancarios.banco}
                onChange={handleChange}
                placeholder="Ej: Banco Nación, Santander, BBVA"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Cuenta
              </label>
              <select
                name="tipoCuenta"
                value={datosBancarios.tipoCuenta}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="Caja de Ahorro">Caja de Ahorro</option>
                <option value="Cuenta Corriente">Cuenta Corriente</option>
              </select>
            </div>
          </div>

          {/* CUIT/CUIL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CUIT/CUIL (opcional)
            </label>
            <input
              type="text"
              name="cuit"
              value={datosBancarios.cuit}
              onChange={handleChange}
              placeholder="XX-XXXXXXXX-X"
              maxLength={13}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 font-mono"
            />
          </div>
        </div>

        {/* Botones */}
        <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
          <button
            onClick={handleGuardar}
            disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Guardando...</span>
              </>
            ) : (
              <>
                <Save size={20} />
                <span>Guardar Cambios</span>
              </>
            )}
          </button>

          <button
            onClick={handleLimpiar}
            disabled={saving}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Limpiar
          </button>
        </div>
      </div>

      {/* Vista previa */}
      {(datosBancarios.cbu || datosBancarios.alias) && datosBancarios.titular && (
        <div className="mt-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border border-orange-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Vista Previa</h3>
          <div className="bg-white rounded-lg p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Titular:</span>
              <span className="font-semibold text-gray-900">{datosBancarios.titular}</span>
            </div>
            {datosBancarios.cbu && (
              <div className="flex justify-between">
                <span className="text-gray-600">CBU:</span>
                <span className="font-mono text-gray-900">{datosBancarios.cbu}</span>
              </div>
            )}
            {datosBancarios.alias && (
              <div className="flex justify-between">
                <span className="text-gray-600">Alias:</span>
                <span className="font-semibold text-gray-900">{datosBancarios.alias}</span>
              </div>
            )}
            {datosBancarios.banco && (
              <div className="flex justify-between">
                <span className="text-gray-600">Banco:</span>
                <span className="text-gray-900">{datosBancarios.banco}</span>
              </div>
            )}
            {datosBancarios.tipoCuenta && (
              <div className="flex justify-between">
                <span className="text-gray-600">Tipo:</span>
                <span className="text-gray-900">{datosBancarios.tipoCuenta}</span>
              </div>
            )}
            {datosBancarios.cuit && (
              <div className="flex justify-between">
                <span className="text-gray-600">CUIT/CUIL:</span>
                <span className="font-mono text-gray-900">{datosBancarios.cuit}</span>
              </div>
            )}
          </div>
          <p className="text-xs text-gray-600 mt-3">
            Así verán los clientes tus datos bancarios al seleccionar transferencia
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminDatosBancarios;
