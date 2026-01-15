import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { User, LogOut, ArrowRight, Building2 } from "lucide-react";

function UserProfile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Estilos limpios y profesionales
  const s = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '20px' },
    card: { backgroundColor: 'white', maxWidth: '500px', width: '100%', borderRadius: '16px', padding: '40px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', textAlign: 'center' },
    
    iconBox: { width: '60px', height: '60px', backgroundColor: '#ECFDF5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto', color: '#059669' },
    
    title: { fontSize: '24px', fontWeight: 'bold', color: '#111827', marginBottom: '10px' },
    subtitle: { color: '#6B7280', marginBottom: '30px', fontSize: '15px' },
    
    infoBox: { backgroundColor: '#F9FAFB', padding: '20px', borderRadius: '12px', border: '1px solid #E5E7EB', marginBottom: '30px', textAlign: 'left' },
    infoLabel: { fontSize: '12px', color: '#6B7280', fontWeight: '600', textTransform: 'uppercase', marginBottom: '4px' },
    infoValue: { fontSize: '16px', color: '#111827', fontWeight: '500', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' },
    
    btnPrimary: { backgroundColor: '#059669', color: 'white', width: '100%', padding: '14px', borderRadius: '8px', border: 'none', fontSize: '16px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'background 0.2s' },
    
    btnLogout: { marginTop: '20px', background: 'transparent', border: 'none', color: '#6B7280', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', margin: '20px auto 0 auto' }
  };

  return (
    <div style={s.container}>
      <div style={s.card}>
        {/* Icono Principal */}
        <div style={s.iconBox}>
          <Building2 size={32} />
        </div>

        <h1 style={s.title}>¡Hola, {user.username}!</h1>
        <p style={s.subtitle}>
          Has creado tu cuenta de administrador, pero aún falta un paso importante.
        </p>

        {/* Datos del Usuario */}
        <div style={s.infoBox}>
          <div style={s.infoLabel}>Tu Usuario</div>
          <div style={s.infoValue}><User size={18} color="#9CA3AF"/> {user.email}</div>
          
          <div style={{...s.infoLabel, marginTop: '15px'}}>Estado de la cuenta</div>
          <div style={s.infoValue}>
             <span style={{backgroundColor:'#FEF3C7', color:'#92400E', padding:'2px 8px', borderRadius:'6px', fontSize:'13px'}}>
                Sin Microempresa
             </span>
          </div>
        </div>

        {/* Botón de Acción Principal */}
        <button 
          onClick={() => navigate("/onboarding/plans")}
          style={s.btnPrimary}
        >
           🚀 Crear mi Microempresa <ArrowRight size={18} />
        </button>

        {/* Botón Salir */}
        <button onClick={logout} style={s.btnLogout}>
          <LogOut size={16} /> Cerrar Sesión
        </button>
      </div>
    </div>
  );
}

export default UserProfile;