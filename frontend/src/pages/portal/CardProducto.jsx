import React from "react";
import { useCart } from "../../context/CartContext";
import { ShoppingCart } from "lucide-react";

export default function CardProducto({ producto }) {
  const { addToCart } = useCart();

  // URL de la imagen (ajustar puerto si es necesario)
  const imageUrl = producto.imagen 
    ? `http://localhost:8000${producto.imagen}` 
    : "https://via.placeholder.com/300?text=Sin+Imagen";

  const handleAdd = () => {
    addToCart(producto, 1);
    // Opcional: Mostrar un toast o vibración pequeña aquí
  };

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full">
      {/* Imagen con Zoom al hacer hover */}
      <div className="relative h-48 overflow-hidden bg-gray-50">
        <img 
          src={imageUrl} 
          alt={producto.nombre} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {/* Badge de Stock (si quieres mostrarlo) */}
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur text-[#0A3A40] text-xs font-bold px-2 py-1 rounded-full shadow-sm">
          Stock Disponible
        </div>
      </div>

      {/* Contenido */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex-1">
          <h3 className="font-bold text-gray-800 text-lg mb-1 line-clamp-2 leading-tight">
            {producto.nombre}
          </h3>
          <p className="text-gray-500 text-sm mb-3 line-clamp-2">
            {producto.descripcion || "Sin descripción disponible."}
          </p>
        </div>

        {/* Precio y Botón */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Precio</p>
            <p className="text-xl font-extrabold text-[#0A3A40]">
              Bs. {parseFloat(producto.precio_venta).toFixed(2)}
            </p>
          </div>

          <button 
            onClick={handleAdd}
            className="bg-[#1D7373] hover:bg-[#155d5d] text-white p-3 rounded-xl shadow-lg shadow-[#1D7373]/20 transition-all active:scale-95 flex items-center justify-center"
            title="Agregar al carrito"
          >
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}