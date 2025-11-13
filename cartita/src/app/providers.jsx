'use client';

import { AuthProvider } from '@/context/AuthContext';
import { LocalProvider } from '@/context/LocalContext';
import { CartProvider } from '@/context/CartContext';

export function Providers({ children }) {
  return (
    <AuthProvider>
      <LocalProvider>
        <CartProvider>
          {children}
        </CartProvider>
      </LocalProvider>
    </AuthProvider>
  );
}
