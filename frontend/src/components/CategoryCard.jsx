import React from "react";

const palette = {
  fondoCard: "linear-gradient(135deg, #0A3A40 60%, #0F5959 100%)",
  textoClaro: "#F5F7F8",
  verdeClaro: "#1D7373",
  rojoSuave: "#E57373",
  sombra: "0 4px 16px 0 rgba(10,58,64,0.10)",
  borde: "#107361",
};

function CategoryCard({ categoria, onEdit, onToggle, onDelete }) {
  if (!categoria) return null;
  const { nombre, descripcion, activo, fecha_creacion } = categoria;
  const colorEstado = activo ? palette.verdeClaro : palette.rojoSuave;
  const textoEstado = activo ? "Activo" : "Inactivo";

  // Estilos
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
    border: `2px solid ${activo ? palette.verdeClaro : palette.rojoSuave}`,
    borderRadius: "1.2em",
    width: 48,
    height: 28,
    display: "flex",
    alignItems: "center",
    justifyContent: activo ? "flex-end" : "flex-start",
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
          <span style={{ color: "#F5F7F8", fontSize: "0.95em", opacity: 0.7 }}>
            {fecha_creacion && `Creada: ${fecha_creacion}`}
          </span>
        </div>
        {/* Barra de acciones (solo visible para adminmicroempresa y superadmin) */}
        {(onEdit || onToggle || onDelete) && (
          <div style={actionBar}>
            {/* Handler real de edición aquí */}
            <button style={btn} onClick={() => onEdit && onEdit(categoria)}>
              Editar
            </button>
            {/* Handler real de activar/desactivar aquí */}
            <button style={toggleStyle} onClick={() => onToggle && onToggle(categoria)} title={activo ? "Desactivar" : "Activar"}>
              <div style={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: activo ? palette.verdeClaro : palette.rojoSuave,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.2s"
              }}>
                {/* Aquí puedes poner un ícono si lo deseas */}
                <span style={{ fontWeight: 700, color: "#fff", fontSize: 13 }}>{activo ? "A" : "I"}</span>
              </div>
            </button>
            {/* Handler real de eliminar aquí */}
            <button style={{ ...btn, ...btnDanger }} onClick={() => onDelete && onDelete(categoria)}>
              Eliminar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CategoryCard;
