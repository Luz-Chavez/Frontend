import { Users, UserCheck, Box, CreditCard } from "lucide-react";

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

      {/* Información de la empresa */}
      <div style={s.section}>
        <div style={s.sectionTitle}>
          <Building2 size={20} /> Información de la microempresa
        </div>
        <div style={s.infoGrid}>
          <div>
            <span style={s.label}>Nombre</span>
            <div style={s.value}>Tienda La Esquina</div>
          </div>
          <div>
            <span style={s.label}>NIT / Razón Social</span>
            <div style={s.value}>123456789-0</div>
          </div>
          <div>
            <span style={s.label}>Estado</span>
            <span style={s.badge}>Activo</span>
          </div>
          <div>
            <span style={s.label}>Plan</span>
            <div style={s.value}>Plan Profesional</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente pequeño para las tarjetas
const Card = ({ title, value, icon: Icon, desc, styles }) => (
  <div style={styles.card}>
    <div style={styles.cardHeader}>
      <span style={styles.cardLabel}>{title}</span>
      <div style={styles.iconBox}><Icon size={20} /></div>
    </div>
    <div style={styles.cardValue}>{value}</div>
    {/* El valor del plan puede ser texto largo, por eso no lo forzamos a numero */}
    {desc && <div style={styles.cardDesc}>{desc}</div>}
  </div>
);

import { Building2 } from "lucide-react"; // Importar el icono que faltaba
export default Home;