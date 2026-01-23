import React, { useState } from "react";
import { useCart } from "../../context/CartContext";

// Icono de carrito mejorado
const IconCartAdd = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

// Icono de check para feedback
const IconCheck = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default function CardProducto({ producto }) {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // URL de imagen con fallback
  const imageUrl = producto.imagen
    ? `http://localhost:8000${producto.imagen}`
    : "https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=400&h=400&fit=crop";

  const handleAdd = (e) => {
    e.stopPropagation();
    addToCart(producto, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const cardStyles = {
    container: {
      background: 'white',
      borderRadius: '24px',
      overflow: 'hidden',
      boxShadow: isHovered
        ? '0 20px 50px rgba(10, 58, 64, 0.15)'
        : '0 4px 20px rgba(10, 58, 64, 0.06)',
      transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: 'pointer',
      border: '1px solid #E2E8F0',
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    },
    imageWrapper: {
      position: 'relative',
      height: '280px',
      overflow: 'hidden',
      background: 'linear-gradient(145deg, #f0f4f8 0%, #e2e8f0 100%)'
    },
    image: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
      transform: isHovered ? 'scale(1.08)' : 'scale(1)'
    },
    overlay: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(to bottom, transparent 50%, rgba(10, 58, 64, 0.6))',
      opacity: isHovered ? 1 : 0,
      transition: 'opacity 0.4s ease'
    },
    badge: {
      position: 'absolute',
      top: '16px',
      right: '16px',
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      color: '#0A3A40',
      fontSize: '0.75rem',
      fontWeight: '700',
      padding: '8px 14px',
      borderRadius: '50px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    },
    badgeDot: {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      background: '#10B981',
      animation: 'pulse 2s infinite'
    },
    content: {
      padding: '24px',
      flex: 1,
      display: 'flex',
      flexDirection: 'column'
    },
    category: {
      fontSize: '0.7rem',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
      color: '#64748B',
      marginBottom: '8px'
    },
    title: {
      fontSize: '1.1rem',
      fontWeight: '700',
      color: '#1E293B',
      marginBottom: '8px',
      lineHeight: '1.3',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical'
    },
    description: {
      fontSize: '0.875rem',
      color: '#64748B',
      marginBottom: '20px',
      lineHeight: '1.5',
      flex: 1,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical'
    },
    footer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: '16px',
      borderTop: '1px solid #E2E8F0'
    },
    priceWrapper: {},
    priceLabel: {
      fontSize: '0.7rem',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      color: '#94A3B8',
      marginBottom: '2px'
    },
    price: {
      fontSize: '1.5rem',
      fontWeight: '800',
      color: '#0A3A40',
      letterSpacing: '-0.02em'
    },
    button: {
      background: isAdded ? '#10B981' : '#1D7373',
      color: 'white',
      border: 'none',
      padding: '14px 18px',
      borderRadius: '14px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      transition: 'all 0.3s ease',
      boxShadow: isAdded
        ? '0 8px 25px rgba(16, 185, 129, 0.35)'
        : '0 8px 25px rgba(29, 115, 115, 0.25)',
      transform: isAdded ? 'scale(1.05)' : 'scale(1)',
      fontWeight: '600',
      fontSize: '0.875rem'
    }
  };

  return (
    <div
      style={cardStyles.container}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Imagen con efectos */}
      <div style={cardStyles.imageWrapper}>
        <img
          src={imageUrl}
          alt={producto.nombre}
          style={cardStyles.image}
        />
        <div style={cardStyles.overlay}></div>

        {/* Badge de disponibilidad */}
        <div style={cardStyles.badge}>
          <div style={cardStyles.badgeDot}></div>
          Disponible
        </div>
      </div>

      {/* Contenido */}
      <div style={cardStyles.content}>
        <span style={cardStyles.category}>Producto</span>
        <h3 style={cardStyles.title}>{producto.nombre}</h3>
        <p style={cardStyles.description}>
          {producto.descripcion || "Producto de alta calidad para ti"}
        </p>

        {/* Footer con precio y botón */}
        <div style={cardStyles.footer}>
          <div style={cardStyles.priceWrapper}>
            <p style={cardStyles.priceLabel}>Precio</p>
            <p style={cardStyles.price}>
              Bs. {parseFloat(producto.precio_venta).toFixed(2)}
            </p>
          </div>

          <button
            onClick={handleAdd}
            style={cardStyles.button}
            title={isAdded ? "¡Agregado!" : "Agregar al carrito"}
          >
            {isAdded ? <IconCheck /> : <IconCartAdd />}
            {isAdded ? "¡Listo!" : "Agregar"}
          </button>
        </div>
      </div>

      {/* CSS para animación del punto */}
      <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.7; transform: scale(1.2); }
                }
            `}</style>
    </div>
  );
}