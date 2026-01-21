import React, { useState } from "react";
import ProductStockDetail from "./ProductStockDetail";
import { Power } from "lucide-react";

// URL de tu Backend (ajusta si usas otro puerto, pero por defecto es 8000)
const BASE_URL = "http://localhost:8000";

const palette = {
  fondoCard: "linear-gradient(135deg, #0A3A40 60%, #0F5959 100%)",
  textoClaro: "#F5F7F8",
  verdeClaro: "#1D7373",
  rojoSuave: "#E57373",
  sombra: "0 4px 16px 0 rgba(10,58,64,0.10)",
  borde: "#107361",
};

function ProductCard({ producto, stock, onEdit, onToggle, onDelete }) {
  const [showStock, setShowStock] = useState(false);
  if (!producto) return null;

  const {
    nombre,
    descripcion,
    precio_venta,
    imagen,
    estado,
  } = producto;

  // Lógica para construir la URL de la imagen
  // Si la imagen viene del backend (empieza con /public), le pegamos el dominio.
  // Si es una URL externa (http...), la dejamos igual.
  const imageUrl = imagen 
    ? (imagen.startsWith("http") ? imagen : `${BASE_URL}${imagen}`) 
    : null;

  const estadoActivo = estado === "activo" || estado === true;
  const colorEstado = estadoActivo ? palette.verdeClaro : palette.rojoSuave;
  const textoEstado = estadoActivo ? "Activo" : "Inactivo";

  // Estilos para acciones
  const actionBar = {
    display: "flex",
    gap: "0.7rem",
    marginTop: "1.2rem",
    justifyContent: "center",
    flexWrap: "wrap",
    width: "100%"
  };
  const btn = {
    background: palette.fondoCard,
    color: palette.textoClaro,
    border: "none",
    borderRadius: "0.7em",
    fontWeight: 600,
    fontSize: "0.95rem",
    padding: "0.5em 1em",
    cursor: "pointer",
    boxShadow: "0 2px 8px 0 rgba(10,58,64,0.10)",
    transition: "background 0.2s"
  };
  const btnDanger = {
    background: palette.rojoSuave,
    color: "#fff"
  };
  const toggleStyle = {
    background: "#E6EAEA",
    border: `2px solid ${estadoActivo ? palette.verdeClaro : palette.rojoSuave}`,
    borderRadius: "1.2em",
    width: 48,
    height: 28,
    display: "flex",
    alignItems: "center",
    justifyContent: estadoActivo ? "flex-end" : "flex-start",
    cursor: "pointer",
    boxShadow: "0 2px 8px 0 rgba(16,115,97,0.10)",
    transition: "border 0.2s, background 0.2s",
    padding: "0 4px"
  };

  return (
    <div
      style={{
        background: palette.fondoCard,
        color: palette.textoClaro,
        borderRadius: "1.2rem",
        boxShadow: palette.sombra,
        padding: "1.5rem",
        maxWidth: 340,
        minWidth: 260,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1.2rem",
        position: "relative",
      }}
    >
      <div
        style={{
          width: "100%",
          aspectRatio: "1.6/1",
          background: "#E6EAEA",
          borderRadius: "0.8rem",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={nombre}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover", // Esto asegura que la imagen no se estire feo
              display: "block",
            }}
            onError={(e) => {
               // Fallback por si la imagen da error al cargar
              e.target.style.display = 'none';
              e.target.parentElement.innerText = 'Error img';
            }}
          />
        ) : (
          <span
            style={{
              color: "#0A3A40",
              opacity: 0.5,
              fontSize: "1.1rem",
              fontWeight: 500,
            }}
          >
            Sin imagen
          </span>
        )}
      </div>
      <div style={{ width: "100%" }}>
        <h3
          style={{
            margin: 0,
            fontSize: "1.25rem",
            fontWeight: 700,
            letterSpacing: "0.01em",
            color: palette.textoClaro,
            lineHeight: 1.2,
          }}
        >
          {nombre}
        </h3>
        <p
          style={{
            margin: "0.5rem 0 0.7rem 0",
            fontSize: "1rem",
            color: "#E6EAEA",
            opacity: 0.85,
            minHeight: "2.2em",
          }}
        >
          {descripcion}
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.7rem",
            marginBottom: "0.7rem",
          }}
        >
          <span
            style={{
              fontWeight: 600,
              fontSize: "1.1rem",
              color: "#F5F7F8",
            }}
          >
            ${precio_venta}
          </span>
          <span
            style={{
              padding: "0.2em 0.8em",
              borderRadius: "1em",
              background: colorEstado,
              color: "#fff",
              fontWeight: 500,
              fontSize: "0.95em",
              letterSpacing: "0.01em",
              boxShadow: "0 1px 4px 0 rgba(16,115,97,0.10)",
            }}
          >
            {textoEstado}
          </span>
        </div>
        <button
          type="button"
          style={{
            width: "100%",
            padding: "0.7em 0",
            background: palette.verdeClaro,
            color: "#fff",
            border: "none",
            borderRadius: "0.7em",
            fontWeight: 600,
            fontSize: "1rem",
            letterSpacing: "0.01em",
            boxShadow: "0 2px 8px 0 rgba(16,115,97,0.10)",
            cursor: "pointer",
            transition: "background 0.2s",
            marginBottom: showStock ? "1.2rem" : 0,
          }}
          onClick={() => setShowStock((v) => !v)}
          onMouseOver={e => (e.currentTarget.style.background = palette.borde)}
          onMouseOut={e => (e.currentTarget.style.background = palette.verdeClaro)}
        >
          {showStock ? "Ocultar stock" : "Ver stock"}
        </button>
        {showStock && (
          <div style={{ marginTop: "0.5rem", width: "100%", display: "flex", justifyContent: "center" }}>
            <ProductStockDetail stock={stock} id_producto={producto.id_producto} />
          </div>
        )}
        {/* Barra de acciones */}
        <div style={actionBar}>
          <button style={btn} onClick={() => onEdit && onEdit(producto)}>
            Editar
          </button>
          <button
            style={toggleStyle}
            onClick={() => {
              if (!onToggle) return;
              onToggle(producto.id_producto, estadoActivo);
            }}
            title={estadoActivo ? "Desactivar" : "Activar"}
          >
            <div style={{
              width: 20,
              height: 20,
              borderRadius: "50%",
              background: estadoActivo ? palette.verdeClaro : palette.rojoSuave,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.2s"
            }}>
              <Power color="#fff" size={16} />
            </div>
          </button>
          <button style={{ ...btn, ...btnDanger }} onClick={() => onDelete && onDelete(producto)}>
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;