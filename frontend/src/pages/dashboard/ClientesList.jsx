import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import apiClient from "../../services/apiClient";
import { Pencil, Trash2, ToggleLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ClienteCreateBar from "./ClienteCreateBar";

export default function ClientesList({ tipo }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchClientes() {
      setLoading(true);
      setError("");
      try {
        let endpoint = `/clientes/microempresa/${user?.microempresa?.id_microempresa}`;
        if (tipo === "activos") endpoint += "/activos";
        if (tipo === "inactivos") endpoint += "/inactivos";
        const res = await apiClient.get(endpoint);
        setClientes(res.data);
      } catch {
        setError("No se pudo cargar la lista de clientes");
      } finally {
        setLoading(false);
      }
    }
    if (user?.microempresa?.id_microempresa) fetchClientes();
  }, [user?.microempresa?.id_microempresa, tipo]);

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", background: "#fff", borderRadius: 16, boxShadow: "0 4px 16px #0002", padding: 32 }}>
      <h2 style={{ textAlign: "center", fontWeight: 700, marginBottom: 24, color: "#1D7373" }}>Clientes de la Microempresa</h2>
      <ClienteCreateBar />
      {loading ? (
        <div style={{ textAlign: "center", color: "#0F5959" }}>Cargando...</div>
      ) : error ? (
        <div style={{ textAlign: "center", color: "#EF4444" }}>{error}</div>
      ) : clientes.length === 0 ? (
        <div style={{ textAlign: "center", color: "#4a5568" }}>No hay clientes registrados.</div>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 16 }}>
          <thead>
            <tr style={{ background: "#E6EAEA" }}>
              <th style={thStyle}>Nombre</th>
              <th style={thStyle}>Documento</th>
              <th style={thStyle}>Teléfono</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Estado</th>
              <th style={thStyle}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map(cliente => (
              <tr key={cliente.id_cliente} style={{ borderBottom: "1px solid #E6EAEA" }}>
                <td style={tdStyle}>{cliente.nombre}</td>
                <td style={tdStyle}>{cliente.documento}</td>
                <td style={tdStyle}>{cliente.telefono}</td>
                <td style={tdStyle}>{cliente.email}</td>
                <td style={tdStyle}>
                  <span style={{
                    display: "inline-block",
                    padding: "4px 12px",
                    borderRadius: 12,
                    fontWeight: 600,
                    color: cliente.estado ? "#107361" : "#EF4444",
                    background: cliente.estado ? "#E6F4EA" : "#FDEDED",
                    border: `1.5px solid ${cliente.estado ? "#107361" : "#EF4444"}`
                  }}>
                    {cliente.estado ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td style={tdStyle}>
                  <button
                    title={cliente.estado ? "Desactivar" : "Activar"}
                    style={{
                      ...iconBtn,
                      background: "#F5F7F8",
                      border: `2px solid ${cliente.estado ? "#107361" : "#EF4444"}`,
                      color: cliente.estado ? "#107361" : "#EF4444",
                      marginRight: 8,
                      overflow: "hidden"
                    }}
                    onClick={async () => {
                      const token = localStorage.getItem('access_token');
                      if (token) {
                        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                      }
                      if (cliente.estado) {
                        await apiClient.put(`/clientes/${cliente.id_cliente}/baja-logica`);
                      } else {
                        await apiClient.put(`/clientes/${cliente.id_cliente}/habilitar`);
                      }
                      // Actualizar estado local sin recargar
                      setClientes(prev => prev.map(c => c.id_cliente === cliente.id_cliente ? { ...c, estado: !c.estado } : c));
                    }}
                  >
                    <ToggleLeft
                      size={28}
                      style={{
                        verticalAlign: "middle",
                        transition: "transform 0.3s cubic-bezier(.68,-0.55,.27,1.55)",
                        transform: cliente.estado ? "rotate(0deg)" : "rotate(180deg)",
                        color: cliente.estado ? "#107361" : "#EF4444"
                      }}
                    />
                  </button>
                  {/* adminmicroempresa y vendedor pueden editar; solo adminmicroempresa puede eliminar */}
                  {(user?.rol === 'adminmicroempresa' || user?.rol === 'vendedor') && (
                    <>
                      <button
                        title="Editar"
                        style={{
                          ...iconBtn,
                          background: "#F5F7F8",
                          border: "2px solid #0A3A40",
                          color: "#0A3A40",
                          marginRight: 8
                        }}
                        onClick={() => {
                          const base = user?.rol === 'vendedor' ? '/seller/clientes/editar/' : '/dashboard/clientes/editar/';
                          navigate(`${base}${cliente.id_cliente}`);
                        }}
                      >
                        <Pencil size={20} style={{ verticalAlign: "middle" }} />
                      </button>
                      {user?.rol === 'adminmicroempresa' && (
                        <button
                          title="Eliminar"
                          style={{
                            ...iconBtn,
                            background: "#F5F7F8",
                            border: "2px solid #EF4444",
                            color: "#EF4444"
                          }}
                          onClick={async () => {
                            if (window.confirm("¿Seguro que deseas eliminar este cliente?")) {
                              const token = localStorage.getItem('access_token');
                              if (token) {
                                apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                              }
                              await apiClient.delete(`/clientes/${cliente.id_cliente}`);
                              // Actualizar estado local sin recargar
                              setClientes(prev => prev.filter(c => c.id_cliente !== cliente.id_cliente));
                            }
                          }}
                        >
                          <Trash2 size={20} style={{ verticalAlign: "middle" }} />
                        </button>
                      )}
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const thStyle = {
  padding: "10px 8px",
  textAlign: "left",
  color: "#042326",
  fontWeight: 700,
  fontSize: 16,
  borderBottom: "2px solid #1D7373"
};

const tdStyle = {
  padding: "10px 8px",
  fontSize: 15,
  color: "#0A3A40"
};

const iconBtn = {
  padding: "6px 10px",
  borderRadius: 8,
  border: "none",
  fontWeight: 600,
  fontSize: 15,
  cursor: "pointer",
  transition: "background 0.2s, border 0.2s, color 0.2s"
};
