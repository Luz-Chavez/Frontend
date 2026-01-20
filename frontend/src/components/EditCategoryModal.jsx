import React, { useState } from "react";

function EditCategoryModal({ categoriaSeleccionada, onClose, onSave }) {
  const [form, setForm] = useState({ ...categoriaSeleccionada });
  const [error, setError] = useState("");

  // Validación básica
  const validate = () => {
    if (!form.nombre) {
      setError("El nombre es obligatorio.");
      return false;
    }
    setError("");
    return true;
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSave = () => {
    if (validate()) {
      // Handler real de edición aquí
      onSave(form);
    }
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
      background: "rgba(4,35,38,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
    }}>
      <div style={{
        background: "#fff",
        color: "#042326",
        borderRadius: "1.2rem",
        boxShadow: "0 8px 32px 0 rgba(10,58,64,0.18)",
        padding: "2rem",
        minWidth: 320,
        maxWidth: 400,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "1.2rem"
      }}>
        <h2 style={{ margin: 0, fontSize: "1.3rem", fontWeight: 700 }}>Editar categoría</h2>
        <label style={{ fontWeight: 600, color: "#0A3A40" }}>
          Nombre:
          <input name="nombre" value={form.nombre} onChange={handleChange}
            style={{
              width: "100%",
              padding: "0.5em",
              borderRadius: "0.5em",
              border: "1px solid #1D7373",
              marginTop: "0.3em",
              marginBottom: "0.7em",
              background: "#F5F7F8",
              color: "#042326"
            }} />
        </label>
        <label style={{ fontWeight: 600, color: "#0A3A40" }}>
          Descripción:
          <input name="descripcion" value={form.descripcion} onChange={handleChange}
            style={{
              width: "100%",
              padding: "0.5em",
              borderRadius: "0.5em",
              border: "1px solid #1D7373",
              marginTop: "0.3em",
              marginBottom: "0.7em",
              background: "#F5F7F8",
              color: "#042326"
            }} />
        </label>
        {error && <div style={{ color: "#E57373", fontWeight: 500 }}>{error}</div>}
        <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
          <button
            style={{
              background: "#1D7373", color: "#fff", border: "none", borderRadius: "0.7em",
              fontWeight: 600, fontSize: "1rem", padding: "0.7em 1.2em", cursor: "pointer",
              boxShadow: "0 2px 8px 0 rgba(16,115,97,0.10)", transition: "background 0.2s"
            }}
            onClick={handleSave}
          >
            Guardar
          </button>
          <button
            style={{
              background: "#E57373", color: "#fff", border: "none", borderRadius: "0.7em",
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

export default EditCategoryModal;
