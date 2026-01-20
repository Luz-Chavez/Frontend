import React, { useEffect, useState } from "react";
import { getStockByProducto } from "../api/inventario.api";

const palette = {
  fondoCard: "linear-gradient(135deg, #0A3A40 60%, #0F5959 100%)",
  textoClaro: "#F5F7F8",
  verdeClaro: "#1D7373",
  rojoSuave: "#E57373",
  sombra: "0 4px 16px 0 rgba(10,58,64,0.10)",
};

function formatFecha(fecha) {
  if (!fecha) return "-";
  const d = new Date(fecha);
  return d.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function ProductStockDetail({ stock, id_producto }) {
  const [stockData, setStockData] = useState(stock || null);
  useEffect(() => {
    if (!stockData && id_producto) {
      getStockByProducto(id_producto)
        .then(res => setStockData(res.data))
        .catch(() => setStockData(null));
    }
  }, [id_producto, stockData]);
  if (!stockData) return null;
  const { cantidad, stock_minimo, ultima_actualizacion } = stockData;
  const stockBajo = cantidad < stock_minimo;
  const colorEstado = stockBajo ? palette.rojoSuave : palette.verdeClaro;
  const textoEstado = stockBajo ? "Stock bajo" : "Stock suficiente";
  return (
    <div
      style={{
        background: palette.fondoCard,
        color: palette.textoClaro,
        borderRadius: "1.1rem",
        boxShadow: palette.sombra,
        padding: "1.3rem 1.5rem",
        minWidth: 240,
        maxWidth: 340,
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        alignItems: "flex-start",
        position: "relative",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.7rem",
          marginBottom: "0.2rem",
        }}
      >
        <span
          style={{
            padding: "0.2em 0.9em",
            borderRadius: "1em",
            background: colorEstado,
            color: "#fff",
            fontWeight: 600,
            fontSize: "1em",
            letterSpacing: "0.01em",
            boxShadow: "0 1px 4px 0 rgba(16,115,97,0.10)",
          }}
        >
          {textoEstado}
        </span>
      </div>
      <div style={{ width: "100%" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "0.5rem",
          }}
        >
          <span style={{ fontWeight: 500, fontSize: "1.05rem" }}>
            Cantidad actual:
          </span>
          <span
            style={{
              fontWeight: 700,
              color: colorEstado,
              fontSize: "1.1rem",
            }}
          >
            {cantidad}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "0.5rem",
          }}
        >
          <span style={{ fontWeight: 500, fontSize: "1.05rem" }}>
            Stock mínimo:
          </span>
          <span
            style={{
              fontWeight: 700,
              color: "#E6EAEA",
              fontSize: "1.1rem",
            }}
          >
            {stock_minimo}
          </span>
        </div>
        <div
          style={{
            marginTop: "0.7rem",
            fontSize: "0.97rem",
            color: "#E6EAEA",
            opacity: 0.8,
          }}
        >
          Última actualización: {formatFecha(ultima_actualizacion)}
        </div>
      </div>
    </div>
  );
}

export default ProductStockDetail;
