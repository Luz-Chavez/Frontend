import { useAuth } from "../../context/AuthContext";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, CreditCard, User, Building2, ShieldCheck, LogOut } from "lucide-react";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const styles = {
    sidebar: { width: '260px', height: '100vh', backgroundColor: '#002F2C', color: 'white', display: 'flex', flexDirection: 'column', position: 'fixed', left: 0, top: 0 },
    logoArea: { padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)' },
    logoTitle: { fontSize: '18px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' },
    subtitle: { fontSize: '12px', color: '#9CA3AF', marginTop: '4px' },
    nav: { flex: 1, padding: '20px 10px' },
    link: { display: 'flex', alignItems: 'center', padding: '12px 16px', color: '#D1D5DB', textDecoration: 'none', borderRadius: '8px', marginBottom: '4px', transition: 'all 0.2s' },
    activeLink: { backgroundColor: '#10B981', color: 'white', fontWeight: '500' },
    footer: { padding: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' },
    logoutBtn: { background: 'transparent', border: 'none', color: '#D1D5DB', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', width: '100%', padding: '10px' }
  };

  const menus = {
    superadmin: [
      { icon: LayoutDashboard, text: "Dashboard", path: "/superadmin/dashboard" },
      { icon: Building2, text: "Microempresas", path: "/superadmin/companies" },
      { icon: CreditCard, text: "Planes", path: "/superadmin/plans" },
      { icon: ShieldCheck, text: "SuperAdmins", path: "/superadmin/admins" },
    ],
    adminmicroempresa: [
      { icon: LayoutDashboard, text: "Dashboard", path: "/dashboard" },
      { icon: User, text: "Mi Perfil", path: "/dashboard/profile" },
      { icon: Building2, text: "Editar Empresa", path: "/dashboard/company-edit" },
      { icon: ShieldCheck, text: "Admins de la Empresa", path: "/dashboard/admins" },
      { icon: Users, text: "Vendedores", path: "/dashboard/vendedores" },
      { icon: CreditCard, text: "Suscripción", path: "/dashboard/subscription" },
    ],
    vendedor: [
      { icon: User, text: "Mi Perfil", path: "/seller/profile" },
    ]
  };

  // Protección contra error si user.rol no coincide
  const currentMenu = user && menus[user.rol] ? menus[user.rol] : [];

  return (
    <div style={styles.sidebar}>
      <div style={styles.logoArea}>
        <div style={styles.logoTitle}>
          <Building2 size={28} color="#10B981" />
          <span>{user?.role === 'superadmin' ? 'Sistema SaaS' : 'Tienda La Esquina'}</span>
        </div>
        <div style={styles.subtitle}>
          {user?.role === 'superadmin' ? 'Panel SuperAdmin' : 'Panel de Admin'}
        </div>
      </div>

      <nav style={styles.nav}>
        {currentMenu.map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={index} 
              to={item.path} 
              style={{ ...styles.link, ...(isActive ? styles.activeLink : {}) }}
            >
              <item.icon size={20} style={{ marginRight: '12px' }} />
              {item.text}
            </Link>
          );
        })}
      </nav>

      <div style={styles.footer}>
        <button onClick={logout} style={styles.logoutBtn}>
          <LogOut size={20} />
          Cerrar sesión
        </button>
      </div>
    </div>
  );
};

export default Sidebar;