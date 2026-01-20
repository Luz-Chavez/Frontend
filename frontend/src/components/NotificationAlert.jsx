import React, { useEffect } from "react";

const palette = {
  info: "#1D7373",
  alerta: "#E57373",
  texto: "#F5F7F8",
  sombra: "0 4px 16px 0 rgba(10,58,64,0.10)"
};

function NotificationAlert({ mensaje, tipo = "info", onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose && onClose();
    }, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div style={{
      position: "fixed",
      top: 24,
      right: 24,
      zIndex: 2000,
      background: palette[tipo] || palette.info,
      color: palette.texto,
      borderRadius: "1em",
      boxShadow: palette.sombra,
      padding: "1.1em 2em",
      fontWeight: 600,
      fontSize: "1.1rem",
      minWidth: 220,
      maxWidth: 340,
      textAlign: "center",
      transition: "opacity 0.3s",
      opacity: 1,
      display: "flex",
      alignItems: "center",
      gap: 12
    }}>
      {mensaje}
    </div>
  );
}

export default NotificationAlert;
