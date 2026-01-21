import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext"; 
import { getNotificacionesPorUsuario, marcarNotificacionLeida } from "../api/notificaciones.api";

// Paleta Corporativa (Textilón)
const theme = {
  bgPage: "#F5F7F8",
  cardBg: "#FFFFFF",
  
  // Colores Exactos del Dashboard
  verdeOscuro: "#0A3A40", // Stock Bajo / Crítico
  verdeMedio: "#1D7373",  // Info / Normal
  verdeClaro: "#f0e6e6ff",  // Fondos suaves
  
  textPrimary: "#2a140fff", // Negro nítido para lectura
  textSecondary: "#8b6a64ff",
};

function Notificaciones() {
  const { user } = useAuth();
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    cargarNotificaciones();
  }, [user]);

  const cargarNotificaciones = async () => {
    const idUsuario = user?.id_usuario || user?.id || user?.sub;
    if (!idUsuario) {
      setLoading(false);
      return;
    }
    try {
      const res = await getNotificacionesPorUsuario(idUsuario);
      const ordenadas = res.data.sort((a, b) => 
        new Date(b.fecha_creacion || 0) - new Date(a.fecha_creacion || 0)
      );
      setNotificaciones(ordenadas);
    } catch (error) {
      console.error(error);
      setErrorMsg("No se pudieron cargar las notificaciones.");
    } finally {
      setLoading(false);
    }
  };

  const manejarMarcarLeido = async (id) => {
    try {
      await marcarNotificacionLeida(id);
      setNotificaciones(nots =>
        nots.map(n => n.id_notificacion === id ? { ...n, leido: true } : n)
      );
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div style={{ padding: "40px", textAlign: "center", color: theme.textSecondary }}>Cargando...</div>;

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto", padding: "0 20px", fontFamily: "inherit" }}>
      
      {/* Encabezado */}
      <header style={{ marginBottom: "30px", borderBottom: `2px solid ${theme.verdeClaro}`, paddingBottom: "15px" }}>
        <h2 style={{ color: theme.verdeOscuro, fontWeight: 800, fontSize: "2rem", margin: 0, letterSpacing: "-0.5px" }}>
          Notificaciones
        </h2>
        {errorMsg && <p style={{ color: "red", marginTop: "10px" }}>{errorMsg}</p>}
      </header>

      {/* Lista Vacía */}
      {notificaciones.length === 0 && !errorMsg ? (
         <div style={{ 
             textAlign: "center", 
             padding: "60px 20px", 
             background: theme.cardBg, 
             borderRadius: "16px", 
             boxShadow: "0 4px 20px rgba(10,58,64,0.05)",
             border: `1px solid ${theme.verdeClaro}`
         }}>
            <h3 style={{ color: theme.verdeMedio, margin: "0 0 5px 0" }}>Todo al día</h3>
            <p style={{ color: theme.textSecondary, margin: 0 }}>No hay alertas pendientes.</p>
         </div>
      ) : (
        /* Lista */
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {notificaciones.map(n => {
            const isAlert = n.tipo === 'STOCK_BAJO' || n.tipo === 'alerta';
            
            // Colores según tipo
            const badgeColor = isAlert ? theme.verdeOscuro : theme.verdeMedio;
            const borderColor = isAlert ? theme.verdeOscuro : theme.verdeMedio;
            
            return (
              <div
                key={n.id_notificacion}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  backgroundColor: n.leido ? "#fcf8f8ff" : "#FFFFFF",
                  borderRadius: "12px",
                  padding: "20px",
                  // Sombra nítida
                  boxShadow: n.leido ? "none" : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                  border: `1px solid ${n.leido ? "#E2E8F0" : "transparent"}`,
                  // Borde izquierdo sólido
                  borderLeft: `5px solid ${n.leido ? "#CBD5E1" : borderColor}`,
                  gap: "20px",
                  transition: "all 0.2s ease"
                }}
              >
                {/* Contenido */}
                <div style={{ flex: 1 }}>
                  
                  {/* Fila Superior: Etiqueta y Fecha */}
                  <div style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      gap: "12px", 
                      marginBottom: "10px"
                  }}>
                    {/* ETIQUETA SÓLIDA (Badge) - Esto elimina lo "borroso" */}
                    <span style={{
                        backgroundColor: n.leido ? "#b89f94ff" : badgeColor,
                        color: "#FFFFFF",
                        fontSize: "0.7rem",
                        fontWeight: "800",
                        textTransform: "uppercase",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        letterSpacing: "0.5px",
                        lineHeight: 1
                    }}>
                        {isAlert ? "STOCK BAJO" : "INFORMACIÓN"}
                    </span>

                    <span style={{ 
                        color: theme.textSecondary, 
                        fontSize: "0.85rem",
                        fontWeight: 500
                    }}>
                      {n.fecha_creacion ? new Date(n.fecha_creacion).toLocaleString() : "Reciente"}
                    </span>
                  </div>
                  
                  {/* Mensaje Principal */}
                  <p style={{ 
                      margin: 0, 
                      color: theme.textPrimary,
                      fontSize: "1rem", 
                      lineHeight: "1.5",
                      fontWeight: n.leido ? 400 : 600, // Más negrita si no está leído
                      // Suavizado de fuente para nitidez
                      WebkitFontSmoothing: "antialiased",
                      MozOsxFontSmoothing: "grayscale"
                  }}>
                    {n.mensaje}
                  </p>
                </div>

                {/* Botón de Acción */}
                {!n.leido && (
                  <button
                    onClick={() => manejarMarcarLeido(n.id_notificacion)}
                    style={{
                      flexShrink: 0,
                      background: "transparent",
                      border: `1px solid ${theme.verdeMedio}`,
                      color: theme.verdeMedio,
                      borderRadius: "6px",
                      padding: "8px 16px",
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      transition: "all 0.2s",
                      whiteSpace: "nowrap"
                    }}
                    onMouseOver={(e) => {
                        e.target.style.background = theme.verdeMedio;
                        e.target.style.color = "#fff";
                    }}
                    onMouseOut={(e) => {
                        e.target.style.background = "transparent";
                        e.target.style.color = theme.verdeMedio;
                    }}
                  >
                    Marcar leída
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Notificaciones;