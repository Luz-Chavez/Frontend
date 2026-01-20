import React, { useState } from "react";
import { crearStock } from "../api/inventario.api";

const palette = {
  fondoCard: "linear-gradient(135deg, #0A3A40 60%, #0F5959 100%)",
  textoClaro: "#F5F7F8",
  verdeClaro: "#1D7373",
  rojoSuave: "#E57373",
  sombra: "0 4px 16px 0 rgba(10,58,64,0.10)",
  borde: "#107361",
};

function ProductStockCreateCard({ producto, onGuardarStock, onClose }) {
  const [form, setForm] = useState({
    id_producto: producto?.id_producto,
    cantidad: "",
    stock_minimo: ""
  });
  const [error, setError] = useState("");

  // Validación básica
  const validate = () => {
    if (!form.cantidad || Number(form.cantidad) < 0 || !form.stock_minimo || Number(form.stock_minimo) < 0) {
      setError("Cantidad y stock mínimo deben ser >= 0");
      return false;
    }
    setError("");
    return true;
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSave = async () => {
    if (validate()) {
      try {
        const data = {
          id_producto: producto.id_producto,
          cantidad: Number(form.cantidad),
          stock_minimo: Number(form.stock_minimo)
        };
        const res = await crearStock(data);
        onGuardarStock && onGuardarStock(res.data);
        onClose && onClose();
      } catch (err) {
        setError("Error al crear stock. Intenta nuevamente.");
      }
    }
  };

  // Estilos
  const cardStyle = {
    background: palette.fondoCard,
    color: palette.textoClaro,
    borderRadius: "1.2rem",
    boxShadow: palette.sombra,
    padding: "2rem 1.5rem",
    maxWidth: 380,
    minWidth: 260,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1.2rem",
    position: "relative"
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
      background: "rgba(4,35,38,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
    }}>
      <div style={cardStyle}>
        <h2 style={{ margin: 0, fontSize: "1.3rem", fontWeight: 700 }}>Agregar stock inicial</h2>
        <div style={{ width: "100%" }}>
          <div style={{ fontWeight: 600, color: palette.textoClaro, marginBottom: 8 }}>Producto: <span style={{ color: palette.verdeClaro }}>{producto?.nombre}</span></div>
        </div>
        <label style={{ fontWeight: 600, color: palette.textoClaro, width: "100%" }}>
          Cantidad:
          <input name="cantidad" type="number" value={form.cantidad} onChange={handleChange}
            style={{
              width: "100%", padding: "0.5em", borderRadius: "0.5em", border: "1px solid #1D7373",
              marginTop: "0.3em", marginBottom: "0.7em", background: "#F5F7F8", color: "#042326"
            }} />
        </label>
        <label style={{ fontWeight: 600, color: palette.textoClaro, width: "100%" }}>
          Stock mínimo:
          <input name="stock_minimo" type="number" value={form.stock_minimo} onChange={handleChange}
            style={{
              width: "100%", padding: "0.5em", borderRadius: "0.5em", border: "1px solid #1D7373",
              marginTop: "0.3em", marginBottom: "0.7em", background: "#F5F7F8", color: "#042326"
            }} />
        </label>
        {error && <div style={{ color: palette.rojoSuave, fontWeight: 500 }}>{error}</div>}
        <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end", width: "100%" }}>
          <button
            style={{
              background: palette.verdeClaro, color: "#fff", border: "none", borderRadius: "0.7em",
              fontWeight: 600, fontSize: "1rem", padding: "0.7em 1.2em", cursor: "pointer",
              boxShadow: "0 2px 8px 0 rgba(16,115,97,0.10)", transition: "background 0.2s"
            }}
            onClick={handleSave}
          >
            Guardar
          </button>
          <button
            style={{
              background: palette.rojoSuave, color: "#fff", border: "none", borderRadius: "0.7em",
              fontWeight: 600, fontSize: "1rem", padding: "0.7em 1.2em", cursor: "pointer",
              boxShadow: "0 2px 8px 0 rgba(229,115,115,0.10)", transition: "background 0.2s"
            }}
            onClick={onClose}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductStockCreateCard;
