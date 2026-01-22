import React from "react";
import { useCart } from "../../context/CartContext";
// Usamos SVG directo para no obligarte a instalar librerías extra por ahora,
// o si ya tienes lucide-react, puedes usar sus iconos.
const IconBag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
);

export default function CartWidget({ onOpen }) {
  const { totalItems } = useCart();

  return (
    <button 
      onClick={onOpen}
      className="relative p-2 text-[#0A3A40] hover:bg-gray-100 rounded-full transition-colors"
      title="Ver Carrito"
    >
      <IconBag />
      
      {/* Burbuja con contador */}
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 bg-[#BE123C] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-bounce">
          {totalItems}
        </span>
      )}
    </button>
  );
}