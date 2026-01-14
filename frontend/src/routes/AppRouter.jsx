import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import RoleGuard from "../guards/RoleGuard";

// Layouts
import DashboardLayout from "../layouts/DashboardLayout";

// Páginas de Autenticación
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

// Páginas del Dashboard Admin (Flujo B)
import DashboardHome from "../pages/dashboard/Home";      
import Users from "../pages/dashboard/Users";
import Subscription from "../pages/dashboard/Subscription";
import CompanyProfile from "../pages/dashboard/CompanyProfile"; // ✅ Importado

// Páginas SuperAdmin (Flujo D)
import SuperDashboard from "../pages/superadmin/Dashboard"; 
import Companies from "../pages/superadmin/Companies";
import PlansManager from "../pages/superadmin/PlansManager";
import Admins from "../pages/superadmin/Admins";

// Páginas Onboarding (Flujo A)
import OnboardingProfile from "../pages/onboarding/UserProfile"; 
import Plans from "../pages/onboarding/Plans";
import Payment from "../pages/onboarding/Payment";

// Páginas Vendedor (Flujo C)
import SellerProfile from "../pages/seller/Profile";     

function AppRouter() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* --- RUTAS PÚBLICAS --- */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<h1>No tienes permiso</h1>} />

          {/* 🟡 FLUJO A: Admin SIN Microempresa (Onboarding) */}
          <Route element={<RoleGuard allowedRoles={['admin_microempresa']} requireCompany={false} />}>
             {/* Sin DashboardLayout para enfocar en el pago */}
             <Route path="/onboarding/profile" element={<OnboardingProfile />} />
             <Route path="/onboarding/plans" element={<Plans />} />
             <Route path="/onboarding/payment" element={<Payment />} />
          </Route>

          {/* 🔵 FLUJO C: Vendedor */}
          <Route element={<RoleGuard allowedRoles={['vendedor']} />}>
             {/* Usamos Layout para que tenga Sidebar y pueda cerrar sesión */}
             <Route element={<DashboardLayout />}>
                <Route path="/seller/profile" element={<SellerProfile />} />
             </Route>
          </Route>

          {/* 🟢 FLUJO B: Admin CON Microempresa */}
          <Route element={<RoleGuard allowedRoles={['admin_microempresa']} requireCompany={true} />}>
             <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<DashboardHome />} />
                <Route path="/dashboard/users" element={<Users />} />
                <Route path="/dashboard/subscription" element={<Subscription />} />
                <Route path="/dashboard/profile" element={<CompanyProfile />} /> {/* ✅ Ruta Agregada */}
             </Route>
          </Route>

          {/* 🔴 FLUJO D: SuperAdmin */}
          <Route element={<RoleGuard allowedRoles={['superadmin']} />}>
             <Route element={<DashboardLayout />}>
                <Route path="/superadmin/dashboard" element={<SuperDashboard />} />
                <Route path="/superadmin/companies" element={<Companies />} />
                <Route path="/superadmin/plans" element={<PlansManager />} />
                <Route path="/superadmin/admins" element={<Admins />} />
             </Route>
          </Route>

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default AppRouter;