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

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px #0001", padding: 32 }}>
      <h2>Admins de la Microempresa</h2>
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
          {admins.map(a => (
            <tr key={a.id_usuario}>
              <td>{a.id_usuario}</td>
              <td>{a.username}</td>
              <td>{a.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
