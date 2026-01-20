import React, { useState } from "react";

const palette = {
  fondoCard: "linear-gradient(135deg, #0A3A40 60%, #0F5959 100%)",
  textoClaro: "#F5F7F8",
  verdeClaro: "#1D7373",
  rojoSuave: "#E57373",
  sombra: "0 4px 16px 0 rgba(10,58,64,0.10)",
  borde: "#107361",
};

function ProductCreateCard({ categorias = [], onProductoCreado, onClose }) {
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    precio_venta: "",
    costo_compra: "",
    codigo: "",
    imagen: "",
    estado: "activo",
    id_categoria: "",
    // id_microempresa: 1 // No enviar, lo recupera el backend
  });
  const [error, setError] = useState("");

  // Validación básica
  const validate = () => {
    if (!form.nombre || !form.precio_venta || Number(form.precio_venta) <= 0 || !form.id_categoria) {
      setError("Nombre, precio (>0) y categoría son obligatorios.");
      return false;
    }
    setError("");
    return true;
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleImage = e => {
    const file = e.target.files[0];
    if (file) {
      setForm(f => ({ ...f, imagen: file }));
    }
  };

  const handleSave = () => {
    if (validate()) {
      // Handler real de creación aquí
      onProductoCreado && onProductoCreado(form);
      onClose && onClose();
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
    position: "relative",
    maxHeight: "90vh",
    overflowY: "auto"
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
      background: "rgba(4,35,38,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
    }}>
      <div style={cardStyle}>
        <h2 style={{ margin: 0, fontSize: "1.3rem", fontWeight: 700 }}>Crear nuevo producto</h2>
        <label style={{ fontWeight: 600, color: palette.textoClaro, width: "100%" }}>
          Nombre:
          <input name="nombre" value={form.nombre} onChange={handleChange}
            style={{
              width: "100%", padding: "0.5em", borderRadius: "0.5em", border: "1px solid #1D7373",
              marginTop: "0.3em", marginBottom: "0.7em", background: "#F5F7F8", color: "#042326"
            }} />
        </label>
        <label style={{ fontWeight: 600, color: palette.textoClaro, width: "100%" }}>
          Descripción:
          <input name="descripcion" value={form.descripcion} onChange={handleChange}
            style={{
              width: "100%", padding: "0.5em", borderRadius: "0.5em", border: "1px solid #1D7373",
              marginTop: "0.3em", marginBottom: "0.7em", background: "#F5F7F8", color: "#042326"
            }} />
        </label>
        <label style={{ fontWeight: 600, color: palette.textoClaro, width: "100%" }}>
          Precio de venta:
          <input name="precio_venta" type="number" value={form.precio_venta} onChange={handleChange}
            style={{
              width: "100%", padding: "0.5em", borderRadius: "0.5em", border: "1px solid #1D7373",
              marginTop: "0.3em", marginBottom: "0.7em", background: "#F5F7F8", color: "#042326"
            }} />
        </label>
        <label style={{ fontWeight: 600, color: palette.textoClaro, width: "100%" }}>
          Costo de compra:
          <input name="costo_compra" type="number" value={form.costo_compra} onChange={handleChange}
            style={{
              width: "100%", padding: "0.5em", borderRadius: "0.5em", border: "1px solid #1D7373",
              marginTop: "0.3em", marginBottom: "0.7em", background: "#F5F7F8", color: "#042326"
            }} />
        </label>
        <label style={{ fontWeight: 600, color: palette.textoClaro, width: "100%" }}>
          Código:
          <input name="codigo" value={form.codigo} onChange={handleChange}
            style={{
              width: "100%", padding: "0.5em", borderRadius: "0.5em", border: "1px solid #1D7373",
              marginTop: "0.3em", marginBottom: "0.7em", background: "#F5F7F8", color: "#042326"
            }} />
        </label>
        <label style={{ fontWeight: 600, color: palette.textoClaro, width: "100%" }}>
          Imagen:
          <input type="file" accept="image/*" onChange={handleImage}
            style={{
              width: "100%", padding: "0.5em", borderRadius: "0.5em", border: "1px solid #1D7373",
              marginTop: "0.3em", marginBottom: "0.7em", background: "#F5F7F8", color: "#042326"
            }} />
          {form.imagen && (
            <div style={{ marginTop: "0.5em", textAlign: "center" }}>
              <img src={URL.createObjectURL(form.imagen)} alt="Previsualización" style={{ maxWidth: 120, maxHeight: 120, borderRadius: 8, boxShadow: "0 2px 8px 0 rgba(10,58,64,0.10)" }} />
            </div>
          )}
        </label>
        <label style={{ fontWeight: 600, color: palette.textoClaro, width: "100%" }}>
          Categoría:
          <select name="id_categoria" value={form.id_categoria} onChange={handleChange}
            style={{
              width: "100%", padding: "0.5em", borderRadius: "0.5em", border: "1px solid #1D7373",
              marginTop: "0.3em", marginBottom: "0.7em", background: "#F5F7F8", color: "#042326"
            }}>
            <option value="">Selecciona una categoría</option>
            {categorias.map(cat => (
              <option key={cat.id_categoria || cat.id} value={cat.id_categoria || cat.id}>{cat.nombre}</option>
            ))}
          </select>
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

export default ProductCreateCard;
