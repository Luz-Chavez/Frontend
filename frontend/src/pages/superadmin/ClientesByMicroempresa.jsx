import { useEffect, useState } from "react";
import apiClient from "../../services/apiClient";
import { useParams } from "react-router-dom";

const palette = {
  accent1: '#0A3A40', accent2: '#0F5959', accent3: '#1D7373', accent4: '#107361', white: '#F5F7F8', gray: '#E6EAEA', green: '#1D7373', red: '#EF4444',
};

export default function ClientesByMicroempresa() {
  const { id_microempresa } = useParams();
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchClientes() {
      setLoading(true);
      setError("");
      try {
        const res = await apiClient.get(`/clientes/microempresa/${id_microempresa}`);
        setClientes(res.data);
      } catch {
        setError("No se pudo cargar la lista de clientes");
      } finally {
        setLoading(false);
      }
    }
    if (id_microempresa) fetchClientes();
  }, [id_microempresa]);

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", background: palette.white, borderRadius: 16, boxShadow: "0 4px 16px #0002", padding: 32 }}>
      <h2 style={{ textAlign: "center", fontWeight: 700, marginBottom: 24, color: palette.accent3 }}>
        Clientes de la Microempresa #{id_microempresa}
      </h2>
      {loading ? (
        <div style={{ textAlign: "center", color: palette.accent2 }}>Cargando...</div>
      ) : error ? (
        <div style={{ textAlign: "center", color: palette.red }}>{error}</div>
      ) : clientes.length === 0 ? (
        <div style={{ textAlign: "center", color: "#4a5568" }}>No hay clientes registrados.</div>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 16 }}>
          <thead>
            <tr style={{ background: palette.gray }}>
              <th style={thStyle}>Nombre</th>
              <th style={thStyle}>Documento</th>
              <th style={thStyle}>Teléfono</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Estado</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map(cliente => (
              <tr key={cliente.id_cliente} style={{ borderBottom: `1px solid ${palette.gray}` }}>
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
                    color: cliente.estado ? palette.accent4 : palette.red,
                    background: cliente.estado ? "#E6F4EA" : "#FDEDED",
                    border: `1.5px solid ${cliente.estado ? palette.accent4 : palette.red}`
                  }}>
                    {cliente.estado ? "Activo" : "Inactivo"}
                  </span>
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
