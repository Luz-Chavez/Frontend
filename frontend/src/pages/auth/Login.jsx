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
    if (currentUser.role === 'superadmin') navigate('/superadmin/dashboard');
    else if (currentUser.role === 'vendedor') navigate('/seller/profile');
    else if (currentUser.role === 'admin_microempresa') {
        if (currentUser.has_microempresa) navigate('/dashboard');
        else navigate('/onboarding/profile');
    }
  };

  // Si ya está logueado al entrar, redirigir
  useEffect(() => {
    if (isAuthenticated && user) {
      redirectBasedOnRole(user);
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userLogged = await signin({ email, password });
    
    // Si el login fue exitoso, el AuthContext actualiza el estado
    // y el useEffect de arriba se encargará de redirigir, 
    // O podemos forzarlo aquí con la respuesta mock:
    if (userLogged) {
        redirectBasedOnRole(userLogged);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
      <h2>Iniciar Sesión (Modo Prueba)</h2>
      
      {errors.map((error, i) => (
        <div key={i} style={{ background: 'red', color: 'white', padding: '10px' }}>{error}</div>
      ))}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '300px' }}>
        <input
          type="email"
          placeholder="Ej: admin-sinempresa@test.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: '10px' }}
        />
        <input
          type="password"
          placeholder="Cualquier contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: '10px' }}
        />
        <button type="submit" style={{ padding: '10px', background: 'blue', color: 'white' }}>Ingresar</button>
      </form>
      <p>¿No tienes cuenta? <Link to="/register">Regístrate</Link></p>
    </div>
  );
}

export default Login;