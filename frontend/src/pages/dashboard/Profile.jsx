
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import apiClient from "../../services/apiClient";

export default function Profile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({
    username: user?.username || "",
    email: user?.email || ""
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await apiClient.put(`/usuarios/${user.id_usuario}`, form);
      setUser({ ...user, ...res.data });
      setSuccess("Datos actualizados correctamente");
    } catch {
      setError("No se pudo actualizar el perfil");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div style={{ maxWidth: 600, margin: "40px auto", background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px #0001", padding: 32 }}>
      <h2>Mi Perfil</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 32 }}>
        <label>Username</label>
        <input name="username" value={form.username} onChange={handleChange} style={{ width: "100%", marginBottom: 12 }} />
        <label>Email</label>
        <input name="email" value={form.email} onChange={handleChange} style={{ width: "100%", marginBottom: 12 }} />
        <button type="submit" disabled={loading} style={{ marginTop: 10 }}>
          {loading ? "Guardando..." : "Guardar Cambios"}
        </button>
        {success && <div style={{ color: "green", marginTop: 10 }}>{success}</div>}
        {error && <div style={{ color: "red", marginTop: 10 }}>{error}</div>}
      </form>

      {/* Sección de microempresa movida a CompanyEdit.jsx y accesible desde el sidebar */}
    </div>
  );
}
