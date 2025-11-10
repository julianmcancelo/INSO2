import React, { createContext, useState, useContext, useEffect } from 'react';

const LocalContext = createContext();

export const useLocal = () => {
  const context = useContext(LocalContext);
  if (!context) {
    throw new Error('useLocal debe ser usado dentro de LocalProvider');
  }
  return context;
};

export const LocalProvider = ({ children }) => {
  const [local, setLocal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Aplicar colores personalizados del local
    if (local) {
      document.documentElement.style.setProperty('--color-primary', local.colorPrimario || '#ef4444');
      document.documentElement.style.setProperty('--color-secondary', local.colorSecundario || '#f59e0b');
      document.title = local.nombre || 'Menú Digital';
    }
  }, [local]);

  const value = {
    local,
    setLocal,
    loading,
    setLoading
  };

  return (
    <LocalContext.Provider value={value}>
      {children}
    </LocalContext.Provider>
  );
};

export default LocalContext;
