import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import apiClient from "../../services/apiClient";
import { useNavigate } from "react-router-dom";

export default function EditCliente() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ nombre: "", documento: "", telefono: "", email: "", estado: true });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Obtener datos del cliente por id_cliente desde la URL
    const id_cliente = window.location.pathname.split("/").pop();
    async function fetchCliente() {
      setLoading(true);
      setError("");
      try {
        const res = await apiClient.get(`/clientes/${id_cliente}`);
        setForm({
          nombre: res.data.nombre || "",
          documento: res.data.documento || "",
          telefono: res.data.telefono || "",
          email: res.data.email || "",
          estado: typeof res.data.estado === "boolean" ? res.data.estado : true
        });
      } catch {
        setError("No se pudo cargar el cliente");
      } finally {
        setLoading(false);
      }
    }
    fetchCliente();
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");
    const id_cliente = window.location.pathname.split("/").pop();
    try {
      // Solo enviar los datos requeridos, incluyendo estado actual
      const payload = {
        nombre: form.nombre,
        documento: form.documento,
        telefono: form.telefono,
        email: form.email,
        estado: form.estado
      };
      await apiClient.put(`/clientes/${id_cliente}`, payload);
      setSuccess("Datos actualizados correctamente");
      setTimeout(() => {
        if (user?.rol === 'vendedor') {
          navigate("/seller/clientes");
        } else {
          navigate("/dashboard/clientes");
        }
      }, 1000);
    } catch {
      setError("No se pudo actualizar el cliente");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "40px auto", background: "#fff", borderRadius: 16, boxShadow: "0 4px 16px #0002", padding: 32 }}>
      <h2 style={{ textAlign: "center", fontWeight: 700, marginBottom: 24, color: "#1D7373" }}>Editar Cliente</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 18 }}>
          <label htmlFor="nombre" style={{ fontWeight: 500, color: "#4a5568" }}>Nombre</label>
          <input id="nombre" name="nombre" value={form.nombre} onChange={handleChange} required style={inputStyle} />
        </div>
        <div style={{ marginBottom: 18 }}>
          <label htmlFor="documento" style={{ fontWeight: 500, color: "#4a5568" }}>Documento</label>
          <input id="documento" name="documento" value={form.documento} onChange={handleChange} required style={inputStyle} />
        </div>
        <div style={{ marginBottom: 18 }}>
          <label htmlFor="telefono" style={{ fontWeight: 500, color: "#4a5568" }}>Teléfono</label>
          <input id="telefono" name="telefono" value={form.telefono} onChange={handleChange} required style={inputStyle} />
        </div>
        <div style={{ marginBottom: 18 }}>
          <label htmlFor="email" style={{ fontWeight: 500, color: "#4a5568" }}>Email</label>
          <input id="email" name="email" value={form.email} onChange={handleChange} required style={inputStyle} />
        </div>
        <button type="submit" disabled={loading} style={buttonStyle}>
          {loading ? "Guardando..." : "Guardar Cambios"}
        </button>
        {success && <div style={{ color: "#38a169", marginTop: 16, textAlign: "center", fontWeight: 500 }}>{success}</div>}
        {error && <div style={{ color: "#EF4444", marginTop: 16, textAlign: "center", fontWeight: 500 }}>{error}</div>}
      </form>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: 8,
  border: "1px solid #cbd5e0",
  marginTop: 6,
  fontSize: 16
};

const buttonStyle = {
  width: "100%",
  padding: "12px 0",
  borderRadius: 8,
  background: "#1D7373",
  color: "#F5F7F8",
  fontWeight: 600,
  fontSize: 17,
  border: "none",
  marginTop: 10,
  cursor: "pointer",
  transition: "background 0.2s"
};
