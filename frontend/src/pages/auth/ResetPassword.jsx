

import { useState, useEffect } from "react";
import apiClient from "../../services/apiClient";
import { useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";


function ResetPassword() {
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location && location.state && location.state.token) {
      setToken(prev => prev || location.state.token);
    }
  }, [location]);

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
    <div style={{
      minHeight: '100vh',
      background: '#042326',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 0,
    }}>
      <div style={{
        maxWidth: 420,
        width: '100%',
        background: '#F5F7F8',
        borderRadius: 18,
        boxShadow: '0 6px 24px #1D737344',
        padding: 36,
        margin: 24,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <h2 style={{ color: '#107361', fontWeight: 800, fontSize: 28, marginBottom: 8 }}>Restablecer Contraseña</h2>
        <div style={{ color: '#0A3A40', fontSize: 16, marginBottom: 18, opacity: 0.8, textAlign: 'center' }}>
          Ingresa el token de recuperación y tu nueva contraseña.
        </div>
        {location?.state?.token && (
          <div style={{ marginBottom: 18, background: '#E6EAEA', padding: 12, borderRadius: 8, wordBreak: 'break-all', width: '100%' }}>
            <strong style={{ color: '#0F5959' }}>Token recibido por correo:</strong>
            <div style={{ marginTop: 6, fontFamily: 'monospace', fontSize: 15, color: '#0A3A40' }}>{location.state.token}</div>
            <div style={{ fontSize: 13, color: '#1D7373', marginTop: 4 }}>Copia este token de tu correo y pégalo en el campo de abajo si es necesario.</div>
          </div>
        )}
        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 18 }}>
          <label style={{ color: '#0A3A40', fontWeight: 700, marginBottom: 4 }}>Token</label>
          <input
            type="text"
            value={token}
            readOnly
            required
            autoComplete="off"
            style={{
              padding: '12px 14px',
              borderRadius: 8,
              border: '1.5px solid #E6EAEA',
              fontSize: 16,
              background: '#f3f3f3',
              color: '#0A3A40',
              marginBottom: 2,
              cursor: 'not-allowed',
            }}
          />
          <label style={{ color: '#0A3A40', fontWeight: 700, marginBottom: 4 }}>Nueva Contraseña</label>
          <div style={{ position: 'relative', width: '100%' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{
                padding: '12px 44px 12px 14px',
                borderRadius: 8,
                border: '1.5px solid #E6EAEA',
                fontSize: 16,
                background: '#fff',
                color: '#0A3A40',
                width: '100%',
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              tabIndex={-1}
              style={{
                position: 'absolute',
                right: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#1D7373',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                fontSize: 20,
              }}
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
            </button>
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '12px 0',
              borderRadius: 8,
              background: loading ? '#1D737388' : '#1D7373',
              color: '#F5F7F8',
              fontWeight: 700,
              fontSize: 17,
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: 8,
              boxShadow: '0 2px 8px #E6EAEA',
              transition: 'background 0.2s',
            }}
          >
            {loading ? "Restableciendo..." : "Restablecer Contraseña"}
          </button>
        </form>
        {success && <div style={{ color: '#10B981', marginTop: 16, fontWeight: 600, fontSize: 16 }}>{success}</div>}
        {error && <div style={{ color: '#EF4444', marginTop: 16, fontWeight: 600, fontSize: 16 }}>{error}</div>}
      </div>
    </div>
  );
}

export default ResetPassword;
