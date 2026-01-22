import React from "react";
import { useCart } from "../../context/CartContext";
import { ShoppingBag } from "lucide-react"; // Si no tienes lucide, usa otro icono o emoji 🛍️

// Recibe la función para abrir el Drawer (panel lateral)
export default function CartWidget({ onOpen }) {
  const { totalItems } = useCart();

  return (
    <button 
      onClick={onOpen}
      className="relative p-2 text-[#0A3A40] hover:bg-gray-100 rounded-full transition-colors"
    >
      <ShoppingBag size={24} />
      
      {/* Burbuja con contador */}
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 bg-[#BE123C] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-bounce-short">
          {totalItems}
        </span>
      )}
    </button>
  );
}