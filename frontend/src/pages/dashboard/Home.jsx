import { Users, UserCheck, Box, CreditCard, Building2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import apiClient from "../../services/apiClient";
import PlanInfo from "../../components/PlanInfo";

const Home = () => {
  // Estilos "inline" simulando Tailwind
  const s = {
    header: { marginBottom: '30px' },
    title: { fontSize: '28px', color: '#111827', fontWeight: 'bold' },
    subtitle: { color: '#6B7280', fontSize: '16px' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '30px' },
    card: { backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' },
    cardLabel: { fontSize: '14px', color: '#6B7280', fontWeight: '500' },
    cardValue: { fontSize: '30px', fontWeight: 'bold', color: '#111827' },
    cardDesc: { fontSize: '12px', color: '#6B7280', marginTop: '5px' },
    iconBox: { padding: '8px', borderRadius: '8px', backgroundColor: '#ECFDF5', color: '#059669' },
    
    section: { backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
    sectionTitle: { fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' },
    infoGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' },
    label: { display: 'block', fontSize: '13px', color: '#6B7280', marginBottom: '5px' },
    value: { fontSize: '16px', color: '#111827', fontWeight: '500' },
    badge: { display: 'inline-block', padding: '4px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: '600', backgroundColor: '#D1FAE5', color: '#065F46' }
  };

  const { user } = useAuth();
  const [plan, setPlan] = useState(null);
  const [empresa, setEmpresa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      if (user?.rol === 'adminmicroempresa' && user?.microempresa?.id_microempresa) {
        try {
          // Obtener datos de la microempresa actualizados
          const empresaRes = await apiClient.get(`/microempresas/${user.microempresa.id_microempresa}`);
          setEmpresa(empresaRes.data);
        } catch {
          setError("No se pudo cargar la información de la microempresa");
        }
        try {
          // Obtener plan actual
          const planRes = await apiClient.get(`/suscripciones/microempresa/${user.microempresa.id_microempresa}/plan`);
          setPlan(planRes.data);
        } catch {
          setError("No se pudo cargar el plan actual");
        }
        setLoading(false);
      } else {
        setLoading(false);
      }
    }
    fetchData();
  }, [user]);

  if (user?.rol === 'adminmicroempresa') {
    return (
      <div style={{ background: '#F5F7F8', minHeight: '100vh', padding: '40px 0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ marginBottom: 30 }}>
            <h1 style={{ fontSize: 28, color: '#0A3A40', fontWeight: 'bold', marginBottom: 0 }}>Dashboard</h1>
            <p style={{ color: '#1D7373', fontSize: 16, marginTop: 6 }}>Vista general de tu microempresa</p>
          </div>
          {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}
          <>
            <div style={{
              background: '#fff',
              borderRadius: 16,
              border: '1.5px solid #E6EAEA',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              padding: '32px 36px',
              marginBottom: 24,
              display: 'flex',
              flexDirection: 'column',
              gap: 18
            }}>
              <div style={{ display: 'flex', alignItems: 'center', fontSize: 20, color: '#0A3A40', fontWeight: 600, marginBottom: 18 }}>
                <Building2 size={24} style={{ marginRight: 10 }} /> Información de la microempresa
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '32px 60px',
                alignItems: 'start',
                fontSize: 16
              }}>
                {/* Logo, nombre y croquis en la misma fila */}
                <div style={{ gridColumn: '1 / 3', display: 'flex', alignItems: 'center', gap: 32 }}>
                  {/* Logo y nombre */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                    {empresa?.logo && (
                      <img
                        src={empresa.logo.startsWith('http') ? empresa.logo : `http://localhost:8000/${empresa.logo}`}
                        alt="Logo"
                        style={{ width: 80, height: 80, borderRadius: 16, objectFit: 'cover', background: '#f3f3f3', border: '1px solid #e6eaea' }}
                      />
                    )}
                    <div>
                      <div style={{ color: '#1D7373', fontWeight: 500, marginBottom: 2 }}>Nombre</div>
                      <div style={{ color: '#0A3A40', fontWeight: 700, fontSize: 26 }}>{empresa?.nombre || '-'}</div>
                    </div>
                  </div>
                  {/* Croquis de ubicación */}
                  {empresa?.latitud && empresa?.longitud && (
                    <div style={{ minWidth: 280, maxWidth: 380, marginLeft: 'auto' }}>
                      <div style={{ color: '#1D7373', fontWeight: 500, marginBottom: 8, textAlign: 'right' }}>Croquis de ubicación</div>
                      <div style={{ borderRadius: 12, overflow: 'hidden', border: '1.5px solid #E6EAEA', width: 320, height: 260, marginLeft: 'auto' }}>
                        <iframe
                          title="Mapa de ubicación"
                          width="320"
                          height="260"
                          frameBorder="0"
                          style={{ border: 0, display: 'block' }}
                          src={`https://www.openstreetmap.org/export/embed.html?bbox=${empresa.longitud-0.001}%2C${empresa.latitud-0.001}%2C${empresa.longitud+0.001}%2C${empresa.latitud+0.001}&layer=mapnik&marker=${empresa.latitud}%2C${empresa.longitud}&zoom=18`}
                          allowFullScreen
                        ></iframe>
                      </div>
                      <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2, textAlign: 'right' }}>
                        Lat: {empresa.latitud} | Lng: {empresa.longitud}
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <div style={{ color: '#1D7373', fontWeight: 500, marginBottom: 2 }}>NIT</div>
                  <div style={{ color: '#0A3A40', fontWeight: 700, fontSize: 26 }}>{empresa?.nit || '-'}</div>
                </div>
                <div>
                  <div style={{ color: '#1D7373', fontWeight: 500, marginBottom: 2 }}>Dirección</div>
                  <div style={{ color: '#0A3A40', fontWeight: 700, fontSize: 26 }}>{empresa?.direccion || '-'}</div>
                </div>
                <div>
                  <div style={{ color: '#1D7373', fontWeight: 500, marginBottom: 2 }}>Teléfono</div>
                  <div style={{ color: '#0A3A40', fontWeight: 700, fontSize: 26 }}>{empresa?.telefono || '-'}</div>
                </div>
                <div>
                  <div style={{ color: '#1D7373', fontWeight: 500, marginBottom: 2 }}>Moneda</div>
                  <div style={{ color: '#0A0A0A', fontWeight: 700, fontSize: 26, display: 'flex', alignItems: 'center', gap: 10 }}>
                    {(() => {
                      const currency = empresa?.moneda;
                      const labelStyle = { color: '#0A0A0A', fontWeight: 700 };
                      switch (currency) {
                        case 'USD':
                          return <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><svg width="28" height="28" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="12" fill="#1D7373"/><text x="12" y="18" textAnchor="middle" fontSize="18" fill="#fff" fontWeight="bold">$</text></svg><span style={labelStyle}>USD</span></span>;
                        case 'EUR':
                          return <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><svg width="28" height="28" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="12" fill="#1D7373"/><text x="12" y="18" textAnchor="middle" fontSize="18" fill="#fff" fontWeight="bold">€</text></svg><span style={labelStyle}>EUR</span></span>;
                        case 'JPY':
                          return <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><svg width="28" height="28" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="12" fill="#1D7373"/><text x="12" y="18" textAnchor="middle" fontSize="18" fill="#fff" fontWeight="bold">¥</text></svg><span style={labelStyle}>JPY</span></span>;
                        case 'GBP':
                          return <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><svg width="28" height="28" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="12" fill="#1D7373"/><text x="12" y="18" textAnchor="middle" fontSize="18" fill="#fff" fontWeight="bold">£</text></svg><span style={labelStyle}>GBP</span></span>;
                        case 'AUD':
                          return <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><svg width="28" height="28" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="12" fill="#1D7373"/><text x="12" y="18" textAnchor="middle" fontSize="13" fill="#fff" fontWeight="bold">A$</text></svg><span style={labelStyle}>AUD</span></span>;
                        case 'CAD':
                          return <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><svg width="28" height="28" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="12" fill="#1D7373"/><text x="12" y="18" textAnchor="middle" fontSize="13" fill="#fff" fontWeight="bold">C$</text></svg><span style={labelStyle}>CAD</span></span>;
                        case 'CHF':
                          return <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><svg width="28" height="28" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="12" fill="#1D7373"/><text x="12" y="18" textAnchor="middle" fontSize="13" fill="#fff" fontWeight="bold">Fr</text></svg><span style={labelStyle}>CHF</span></span>;
                        case 'CNY':
                          return <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><svg width="28" height="28" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="12" fill="#1D7373"/><text x="12" y="18" textAnchor="middle" fontSize="18" fill="#fff" fontWeight="bold">元</text></svg><span style={labelStyle}>CNY</span></span>;
                        case 'HKD':
                          return <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><svg width="28" height="28" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="12" fill="#1D7373"/><text x="12" y="18" textAnchor="middle" fontSize="13" fill="#fff" fontWeight="bold">HK$</text></svg><span style={labelStyle}>HKD</span></span>;
                        case 'INR':
                          return <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><svg width="28" height="28" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="12" fill="#1D7373"/><text x="12" y="18" textAnchor="middle" fontSize="18" fill="#fff" fontWeight="bold">₹</text></svg><span style={labelStyle}>INR</span></span>;
                        case 'BOB':
                          return <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><svg width="28" height="28" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="12" fill="#1D7373"/><text x="12" y="18" textAnchor="middle" fontSize="13" fill="#fff" fontWeight="bold">Bs</text></svg><span style={labelStyle}>BOB</span></span>;
                        default:
                          return <span style={labelStyle}>{empresa?.moneda || '-'}</span>;
                      }
                    })()}
                  </div>
                </div>
                <div>
                  <div style={{ color: '#1D7373', fontWeight: 500, marginBottom: 2 }}>Activo</div>
                  <span style={{
                    display: 'inline-block',
                    padding: '4px 14px',
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 700,
                    background: empresa?.activo ? '#1D7373' : '#F87171',
                    color: '#fff',
                    marginTop: 2
                  }}>{empresa?.activo ? 'Activo' : 'Inactivo'}</span>
                </div>
                <div>
                  <div style={{ color: '#1D7373', fontWeight: 500, marginBottom: 2 }}>Fecha de registro</div>
                  <div style={{ color: '#0A3A40', fontWeight: 700, fontSize: 18 }}>{empresa?.fecha_registro ? new Date(empresa.fecha_registro).toLocaleDateString() : '-'}</div>
                </div>
                <div>
                  <div style={{ color: '#1D7373', fontWeight: 500, marginBottom: 2 }}>Rubro</div>
                  <div style={{ color: '#0A3A40', fontWeight: 700, fontSize: 18 }}>{empresa?.rubro?.nombre || '-'}</div>
                  {empresa?.rubro?.descripcion && (
                    <div style={{ color: '#6B7280', fontSize: 13, marginTop: 2 }}>{empresa.rubro.descripcion}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Sección tipo de atención */}
            <div style={{
              background: '#F9FAFB',
              borderRadius: 12,
              border: '1.5px solid #E6EAEA',
              boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
              padding: '20px 32px',
              marginBottom: 32,
              display: 'flex',
              alignItems: 'center',
              gap: 18,
              maxWidth: 500
            }}>
              <span style={{ fontSize: 18, color: '#0A3A40', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="12" fill="#1D7373"/><path d="M8 12h8M12 8v8" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
                Tipo de atención:
              </span>
              <span style={{ fontSize: 17, color: '#0A3A40', fontWeight: 700, background: '#E0F2F1', borderRadius: 8, padding: '4px 16px' }}>
                {empresa?.tipo_atencion || 'No especificado'}
              </span>
            </div>
          </>
        </div>
      </div>
    );
  }
  // Otros roles: vista por defecto
  return (
    <div>
      <div style={s.header}>
        <h1 style={s.title}>Dashboard</h1>
        <p style={s.subtitle}>Vista general de tu microempresa</p>
      </div>
      {/* Cards Superiores */}
      <div style={s.grid}>
        <Card title="Total Usuarios" value="3" icon={Users} desc="Todos los roles" styles={s} />
        <Card title="Usuarios Activos" value="2" icon={UserCheck} desc="Acceso permitido" styles={s} />
        <Card title="Límite de Usuarios" value="10" icon={Box} desc="Según tu plan" styles={s} />
        <Card title="Plan Actual" value="Profesional" icon={CreditCard} desc="Facturación mensual" styles={s} />
      </div>
    </div>
  );
};

// Componente pequeño para las tarjetas
const Card = ({ title, value, icon, desc, styles }) => (
  <div style={styles.card}>
    <div style={styles.cardHeader}>
      <span style={styles.cardLabel}>{title}</span>
      <div style={styles.iconBox}>{icon && icon({ size: 20 })}</div>
    </div>
    <div style={styles.cardValue}>{value}</div>
    {/* El valor del plan puede ser texto largo, por eso no lo forzamos a numero */}
    {desc && <div style={styles.cardDesc}>{desc}</div>}
  </div>
);

export default Home;