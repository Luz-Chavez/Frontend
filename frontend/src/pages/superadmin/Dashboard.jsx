
import { useEffect, useState } from "react";
import { Building2, CheckCircle, XCircle, CreditCard, TrendingUp } from "lucide-react";
import {
  getTotalMicroempresas,
  getTotalMicroempresasActivas,
  getTotalMicroempresasInactivas,
  getTotalPlanesActivos
} from "../../api/dashboard.api";

// Paleta de colores para fondo claro
const palette = {
  darkBg: '#0A3A40',
  primary: '#0A3A40',
  secondary: '#1D7373',
  accent: '#FF6B35',
  white: '#FFFFFF',
  lightBg: '#F8FAFC',
  gray: '#64748B',
  border: '#E2E8F0',
  green: '#10B981',
  red: '#EF4444',
};

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    total: 0,
    activas: 0,
    inactivas: 0,
    planes: 0,
  });

  const s = {
    container: { maxWidth: '1200px' },
    header: { marginBottom: '32px' },
    title: {
      fontSize: '28px',
      color: palette.darkBg,
      fontWeight: '700',
      marginBottom: '6px',
    },
    subtitle: { color: palette.gray, fontSize: '15px' },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: '20px'
    },
    card: {
      backgroundColor: palette.white,
      padding: '24px',
      borderRadius: '12px',
      border: `1px solid ${palette.border}`,
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: '150px',
      transition: 'all 0.2s ease',
    },
    cardHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start'
    },
    cardLabel: {
      fontSize: '14px',
      color: palette.gray,
      fontWeight: '500'
    },
    cardValue: {
      fontSize: '32px',
      fontWeight: '700',
      color: palette.darkBg,
      marginTop: '10px'
    },
    cardFooter: {
      fontSize: '13px',
      color: palette.gray,
      marginTop: 'auto'
    },
    iconBox: {
      width: '40px',
      height: '40px',
      borderRadius: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    welcomeCard: {
      background: `linear-gradient(135deg, ${palette.primary} 0%, ${palette.secondary} 100%)`,
      padding: '28px 32px',
      borderRadius: '16px',
      marginBottom: '24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    welcomeTitle: {
      fontSize: '22px',
      fontWeight: '700',
      color: '#FFFFFF',
      marginBottom: '8px',
    },
    welcomeText: {
      fontSize: '14px',
      color: 'rgba(255,255,255,0.8)',
      maxWidth: '400px',
    },
    welcomeIcon: {
      width: '70px',
      height: '70px',
      background: 'rgba(255,255,255,0.15)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }
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

  const cards = [
    {
      label: 'Total Microempresas',
      value: data.total,
      footer: 'Empresas registradas',
      icon: Building2,
      iconBg: 'rgba(10, 58, 64, 0.1)',
      iconColor: palette.primary,
    },
    {
      label: 'Microempresas Activas',
      value: data.activas,
      footer: 'Con suscripción activa',
      icon: CheckCircle,
      iconBg: 'rgba(16, 185, 129, 0.1)',
      iconColor: palette.green,
    },
    {
      label: 'Microempresas Inactivas',
      value: data.inactivas,
      footer: 'Suspendidas o sin plan',
      icon: XCircle,
      iconBg: 'rgba(239, 68, 68, 0.1)',
      iconColor: palette.red,
    },
    {
      label: 'Planes Activos',
      value: data.planes,
      footer: 'Planes disponibles',
      icon: CreditCard,
      iconBg: 'rgba(29, 115, 115, 0.1)',
      iconColor: palette.secondary,
    },
  ];

  return (
    <div style={s.container}>
      {/* Welcome Card */}
      <div style={s.welcomeCard}>
        <div>
          <h2 style={s.welcomeTitle}>¡Bienvenido, SuperAdmin! 👋</h2>
          <p style={s.welcomeText}>
            Gestiona todas las microempresas, usuarios, productos y más desde el panel lateral.
          </p>
        </div>
        <div style={s.welcomeIcon}>
          <TrendingUp size={32} color="#FFFFFF" />
        </div>
      </div>

      {/* Header */}
      <div style={s.header}>
        <h1 style={s.title}>Dashboard</h1>
        <p style={s.subtitle}>Resumen general del sistema</p>
      </div>

      {/* Stats Grid */}
      <div style={s.grid}>
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              style={s.card}
            >
              <div style={s.cardHeader}>
                <span style={s.cardLabel}>{card.label}</span>
                <div style={{ ...s.iconBox, background: card.iconBg }}>
                  <Icon size={20} color={card.iconColor} />
                </div>
              </div>
              <div style={s.cardValue}>
                {loading ? '...' : card.value}
              </div>
              <div style={s.cardFooter}>{card.footer}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;