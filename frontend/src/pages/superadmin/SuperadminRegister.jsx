import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../services/apiClient";
import { UserPlus } from "lucide-react";

function SuperadminRegister() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await apiClient.post("/auth/register/superadmin", { nombre, email, password });
      setSuccess("Superadmin registrado correctamente. Puedes iniciar sesión.");
      setTimeout(() => navigate("/login"), 1800);
    } catch (err) {
      setError(err.response?.data?.detail || "Error al registrar superadmin");
    }
  };

  const s = {
    container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(120deg, #F5F7F8 60%, #1D7373 100%)' },
    card: { width: '100%', maxWidth: '410px', padding: '44px 36px 36px 36px', backgroundColor: '#fff', borderRadius: '18px', boxShadow: '0 6px 32px #1D737320', border: '1.5px solid #E6EAEA' },
    title: { fontSize: '27px', fontWeight: 700, color: '#0A3A40', textAlign: 'center', marginBottom: '22px', letterSpacing: 0.2 },
    input: { width: '100%', padding: '13px 15px', marginBottom: '18px', backgroundColor: '#F5F7F8', border: '1.5px solid #1D7373', borderRadius: '9px', color: '#042326', fontSize: '15px', outline: 'none', fontWeight: 500, transition: 'border-color 0.2s' },
    button: { width: '100%', padding: '13px 0', backgroundColor: '#1D7373', color: '#F5F7F8', border: 'none', borderRadius: '9px', fontSize: '17px', fontWeight: 600, cursor: 'pointer', display: 'flex', justifyContent: 'center', gap: '8px', marginTop: 6, boxShadow: '0 2px 8px #E6EAEA', transition: 'background 0.2s' },
    error: { backgroundColor: '#FEE2E2', color: '#B91C1C', padding: '10px', borderRadius: '7px', marginBottom: '15px', fontSize: '15px', textAlign: 'center', border: '1.5px solid #FCA5A5', fontWeight: 500 },
    success: { backgroundColor: '#D1FAE5', color: '#047857', padding: '10px', borderRadius: '7px', marginBottom: '15px', fontSize: '15px', textAlign: 'center', border: '1.5px solid #6EE7B7', fontWeight: 500 }
  };

  return (
    <div style={s.container}>
      <div style={s.card}>
        <div style={{textAlign:'center', marginBottom:'8px'}}>
          <UserPlus size={44} color="#1D7373" style={{ background: '#F5F7F8', borderRadius: 12, padding: 6, boxShadow: '0 2px 8px #E6EAEA' }} />
        </div>
        <h2 style={s.title}>Registrar Superadmin</h2>
        {error && <div style={s.error}>{error}</div>}
        {success && <div style={s.success}>{success}</div>}
        <form onSubmit={handleSubmit} autoComplete="off">
          <input
            type="text"
            placeholder="Nombre completo"
            style={s.input}
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            required
            onFocus={e => e.target.style.borderColor = '#107361'}
            onBlur={e => e.target.style.borderColor = '#1D7373'}
          />
          <input
            type="email"
            placeholder="Correo electrónico"
            style={s.input}
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            onFocus={e => e.target.style.borderColor = '#107361'}
            onBlur={e => e.target.style.borderColor = '#1D7373'}
          />
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              style={{ ...s.input, marginBottom: 0 }}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
              onFocus={e => e.target.style.borderColor = '#107361'}
              onBlur={e => e.target.style.borderColor = '#1D7373'}
            />
            <button type="button" onClick={() => setShowPassword(v => !v)} style={{ position: 'absolute', right: 12, top: 13, background: 'none', border: 'none', cursor: 'pointer', color: '#1D7373', fontWeight: 600 }}>
              {showPassword ? 'Ocultar' : 'Mostrar'}
            </button>
          </div>
          <button type="submit" style={s.button}><UserPlus size={20}/> Registrar</button>
        </form>
      </div>
    </div>
  );
}

export default SuperadminRegister;
