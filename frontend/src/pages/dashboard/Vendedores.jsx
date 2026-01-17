import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import apiClient from "../../services/apiClient";
import { useNavigate } from "react-router-dom";
import { Trash2, ToggleLeft, ToggleRight } from "lucide-react";

export default function Vendedores() {
  const { user } = useAuth();
  const [vendedores, setVendedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchVendedores() {
      try {
        const res = await apiClient.get(`/microempresas/${user?.microempresa?.id_microempresa}/vendedores`);
        setVendedores(res.data);
      } catch {
        setError("No se pudo cargar la lista de vendedores");
      } finally {
        setLoading(false);
      }
    }
    if (user?.microempresa?.id_microempresa) fetchVendedores();
  }, [user]);

  // Acciones para eliminar y cambiar estado
  const handleDelete = async (id_usuario) => {
    if (!window.confirm("¿Seguro que deseas eliminar este vendedor?")) return;
    try {
      await apiClient.delete(`/vendedores/${id_usuario}`);
      setVendedores(vendedores.filter(v => v.id_usuario !== id_usuario));
    } catch {
      alert("No se pudo eliminar el vendedor.");
    }
  };

  const handleToggleEstado = async (id_usuario, estadoActual) => {
    try {
      await apiClient.put(`/vendedores/${id_usuario}/baja-logica`);
      setVendedores(vendedores.map(v => v.id_usuario === id_usuario ? { ...v, estado: !estadoActual } : v));
    } catch {
      alert("No se pudo cambiar el estado del vendedor.");
    }
  };

  const s = {
    table: { width: "100%", marginTop: 20, borderCollapse: "collapse" },
    th: { background: "#E6EAEA", color: "#042326", fontWeight: 600, padding: "12px", borderBottom: "2px solid #1D7373" },
    td: { padding: "12px", borderBottom: "1px solid #E6EAEA", color: "#042326", fontSize: 15 },
    estado: (activo) => ({
      display: "inline-flex", alignItems: "center", gap: 6,
      background: activo ? "#D1FAE5" : "#FECACA",
      color: activo ? "#107361" : "#EF4444",
      fontWeight: 600, fontSize: 13, borderRadius: 99, padding: "4px 12px"
    }),
    actions: { display: "flex", gap: 10, justifyContent: "center" }
  };

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", background: "#F5F7F8", borderRadius: 12, boxShadow: "0 2px 8px #E6EAEA", padding: 32 }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: '#0A3A40', marginBottom: 10 }}>Vendedores de la Microempresa</h2>
      {user?.rol === 'adminmicroempresa' && (
        <button
          onClick={() => navigate('/dashboard/vendedores/crear')}
          style={{ margin: '16px 0', padding: '10px 18px', background: '#1D7373', color: '#F5F7F8', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 15, cursor: 'pointer', transition: 'background 0.2s' }}
        >
          + Agregar Vendedor
        </button>
      )}
      {loading && <div style={{ color: '#042326' }}>Cargando...</div>}
      {error && <div style={{ color: '#EF4444', fontWeight: 500 }}>{error}</div>}
      <table style={s.table}>
        <thead>
          <tr>
            <th style={s.th}>Nombre</th>
            <th style={s.th}>Email</th>
            <th style={s.th}>Estado</th>
            <th style={s.th}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {vendedores.map(v => (
            <tr key={v.id_usuario}>
              <td style={s.td}>{v.nombre}</td>
              <td style={s.td}>{v.email}</td>
              <td style={s.td}>
                <span style={s.estado(v.estado)}>
                  {v.estado ? <ToggleRight size={18} color="#107361" /> : <ToggleLeft size={18} color="#EF4444" />}
                  {v.estado ? "Activo" : "Inactivo"}
                </span>
              </td>
              <td style={s.td}>
                <div style={s.actions}>
                  <button
                    title="Cambiar estado"
                    onClick={() => handleToggleEstado(v.id_usuario, v.estado)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    {v.estado ? <ToggleRight color="#107361" /> : <ToggleLeft color="#EF4444" />}
                  </button>
                  <button
                    title="Eliminar vendedor"
                    onClick={() => handleDelete(v.id_usuario)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    <Trash2 color="#EF4444" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
