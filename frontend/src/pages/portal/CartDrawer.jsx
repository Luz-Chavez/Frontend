import React from "react";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import { X, Trash2, Plus, Minus } from "lucide-react"; // Iconos

export default function CartDrawer({ isOpen, onClose, idMicroempresa }) {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Fondo oscuro (Overlay) */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      {/* Panel Blanco */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-in-right">
        
        {/* Cabecera */}
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-[#F8FAFC]">
          <h2 className="text-xl font-bold text-[#0A3A40]">Tu Carrito</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full text-gray-500">
            <X size={20} />
          </button>
        </div>

        {/* Lista de Productos */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p className="text-4xl mb-2">🛒</p>
              <p>Tu carrito está vacío</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id_producto} className="flex gap-4 p-3 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                {/* Imagen */}
                <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  {item.imagen ? (
                    <img src={`http://localhost:8000${item.imagen}`} alt={item.nombre} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">Sin Foto</div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 line-clamp-1">{item.nombre}</h3>
                  <p className="text-[#1D7373] font-bold text-sm">Bs. {item.precio_venta.toFixed(2)}</p>
                  
                  {/* Controles Cantidad */}
                  <div className="flex items-center gap-3 mt-2">
                    <button 
                      onClick={() => updateQuantity(item.id_producto, item.cantidad - 1)}
                      className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 text-gray-600"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="text-sm font-medium w-4 text-center">{item.cantidad}</span>
                    <button 
                      onClick={() => updateQuantity(item.id_producto, item.cantidad + 1)}
                      className="w-6 h-6 flex items-center justify-center bg-[#0A3A40] text-white rounded-full hover:bg-[#155d5d]"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>

                {/* Eliminar */}
                <button 
                  onClick={() => removeFromCart(item.id_producto)}
                  className="text-gray-300 hover:text-red-500 self-start p-1"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer (Total y Botón) */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-gray-100 bg-white">
            <div className="flex justify-between items-end mb-4">
              <span className="text-gray-500 font-medium">Total Estimado</span>
              <span className="text-2xl font-bold text-[#0A3A40]">Bs. {cartTotal.toFixed(2)}</span>
            </div>
            
            <button
              onClick={() => {
                onClose();
                // Navegar al checkout pasando el ID de la empresa
                navigate(`/portal/${idMicroempresa}/checkout`);
              }}
              className="w-full bg-[#0A3A40] hover:bg-[#062c30] text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-[#0A3A40]/20 transition-all active:scale-[0.98]"
            >
              Procesar Compra →
            </button>
            
            <button 
              onClick={clearCart} 
              className="w-full mt-2 text-sm text-gray-400 hover:text-red-500 py-2"
            >
              Vaciar Carrito
            </button>
          </div>
        )}
      </div>
    </div>
  );
}