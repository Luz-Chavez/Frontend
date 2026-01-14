import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function RoleGuard({ allowedRoles, requireCompany = null }) {
  const { loading, isAuthenticated, user } = useAuth();

  if (loading) return <h1>Cargando...</h1>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // 1. Verificar Rol
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // 2. Verificar Estado de Empresa (Solo para Admins de Microempresa)
  if (requireCompany !== null && user.role === 'admin_microempresa') {
    
    // Si la ruta requiere empresa (True) y NO la tiene -> Mandar a Onboarding
    if (requireCompany === true && !user.has_microempresa) {
      return <Navigate to="/onboarding/profile" replace />;
    }
    
    // Si la ruta es de Onboarding (requireCompany = False) y YA tiene empresa -> Mandar al Dashboard
    if (requireCompany === false && user.has_microempresa) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <Outlet />;
}

export default RoleGuard;