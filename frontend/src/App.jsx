import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

// Providers
import { LocalProvider } from './context/LocalContext';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

// Páginas
import LandingPage from './pages/LandingPage';
import SetupPage from './pages/SetupPage';
import RegisterByInvitation from './pages/RegisterByInvitation';
import MenuPage from './pages/cliente/MenuPage';
import ConfirmacionPage from './pages/cliente/ConfirmacionPage';
import SeguimientoPedidoPage from './pages/cliente/SeguimientoPedidoPage';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLocales from './pages/admin/AdminLocales';
import AdminSolicitudes from './pages/admin/AdminSolicitudes';
import AdminProductos from './pages/admin/AdminProductos';
import AdminPedidos from './pages/admin/AdminPedidos';
import AdminCategorias from './pages/admin/AdminCategorias';
import AdminQRCode from './pages/admin/AdminQRCode';
import AdminHorarios from './pages/admin/AdminHorarios';
import AdminMantenimiento from './pages/admin/AdminMantenimiento';
import QRLabel from './pages/admin/QRLabel';
import Mantenimiento from './pages/Mantenimiento';
import NotFound from './pages/NotFound';
import PrivateRoute from './components/PrivateRoute';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Componente para manejar la lógica de mantenimiento
function AppContent() {
  const location = useLocation();
  const [setupNeeded, setSetupNeeded] = useState(null);
  const [checkingSetup, setCheckingSetup] = useState(true);
  const [mantenimiento, setMantenimiento] = useState({
    activo: false,
    fechaLanzamiento: null,
    mensaje: null
  });
  const [checkingMantenimiento, setCheckingMantenimiento] = useState(true);

  useEffect(() => {
    checkSetup();
    checkMantenimiento();
    
    // Verificar mantenimiento cada 30 segundos
    const mantenimientoInterval = setInterval(() => {
      checkMantenimiento();
    }, 30000);

    return () => clearInterval(mantenimientoInterval);
  }, []);

  // Verificar mantenimiento cuando cambia la ruta
  useEffect(() => {
    checkMantenimiento();
  }, [location.pathname]);

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

  const checkMantenimiento = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/configuracion/mantenimiento`);
      if (response.data.success) {
        setMantenimiento(response.data.mantenimiento);
      }
    } catch (error) {
      console.error('Error al verificar mantenimiento:', error);
    } finally {
      setCheckingMantenimiento(false);
    }
  };

  if (checkingSetup || checkingMantenimiento) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Verificar si estamos en modo mantenimiento
  const isLoginPage = location.pathname === '/admin/login';
  const isAdminRoute = location.pathname.startsWith('/admin');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const isSuperAdmin = user?.rol === 'superadmin';

  // Si el mantenimiento está activo y no es la página de login ni admin (superadmin)
  if (mantenimiento.activo && !isLoginPage && !(isAdminRoute && isSuperAdmin)) {
    return (
      <Mantenimiento 
        tipo={mantenimiento.fechaLanzamiento ? 'countdown' : 'maintenance'}
        fechaLanzamiento={mantenimiento.fechaLanzamiento}
        mensaje={mantenimiento.mensaje}
      />
    );
  }

  return (
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
              <Route path="/menu/:localId" element={<MenuPage />} />
              <Route path="/menu/:localId/confirmacion" element={<ConfirmacionPage />} />
              <Route path="/menu/:localId/pedido/:pedidoId" element={<SeguimientoPedidoPage />} />

              {/* Rutas del Admin */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
              <Route path="/admin/locales" element={<PrivateRoute><AdminLocales /></PrivateRoute>} />
              <Route path="/admin/solicitudes" element={<PrivateRoute><AdminSolicitudes /></PrivateRoute>} />
              <Route path="/admin/productos" element={<PrivateRoute><AdminProductos /></PrivateRoute>} />
              <Route path="/admin/pedidos" element={<PrivateRoute><AdminPedidos /></PrivateRoute>} />
              <Route path="/admin/categorias" element={<PrivateRoute><AdminCategorias /></PrivateRoute>} />
              <Route path="/admin/horarios" element={<PrivateRoute><AdminHorarios /></PrivateRoute>} />
              <Route path="/admin/mantenimiento" element={<PrivateRoute><AdminMantenimiento /></PrivateRoute>} />
              <Route path="/admin/qr" element={<PrivateRoute><AdminQRCode /></PrivateRoute>} />
              <Route path="/admin/qr-label" element={<PrivateRoute><QRLabel /></PrivateRoute>} />

              {/* Landing Page */}
              <Route path="/" element={<LandingPage />} />

              {/* 404 - Debe estar al final */}
              <Route path="*" element={<NotFound />} />
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
  );
}

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AppContent />
    </Router>
  );
}

export default App;
