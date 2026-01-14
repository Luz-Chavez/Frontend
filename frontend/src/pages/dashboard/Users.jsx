import { UserPlus, Eye, Power } from "lucide-react";

const Users = () => {
  // Datos dummy para visualizar
  const users = [
    { id: 1, name: "María González", email: "maria@tienda.com", role: "Vendedor", status: "Activo" },
    { id: 2, name: "Carlos Ramírez", email: "carlos@tienda.com", role: "Vendedor", status: "Inactivo" },
    { id: 3, name: "Ana López", email: "ana@tienda.com", role: "Admin", status: "Activo" },
  ];

  const s = {
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
    title: { fontSize: '28px', color: '#111827', fontWeight: 'bold' },
    subtitle: { color: '#6B7280', fontSize: '16px' },
    btnPrimary: { backgroundColor: '#065F46', color: 'white', padding: '10px 20px', borderRadius: '8px', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: '500' },
    
    card: { backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' },
    table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
    th: { padding: '16px 24px', borderBottom: '1px solid #E5E7EB', backgroundColor: '#F9FAFB', color: '#374151', fontSize: '12px', textTransform: 'uppercase', fontWeight: '600' },
    td: { padding: '16px 24px', borderBottom: '1px solid #E5E7EB', color: '#111827', fontSize: '14px' },
    
    badgeActive: { backgroundColor: '#D1FAE5', color: '#065F46', padding: '2px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: '600' },
    badgeInactive: { backgroundColor: '#FEE2E2', color: '#991B1B', padding: '2px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: '600' },
    
    actionBtn: { padding: '6px 12px', borderRadius: '6px', border: '1px solid #D1D5DB', backgroundColor: 'white', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px', marginRight: '8px' }
  };

  return (
    <div>
      <div style={s.header}>
        <div>
          <h1 style={s.title}>Gestión de Usuarios</h1>
          <p style={s.subtitle}>Administra los usuarios de tu microempresa</p>
        </div>
        <button style={s.btnPrimary}>
          <UserPlus size={18} /> Crear vendedor
        </button>
      </div>

      <div style={s.card}>
        <table style={s.table}>
          <thead>
            <tr>
              <th style={s.th}>Nombre</th>
              <th style={s.th}>Email</th>
              <th style={s.th}>Rol</th>
              <th style={s.th}>Estado</th>
              <th style={s.th}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td style={s.td}>{u.name}</td>
                <td style={s.td}>{u.email}</td>
                <td style={s.td}>{u.role}</td>
                <td style={s.td}>
                  <span style={u.status === 'Activo' ? s.badgeActive : s.badgeInactive}>
                    {u.status}
                  </span>
                </td>
                <td style={{ ...s.td, display: 'flex' }}>
                   <button style={s.actionBtn}><Power size={14}/> {u.status === 'Activo' ? 'Desactivar' : 'Activar'}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;