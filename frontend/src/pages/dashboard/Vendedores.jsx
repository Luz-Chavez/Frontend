import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import apiClient from "../../services/apiClient";

export default function Vendedores() {
  const { user } = useAuth();
  const [vendedores, setVendedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px #0001", padding: 32 }}>
      <h2>Vendedores de la Microempresa</h2>
      {loading && <div>Cargando...</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
      <table style={{ width: "100%", marginTop: 20 }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {vendedores.map(v => (
            <tr key={v.id_usuario}>
              <td>{v.id_usuario}</td>
              <td>{v.username}</td>
              <td>{v.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
