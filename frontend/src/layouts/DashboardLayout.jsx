import Sidebar from "../components/layout/Sidebar";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F3F4F6' }}>
      {/* Sidebar fija */}
      <Sidebar />

      {/* Contenido principal dinámico */}
      <div style={{ marginLeft: '260px', width: '100%', padding: '32px 40px' }}>
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;