import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Cargar carrito del localStorage al iniciar
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error al cargar carrito:', error);
        localStorage.removeItem('cart');
      }
    }
  }, []);

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cart));
    } else {
      localStorage.removeItem('cart');
    }
  }, [cart]);

  const addToCart = (producto, cantidad = 1, personalizaciones = {}, notas = '') => {
    setCart(prevCart => {
      // Buscar si el producto ya existe con las mismas personalizaciones
      const existingIndex = prevCart.findIndex(item => 
        item.producto.id === producto.id &&
        JSON.stringify(item.personalizaciones) === JSON.stringify(personalizaciones)
      );

      if (existingIndex !== -1) {
        // Si existe, incrementar cantidad
        const newCart = [...prevCart];
        newCart[existingIndex].cantidad += cantidad;
        return newCart;
      } else {
        // Si no existe, agregar nuevo item
        return [...prevCart, {
          producto,
          cantidad,
          personalizaciones,
          notas,
          subtotal: producto.precio * cantidad
        }];
      }
    });
  };

  const removeFromCart = (index) => {
    setCart(prevCart => prevCart.filter((_, i) => i !== index));
  };

  const updateQuantity = (index, cantidad) => {
    if (cantidad <= 0) {
      removeFromCart(index);
      return;
    }

    setCart(prevCart => {
      const newCart = [...prevCart];
      newCart[index].cantidad = cantidad;
      newCart[index].subtotal = newCart[index].producto.precio * cantidad;
      return newCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  const getTotal = () => {
    return cart.reduce((total, item) => total + item.subtotal, 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.cantidad, 0);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotal,
    getTotalItems,
    isCartOpen,
    openCart,
    closeCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
