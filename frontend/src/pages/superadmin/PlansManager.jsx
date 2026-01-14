import { Plus, Edit2, Trash2 } from "lucide-react";

const PlansManager = () => {
  const plans = [
    { id: 1, name: "Plan Básico", price: "$29", users: 3, desc: "Perfecto para empezar" },
    { id: 2, name: "Plan Profesional", price: "$59", users: 10, desc: "Para negocios en crecimiento" },
    { id: 3, name: "Plan Empresarial", price: "$99", users: 25, desc: "Para empresas establecidas" },
  ];

  const s = {
    container: { maxWidth: '1200px' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' },
    title: { fontSize: '28px', color: '#111827', fontWeight: 'bold', marginBottom: '5px' },
    subtitle: { color: '#6B7280', fontSize: '16px' },
    
    // Botón verde oscuro sólido
    btnCreate: { backgroundColor: '#065F46', color: 'white', padding: '10px 20px', borderRadius: '8px', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: '500', fontSize: '14px' },
    
    card: { backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #E5E7EB', padding: '20px' },
    tableTitle: { fontSize: '16px', fontWeight: '500', color: '#374151', marginBottom: '20px' },
    
    tableContainer: { overflowX: 'auto' },
    table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' },
    th: { padding: '12px 24px', borderBottom: '1px solid #E5E7EB', color: '#374151', fontSize: '13px', fontWeight: '600' },
    td: { padding: '16px 24px', borderBottom: '1px solid #F3F4F6', color: '#1F2937', fontSize: '14px', verticalAlign: 'middle' },
    
    // Botones con contorno rojo/gris
    actions: { display: 'flex', gap: '8px' },
    btnEdit: { padding: '6px 12px', borderRadius: '6px', border: '1px solid #D1D5DB', backgroundColor: 'white', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', color: '#374151', fontWeight: '500' },
    btnDelete: { padding: '6px 12px', borderRadius: '6px', border: '1px solid #FCA5A5', backgroundColor: '#FEF2F2', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', color: '#DC2626', fontWeight: '500' }
  };

  return (
    <div style={s.container}>
      <div style={s.header}>
        <div>
           <h1 style={s.title}>Gestión de Planes</h1>
           <p style={s.subtitle}>Administra los planes de suscripción disponibles</p>
        </div>
        <button style={s.btnCreate}>
          <Plus size={18} /> Crear plan
        </button>
      </div>

      <div style={s.card}>
        <h2 style={s.tableTitle}>Lista de Planes</h2>
        <div style={s.tableContainer}>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Nombre</th>
                <th style={s.th}>Precio</th>
                <th style={s.th}>Límite Usuarios</th>
                <th style={s.th}>Descripción</th>
                <th style={s.th}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {plans.map((p) => (
                <tr key={p.id}>
                  <td style={s.td}>{p.name}</td>
                  <td style={s.td}>{p.price}</td>
                  <td style={s.td}>{p.users}</td>
                  <td style={s.td}>{p.desc}</td>
                  <td style={s.td}>
                    <div style={s.actions}>
                       <button style={s.btnEdit}><Edit2 size={14}/> Editar</button>
                       <button style={s.btnDelete}><Trash2 size={14}/> Eliminar</button>
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

export default PlansManager;