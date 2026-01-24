import { useAuth } from "../../context/AuthContext";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  User, 
  Building2, 
  ShieldCheck, 
  LogOut, 
  Box, 
  Tags, 
  ShoppingBag, 
  Truck,          // Icono para Proveedores
  ShoppingCart,   // Icono para Compras
  BarChart3       // Icono para Reportes
} from "lucide-react";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  
  // Los logs deben ir después de inicializar location
  console.log("[Sidebar] user:", user);
  console.log("[Sidebar] location:", location.pathname);

  const styles = {
    sidebar: { width: '260px', height: '100vh', backgroundColor: '#002F2C', color: 'white', display: 'flex', flexDirection: 'column', position: 'fixed', left: 0, top: 0 },
    logoArea: { padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)' },
    logoTitle: { fontSize: '18px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' },
    subtitle: { fontSize: '12px', color: '#9CA3AF', marginTop: '4px' },
    nav: { flex: 1, padding: '20px 10px', overflowY: 'auto' }, // Added overflowY for smaller screens if menu grows
    link: { display: 'flex', alignItems: 'center', padding: '12px 16px', color: '#D1D5DB', textDecoration: 'none', borderRadius: '8px', marginBottom: '4px', transition: 'all 0.2s' },
    activeLink: { backgroundColor: '#10B981', color: 'white', fontWeight: '500' },
    footer: { padding: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' },
    logoutBtn: { background: 'transparent', border: 'none', color: '#D1D5DB', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', width: '100%', padding: '10px' }
  };

  const menus = {
    superadmin: [
      { icon: LayoutDashboard, text: "Dashboard", path: "/superadmin/dashboard" },
      { icon: Building2, text: "Microempresas", path: "/superadmin/companies" },
      { icon: Users, text: "Clientes", path: "/superadmin/clientes" },
      { icon: Box, text: "Productos", path: "/superadmin/productos" },
      { icon: CreditCard, text: "Planes", path: "/superadmin/plans" },
      { icon: Tags, text: "Categorías", path: "/superadmin/categorias" },
      { icon: ShieldCheck, text: "SuperAdmins", path: "/superadmin/admins" },
    ],
    adminmicroempresa: [
      { icon: LayoutDashboard, text: "Dashboard", path: "/dashboard" },
      { icon: User, text: "Mi Perfil", path: "/dashboard/profile" },
      { icon: Building2, text: "Editar Empresa", path: "/dashboard/company-edit" },
      
      // Gestión de Personal
      { icon: ShieldCheck, text: "Admins de la Empresa", path: "/dashboard/admins" },
      { icon: Users, text: "Vendedores", path: "/dashboard/vendedores" },
      
      // Gestión Comercial
      { icon: Users, text: "Clientes", path: "/dashboard/clientes" },
      { icon: ShoppingBag, text: "Ventas / Pedidos", path: "/dashboard/ventas" },

      // --- NUEVOS MÓDULOS ---
      { icon: Truck, text: "Proveedores", path: "/dashboard/proveedores" },
      { icon: ShoppingCart, text: "Compras", path: "/dashboard/compras" },
      
      // Inventario
      { icon: Box, text: "Productos", path: "/dashboard/productos" },
      { icon: Tags, text: "Categorías", path: "/dashboard/categorias" },
      
      // Finanzas y Reportes
      { icon: BarChart3, text: "Reportes", path: "/dashboard/reportes" },
      { icon: CreditCard, text: "Suscripción", path: "/dashboard/subscription" },
    ],
    vendedor: [
      { icon: User, text: "Mi Perfil", path: "/seller/profile" },
      { icon: LayoutDashboard, text: "Dashboard", path: "/seller/dashboard" },
      { icon: CreditCard, text: "Suscripción", path: "/seller/subscription" },
      { icon: Users, text: "Clientes", path: "/seller/clientes" },
    ]
  };

  // Protección contra error si user.rol no coincide
  const currentMenu = user && menus[user.rol] ? menus[user.rol] : [];

  return (
    <div style={styles.sidebar}>
      <div style={styles.logoArea}>
        <div style={styles.logoTitle}>
          <Building2 size={28} color="#10B981" />
          <span>
            {user?.rol === 'superadmin'
              ? 'Sistema SaaS'
              : (user?.rol === 'adminmicroempresa' || user?.rol === 'vendedor')
                ? (user?.microempresa && typeof user.microempresa === 'object' && user.microempresa.nombre
                    ? user.microempresa.nombre
                    : 'Empresa')
                : 'Empresa'}
          </span>
        </div>
        <div style={styles.subtitle}>
          {user?.rol === 'superadmin'
            ? 'Panel SuperAdmin'
            : user?.rol === 'adminmicroempresa'
              ? 'Panel de Admin'
              : user?.rol === 'vendedor'
                ? 'Panel de Vendedor'
                : ''}
        </div>
      </div>

      <nav style={styles.nav}>
        {/* Opción de notificaciones visible para todos */}
        <Link
          to="/notificaciones"
          style={{
            ...styles.link,
            ...(location.pathname === "/notificaciones" ? styles.activeLink : {})
          }}
        >
          <svg style={{ marginRight: 12 }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F5F7F8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          Notificaciones
        </Link>
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