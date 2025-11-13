'use client';

import PrivateRoute from '@/components/shared/PrivateRoute';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingCart, Users, QrCode, Settings, LogOut, Store, Clock, FileText, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import BrandLogo from '@/components/shared/BrandLogo';
import { toast } from 'react-toastify';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();

  console.log('Dashboard - Usuario cargado:', user);
  console.log('Dashboard - Local ID:', user?.localId);
  console.log('Dashboard - Local:', user?.local);

  const handleLogout = () => {
    logout();
    toast.success('Sesión cerrada correctamente');
    router.push('/');
  };

  // Menú para SUPERADMIN - Gestión global
  const superadminMenuItems = [
    { icon: FileText, label: 'Solicitudes', href: '/admin/solicitudes', description: 'Revisar solicitudes de nuevos locales' },
    { icon: Store, label: 'Locales', href: '/admin/locales', description: 'Gestionar todos los locales' },
    { icon: Users, label: 'Usuarios', href: '/admin/usuarios', description: 'Gestionar usuarios del sistema' },
    { icon: AlertCircle, label: 'Mantenimiento', href: '/admin/mantenimiento', description: 'Modo mantenimiento y configuración' },
    { icon: Settings, label: 'Configuración', href: '/admin/configuracion', description: 'Configuración global' },
  ];

  // Menú para ADMIN - Gestión de su local
  const adminMenuItems = [
    { icon: Package, label: 'Productos', href: '/admin/productos', description: 'Gestionar menú y productos' },
    { icon: ShoppingCart, label: 'Pedidos', href: '/admin/pedidos', description: 'Ver y gestionar pedidos' },
    { icon: LayoutDashboard, label: 'Categorías', href: '/admin/categorias', description: 'Organizar categorías' },
    { icon: Clock, label: 'Horarios', href: '/admin/horarios', description: 'Configurar horarios de atención' },
    { icon: QrCode, label: 'Código QR', href: '/admin/qr', description: 'Generar QR del menú' },
    { icon: Settings, label: 'Mi Local', href: '/admin/mi-local', description: 'Configuración del local' },
  ];

  const menuItems = user?.rol === 'superadmin' ? superadminMenuItems : adminMenuItems;

  return (
    <PrivateRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <BrandLogo size="sm" showText={true} />
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">{user?.nombre}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.rol}</p>
                {user?.local && (
                  <p className="text-xs text-primary font-medium">
                    {user.local.nombre}
                  </p>
                )}
              </div>

              {/* Botón cambiar local (solo para admins con múltiples locales) */}
              {user?.rol === 'admin' && (
                <button
                  onClick={() => router.push('/admin/seleccionar-local')}
                  className="p-2 text-gray-600 hover:text-primary hover:bg-orange-50 rounded-lg transition"
                  title="Cambiar de local"
                >
                  <RefreshCw size={20} />
                </button>
              )}
              
              <button
                onClick={handleLogout}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                title="Cerrar sesión"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              ¡Bienvenido, {user?.nombre}!
            </h1>
            <p className="text-gray-600">
              {user?.rol === 'superadmin' 
                ? 'Panel de Superadministrador - Gestión Global'
                : `Panel de Administración - ${user?.local?.nombre || 'Tu Local'}`
              }
            </p>
          </div>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item) => (
              <button
                key={item.href}
                onClick={() => router.push(item.href)}
                className="p-6 rounded-xl border-2 bg-white border-gray-200 hover:border-primary hover:shadow-lg transition-all hover:scale-105 text-left"
              >
                <item.icon size={32} className="mb-4 text-primary" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {item.label}
                </h3>
                <p className="text-sm text-gray-600">
                  {item.description}
                </p>
              </button>
            ))}
          </div>

          {/* Stats Section - Solo para Admin */}
          {user?.rol !== 'superadmin' && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Estadísticas de Hoy</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Pedidos Hoy</p>
                  <p className="text-3xl font-bold text-gray-900">0</p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Productos Activos</p>
                  <p className="text-3xl font-bold text-gray-900">0</p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Ventas del Día</p>
                  <p className="text-3xl font-bold text-gray-900">$0</p>
                </div>
              </div>
            </div>
          )}

          {/* Info Section - Solo para Superadmin */}
          {user?.rol === 'superadmin' && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Resumen del Sistema</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Solicitudes Pendientes</p>
                  <p className="text-3xl font-bold text-orange-600">0</p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Locales Activos</p>
                  <p className="text-3xl font-bold text-green-600">0</p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Total Usuarios</p>
                  <p className="text-3xl font-bold text-blue-600">0</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Estado Sistema</p>
                  <div className="flex items-center gap-2 mt-1">
                    <CheckCircle className="text-green-600" size={24} />
                    <p className="text-lg font-semibold text-green-600">Operativo</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PrivateRoute>
  );
}
