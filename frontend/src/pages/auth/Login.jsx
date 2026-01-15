import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const { signin, errors, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
    <div style={{ minHeight: '100vh', background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px #0002', padding: 40, minWidth: 340, maxWidth: 380 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontWeight: 700, fontSize: 28, color: '#10B981', marginBottom: 8 }}>Iniciar Sesión</div>
          <div style={{ color: '#6B7280', fontSize: 15 }}>Accede a tu cuenta para continuar</div>
        </div>
        {errors.map((error, i) => (
          <div key={i} style={{ background: '#F87171', color: 'white', padding: '10px', borderRadius: 8, marginBottom: 10 }}>{error}</div>
        ))}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <label style={{ color: '#374151', fontWeight: 500 }}>Email</label>
          <input
            type="email"
            placeholder="Ej: admin@empresa.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ padding: '12px', borderRadius: 8, border: '1px solid #D1D5DB', fontSize: 15 }}
          />
          <label style={{ color: '#374151', fontWeight: 500 }}>Contraseña</label>
          <input
            type="password"
            placeholder="Tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ padding: '12px', borderRadius: 8, border: '1px solid #D1D5DB', fontSize: 15 }}
          />
          <button type="submit" style={{ padding: '12px', background: '#10B981', color: 'white', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 16, marginTop: 8 }}>
            Ingresar
          </button>
        </form>
        <div style={{ marginTop: 18, textAlign: 'center', fontSize: 14 }}>
          <Link to="/recovery" style={{ color: '#10B981', textDecoration: 'underline' }}>¿Olvidaste tu contraseña?</Link>
        </div>
        <div style={{ marginTop: 10, textAlign: 'center', fontSize: 14 }}>
          ¿No tienes cuenta? <Link to="/register" style={{ color: '#10B981', textDecoration: 'underline' }}>Regístrate</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;