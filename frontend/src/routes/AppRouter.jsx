import AllClientes from "../pages/superadmin/AllClientes";
import ClientesByMicroempresa from "../pages/superadmin/ClientesByMicroempresa";
import SellerDashboard from "../pages/seller/SellerDashboard";
import SuperadminRegister from "../pages/superadmin/SuperadminRegister";
import UserProfile from "../pages/user/UserProfile";
import CreateMicroempresaOnboarding from "../pages/onboarding/CreateMicroempresaOnboarding";
import AdminMicroempresaProfile from "../pages/dashboard/AdminMicroempresaProfile";
import UserPlanDetail from "../pages/user/UserPlanDetail";
               {/* 🟣 FLUJO USER SIMPLE */}
               <Route element={<RoleGuard allowedRoles={['user']} />}>
                  <Route path="/user/profile" element={<UserProfile />} />
               </Route>
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthProvider from "../context/AuthContext.jsx";
import RoleGuard from "../guards/RoleGuard";

// Layouts
import DashboardLayout from "../layouts/DashboardLayout";

// Páginas de Autenticación
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Recovery from "../pages/auth/Recovery";
import ResetPassword from "../pages/auth/ResetPassword";

// Páginas del Dashboard Admin (Flujo B)
import DashboardHome from "../pages/dashboard/Home";      
import Users from "../pages/dashboard/Users";
import Subscription from "../pages/dashboard/Subscription";
import CompanyProfile from "../pages/dashboard/CompanyProfile"; // ✅ Importado
import ClientesList from "../pages/dashboard/ClientesList";
import EditCliente from "../pages/dashboard/EditCliente";
import ClienteCreate from "../pages/dashboard/ClienteCreate";
// Las siguientes vistas pueden reutilizar ClientesList con props o crear componentes separados si se requiere.

// Páginas SuperAdmin (Flujo D)
import SuperDashboard from "../pages/superadmin/Dashboard"; 
import Companies from "../pages/superadmin/Companies";
import PlansManager from "../pages/superadmin/PlansManager";
import Admins from "../pages/superadmin/Admins";
import Profile from "../pages/dashboard/Profile";
import AdminsDashboard from "../pages/dashboard/Admins";
import Vendedores from "../pages/dashboard/Vendedores";
import CompanyEdit from "../pages/dashboard/CompanyEdit";
import VendedorCreate from "../pages/dashboard/VendedorCreate";

// Páginas Onboarding (Flujo A)
import OnboardingProfile from "../pages/onboarding/UserProfile"; 
import Plans from "../pages/onboarding/Plans";
import Payment from "../pages/onboarding/Payment";

// Páginas Vendedor (Flujo C)
import SellerProfile from "../pages/seller/Profile";
import SellerSubscription from "../pages/seller/SellerSubscription";

function AppRouter() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* --- RUTAS PÚBLICAS --- */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register-superadmin" element={<SuperadminRegister />} />
          <Route path="/recovery" element={<Recovery />} />
          <Route path="/auth/reset-password" element={<ResetPassword />} />
          <Route path="/unauthorized" element={<h1>No tienes permiso</h1>} />

          {/* 🟡 FLUJO A: Onboarding SOLO para usuario */}
          <Route element={<RoleGuard allowedRoles={['usuario']} requireCompany={false} />}>
             <Route path="/onboarding/profile" element={<OnboardingProfile />} />
             <Route path="/onboarding/plans" element={<Plans />} />
             <Route path="/onboarding/payment" element={<Payment />} />
             <Route path="/onboarding/create-microempresa" element={<CreateMicroempresaOnboarding />} />
          </Route>

          {/* 🔵 FLUJO C: Vendedor */}
          <Route element={<RoleGuard allowedRoles={['vendedor']} />}>
             {/* Usamos Layout para que tenga Sidebar y pueda cerrar sesión */}
             <Route element={<DashboardLayout />}>
                <Route path="/seller/profile" element={<SellerProfile />} />
                <Route path="/seller/dashboard" element={<SellerDashboard />} />
                <Route path="/seller/subscription" element={<SellerSubscription />} />
                <Route path="/seller/clientes" element={<ClientesList />} />
                <Route path="/seller/clientes/activos" element={<ClientesList tipo="activos" />} />
                <Route path="/seller/clientes/inactivos" element={<ClientesList tipo="inactivos" />} />
                <Route path="/seller/clientes/crear" element={<ClienteCreate />} />
                <Route path="/seller/clientes/editar/:id_cliente" element={<EditCliente />} />
             </Route>
          </Route>

          {/* 🟢 FLUJO B: Admin CON Microempresa */}
          <Route element={<RoleGuard allowedRoles={['adminmicroempresa']} requireCompany={true} />}>
             <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<DashboardHome />} />
                <Route path="/dashboard/users" element={<Users />} />
                <Route path="/dashboard/subscription" element={<Subscription />} />
                <Route path="/dashboard/profile" element={<Profile />} />
                <Route path="/dashboard/company-edit" element={<CompanyEdit />} />
                <Route path="/dashboard/admins" element={<AdminsDashboard />} />
                <Route path="/dashboard/vendedores" element={<Vendedores />} />
                <Route path="/dashboard/vendedores/crear" element={<VendedorCreate />} />
                <Route path="/dashboard/clientes" element={<ClientesList />} />
                <Route path="/dashboard/clientes/activos" element={<ClientesList tipo="activos" />} />
                <Route path="/dashboard/clientes/inactivos" element={<ClientesList tipo="inactivos" />} />
                <Route path="/dashboard/clientes/crear" element={<ClienteCreate />} />
                <Route path="/dashboard/clientes/editar/:id_cliente" element={<EditCliente />} />
             </Route>
          </Route>

          {/* 🔴 FLUJO D: SuperAdmin */}
          <Route element={<RoleGuard allowedRoles={['superadmin']} />}>
             <Route element={<DashboardLayout />}>
                <Route path="/superadmin/dashboard" element={<SuperDashboard />} />
                <Route path="/superadmin/companies" element={<Companies />} />
                <Route path="/superadmin/companies/:id_microempresa/clientes" element={<ClientesByMicroempresa />} />
                <Route path="/superadmin/clientes" element={<AllClientes />} />
                <Route path="/superadmin/plans" element={<PlansManager />} />
                <Route path="/superadmin/admins" element={<Admins />} />
             </Route>
          </Route>

               {/* 🟣 FLUJO USUARIO SIMPLE */}
               <Route element={<RoleGuard allowedRoles={['usuario']} />}>
                  <Route path="/user/profile" element={<UserProfile />} />
                  <Route path="/user/plan/:id_plan" element={<UserPlanDetail />} />
               </Route>
            </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default AppRouter;