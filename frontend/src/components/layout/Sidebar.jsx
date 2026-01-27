import { useAuth } from "../../context/AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
  Truck,
  ShoppingCart,
  BarChart3,
  UserCheck,
  Bell,
  Store
} from "lucide-react";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const styles = {
    sidebar: {
      width: '260px',
      height: '100vh',
      backgroundColor: '#0A3A40',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      left: 0,
      top: 0
    },
    logoArea: {
      padding: '24px',
      borderBottom: '1px solid rgba(255,255,255,0.1)',
      background: 'linear-gradient(135deg, #0A3A40 0%, #1D7373 100%)'
    },
    logoTitle: {
      fontSize: '18px',
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    subtitle: {
      fontSize: '12px',
      color: 'rgba(255,255,255,0.7)',
      marginTop: '4px'
    },
    nav: {
      flex: 1,
      padding: '16px 10px',
      overflowY: 'auto'
    },
    sectionTitle: {
      fontSize: '11px',
      fontWeight: '600',
      color: 'rgba(255,255,255,0.4)',
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
      padding: '12px 16px 8px',
      marginTop: '8px'
    },
    link: {
      display: 'flex',
      alignItems: 'center',
      padding: '11px 16px',
      color: 'rgba(255,255,255,0.75)',
      textDecoration: 'none',
      borderRadius: '8px',
      marginBottom: '2px',
      transition: 'all 0.2s',
      fontSize: '14px'
    },
    activeLink: {
      backgroundColor: 'rgba(255,255,255,0.12)',
      color: 'white',
      fontWeight: '500'
    },
    hoverLink: {
      backgroundColor: 'rgba(255,255,255,0.1)'
    },
    footer: {
      padding: '16px',
      borderTop: '1px solid rgba(255,255,255,0.1)'
    },
    logoutBtn: {
      background: 'transparent',
      border: '1px solid rgba(255,255,255,0.2)',
      color: 'rgba(255,255,255,0.8)',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      cursor: 'pointer',
      width: '100%',
      padding: '12px',
      borderRadius: '8px',
      fontSize: '14px',
      transition: 'all 0.2s'
    },
    userInfo: {
      padding: '12px 16px',
      background: 'rgba(0,0,0,0.2)',
      borderRadius: '8px',
      marginBottom: '12px'
    },
    userName: {
      fontSize: '14px',
      fontWeight: '600',
      color: 'white'
    },
    userEmail: {
      fontSize: '12px',
      color: 'rgba(255,255,255,0.6)'
    }
  };

  const menus = {
    superadmin: [
      // Sección Principal
      { type: 'section', title: 'Principal' },
      { icon: Bell, text: "Notificaciones", path: "/superadmin/notificaciones" },
      { icon: LayoutDashboard, text: "Dashboard", path: "/superadmin/dashboard" },

      // Sección Gestión de Empresas
      { type: 'section', title: 'Empresas' },
      { icon: Building2, text: "Microempresas", path: "/superadmin/companies" },
      { icon: Store, text: "Rubros", path: "/superadmin/rubros" },
      { icon: CreditCard, text: "Planes", path: "/superadmin/plans" },

      // Sección Usuarios
      { type: 'section', title: 'Usuarios' },
      { icon: ShieldCheck, text: "SuperAdmins", path: "/superadmin/admins" },
      { icon: UserCheck, text: "Admins de Empresas", path: "/superadmin/gestion?tab=admins" },
      { icon: Users, text: "Vendedores", path: "/superadmin/gestion?tab=vendedores" },
      { icon: Users, text: "Clientes", path: "/superadmin/clientes" },

      // Sección Catálogo
      { type: 'section', title: 'Catálogo' },
      { icon: Box, text: "Productos", path: "/superadmin/productos" },
      { icon: Tags, text: "Categorías", path: "/superadmin/categorias" },
      { icon: Truck, text: "Proveedores", path: "/superadmin/gestion?tab=proveedores" },
    ],
    adminmicroempresa: [
      { type: 'section', title: 'Principal' },
      { icon: LayoutDashboard, text: "Dashboard", path: "/dashboard" },
      { icon: User, text: "Mi Perfil", path: "/dashboard/profile" },
      { icon: Building2, text: "Editar Empresa", path: "/dashboard/company-edit" },

      { type: 'section', title: 'Personal' },
      { icon: ShieldCheck, text: "Admins", path: "/dashboard/admins" },
      { icon: Users, text: "Vendedores", path: "/dashboard/vendedores" },

      { type: 'section', title: 'Comercial' },
      { icon: Users, text: "Clientes", path: "/dashboard/clientes" },
      { icon: ShoppingBag, text: "Ventas / Pedidos", path: "/dashboard/ventas" },
      { icon: Truck, text: "Proveedores", path: "/dashboard/proveedores" },
      { icon: ShoppingCart, text: "Compras", path: "/dashboard/compras" },

      { type: 'section', title: 'Inventario' },
      { icon: Box, text: "Productos", path: "/dashboard/productos" },
      { icon: Tags, text: "Categorías", path: "/dashboard/categorias" },

      { type: 'section', title: 'Reportes' },
      { icon: BarChart3, text: "Reportes", path: "/dashboard/reportes" },
      { icon: CreditCard, text: "Suscripción", path: "/dashboard/subscription" },
    ],
    vendedor: [
      { type: 'section', title: 'Principal' },
      { icon: LayoutDashboard, text: "Dashboard", path: "/seller/dashboard" },
      { icon: User, text: "Mi Perfil", path: "/seller/profile" },

      { type: 'section', title: 'Comercial' },
      { icon: Users, text: "Clientes", path: "/seller/clientes" },
      { icon: ShoppingBag, text: "Ventas / Pedidos", path: "/seller/ventas" },

      { type: 'section', title: 'Catálogo (Solo ver)' },
      { icon: Box, text: "Productos", path: "/seller/productos" },
      { icon: Tags, text: "Categorías", path: "/seller/categorias" },
      { icon: Truck, text: "Proveedores", path: "/seller/proveedores" },

      { type: 'section', title: 'Reportes' },
      { icon: BarChart3, text: "Reportes", path: "/seller/reportes" },
      { icon: CreditCard, text: "Suscripción", path: "/seller/subscription" },
    ]
  };

  const currentMenu = user && menus[user.rol] ? menus[user.rol] : [];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => {
    if (path.includes('?')) {
      return location.pathname + location.search === path;
    }
    return location.pathname === path;
  };

  return (
    <div style={styles.sidebar}>
      <div style={styles.logoArea}>
        <div style={styles.logoTitle}>
          <Building2 size={28} color="#1D7373" />
          <span>
            {user?.rol === 'superadmin'
              ? 'Sistoys'
              : (user?.rol === 'adminmicroempresa' || user?.rol === 'vendedor')
                ? (user?.microempresa?.nombre || 'Empresa')
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
        {/* Usuario info */}
        {user && (
          <div style={styles.userInfo}>
            <div style={styles.userName}>{user.nombre}</div>
            <div style={styles.userEmail}>{user.email}</div>
          </div>
        )}

        {/* Notificaciones */}
        <Link
          to="/notificaciones"
          style={{
            ...styles.link,
            ...(location.pathname === "/notificaciones" ? styles.activeLink : {})
          }}
        >
          <Bell size={18} style={{ marginRight: 12 }} />
          Notificaciones
        </Link>

        {/* Menú dinámico */}
        {currentMenu.map((item, index) => {
          if (item.type === 'section') {
            return (
              <div key={index} style={styles.sectionTitle}>
                {item.title}
              </div>
            );
          }

          const active = isActive(item.path);
          return (
            <Link
              key={index}
              to={item.path}
              style={{
                ...styles.link,
                ...(active ? styles.activeLink : {})
              }}
            >
              <item.icon size={18} style={{ marginRight: 12 }} />
              {item.text}
            </Link>
          );
        })}
      </nav>

      <div style={styles.footer}>
        <button
          onClick={handleLogout}
          style={styles.logoutBtn}
          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,107,53,0.2)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
        >
          <LogOut size={18} />
          Cerrar sesión
        </button>
      </div>
    </div>
  );
};

export default Sidebar;