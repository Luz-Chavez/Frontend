import { Building2, CheckCircle, XCircle, CreditCard } from "lucide-react";

const Dashboard = () => {
  // Estilos idénticos a tu captura
  const s = {
    container: { maxWidth: '1200px' },
    header: { marginBottom: '30px' },
    title: { fontSize: '28px', color: '#111827', fontWeight: 'bold', marginBottom: '5px' },
    subtitle: { color: '#6B7280', fontSize: '16px' },
    
    // Grid de 4 columnas
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' },
    
    // Tarjetas
    card: { backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '160px' },
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
    cardLabel: { fontSize: '14px', color: '#4B5563', fontWeight: '500' },
    cardValue: { fontSize: '32px', fontWeight: 'bold', color: '#111827', marginTop: '10px' },
    cardFooter: { fontSize: '13px', color: '#6B7280', marginTop: 'auto' },
    
    // Iconos de colores específicos
    iconBuilding: { color: '#059669' }, // Verde
    iconCheck: { color: '#059669' }, 
    iconX: { color: '#DC2626' }, // Rojo
    iconCard: { color: '#059669' } 
  };

  return (
    <div style={s.container}>
      <div style={s.header}>
        <h1 style={s.title}>Dashboard SuperAdmin</h1>
        <p style={s.subtitle}>Vista general del sistema SaaS</p>
      </div>

      <div style={s.grid}>
        {/* Card 1 */}
        <div style={s.card}>
          <div style={s.cardHeader}>
            <span style={s.cardLabel}>Total Microempresas</span>
            <Building2 size={20} style={s.iconBuilding} />
          </div>
          <div style={s.cardValue}>3</div>
          <div style={s.cardFooter}>Todas las microempresas registradas</div>
        </div>

        {/* Card 2 */}
        <div style={s.card}>
          <div style={s.cardHeader}>
            <span style={s.cardLabel}>Microempresas Activas</span>
            <CheckCircle size={20} style={s.iconCheck} />
          </div>
          <div style={s.cardValue}>2</div>
          <div style={s.cardFooter}>Con suscripción activa</div>
        </div>

        {/* Card 3 */}
        <div style={s.card}>
          <div style={s.cardHeader}>
            <span style={s.cardLabel}>Microempresas Inactivas</span>
            <XCircle size={20} style={s.iconX} />
          </div>
          <div style={s.cardValue}>1</div>
          <div style={s.cardFooter}>Suspendidas o sin suscripción</div>
        </div>

        {/* Card 4 */}
        <div style={s.card}>
          <div style={s.cardHeader}>
            <span style={s.cardLabel}>Planes Activos</span>
            <CreditCard size={20} style={s.iconCard} />
          </div>
          <div style={s.cardValue}>3</div>
          <div style={s.cardFooter}>Planes disponibles</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;