import React, { useState } from "react";

const palette = {
  fondo: "#F5F7F8",
  card: "#fff",
  sombra: "0 2px 8px 0 rgba(10,58,64,0.10)",
  verdeClaro: "#C6F6D5",
  texto: "#042326",
  info: "#1D7373",
  alerta: "#E57373"
};

const notificacionesEjemplo = [
  {
    id_microempresa: 1,
    id_usuario: 2,
    tipo: "info",
    mensaje: "Bienvenido a la plataforma!",
    leido: false,
    id_notificacion: 1,
    fecha_creacion: "2026-01-20 10:00"
  },
  {
    id_microempresa: 1,
    id_usuario: 2,
    tipo: "alerta",
    mensaje: "Tu suscripción está por vencer.",
    leido: false,
    id_notificacion: 2,
    fecha_creacion: "2026-01-19 09:00"
  },
  {
    id_microempresa: 1,
    id_usuario: 2,
    tipo: "info",
    mensaje: "Nuevo producto agregado.",
    leido: true,
    id_notificacion: 3,
    fecha_creacion: "2026-01-18 08:00"
  }
];

function Notificaciones() {
  const [notificaciones, setNotificaciones] = useState(notificacionesEjemplo);

  const marcarLeido = id => {
    setNotificaciones(nots =>
      nots.map(n =>
        n.id_notificacion === id ? { ...n, leido: true } : n
      )
    );
  };

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", padding: 24 }}>
      <h2 style={{ color: palette.info, fontWeight: 800, fontSize: "2rem", marginBottom: 32 }}>
        Buzón de notificaciones
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {notificaciones.map(n => (
          <div
            key={n.id_notificacion}
            style={{
              background: n.leido ? palette.card : palette.verdeClaro,
              color: palette.texto,
              borderRadius: 12,
              boxShadow: palette.sombra,
              padding: "1.1em 1.5em",
              display: "flex",
              flexDirection: "column",
              gap: 6,
              borderLeft: `6px solid ${palette[n.tipo]}`,
              position: "relative"
            }}
          >
            <div style={{ fontWeight: 700, fontSize: "1.1rem" }}>{n.mensaje}</div>
            <div style={{ fontSize: 13, color: palette.info, marginBottom: 4 }}>
              {n.tipo === "alerta" ? "Alerta" : "Info"} · {n.fecha_creacion}
            </div>
            {!n.leido && (
              <button
                onClick={() => marcarLeido(n.id_notificacion)}
                style={{
                  position: "absolute",
                  top: 12,
                  right: 16,
                  background: palette.info,
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "0.3em 0.9em",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontSize: 13,
                  boxShadow: "0 1px 4px 0 rgba(16,115,97,0.10)"
                }}
              >
                Marcar como leído
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notificaciones;
