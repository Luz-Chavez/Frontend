import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";

function Register() {
  const { signup, errors } = useAuth();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await signup({ nombre, email, password });
    // Redirigir siempre al login tras registro
    if (result !== false) {
      navigate("/login");
    }
  };

  const s = {
    container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(120deg, #F5F7F8 60%, #1D7373 100%)' },
    card: { width: '100%', maxWidth: '410px', padding: '44px 36px 36px 36px', backgroundColor: '#fff', borderRadius: '18px', boxShadow: '0 6px 32px #1D737320', border: '1.5px solid #E6EAEA' },
    title: { fontSize: '27px', fontWeight: 700, color: '#0A3A40', textAlign: 'center', marginBottom: '22px', letterSpacing: 0.2 },
    input: { width: '100%', padding: '13px 15px', marginBottom: '18px', backgroundColor: '#F5F7F8', border: '1.5px solid #1D7373', borderRadius: '9px', color: '#042326', fontSize: '15px', outline: 'none', fontWeight: 500, transition: 'border-color 0.2s' },
    button: { width: '100%', padding: '13px 0', backgroundColor: '#1D7373', color: '#F5F7F8', border: 'none', borderRadius: '9px', fontSize: '17px', fontWeight: 600, cursor: 'pointer', display: 'flex', justifyContent: 'center', gap: '8px', marginTop: 6, boxShadow: '0 2px 8px #E6EAEA', transition: 'background 0.2s' },
    linkText: { color: '#4a5568', textAlign: 'center', marginTop: '22px', fontSize: '15px' },
    link: { color: '#1D7373', textDecoration: 'underline', fontWeight: 600 },
    error: { backgroundColor: '#FEE2E2', color: '#B91C1C', padding: '10px', borderRadius: '7px', marginBottom: '15px', fontSize: '15px', textAlign: 'center', border: '1.5px solid #FCA5A5', fontWeight: 500 }
  };

  return (
    <div style={s.container}>
      <div style={s.card}>
        <div style={{textAlign:'center', marginBottom:'8px'}}>
          <UserPlus size={44} color="#1D7373" style={{ background: '#F5F7F8', borderRadius: 12, padding: 6, boxShadow: '0 2px 8px #E6EAEA' }} />
        </div>
        <h2 style={s.title}>Crear Cuenta</h2>
        {errors.map((error, i) => (
          <div key={i} style={s.error}>{error}</div>
        ))}
        <form onSubmit={handleSubmit} autoComplete="off">
          <input
            type="text"
            placeholder="Nombre completo"
            style={s.input}
            onChange={(e) => setNombre(e.target.value)}
            required
            onFocus={e => e.target.style.borderColor = '#107361'}
            onBlur={e => e.target.style.borderColor = '#1D7373'}
          />
          <input
            type="email"
            placeholder="Correo electrónico"
            style={s.input}
            onChange={(e) => setEmail(e.target.value)}
            required
            onFocus={e => e.target.style.borderColor = '#107361'}
            onBlur={e => e.target.style.borderColor = '#1D7373'}
          />
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              style={s.input}
              onChange={(e) => setPassword(e.target.value)}
              required
              onFocus={e => e.target.style.borderColor = '#107361'}
              onBlur={e => e.target.style.borderColor = '#1D7373'}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              style={{
                position: 'absolute',
                right: 10,
                top: 0,
                bottom: 0,
                margin: 'auto',
                height: 32,
                width: 32,
                background: 'none',
                border: 'none',
                color: '#1D7373',
                cursor: 'pointer',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPassword ? (
                // Ojo cerrado
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1D7373" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display:'block'}}><path d="M17.94 17.94A10.06 10.06 0 0 1 12 20c-5 0-9.27-3.11-11-8 1.09-2.86 3.05-5.13 5.61-6.44"/><path d="M1 1l22 22"/><path d="M9.53 9.53A3.5 3.5 0 0 0 12 15.5c1.93 0 3.5-1.57 3.5-3.5a3.5 3.5 0 0 0-5.97-2.47"/></svg>
              ) : (
                // Ojo abierto
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1D7373" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display:'block'}}><ellipse cx="12" cy="12" rx="10" ry="7"/><circle cx="12" cy="12" r="3"/></svg>
              )}
            </button>
          </div>
          <button type="submit" style={s.button}>Registrarse</button>
        </form>
        <p style={s.linkText}>
          ¿Ya tienes cuenta? <Link to="/login" style={s.link}>Inicia Sesión</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;