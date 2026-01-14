import { Eye, Power } from "lucide-react";

const Companies = () => {
  const companies = [
    { id: 1, name: "Tienda La Esquina", nit: "123456789-0", plan: "Plan Profesional", status: "Activo" },
    { id: 2, name: "Abarrotes El Sol", nit: "987654321-0", plan: "Plan Básico", status: "Activo" },
    { id: 3, name: "Supermercado Central", nit: "456789123-0", plan: "Plan Empresarial", status: "Inactivo" },
  ];

  const s = {
    container: { maxWidth: '1200px' },
    header: { marginBottom: '30px' },
    title: { fontSize: '28px', color: '#111827', fontWeight: 'bold', marginBottom: '5px' },
    subtitle: { color: '#6B7280', fontSize: '16px' },
    
    card: { backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #E5E7EB', padding: '20px' },
    tableTitle: { fontSize: '16px', fontWeight: '500', color: '#374151', marginBottom: '20px' },
    
    tableContainer: { overflowX: 'auto' },
    table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' },
    
    // Encabezados grises
    th: { padding: '12px 24px', borderBottom: '1px solid #E5E7EB', color: '#374151', fontSize: '13px', fontWeight: '600', backgroundColor: 'transparent' },
    td: { padding: '16px 24px', borderBottom: '1px solid #F3F4F6', color: '#1F2937', fontSize: '14px', verticalAlign: 'middle' },
    
    // Badges (Etiquetas de color)
    badgeActive: { backgroundColor: '#10B981', color: 'white', padding: '4px 12px', borderRadius: '99px', fontSize: '12px', fontWeight: '600' },
    badgeInactive: { backgroundColor: '#EF4444', color: 'white', padding: '4px 12px', borderRadius: '99px', fontSize: '12px', fontWeight: '600' },
    
    // Botones de acción
    actions: { display: 'flex', gap: '8px' },
    btnView: { padding: '6px 12px', borderRadius: '6px', border: '1px solid #D1D5DB', backgroundColor: 'white', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', color: '#374151', fontWeight: '500' },
    btnAction: { padding: '6px 12px', borderRadius: '6px', border: '1px solid #D1D5DB', backgroundColor: 'white', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', color: '#374151', fontWeight: '500' }
  };

  return (
    <div style={s.container}>
      <div style={s.header}>
        <h1 style={s.title}>Gestión de Microempresas</h1>
        <p style={s.subtitle}>Administra todas las microempresas del sistema</p>
      </div>

      <div style={s.card}>
        <h2 style={s.tableTitle}>Lista de Microempresas</h2>
        
        <div style={s.tableContainer}>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Nombre</th>
                <th style={s.th}>NIT</th>
                <th style={s.th}>Plan</th>
                <th style={s.th}>Estado</th>
                <th style={s.th}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((c) => (
                <tr key={c.id}>
                  <td style={s.td} dangerouslySetInnerHTML={{__html: c.name}}></td> {/* Para que respete negritas si las hubiera */}
                  <td style={s.td}>{c.nit}</td>
                  <td style={s.td}>{c.plan}</td>
                  <td style={s.td}>
                    <span style={c.status === 'Activo' ? s.badgeActive : s.badgeInactive}>
                      {c.status}
                    </span>
                  </td>
                  <td style={s.td}>
                    <div style={s.actions}>
                      <button style={s.btnView}><Eye size={14}/> Ver</button>
                      <button style={s.btnAction}>
                        <Power size={14}/> {c.status === 'Activo' ? 'Desactivar' : 'Activar'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Companies;