import React from "react";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";

// Icono SVG para carrito vacío (reemplaza emoji)
const IconEmptyCart = () => (
  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

export default function CartDrawer({ isOpen, onClose, idMicroempresa }) {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const styles = {
    overlay: {
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      display: 'flex',
      justifyContent: 'flex-end'
    },
    backdrop: {
      position: 'absolute',
      inset: 0,
      background: 'rgba(10, 58, 64, 0.4)',
      backdropFilter: 'blur(4px)',
      transition: 'opacity 0.3s ease'
    },
    panel: {
      position: 'relative',
      width: '100%',
      maxWidth: '440px',
      background: 'white',
      height: '100%',
      boxShadow: '-20px 0 60px rgba(0, 0, 0, 0.15)',
      display: 'flex',
      flexDirection: 'column',
      animation: 'slideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
    },
    header: {
      padding: '24px 28px',
      borderBottom: '1px solid #E2E8F0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #0A3A40 0%, #1D7373 100%)',
      color: 'white'
    },
    headerTitle: {
      fontSize: '1.25rem',
      fontWeight: '700',
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    closeBtn: {
      background: 'rgba(255,255,255,0.15)',
      border: 'none',
      padding: '10px',
      borderRadius: '12px',
      cursor: 'pointer',
      color: 'white',
      transition: 'all 0.2s ease'
    },
    itemsContainer: {
      flex: 1,
      overflowY: 'auto',
      padding: '20px',
      background: '#F8FAFC'
    },
    emptyState: {
      textAlign: 'center',
      padding: '60px 20px',
      color: '#94A3B8'
    },
    itemCard: {
      display: 'flex',
      gap: '16px',
      padding: '16px',
      background: 'white',
      borderRadius: '16px',
      marginBottom: '12px',
      boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
      border: '1px solid #E2E8F0',
      transition: 'all 0.2s ease'
    },
    itemImage: {
      width: '80px',
      height: '80px',
      borderRadius: '12px',
      overflow: 'hidden',
      background: 'linear-gradient(145deg, #f0f4f8 0%, #e2e8f0 100%)',
      flexShrink: 0
    },
    itemInfo: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    },
    itemName: {
      fontSize: '0.95rem',
      fontWeight: '600',
      color: '#1E293B',
      marginBottom: '4px',
      lineHeight: '1.3'
    },
    itemPrice: {
      fontSize: '1.1rem',
      fontWeight: '700',
      color: '#1D7373'
    },
    quantityControls: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginTop: '12px'
    },
    quantityBtn: {
      width: '32px',
      height: '32px',
      borderRadius: '10px',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s ease'
    },
    minusBtn: {
      background: '#F1F5F9',
      color: '#64748B'
    },
    plusBtn: {
      background: '#0A3A40',
      color: 'white'
    },
    quantity: {
      fontSize: '1rem',
      fontWeight: '600',
      minWidth: '28px',
      textAlign: 'center',
      color: '#1E293B'
    },
    deleteBtn: {
      background: 'none',
      border: 'none',
      color: '#CBD5E1',
      cursor: 'pointer',
      padding: '8px',
      borderRadius: '8px',
      transition: 'all 0.2s ease',
      alignSelf: 'flex-start'
    },
    footer: {
      padding: '24px',
      borderTop: '1px solid #E2E8F0',
      background: 'white'
    },
    totalRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px'
    },
    totalLabel: {
      color: '#64748B',
      fontWeight: '500',
      fontSize: '0.95rem'
    },
    totalAmount: {
      fontSize: '1.75rem',
      fontWeight: '800',
      color: '#0A3A40'
    },
    checkoutBtn: {
      width: '100%',
      background: 'linear-gradient(135deg, #0A3A40 0%, #1D7373 100%)',
      color: 'white',
      border: 'none',
      padding: '18px 24px',
      borderRadius: '16px',
      fontSize: '1rem',
      fontWeight: '700',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      boxShadow: '0 10px 30px rgba(10, 58, 64, 0.25)',
      transition: 'all 0.3s ease'
    },
    clearBtn: {
      width: '100%',
      background: 'none',
      border: 'none',
      color: '#94A3B8',
      padding: '12px',
      marginTop: '10px',
      fontSize: '0.875rem',
      cursor: 'pointer',
      transition: 'color 0.2s ease'
    },
    badge: {
      background: 'rgba(255,255,255,0.2)',
      padding: '4px 10px',
      borderRadius: '20px',
      fontSize: '0.8rem',
      fontWeight: '600'
    }
  };

  return (
    <div style={styles.overlay}>
      {/* Backdrop */}
      <div style={styles.backdrop} onClick={onClose}></div>

      {/* Panel Principal */}
      <div style={styles.panel}>

        {/* Header con gradiente */}
        <div style={styles.header}>
          <h2 style={styles.headerTitle}>
            <ShoppingBag size={24} />
            Tu Carrito
            {cart.length > 0 && (
              <span style={styles.badge}>{cart.length}</span>
            )}
          </h2>
          <button
            onClick={onClose}
            style={styles.closeBtn}
            onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.25)'}
            onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.15)'}
          >
            <X size={22} />
          </button>
        </div>

        {/* Lista de Items */}
        <div style={styles.itemsContainer}>
          {cart.length === 0 ? (
            <div style={styles.emptyState}>
              <IconEmptyCart />
              <p style={{ fontSize: '1.1rem', fontWeight: '500', marginTop: '16px' }}>Tu carrito está vacío</p>
              <p style={{ fontSize: '0.875rem', marginTop: '8px' }}>
                Explora nuestros productos y encuentra algo que te guste
              </p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id_producto}
                style={styles.itemCard}
              >
                {/* Imagen */}
                <div style={styles.itemImage}>
                  {item.imagen ? (
                    <img
                      src={`http://localhost:8000${item.imagen}`}
                      alt={item.nombre}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#CBD5E1',
                      fontSize: '0.75rem'
                    }}>
                      Sin Foto
                    </div>
                  )}
                </div>

                {/* Info */}
                <div style={styles.itemInfo}>
                  <div>
                    <h3 style={styles.itemName}>{item.nombre}</h3>
                    <p style={styles.itemPrice}>
                      Bs. {(item.precio_venta || 0).toFixed(2)}
                    </p>
                  </div>

                  {/* Controles de cantidad */}
                  <div style={styles.quantityControls}>
                    <button
                      onClick={() => updateQuantity(item.id_producto, item.cantidad - 1)}
                      style={{ ...styles.quantityBtn, ...styles.minusBtn }}
                    >
                      <Minus size={16} />
                    </button>

                    <span style={styles.quantity}>{item.cantidad}</span>

                    <button
                      onClick={() => updateQuantity(item.id_producto, item.cantidad + 1)}
                      style={{ ...styles.quantityBtn, ...styles.plusBtn }}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                {/* Botón eliminar */}
                <button
                  onClick={() => removeFromCart(item.id_producto)}
                  style={styles.deleteBtn}
                  onMouseEnter={(e) => e.target.style.color = '#EF4444'}
                  onMouseLeave={(e) => e.target.style.color = '#CBD5E1'}
                  title="Eliminar producto"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer con Total y Botones */}
        {cart.length > 0 && (
          <div style={styles.footer}>
            <div style={styles.totalRow}>
              <span style={styles.totalLabel}>Total Estimado</span>
              <span style={styles.totalAmount}>
                Bs. {(cartTotal || 0).toFixed(2)}
              </span>
            </div>

            <button
              onClick={() => {
                onClose();
                navigate(`/portal/${idMicroempresa}/checkout`);
              }}
              style={styles.checkoutBtn}
            >
              Procesar Compra
              <ArrowRight size={20} />
            </button>

            <button
              onClick={clearCart}
              style={styles.clearBtn}
            >
              Vaciar Carrito
            </button>
          </div>
        )}
      </div>

      {/* Animación CSS */}
      <style>{`
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `}</style>
    </div>
  );
}