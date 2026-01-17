import { useState } from "react";
import apiClient from "../../services/apiClient";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function VendedorCreate() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await apiClient.post("/auth/register/vendedor", { nombre, email });
      setSuccess("Vendedor creado exitosamente.");
      setTimeout(() => navigate("/dashboard/vendedores"), 1200);
    } catch {
      setError("No se pudo crear el vendedor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "40px auto", background: "#F5F7F8", borderRadius: 12, boxShadow: "0 2px 8px #E6EAEA", padding: 32 }}>
      <button
        type="button"
        onClick={() => navigate("/dashboard/vendedores")}
        style={{
          display: 'flex', alignItems: 'center', gap: 7,
          background: 'none', border: 'none', color: '#1D7373', fontWeight: 600,
          fontSize: 15, marginBottom: 10, cursor: 'pointer', padding: 0
        }}
      >
        <ArrowLeft size={20} /> Volver a la lista
      </button>
      <h2 style={{ color: "#042326", fontWeight: 700, textAlign: "center", marginBottom: 18 }}>Registrar Nuevo Vendedor</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <label style={{ color: "#0A3A40", fontWeight: 500 }}>Nombre</label>
        <input
          type="text"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          required
          style={{
            padding: "10px 14px",
            borderRadius: 8,
            border: "1.5px solid #1D7373",
            background: "#fff",
            color: "#042326",
            fontSize: 16,
            outline: "none",
            fontWeight: 500,
            transition: "border-color 0.2s"
          }}
          onFocus={e => e.target.style.borderColor = '#107361'}
          onBlur={e => e.target.style.borderColor = '#1D7373'}
        />
        <label style={{ color: "#0A3A40", fontWeight: 500 }}>Email</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{
            padding: "10px 14px",
            borderRadius: 8,
            border: "1.5px solid #1D7373",
            background: "#fff",
            color: "#042326",
            fontSize: 16,
            outline: "none",
            fontWeight: 500,
            transition: "border-color 0.2s"
          }}
          onFocus={e => e.target.style.borderColor = '#107361'}
          onBlur={e => e.target.style.borderColor = '#1D7373'}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: 12,
            background: loading ? "#0F5959" : "#1D7373",
            color: "#F5F7F8",
            border: 'none',
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 16,
            cursor: loading ? "not-allowed" : "pointer",
            transition: "background 0.2s"
          }}
        >
          {loading ? "Registrando..." : "Registrar Vendedor"}
        </button>
      </form>
      {success && <div style={{ color: '#107361', marginTop: 10, fontWeight: 500 }}>{success}</div>}
      {error && <div style={{ color: '#EF4444', marginTop: 10, fontWeight: 500 }}>{error}</div>}
    </div>
  );
}
