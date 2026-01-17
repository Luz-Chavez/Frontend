
import { useEffect, useState } from "react";
import { Building2, CheckCircle, XCircle, CreditCard } from "lucide-react";
import {
  getTotalMicroempresas,
  getTotalMicroempresasActivas,
  getTotalMicroempresasInactivas,
  getTotalPlanesActivos
} from "../../api/dashboard.api";


const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    total: 0,
    activas: 0,
    inactivas: 0,
    planes: 0,
  });

  // Paleta de colores (puedes centralizar luego)
  const palette = {
    darkBg: '#042326',
    accent1: '#0A3A40',
    accent2: '#0F5959',
    accent3: '#1D7373',
    accent4: '#107361',
    white: '#F5F7F8',
    gray: '#E6EAEA',
    green: '#1D7373',
    red: '#EF4444',
  };

  const s = {
    container: { maxWidth: '1200px' },
    header: { marginBottom: '30px' },
    title: { fontSize: '28px', color: palette.darkBg, fontWeight: 'bold', marginBottom: '5px' },
    subtitle: { color: palette.accent2, fontSize: '16px' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' },
    card: { backgroundColor: palette.white, padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: `1px solid ${palette.gray}`, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '160px' },
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
    cardLabel: { fontSize: '14px', color: palette.accent2, fontWeight: '500' },
    cardValue: { fontSize: '32px', fontWeight: 'bold', color: palette.darkBg, marginTop: '10px' },
    cardFooter: { fontSize: '13px', color: palette.accent2, marginTop: 'auto' },
    iconBuilding: { color: palette.accent4 },
    iconCheck: { color: palette.green },
    iconX: { color: palette.red },
    iconCard: { color: palette.accent3 },
  };

  useEffect(() => {
    Promise.all([
      getTotalMicroempresas(),
      getTotalMicroempresasActivas(),
      getTotalMicroempresasInactivas(),
      getTotalPlanesActivos(),
    ])
      .then(([total, activas, inactivas, planes]) => {
        setData({
          total: total.data.cantidad,
          activas: activas.data.cantidad,
          inactivas: inactivas.data.cantidad,
          planes: planes.data.cantidad,
        });
      })
      .finally(() => setLoading(false));
  }, []);

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
          <div style={s.cardValue}>{loading ? '...' : data.total}</div>
          <div style={s.cardFooter}>Todas las microempresas registradas</div>
        </div>

        {/* Card 2 */}
        <div style={s.card}>
          <div style={s.cardHeader}>
            <span style={s.cardLabel}>Microempresas Activas</span>
            <CheckCircle size={20} style={s.iconCheck} />
          </div>
          <div style={s.cardValue}>{loading ? '...' : data.activas}</div>
          <div style={s.cardFooter}>Con suscripción activa</div>
        </div>

        {/* Card 3 */}
        <div style={s.card}>
          <div style={s.cardHeader}>
            <span style={s.cardLabel}>Microempresas Inactivas</span>
            <XCircle size={20} style={s.iconX} />
          </div>
          <div style={s.cardValue}>{loading ? '...' : data.inactivas}</div>
          <div style={s.cardFooter}>Suspendidas o sin suscripción</div>
        </div>

        {/* Card 4 */}
        <div style={s.card}>
          <div style={s.cardHeader}>
            <span style={s.cardLabel}>Planes Activos</span>
            <CreditCard size={20} style={s.iconCard} />
          </div>
          <div style={s.cardValue}>{loading ? '...' : data.planes}</div>
          <div style={s.cardFooter}>Planes disponibles</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;