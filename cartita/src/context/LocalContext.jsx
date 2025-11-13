'use client';

import React, { createContext, useState, useContext } from 'react';

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
  const [loading, setLoading] = useState(false);

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
