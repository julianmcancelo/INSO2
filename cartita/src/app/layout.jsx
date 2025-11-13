import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Cartita - Menú Digital para Restaurantes',
  description: 'La plataforma definitiva para digitalizar tu restaurante en 2025',
  keywords: ['menú digital', 'restaurante', 'QR', 'pedidos online', 'carta digital'],
  authors: [{ name: 'Cartita Team' }],
  openGraph: {
    title: 'Cartita - Menú Digital para Restaurantes',
    description: 'Digitaliza tu restaurante con menú QR y pedidos en tiempo real',
    url: 'https://cartita.digital',
    siteName: 'Cartita',
    locale: 'es_AR',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <Providers>
          {children}
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
        </Providers>
      </body>
    </html>
  );
}
