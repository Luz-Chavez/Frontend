import { useAuth } from "../../context/AuthContext";

function AdminMicroempresaProfile() {
  const { user } = useAuth();
  // Suponiendo que user.microempresa contiene la info de la microempresa
  const empresa = user?.microempresa || {};

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px #0001", padding: 32 }}>
      <h2>Perfil de Administrador de Microempresa</h2>
      <h3>Información de la Microempresa</h3>
      <ul>
        <li><b>Nombre:</b> {empresa.nombre || "-"}</li>
        <li><b>NIT:</b> {empresa.nit || "-"}</li>
        <li><b>Dirección:</b> {empresa.direccion || "-"}</li>
        <li><b>Teléfono:</b> {empresa.telefono || "-"}</li>
        <li><b>Moneda:</b> {empresa.moneda || "-"}</li>
      </ul>
      <h3>Tu información de usuario</h3>
      <ul>
        <li><b>Nombre:</b> {user?.nombre}</li>
        <li><b>Email:</b> {user?.email}</li>
        <li><b>Rol:</b> {user?.rol}</li>
      </ul>
    </div>
  );
}

export default AdminMicroempresaProfile;
