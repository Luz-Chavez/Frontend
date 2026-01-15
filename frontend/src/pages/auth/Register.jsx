import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";

function Register() {
  const { signup, errors } = useAuth();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await signup({ nombre, email, password });
    // Redirigir solo si el registro fue exitoso (sin errores)
    setTimeout(() => {
      if (errors.length === 0 && result !== false) {
        navigate("/login");
      }
    }, 100);
  };

  const s = {
    container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111827' },
    card: { width: '100%', maxWidth: '400px', padding: '40px', backgroundColor: '#1F2937', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)' },
    title: { fontSize: '24px', fontWeight: 'bold', color: 'white', textAlign: 'center', marginBottom: '30px' },
    input: { width: '100%', padding: '12px', marginBottom: '15px', backgroundColor: '#374151', border: '1px solid #4B5563', borderRadius: '8px', color: 'white', fontSize: '14px', outline: 'none' },
    button: { width: '100%', padding: '12px', backgroundColor: '#2563EB', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', display: 'flex', justifyContent: 'center', gap: '8px', transition: 'background 0.2s' },
    linkText: { color: '#9CA3AF', textAlign: 'center', marginTop: '20px', fontSize: '14px' },
    link: { color: '#60A5FA', textDecoration: 'none' },
    error: { backgroundColor: '#7F1D1D', color: '#FECACA', padding: '10px', borderRadius: '6px', marginBottom: '15px', fontSize: '14px', textAlign: 'center' }
  };

  return (
    <div style={s.container}>
      <div style={s.card}>
        <div style={{textAlign:'center', marginBottom:'10px'}}><UserPlus size={40} color="#2563EB"/></div>
        <h2 style={s.title}>Crear Cuenta</h2>
        
        {errors.map((error, i) => (
          <div key={i} style={s.error}>{error}</div>
        ))}

        <form onSubmit={handleSubmit}>
             <input type="text" placeholder="Nombre completo" style={s.input} 
               onChange={(e) => setNombre(e.target.value)} required />
                 
          <input type="email" placeholder="Correo electrónico" style={s.input} 
                 onChange={(e) => setEmail(e.target.value)} required />
                 
          <input type="password" placeholder="Contraseña" style={s.input} 
                 onChange={(e) => setPassword(e.target.value)} required />

          <button type="submit" style={s.button}> Registrarse </button>
        </form>

        <p style={s.linkText}>
          ¿Ya tienes cuenta? <Link to="/login" style={s.link}>Inicia Sesión</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;