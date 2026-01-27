import { useState } from "react";
import apiClient from "../../services/apiClient";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";

export default function VendedorCreate() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar contraseñas
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await apiClient.post("/auth/register/vendedor", { nombre, email, password });
      setSuccess("Vendedor creado exitosamente.");
      setTimeout(() => navigate("/dashboard/vendedores"), 1200);
    } catch (err) {
      const msg = err.response?.data?.detail || "No se pudo crear el vendedor.";
      setError(typeof msg === 'object' ? JSON.stringify(msg) : msg);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    padding: "10px 14px",
    borderRadius: 8,
    border: "1.5px solid #1D7373",
    background: "#fff",
    color: "#042326",
    fontSize: 16,
    outline: "none",
    fontWeight: 500,
    transition: "border-color 0.2s",
    width: "100%",
    boxSizing: "border-box"
  };

  return (
    <div style={{ maxWidth: 420, margin: "40px auto", background: "#fff", borderRadius: 16, boxShadow: "0 4px 20px rgba(0,0,0,0.08)", padding: 32 }}>
      <button
        type="button"
        onClick={() => navigate("/dashboard/vendedores")}
        style={{
          display: 'flex', alignItems: 'center', gap: 7,
          background: 'none', border: 'none', color: '#1D7373', fontWeight: 600,
          fontSize: 15, marginBottom: 16, cursor: 'pointer', padding: 0
        }}
      >
        <ArrowLeft size={20} /> Volver a la lista
      </button>

      <h2 style={{ color: "#0A3A40", fontWeight: 700, textAlign: "center", marginBottom: 24 }}>
        Registrar Nuevo Vendedor
      </h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div>
          <label style={{ color: "#0A3A40", fontWeight: 500, display: 'block', marginBottom: 6 }}>Nombre completo</label>
          <input
            type="text"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            required
            placeholder="Ej: Juan Pérez"
            style={inputStyle}
          />
        </div>

        <div>
          <label style={{ color: "#0A3A40", fontWeight: 500, display: 'block', marginBottom: 6 }}>Correo electrónico</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            placeholder="vendedor@empresa.com"
            style={inputStyle}
          />
        </div>

        <div>
          <label style={{ color: "#0A3A40", fontWeight: 500, display: 'block', marginBottom: 6 }}>Contraseña</label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="Mínimo 6 caracteres"
              style={{ ...inputStyle, paddingRight: 45 }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#64748B'
              }}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <div>
          <label style={{ color: "#0A3A40", fontWeight: 500, display: 'block', marginBottom: 6 }}>Confirmar contraseña</label>
          <input
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
            placeholder="Repetir contraseña"
            style={inputStyle}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: 14,
            background: loading ? "#0F5959" : "#1D7373",
            color: "#fff",
            border: 'none',
            borderRadius: 10,
            fontWeight: 600,
            fontSize: 16,
            cursor: loading ? "not-allowed" : "pointer",
            transition: "background 0.2s",
            marginTop: 8
          }}
        >
          {loading ? "Registrando..." : "Registrar Vendedor"}
        </button>
      </form>

      {success && <div style={{ color: '#10B981', marginTop: 16, fontWeight: 500, textAlign: 'center' }}>{success}</div>}
      {error && <div style={{ color: '#EF4444', marginTop: 16, fontWeight: 500, textAlign: 'center' }}>{error}</div>}
    </div>
  );
}
