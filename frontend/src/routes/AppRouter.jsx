import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthProvider from "../context/AuthContext.jsx";
import RoleGuard from "../guards/RoleGuard";

// Layouts
import DashboardLayout from "../layouts/DashboardLayout";

// --- PÁGINAS DEL PORTAL (CLIENTE) ---
import Portal from "../pages/portal/Portal";
import Checkout from "../pages/portal/Checkout";

// Páginas de Autenticación
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Recovery from "../pages/auth/Recovery";
import ResetPassword from "../pages/auth/ResetPassword";

// Páginas del Dashboard Admin (Flujo B)
import DashboardHome from "../pages/dashboard/Home";      
import Users from "../pages/dashboard/Users";
import Subscription from "../pages/dashboard/Subscription";
import ClientesList from "../pages/dashboard/ClientesList";
import EditCliente from "../pages/dashboard/EditCliente";
import ClienteCreate from "../pages/dashboard/ClienteCreate";
import ProductosVista from "../pages/dashboard/Productos";
import CategoriasVista from "../pages/dashboard/Categorias";
import Notificaciones from "../pages/Notificaciones";
import Profile from "../pages/dashboard/Profile";
// import CompanyEdit from "../pages/dashboard/CompanyEdit";
import EditMicroempresa from "../views/EditMicroempresa";
import AdminsDashboard from "../pages/dashboard/Admins";
import Vendedores from "../pages/dashboard/Vendedores";
import VendedorCreate from "../pages/dashboard/VendedorCreate";
import Ventas from "../pages/dashboard/Ventas";

// --- IMPORTACIONES NUEVAS (MÓDULOS DE COMPRAS Y PROVEEDORES) ---
import Proveedores from "../pages/dashboard/Proveedores";
import ComprasList from "../pages/dashboard/ComprasList";
import NuevaCompra from "../pages/dashboard/NuevaCompra"; // El archivo que creamos antes
import Reportes from "../pages/dashboard/Reportes"; // El archivo de gráficos

// Páginas SuperAdmin (Flujo D)
import SuperDashboard from "../pages/superadmin/Dashboard"; 
import Companies from "../pages/superadmin/Companies";
import PlansManager from "../pages/superadmin/PlansManager";
import Admins from "../pages/superadmin/Admins";
import AllClientes from "../pages/superadmin/AllClientes";
import ClientesByMicroempresa from "../pages/superadmin/ClientesByMicroempresa";
import SuperadminRegister from "../pages/superadmin/SuperadminRegister";
import ProductosGlobalSuperadmin from "../pages/superadmin/ProductosGlobalSuperadmin";
import CategoriasGlobalSuperadmin from "../pages/superadmin/CategoriasGlobalSuperadmin";

// Páginas Onboarding (Flujo A)
import OnboardingProfile from "../pages/onboarding/UserProfile"; 
import Plans from "../pages/onboarding/Plans";
import Payment from "../pages/onboarding/Payment";
import CreateMicroempresaOnboarding from "../pages/onboarding/CreateMicroempresaOnboarding";

// Páginas Vendedor (Flujo C)
import SellerDashboard from "../pages/seller/SellerDashboard";
import SellerProfile from "../pages/seller/Profile";
import SellerSubscription from "../pages/seller/SellerSubscription";

// Páginas User Simple
import UserProfile from "../pages/user/UserProfile";
import UserPlanDetail from "../pages/user/UserPlanDetail";

