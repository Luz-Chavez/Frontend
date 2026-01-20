import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function RoleGuard({ allowedRoles, requireCompany = null }) {
  const { loading, isAuthenticated, user } = useAuth();

  // Log visual y de consola para depuración
  if (loading) {
    console.log("[RoleGuard] loading...", { loading, isAuthenticated, user });
    return <h1>Cargando...</h1>;
  }
  if (!isAuthenticated) {
    console.log("[RoleGuard] No autenticado", { loading, isAuthenticated, user });
    return <h2 style={{color: 'red'}}>No autenticado. Redirigiendo a login...</h2>;
  }

  // 1. Verificar Rol
  if (allowedRoles && !allowedRoles.includes(user.rol)) {
    console.log("[RoleGuard] Rol no permitido", { user, allowedRoles, userRolType: typeof user.rol });
    return (
      <div style={{color: 'red', fontSize: 18, padding: 24}}>
        <div>Rol no permitido:</div>
        <div><b>user.rol:</b> [{String(user.rol)}] (tipo: {typeof user.rol})</div>
        <div><b>allowedRoles:</b> {JSON.stringify(allowedRoles)}</div>
      </div>
    );
  }

  // 2. Verificar Estado de Empresa (Solo para Admins de Microempresa)
  if (user.rol === 'adminmicroempresa') {
    if (requireCompany !== null) {
      // Si la ruta requiere empresa (True) y NO la tiene -> Mandar a Onboarding
      if (requireCompany === true && !user.has_microempresa) {
        console.log("[RoleGuard] Adminmicroempresa sin microempresa. Redirigiendo a onboarding", user);
        return <h2 style={{color: 'red'}}>Adminmicroempresa sin microempresa. Redirigiendo a onboarding...</h2>;
      }
      // Si la ruta es de Onboarding (requireCompany = False) y YA tiene empresa -> Mandar al Dashboard
      if (requireCompany === false && user.has_microempresa) {
        console.log("[RoleGuard] Adminmicroempresa ya tiene microempresa. Redirigiendo a dashboard", user);
        return <h2 style={{color: 'red'}}>Ya tienes microempresa. Redirigiendo a dashboard...</h2>;
      }
    }
  }

  console.log("[RoleGuard] Autorizado, renderizando Outlet", { user, allowedRoles, requireCompany });
  return <Outlet />;
}

export default RoleGuard;