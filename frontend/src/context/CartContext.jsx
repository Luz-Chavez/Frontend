import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

// Hook personalizado para usar el carrito fácilmente
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe ser usado dentro de un CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  // Inicializamos el carrito leyendo de localStorage si existe
  const [cart, setCart] = useState(() => {
    try {
      const storedCart = localStorage.getItem("carrito_compras");
      return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
      console.error("Error al leer carrito del storage", error);
      return [];
    }
  });

  // Cada vez que el carrito cambia, lo guardamos en localStorage
  useEffect(() => {
    localStorage.setItem("carrito_compras", JSON.stringify(cart));
  }, [cart]);

  /**
   * Agrega un producto al carrito.
   * Si ya existe, suma la cantidad.
   * @param {Object} product - Objeto producto completo (debe tener id_producto, precio_venta, nombre, imagen, stock)
   * @param {number} quantity - Cantidad a agregar (default 1)
   */
  const addToCart = (product, quantity = 1) => {
    setCart((prevCart) => {
      // Buscamos si el producto ya está en el carrito
      const existingItemIndex = prevCart.findIndex(
        (item) => item.id_producto === product.id_producto
      );

      if (existingItemIndex >= 0) {
        // Si existe, actualizamos la cantidad
        const updatedCart = [...prevCart];
        const currentItem = updatedCart[existingItemIndex];
        
        // Validación básica de stock (si el producto trae la info de stock)
        /* NOTA: En tu endpoint 'portal/.../listado', los productos vienen de la tabla Producto.
           Si hiciste el join con Stock, asegúrate de que el campo se llame 'cantidad' o 'stock'.
           Aquí asumo que podría venir como 'stock' o no venir.
        */
        const nuevoTotal = currentItem.cantidad + quantity;
        
        // Solo actualizamos
        updatedCart[existingItemIndex] = {
          ...currentItem,
          cantidad: nuevoTotal
        };
        return updatedCart;
      } else {
        // Si no existe, lo agregamos normal
        return [
          ...prevCart,
          {
            ...product,
            cantidad: quantity,
            // Aseguramos que el precio sea número para cálculos futuros
            precio_venta: parseFloat(product.precio_venta) 
          }
        ];
      }
    });
  };

  /**
   * Elimina un producto del carrito por su ID.
   */
  const removeFromCart = (idProducto) => {
    setCart((prevCart) => prevCart.filter((item) => item.id_producto !== idProducto));
  };

  /**
   * Actualiza la cantidad de un ítem específico.
   * No permite bajar de 1.
   */
  const updateQuantity = (idProducto, newQuantity) => {
    if (newQuantity < 1) return;

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id_producto === idProducto
          ? { ...item, cantidad: newQuantity }
          : item
      )
    );
  };

  /**
   * Vacía el carrito completamente (ej. después de pagar).
   */
  const clearCart = () => {
    setCart([]);
  };

  // Cálculos derivados (se recalculan automáticamente)
  
  // Cantidad total de ítems (ej: 2 camisas + 1 pantalón = 3 ítems)
  const totalItems = cart.reduce((acc, item) => acc + item.cantidad, 0);

  // Monto total en dinero (DECIMAL 10,2)
  const cartTotal = cart.reduce((acc, item) => {
    return acc + (item.cantidad * item.precio_venta);
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        cartTotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
};