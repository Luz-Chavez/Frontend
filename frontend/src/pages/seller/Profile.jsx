import { useAuth } from "../../context/AuthContext";
import { User, Mail, Shield, Award, KeyRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { recoverPassword } from "../../api/user.api";

const SellerProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const s = {
    container: { maxWidth: '600px', margin: '0 auto' },
    card: { backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden', border: '1px solid #E5E7EB' },
    
    header: { backgroundColor: '#065F46', padding: '30px', textAlign: 'center', color: 'white' },
    avatar: { width: '80px', height: '80px', backgroundColor: 'white', borderRadius: '50%', margin: '0 auto 15px auto', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#065F46', fontSize: '30px', fontWeight: 'bold' },
    name: { fontSize: '22px', fontWeight: 'bold', marginBottom: '5px' },
    roleBadge: { backgroundColor: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: '99px', fontSize: '12px' },

    body: { padding: '30px' },
    item: { display: 'flex', alignItems: 'center', gap: '15px', padding: '15px 0', borderBottom: '1px solid #F3F4F6' },
    label: { fontSize: '13px', color: '#6B7280', display: 'block' },
    value: { fontSize: '16px', color: '#1F2937', fontWeight: '500' },
    
    note: { backgroundColor: '#F0FDF4', padding: '15px', borderRadius: '8px', marginTop: '20px', color: '#166534', fontSize: '13px', lineHeight: '1.5' }
  };

  const handleChangePassword = async () => {
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const response = await recoverPassword(user?.email);
      // El backend responde con { reset_token: "string" }
      const token = response?.data?.reset_token;
      if (token) {
        setSuccess("Token recibido. Redirigiendo...");
        setTimeout(() => {
          navigate("/auth/reset-password", { state: { token } });
        }, 1200);
      } else {
        setError("No se recibió el token. Revisa tu correo o intenta más tarde.");
      }
    } catch {
      setError("No se pudo solicitar el cambio. Intenta más tarde.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.container}>
      <h1 style={{fontSize:'24px', fontWeight:'bold', marginBottom:'20px', color:'#111827'}}>Mi Perfil</h1>
      <div style={s.card}>
        <div style={s.header}>
            <div style={s.avatar}>{user?.username ? user.username.charAt(0).toUpperCase() : "U"}</div>
            <div style={s.name}>{user?.username || "Usuario"}</div>
            <span style={s.roleBadge}>Vendedor Autorizado</span>
        </div>
        <div style={s.body}>
            <div style={s.item}>
                <Mail size={20} color="#9CA3AF" />
                <div>
                    <span style={s.label}>Correo Electrónico</span>
                    <div style={s.value}>{user?.email || "Sin correo"}</div>
                </div>
            </div>
            <div style={s.item}>
                <Shield size={20} color="#9CA3AF" />
                <div>
                    <span style={s.label}>Rol en el sistema</span>
                    <div style={s.value}>Vendedor (Acceso Limitado)</div>
                </div>
            </div>
            <div style={{...s.item, borderBottom:'none'}}>
                <Award size={20} color="#9CA3AF" />
                <div>
                    <span style={s.label}>Estado</span>
                    <div style={{...s.value, color:'#059669'}}>Activo</div>
                </div>
            </div>
            <div style={{marginTop:'18px', textAlign:'center'}}>
              <button
                onClick={handleChangePassword}
                disabled={loading}
                style={{background:'#107361', color:'white', border:'none', borderRadius:'8px', padding:'10px 22px', fontWeight:'600', fontSize:'15px', cursor:'pointer', display:'inline-flex', alignItems:'center', gap:'8px'}}>
                <KeyRound size={18}/> Cambiar contraseña
              </button>
              {error && <div style={{color:'#EF4444', fontWeight:500, marginTop:8}}>{error}</div>}
              {success && <div style={{color:'#107361', fontWeight:600, marginTop:8}}>{success}</div>}
            </div>
            <div style={s.note}>
                <strong>Nota:</strong> Como vendedor, solo tienes acceso a esta sección y al módulo de ventas (próximamente).
            </div>
        </div>
      </div>
    </div>
  );
};

export default SellerProfile;