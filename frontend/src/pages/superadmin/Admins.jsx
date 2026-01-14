import { UserPlus, Shield, Power, Mail, Trash2 } from "lucide-react";

const Admins = () => {
  // Datos de ejemplo
  const admins = [
    { id: 1, name: "Sistema Admin", email: "admin@saas.com", role: "SuperAdmin", status: "Activo", lastLogin: "Hace 2 horas" },
    { id: 2, name: "Soporte Técnico", email: "soporte@saas.com", role: "Soporte", status: "Activo", lastLogin: "Ayer" },
    { id: 3, name: "Admin Auditor", email: "auditor@saas.com", role: "Auditor", status: "Inactivo", lastLogin: "Hace 1 semana" },
  ];

  const s = {
    container: { maxWidth: '1200px' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' },
    title: { fontSize: '28px', color: '#111827', fontWeight: 'bold', marginBottom: '5px' },
    subtitle: { color: '#6B7280', fontSize: '16px' },
    
    // Botón principal
    btnCreate: { backgroundColor: '#111827', color: 'white', padding: '10px 20px', borderRadius: '8px', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: '500', fontSize: '14px' },
    
    // Tabla
    card: { backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #E5E7EB', padding: '0', overflow:'hidden' },
    table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' },
    th: { padding: '16px 24px', borderBottom: '1px solid #E5E7EB', backgroundColor: '#F9FAFB', color: '#374151', fontSize: '12px', textTransform: 'uppercase', fontWeight: '600' },
    td: { padding: '16px 24px', borderBottom: '1px solid #F3F4F6', color: '#1F2937', fontSize: '14px', verticalAlign: 'middle' },
    
    // Elementos de la celda
    userCell: { display: 'flex', alignItems: 'center', gap: '12px' },
    avatar: { width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4B5563' },
    userInfo: { display: 'flex', flexDirection: 'column' },
    userName: { fontWeight: '500', color: '#111827' },
    userEmail: { fontSize: '12px', color: '#6B7280' },
    
    badgeActive: { backgroundColor: '#D1FAE5', color: '#065F46', padding: '2px 10px', borderRadius: '99px', fontSize: '12px', fontWeight: '600' },
    badgeInactive: { backgroundColor: '#F3F4F6', color: '#374151', padding: '2px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: '600' },
    
    actions: { display: 'flex', gap: '8px' },
    btnAction: { padding: '6px', borderRadius: '6px', border: '1px solid #E5E7EB', backgroundColor: 'white', cursor: 'pointer', color: '#6B7280', display: 'flex', alignItems: 'center', justifyContent: 'center' }
  };

  return (
    <div style={s.container}>
      <div style={s.header}>
        <div>
           <h1 style={s.title}>Gestión de SuperAdmins</h1>
           <p style={s.subtitle}>Administra los accesos privilegiados del sistema</p>
        </div>
        <button style={s.btnCreate}>
          <UserPlus size={18} /> Nuevo Admin
        </button>
      </div>

      <div style={s.card}>
        <table style={s.table}>
          <thead>
            <tr>
              <th style={s.th}>Administrador</th>
              <th style={s.th}>Rol</th>
              <th style={s.th}>Estado</th>
              <th style={s.th}>Último Acceso</th>
              <th style={s.th}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin.id}>
                <td style={s.td}>
                  <div style={s.userCell}>
                    <div style={s.avatar}><Shield size={18}/></div>
                    <div style={s.userInfo}>
                        <span style={s.userName}>{admin.name}</span>
                        <span style={s.userEmail}>{admin.email}</span>
                    </div>
                  </div>
                </td>
                <td style={s.td}>{admin.role}</td>
                <td style={s.td}>
                   <span style={admin.status === 'Activo' ? s.badgeActive : s.badgeInactive}>
                     {admin.status}
                   </span>
                </td>
                <td style={{...s.td, color:'#6B7280'}}>{admin.lastLogin}</td>
                <td style={s.td}>
                  <div style={s.actions}>
                    <button style={s.btnAction} title="Desactivar"><Power size={16}/></button>
                    <button style={{...s.btnAction, color:'#EF4444', borderColor:'#FECACA'}} title="Eliminar"><Trash2 size={16}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Admins;