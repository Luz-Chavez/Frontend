import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const { signin, errors, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Lógica de redirección compartida
  const redirectBasedOnRole = (currentUser) => {
    if (currentUser.rol === 'superadmin') navigate('/superadmin/dashboard');
    else if (currentUser.rol === 'adminmicroempresa') navigate('/dashboard');
    else if (currentUser.rol === 'vendedor') navigate('/seller/profile');
    else if (currentUser.rol === 'usuario') navigate('/onboarding/profile');
    else navigate('/');
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      redirectBasedOnRole(user);
    }
  }, [isAuthenticated, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userLogged = await signin({ email, password });
    if (userLogged) {
      redirectBasedOnRole(userLogged);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0A3A40 0%, #1D7373 100%)'
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '20px',
        boxShadow: '0 4px 32px rgba(16, 115, 97, 0.10)',
        padding: '40px 32px',
        minWidth: 370,
        maxWidth: 410,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <div style={{
          background: '#1D7373',
          width: 64,
          height: 64,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 24
        }}>
          {/* Icono simple tipo edificio/empresa */}
          <svg width="36" height="36" fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="12" fill="none" />
            <rect x="6" y="9" width="12" height="9" rx="2" fill="#fff" />
            <rect x="9" y="12" width="2" height="2" rx="1" fill="#1D7373" />
            <rect x="13" y="12" width="2" height="2" rx="1" fill="#1D7373" />
            <rect x="9" y="15" width="2" height="2" rx="1" fill="#1D7373" />
            <rect x="13" y="15" width="2" height="2" rx="1" fill="#1D7373" />
          </svg>
        </div>
        <div style={{ fontWeight: 500, fontSize: 28, color: '#0A3A40', marginBottom: 8, textAlign: 'center' }}>Bienvenido</div>
        <div style={{ color: '#0A3A40', fontSize: 17, marginBottom: 28, textAlign: 'center' }}>
          Ingresa tus credenciales para acceder al sistema
        </div>
        {errors.map((error, i) => (
          <div key={i} style={{ background: '#F87171', color: 'white', padding: '10px', borderRadius: 8, marginBottom: 10, textAlign: 'center', width: '100%' }}>{error}</div>
        ))}
        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <label style={{ color: '#0A3A40', fontWeight: 500, marginBottom: 4 }}>Email</label>
          <input
            type="email"
            placeholder="usuario@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              padding: '12px',
              borderRadius: 8,
              border: '1px solid #E6EAEA',
              fontSize: 16,
              marginBottom: 12,
              background: '#F5F7F8',
              color: '#0A3A40',
              outline: 'none'
            }}
          />
          <label style={{ color: '#0A3A40', fontWeight: 500, marginBottom: 4 }}>Contraseña</label>
          <div style={{ position: 'relative', marginBottom: 12 }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder=""
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                padding: '12px',
                borderRadius: 8,
                border: '1px solid #E6EAEA',
                fontSize: 16,
                width: '100%',
                background: '#F5F7F8',
                color: '#0A3A40',
                outline: 'none'
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              style={{
                position: 'absolute',
                right: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: '#1D7373',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: 14
              }}
            >
              {showPassword ? 'Ocultar' : 'Mostrar'}
            </button>
          </div>
          <div style={{ textAlign: 'right', marginBottom: 18 }}>
            <Link to="/recovery" style={{ color: '#1D7373', textDecoration: 'none', fontSize: 15, fontWeight: 500 }}>
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <button type="submit" style={{
            padding: '12px',
            background: '#1D7373',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 18,
            marginTop: 8,
            width: '100%',
            boxShadow: '0 2px 8px rgba(16, 115, 97, 0.08)'
          }}>
            Iniciar sesión
          </button>
        </form>
        <div style={{ marginTop: 18, textAlign: 'center', fontSize: 15, color: '#0A3A40' }}>
          ¿No tienes cuenta?{' '}
          <Link to="/register" style={{ color: '#1D7373', textDecoration: 'none', fontWeight: 600 }}>Crear cuenta</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;