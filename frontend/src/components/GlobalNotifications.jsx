import React, { useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import useNotificacionesWS from "../hooks/useNotificacionesWS";
import NotificationAlert from "./NotificationAlert";

export default function GlobalNotifications() {
  const { user } = useAuth();
  const [alerta, setAlerta] = useState(null);

  // Callback para mostrar notificación
  const handleWSMessage = useCallback((msg) => {
    console.log("[WS] Mensaje recibido:", msg);
    // Siempre mostrar un mensaje genérico
    setAlerta({
      mensaje: "Tienes una nueva notificación. Revisa tu buzón de notificaciones.",
      tipo: "info"
    });
  }, []);

  // Conectar solo si hay usuario
  useNotificacionesWS(user?.id_usuario || user?.id || user?.sub, handleWSMessage);

  if (!alerta) return null;
  return (
    <NotificationAlert
      mensaje={alerta.mensaje}
      tipo={alerta.tipo === "alerta" ? "alerta" : "info"}
      onClose={() => setAlerta(null)}
    />
  );
}
