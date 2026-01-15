
import { useState, useEffect } from "react";
import apiClient from "../../services/apiClient";
import { useNavigate, useLocation } from "react-router-dom";

function ResetPassword() {


  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location && location.state && location.state.token) {
      // Solo setear el token si el input está vacío (para no sobreescribir si el usuario escribe)
      setToken(prev => prev || location.state.token);
    }
  }, [location]);

  // Mostrar el token recibido para copiar
  const tokenFromNav = location && location.state && location.state.token;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await apiClient.post("/auth/reset-password", { token, nueva_password: password });
      setSuccess("Contraseña restablecida correctamente. Ahora puedes iniciar sesión.");
      setTimeout(() => navigate("/login"), 2000);
    } catch {
      setError("No se pudo restablecer la contraseña. Verifica el token y el email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "60px auto", background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px #0001", padding: 32 }}>
      <h2>Restablecer Contraseña</h2>
      {token && (
        <div style={{ marginBottom: 16, background: '#F3F4F6', padding: 12, borderRadius: 8, wordBreak: 'break-all' }}>
          <strong>Token para restablecer:</strong>
          <div style={{ marginTop: 6, fontFamily: 'monospace', fontSize: 15 }}>{token}</div>
          <div style={{ fontSize: 13, color: '#6B7280', marginTop: 4 }}>Copia este token si lo necesitas para pegarlo en el campo de abajo.</div>
        </div>
      )}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <label>Token</label>
        <input type="text" value={token} onChange={e => setToken(e.target.value)} required style={{ padding: 10 }} />
        <label>Nueva Contraseña</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{ padding: 10 }} />
        <button type="submit" disabled={loading} style={{ padding: 10, background: '#10B981', color: 'white', border: 'none', borderRadius: 6 }}>
          {loading ? "Restableciendo..." : "Restablecer Contraseña"}
        </button>
      </form>
      {success && <div style={{ color: 'green', marginTop: 10 }}>{success}</div>}
      {error && <div style={{ color: 'red', marginTop: 10 }}>{error}</div>}
    </div>
  );
}

export default ResetPassword;
