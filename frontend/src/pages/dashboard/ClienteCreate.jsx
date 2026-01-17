import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import apiClient from "../../services/apiClient";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function ClienteCreate() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ nombre: "", documento: "", telefono: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await apiClient.post("/clientes/", {
        ...form,
        id_microempresa: user?.microempresa?.id_microempresa
      });
      setSuccess("Cliente creado correctamente");
      setTimeout(() => {
        if (user?.rol === 'vendedor') {
          navigate("/seller/clientes");
        } else {
          navigate("/dashboard/clientes");
        }
      }, 1200);
    } catch {
      setError("No se pudo crear el cliente");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: "40px auto", background: "#F5F7F8", borderRadius: 12, boxShadow: "0 2px 12px #E6EAEA", padding: 32 }}>
      <button
        type="button"
        onClick={() => {
          if (user?.rol === 'vendedor') {
            navigate("/seller/clientes");
          } else {
            navigate("/dashboard/clientes");
          }
        }}
        style={{
          display: 'flex', alignItems: 'center', gap: 7,
          background: 'none', border: 'none', color: '#1D7373', fontWeight: 600,
          fontSize: 15, marginBottom: 10, cursor: 'pointer', padding: 0
        }}
      >
        <ArrowLeft size={20} /> Volver a la lista
      </button>
      <h2 style={{ color: "#1D7373", fontWeight: 700, fontSize: 24, marginBottom: 24 }}>Crear Cliente</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <input name="nombre" value={form.nombre} onChange={handleChange} required placeholder="Nombre" style={inputStyle} />
        <input name="documento" value={form.documento} onChange={handleChange} required placeholder="Documento" style={inputStyle} />
        <input name="telefono" value={form.telefono} onChange={handleChange} required placeholder="Teléfono" style={inputStyle} />
        <input name="email" value={form.email} onChange={handleChange} required placeholder="Email" style={inputStyle} />
        <button type="submit" disabled={loading} style={submitStyle}>
          {loading ? "Guardando..." : "Crear Cliente"}
        </button>
      </form>
      {error && <span style={{ color: "#EF4444", fontWeight: 500, marginTop: 12 }}>{error}</span>}
      {success && <span style={{ color: "#107361", fontWeight: 500, marginTop: 12 }}>{success}</span>}
    </div>
  );
}

const inputStyle = {
  padding: "10px 14px",
  borderRadius: 8,
  border: "1px solid #cbd5e0",
  fontSize: 16,
  minWidth: 180
};

const submitStyle = {
  padding: "10px 22px",
  borderRadius: 8,
  background: "#1D7373",
  color: "#F5F7F8",
  fontWeight: 700,
  fontSize: 16,
  border: "none",
  cursor: "pointer",
  marginTop: 8
};
