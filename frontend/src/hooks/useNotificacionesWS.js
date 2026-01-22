import { useEffect, useRef } from "react";

/**
 * Hook para conectar a WebSocket de notificaciones por usuario
 * @param {string|number} idUsuario - ID del usuario autenticado
 * @param {(msg: object) => void} onMessage - Callback al recibir mensaje
 * @returns {void}
 */
export default function useNotificacionesWS(idUsuario, onMessage) {
  const wsRef = useRef(null);

  useEffect(() => {
    if (!idUsuario) return;
    // Cambia la URL si tu backend no es localhost
    const wsUrl = `ws://127.0.0.1:8000/ws/notificaciones/${idUsuario}`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      // Opcional: console.log("WebSocket conectado");
    };
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (onMessage) onMessage(data);
        } catch {
          // Si no es JSON, igual lo pasamos
          if (onMessage) onMessage(event.data);
        }
      };
      ws.onerror = () => {
        // Opcional: console.error("WebSocket error");
      };
    ws.onclose = () => {
      // Opcional: console.log("WebSocket cerrado");
    };
    return () => {
      ws.close();
    };
  }, [idUsuario, onMessage]);
}
