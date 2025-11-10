import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

// Providers
import { LocalProvider } from './context/LocalContext';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

// Páginas
import SetupPage from './pages/SetupPage';
import RegisterByInvitation from './pages/RegisterByInvitation';
import MenuPage from './pages/cliente/MenuPage';
import ConfirmacionPage from './pages/cliente/ConfirmacionPage';
import SeguimientoPedidoPage from './pages/cliente/SeguimientoPedidoPage';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLocales from './pages/admin/AdminLocales';
import AdminProductos from './pages/admin/AdminProductos';
import AdminPedidos from './pages/admin/AdminPedidos';
import AdminCategorias from './pages/admin/AdminCategorias';
import PrivateRoute from './components/PrivateRoute';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [setupNeeded, setSetupNeeded] = useState(null);
  const [checkingSetup, setCheckingSetup] = useState(true);

  useEffect(() => {
    checkSetup();
  }, []);

  const checkSetup = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/setup/check`);
      setSetupNeeded(response.data.setupNeeded);
    } catch (error) {
      console.error('Error al verificar setup:', error);
      setSetupNeeded(false);
    } finally {
      setCheckingSetup(false);
    }
  };

  if (checkingSetup) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <LocalProvider>
          <CartProvider>
            {setupNeeded ? (
              <SetupPage />
            ) : (
            <div className="App">
              <Routes>
                {/* Setup */}
                <Route path="/setup" element={<SetupPage />} />
                
                {/* Registro por invitación */}
                <Route path="/register/:token" element={<RegisterByInvitation />} />
                
                {/* Rutas del Cliente */}
                <Route path="/:slug" element={<MenuPage />} />
                <Route path="/:slug/confirmacion" element={<ConfirmacionPage />} />
                <Route path="/:slug/pedido/:pedidoId" element={<SeguimientoPedidoPage />} />

                {/* Rutas del Admin */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
                <Route path="/admin/locales" element={<PrivateRoute><AdminLocales /></PrivateRoute>} />
                <Route path="/admin/productos" element={<PrivateRoute><AdminProductos /></PrivateRoute>} />
                <Route path="/admin/pedidos" element={<PrivateRoute><AdminPedidos /></PrivateRoute>} />
                <Route path="/admin/categorias" element={<PrivateRoute><AdminCategorias /></PrivateRoute>} />

                {/* Ruta por defecto */}
                <Route path="/" element={
                  <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="text-center">
                      <h1 className="text-4xl font-bold text-gray-800 mb-4">Menú Digital</h1>
                      <p className="text-gray-600">Sistema de menú digital para restaurantes</p>
                      <p className="text-sm text-gray-500 mt-4">Accede como administrador: /admin/login</p>
                    </div>
                  </div>
                } />
              </Routes>

              <ToastContainer
                position="bottom-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
              />
            </div>
            )}
          </CartProvider>
        </LocalProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
