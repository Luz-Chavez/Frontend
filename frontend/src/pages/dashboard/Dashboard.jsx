import { useAuth } from "../../context/AuthContext";

function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      background: 'linear-gradient(135deg, #0A3A40 0%, #1D7373 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 0
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '20px',
        boxShadow: '0 4px 32px rgba(16, 115, 97, 0.10)',
        padding: '40px 32px',
        minWidth: 370,
        maxWidth: 500,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <div style={{ fontWeight: 700, fontSize: 28, color: '#0A3A40', marginBottom: 8, textAlign: 'center' }}>
          Panel de Control (Dashboard)
        </div>
        <div style={{ color: '#1D7373', fontWeight: 700, fontSize: 22, marginBottom: 18, textAlign: 'center' }}>
          {user?.microempresa?.nombre ? user.microempresa.nombre : 'Empresa'}
        </div>
        <div style={{ color: '#0A3A40', fontSize: 16, marginBottom: 28, textAlign: 'center' }}>
          Esta es una ruta protegida. Solo puedes verla si has iniciado sesión.
        </div>
        <button
          onClick={() => logout()}
          style={{
            padding: '12px 32px',
            background: '#F87171',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 16,
            marginTop: 8,
            width: '100%',
            boxShadow: '0 2px 8px rgba(16, 115, 97, 0.08)',
            cursor: 'pointer',
            transition: 'background 0.2s'
          }}
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}

export default Dashboard;