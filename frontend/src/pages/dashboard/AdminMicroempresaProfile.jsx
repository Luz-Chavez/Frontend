import { useAuth } from "../../context/AuthContext";

function AdminMicroempresaProfile() {
  const { user } = useAuth();
  // Suponiendo que user.microempresa contiene la info de la microempresa
  const empresa = user?.microempresa || {};

  return (
    <div style={{
      maxWidth: 600,
      margin: "40px auto",
      background: "#0A3A40",
      borderRadius: 20,
      boxShadow: "0 4px 32px rgba(16, 115, 97, 0.10)",
      padding: 40,
      color: "#F5F7F8"
    }}>
      <h2 style={{ color: '#1D7373', fontWeight: 700, marginBottom: 18 }}>Perfil de Administrador de Microempresa</h2>
      <h3 style={{ color: '#F5F7F8', fontWeight: 600, marginBottom: 10 }}>Información de la Microempresa</h3>
      <ul style={{ marginBottom: 28 }}>
        <li><b style={{ color: '#1D7373' }}>Nombre:</b> {empresa.nombre || "-"}</li>
        <li><b style={{ color: '#1D7373' }}>NIT:</b> {empresa.nit || "-"}</li>
        <li><b style={{ color: '#1D7373' }}>Dirección:</b> {empresa.direccion || "-"}</li>
        <li><b style={{ color: '#1D7373' }}>Teléfono:</b> {empresa.telefono || "-"}</li>
        <li><b style={{ color: '#1D7373' }}>Moneda:</b> {empresa.moneda || "-"}</li>
      </ul>
      <h3 style={{ color: '#F5F7F8', fontWeight: 600, marginBottom: 10 }}>Tu información de usuario</h3>
      <ul>
        <li><b style={{ color: '#1D7373' }}>Nombre:</b> {user?.nombre}</li>
        <li><b style={{ color: '#1D7373' }}>Email:</b> {user?.email}</li>
        <li><b style={{ color: '#1D7373' }}>Rol:</b> {user?.rol}</li>
      </ul>
    </div>
  );
}

export default AdminMicroempresaProfile;