function AppRouter() {
   return (
   <AuthProvider>
         <BrowserRouter>
            <Routes>
               
               {/* --- RUTAS PÚBLICAS (PORTAL Y AUTH) --- */}
               <Route path="/portal/:id_microempresa" element={<Portal />} />
               <Route path="/portal/:id_microempresa/checkout" element={<Checkout />} />
               <Route path="/" element={<Navigate to="/login" replace />} />
               <Route path="/login" element={<Login />} />
               <Route path="/register" element={<Register />} />
               <Route path="/register-superadmin" element={<SuperadminRegister />} />
               <Route path="/recovery" element={<Recovery />} />
               <Route path="/auth/reset-password" element={<ResetPassword />} />
               <Route path="/unauthorized" element={<h1>No tienes permiso</h1>} />

               {/* Ruta global para notificaciones */}
               <Route element={<DashboardLayout />}>
                  <Route path="/notificaciones" element={<Notificaciones />} />
               </Route>

               {/* 🟡 FLUJO A: Onboarding SOLO para usuario */}
               <Route element={<RoleGuard allowedRoles={['usuario']} requireCompany={false} />}>
                  <Route path="/onboarding/profile" element={<OnboardingProfile />} />
                  <Route path="/onboarding/plans" element={<Plans />} />
                  <Route path="/onboarding/payment" element={<Payment />} />
                  <Route path="/onboarding/create-microempresa" element={<CreateMicroempresaOnboarding />} />
               </Route>

               {/* 🔵 FLUJO C: Vendedor */}
               <Route element={<RoleGuard allowedRoles={['vendedor']} />}>
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

               {/* 🟢 FLUJO B: Admin CON Microempresa (AQUÍ AGREGAMOS TUS RUTAS) */}
               <Route element={<RoleGuard allowedRoles={['adminmicroempresa']} requireCompany={true} />}>
                  <Route element={<DashboardLayout />}>
                      <Route path="/dashboard" element={<DashboardHome />} />
                      <Route path="/dashboard/users" element={<Users />} />
                      <Route path="/dashboard/subscription" element={<Subscription />} />
                      <Route path="/dashboard/profile" element={<Profile />} />
                      <Route path="/dashboard/company-edit" element={<EditMicroempresa />} />
                      <Route path="/dashboard/admins" element={<AdminsDashboard />} />
                      
                      {/* Vendedores y Clientes */}
                      <Route path="/dashboard/vendedores" element={<Vendedores />} />
                      <Route path="/dashboard/vendedores/crear" element={<VendedorCreate />} />
                      <Route path="/dashboard/clientes" element={<ClientesList />} />
                      <Route path="/dashboard/clientes/activos" element={<ClientesList tipo="activos" />} />
                      <Route path="/dashboard/clientes/inactivos" element={<ClientesList tipo="inactivos" />} />
                      <Route path="/dashboard/clientes/crear" element={<ClienteCreate />} />
                      <Route path="/dashboard/clientes/editar/:id_cliente" element={<EditCliente />} />
                      
                      {/* Productos y Categorías */}
                      <Route path="/dashboard/productos" element={<ProductosVista />} />
                      <Route path="/dashboard/categorias" element={<CategoriasVista />} />
                      <Route path="/dashboard/ventas" element={<Ventas />} />

                      {/* --- NUEVAS RUTAS DE GESTIÓN (Tus agregados) --- */}
                      
                      {/* 1. Proveedores */}
                      <Route path="/dashboard/proveedores" element={<Proveedores />} />
                      
                      {/* 2. Compras (Historial y Registro) */}
                      <Route path="/dashboard/compras" element={<ComprasList />} />
                      <Route path="/dashboard/compras/nueva" element={<NuevaCompra />} />

                      {/* 3. Reportes */}
                      <Route path="/dashboard/reportes" element={<Reportes />} />
                      
                  </Route>
               </Route>

               {/* 🔴 FLUJO D: SuperAdmin */}
               <Route element={<RoleGuard allowedRoles={['superadmin']} />}>
                  <Route element={<DashboardLayout />}>
                      <Route path="/superadmin/dashboard" element={<SuperDashboard />} />
                      <Route path="/superadmin/companies" element={<Companies />} />
                      <Route path="/superadmin/companies/:id_microempresa/clientes" element={<ClientesByMicroempresa />} />
                      <Route path="/superadmin/clientes" element={<AllClientes />} />
                      <Route path="/superadmin/productos" element={<ProductosGlobalSuperadmin />} />
                      <Route path="/superadmin/categorias" element={<CategoriasGlobalSuperadmin />} />
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