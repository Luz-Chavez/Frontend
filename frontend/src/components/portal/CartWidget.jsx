import React, { useState, useEffect, useRef } from "react";
import { useCart } from "../../context/CartContext";

// Icono de bolsa de compras
const IconBag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
    <path d="M3 6h18" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

export default function CartWidget({ onOpen }) {
  const { totalItems, cart } = useCart();
  const [showNotification, setShowNotification] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState(null);
  const [animateBadge, setAnimateBadge] = useState(false);
  const prevCartLength = useRef(cart.length);

  // Detectar cuando se agrega un producto
  useEffect(() => {
    if (cart.length > prevCartLength.current) {
      // Se agregó un producto
      const newItem = cart[cart.length - 1];
      setLastAddedItem(newItem);
      setShowNotification(true);
      setAnimateBadge(true);

      // Ocultar notificación después de 3 segundos
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 3000);

      // Quitar animación del badge
      const badgeTimer = setTimeout(() => {
        setAnimateBadge(false);
      }, 600);

      return () => {
        clearTimeout(timer);
        clearTimeout(badgeTimer);
      };
    }
    prevCartLength.current = cart.length;
  }, [cart]);

  const styles = {
    container: {
      position: 'relative'
    },
    button: {
      position: 'relative',
      padding: '12px',
      background: 'transparent',
      border: 'none',
      borderRadius: '12px',
      cursor: 'pointer',
      color: '#0A3A40',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    badge: {
      position: 'absolute',
      top: '4px',
      right: '4px',
      background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
      color: 'white',
      fontSize: '0.7rem',
      fontWeight: '700',
      borderRadius: '50%',
      minWidth: '20px',
      height: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 2px 8px rgba(239, 68, 68, 0.4)',
      transform: animateBadge ? 'scale(1.3)' : 'scale(1)',
      transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
    },
    notification: {
      position: 'absolute',
      top: '100%',
      right: '0',
      marginTop: '12px',
      background: 'white',
      borderRadius: '16px',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
      border: '1px solid #E2E8F0',
      padding: '16px',
      width: '280px',
      zIndex: 1000,
      animation: 'slideDown 0.3s ease',
      opacity: showNotification ? 1 : 0,
      visibility: showNotification ? 'visible' : 'hidden',
      transition: 'opacity 0.3s ease, visibility 0.3s ease'
    },
    notificationHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '12px',
      color: '#10B981',
      fontSize: '0.85rem',
      fontWeight: '600'
    },
    notificationCheck: {
      width: '20px',
      height: '20px',
      background: '#10B981',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white'
    },
    notificationItem: {
      display: 'flex',
      gap: '12px',
      alignItems: 'center'
    },
    notificationImage: {
      width: '50px',
      height: '50px',
      borderRadius: '10px',
      background: '#F1F5F9',
      overflow: 'hidden',
      flexShrink: 0
    },
    notificationInfo: {
      flex: 1
    },
    notificationName: {
      fontSize: '0.9rem',
      fontWeight: '600',
      color: '#1E293B',
      marginBottom: '4px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    },
    notificationPrice: {
      fontSize: '0.85rem',
      color: '#1D7373',
      fontWeight: '700'
    },
    totalBadge: {
      marginTop: '12px',
      paddingTop: '12px',
      borderTop: '1px solid #E2E8F0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: '0.85rem'
    },
    viewCartBtn: {
      background: 'linear-gradient(135deg, #0A3A40 0%, #1D7373 100%)',
      color: 'white',
      border: 'none',
      padding: '8px 16px',
      borderRadius: '8px',
      fontSize: '0.8rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    }
  };

  return (
    <div style={styles.container}>
      <button
        onClick={onOpen}
        style={styles.button}
        onMouseEnter={(e) => e.target.style.background = '#F1F5F9'}
        onMouseLeave={(e) => e.target.style.background = 'transparent'}
        title="Ver Carrito"
      >
        <IconBag />

        {/* Badge con contador */}
        {totalItems > 0 && (
          <span style={styles.badge}>
            {totalItems > 99 ? '99+' : totalItems}
          </span>
        )}
      </button>

      {/* Notificación de producto agregado */}
      <div style={styles.notification}>
        <div style={styles.notificationHeader}>
          <div style={styles.notificationCheck}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          Agregado al carrito
        </div>

        {lastAddedItem && (
          <>
            <div style={styles.notificationItem}>
              <div style={styles.notificationImage}>
                {lastAddedItem.imagen ? (
                  <img
                    src={`http://localhost:8000${lastAddedItem.imagen}`}
                    alt={lastAddedItem.nombre}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#CBD5E1', fontSize: '0.7rem' }}>
                    Sin foto
                  </div>
                )}
              </div>
              <div style={styles.notificationInfo}>
                <div style={styles.notificationName}>{lastAddedItem.nombre}</div>
                <div style={styles.notificationPrice}>
                  Bs. {parseFloat(lastAddedItem.precio_venta || 0).toFixed(2)}
                </div>
              </div>
            </div>

            <div style={styles.totalBadge}>
              <span style={{ color: '#64748B' }}>{totalItems} item(s) en carrito</span>
              <button style={styles.viewCartBtn} onClick={onOpen}>
                Ver carrito
              </button>
            </div>
          </>
        )}
      </div>

      {/* CSS para animación */}
      <style>{`
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
    </div>
  );
}