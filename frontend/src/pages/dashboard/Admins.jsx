import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import apiClient from "../../services/apiClient";

export default function Admins() {
  const { user } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchAdmins() {
      try {
        const res = await apiClient.get(`/microempresas/${user?.microempresa?.id_microempresa}/admins`);
        setAdmins(res.data);
      } catch {
        setError("No se pudo cargar la lista de admins");
      } finally {
        setLoading(false);
      }
    }
    if (user?.microempresa?.id_microempresa) fetchAdmins();
  }, [user]);

  // Estilos coherentes con el dashboard
  const s = {
    container: { maxWidth: 800, margin: "40px auto", background: "#fff", borderRadius: 16, boxShadow: "0 4px 16px #0002", padding: 36 },
    title: { fontSize: 26, color: "#0A3A40", fontWeight: 700, marginBottom: 8, textAlign: "center", letterSpacing: 0.5 },
    subtitle: { color: "#1D7373", fontSize: 16, marginBottom: 24, textAlign: "center" },
    table: { width: "100%", borderCollapse: "collapse", marginTop: 18, background: "#F5F7F8", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 3px #E6EAEA" },
    th: { background: "#1D7373", color: "#fff", fontWeight: 600, fontSize: 15, padding: "12px 8px", border: "none", letterSpacing: 0.5 },
    td: { background: "#fff", color: "#042326", fontSize: 15, padding: "12px 8px", borderBottom: "1.5px solid #E6EAEA", textAlign: "center" },
    trHover: { background: "#F0FAF9" },
    error: { color: "#E53E3E", margin: "12px 0", textAlign: "center", fontWeight: 500 },
    loading: { color: "#1D7373", margin: "12px 0", textAlign: "center", fontWeight: 500 }
  };

  return (
    <div style={s.container}>
      <div style={s.title}>Admins de la Microempresa</div>
      <div style={s.subtitle}>Gestiona los administradores de tu empresa</div>
      {loading && <div style={s.loading}>Cargando...</div>}
      {error && <div style={s.error}>{error}</div>}
      <div style={{ overflowX: "auto" }}>
        <table style={s.table}>
          <thead>
            <tr>
              <th style={s.th}>ID</th>
              <th style={s.th}>Usuario</th>
              <th style={s.th}>Email</th>
            </tr>
          </thead>
          <tbody>
            {admins.length === 0 && !loading && (
              <tr>
                <td colSpan={3} style={{ ...s.td, color: '#6B7280', fontStyle: 'italic' }}>No hay administradores registrados</td>
              </tr>
            )}
            {admins.map((a, idx) => (
              <tr key={a.id_usuario} style={idx % 2 ? s.trHover : {}}>
                <td style={s.td}>{a.id_usuario}</td>
                <td style={s.td}>{a.username}</td>
                <td style={s.td}>{a.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
