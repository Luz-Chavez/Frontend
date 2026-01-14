import { useAuth } from "../../context/AuthContext";

function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div style={{ padding: '20px' }}>
      <h1>Panel de Control (Dashboard)</h1>
      <h2>Bienvenido, {user?.username || user?.email}</h2>
      
      <p>Esta es una ruta protegida. Solo puedes verla si has iniciado sesión.</p>

      <button 
        onClick={() => logout()} 
        style={{ padding: '10px', backgroundColor: 'red', color: 'white', border: 'none', cursor: 'pointer' }}
      >
        Cerrar Sesión
      </button>
    </div>
  );
}

export default Dashboard;