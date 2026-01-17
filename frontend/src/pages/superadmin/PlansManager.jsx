
import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, X, ToggleLeft, ToggleRight } from "lucide-react";
import {
  getPlanes,
  getPlanById,
  createPlan,
  updatePlan,
  deletePlan,
  activarPlan,
  desactivarPlan,
  getPlanesActivos,
  getPlanesNoActivos
} from "../../api/planes.api";


const palette = {
  darkBg: '#042326',
  accent1: '#0A3A40',
  accent2: '#0F5959',
  accent3: '#1D7373',
  accent4: '#107361',
  white: '#F5F7F8',
  gray: '#E6EAEA',
  green: '#1D7373',
  red: '#EF4444',
};

  // Estilos modernos para barra de filtros
  const btnFilter = {
    padding: '8px 22px',
    borderRadius: '10px',
    border: `1.5px solid ${palette.accent3}`,
    background: `linear-gradient(90deg, ${palette.accent4} 0%, ${palette.accent3} 100%)`,
    color: 'white',
    fontWeight: 600,
    fontSize: '16px',
    boxShadow: '0 2px 10px rgba(16,115,97,0.10)',
    cursor: 'pointer',
    transition: 'background 0.2s, box-shadow 0.2s, color 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '2px',
    letterSpacing: '0.5px',
    outline: 'none',
  };
  const btnFilterActive = {
    background: palette.gray,
    color: palette.accent4,
    boxShadow: '0 4px 18px rgba(16,115,97,0.18)',
    border: `2px solid ${palette.accent4}`,
    fontWeight: 800,
    letterSpacing: '1px',
    textShadow: '0 1px 2px #fff',
  };

const s = {
  container: { maxWidth: '1200px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' },
  title: { fontSize: '28px', color: palette.darkBg, fontWeight: 'bold', marginBottom: '5px' },
  subtitle: { color: palette.accent2, fontSize: '16px' },
  btnCreate: { backgroundColor: palette.accent4, color: 'white', padding: '10px 20px', borderRadius: '8px', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: '500', fontSize: '14px', boxShadow: '0 1px 4px rgba(16,115,97,0.08)' },
  card: { backgroundColor: palette.white, borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: `1px solid ${palette.gray}`, padding: '20px' },
  tableTitle: { fontSize: '16px', fontWeight: '500', color: palette.accent2, marginBottom: '20px' },
  tableContainer: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' },
  th: { padding: '12px 24px', borderBottom: `1px solid ${palette.gray}`, color: palette.accent2, fontSize: '13px', fontWeight: '600', backgroundColor: 'transparent' },
  td: { padding: '16px 24px', borderBottom: `1px solid ${palette.white}`, color: palette.darkBg, fontSize: '14px', verticalAlign: 'middle' },
  tdName: { fontSize: '16.5px', fontWeight: 600, color: palette.accent4, letterSpacing: '0.1px' },
  actions: { display: 'flex', gap: '8px' },
  btnEdit: { padding: '6px 12px', borderRadius: '6px', border: `1px solid ${palette.gray}`, backgroundColor: 'white', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', color: palette.accent2, fontWeight: '500' },
  btnDelete: { padding: '6px 12px', borderRadius: '6px', border: '1px solid #FCA5A5', backgroundColor: '#FEF2F2', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', color: palette.red, fontWeight: '500' },
  btnToggle: { padding: '6px 12px', borderRadius: '6px', border: `1px solid ${palette.gray}`, backgroundColor: palette.white, cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', color: palette.accent3, fontWeight: '500' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.25)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  modal: { background: palette.white, borderRadius: '16px', padding: '18px 12px 14px 12px', minWidth: '220px', maxWidth: '370px', boxShadow: '0 6px 32px rgba(16, 115, 97, 0.18)', position: 'relative', border: `1.5px solid ${palette.gray}` },
  modalClose: { position: 'absolute', top: 18, right: 18, background: 'none', border: 'none', cursor: 'pointer', color: palette.accent2, fontSize: 22, transition: 'color 0.2s' },
  modalTitle: { fontSize: '22px', fontWeight: 'bold', color: palette.accent4, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px', letterSpacing: '0.5px' },
  modalLabel: { fontWeight: '600', color: palette.accent2, minWidth: '120px', display: 'inline-block', fontSize: '14px' },
  modalInput: { width: '100%', padding: '8px 12px', borderRadius: '6px', border: `1px solid ${palette.gray}`, fontSize: '15px', marginBottom: '12px', marginTop: '2px', background: palette.white, color: palette.darkBg },
  modalTextarea: { width: '100%', padding: '8px 12px', borderRadius: '6px', border: `1px solid ${palette.gray}`, fontSize: '15px', marginBottom: '12px', marginTop: '2px', background: palette.white, color: palette.darkBg, resize: 'vertical', minHeight: '60px' },
  modalActions: { display: 'flex', gap: '12px', marginTop: '10px', justifyContent: 'flex-end' },
  modalError: { color: palette.red, fontWeight: 500, marginBottom: 8, fontSize: 14 },
};

const initialPlanState = { nombre: '', precio: '', limite_productos: '', limite_admins: '', limite_vendedores: '', descripcion: '' };

const PlansManager = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, type: null, plan: null });
  const [form, setForm] = useState(initialPlanState);
  const [formError, setFormError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState('todos');

  // Cargar planes según filtro
  const fetchPlanes = async (endpoint = getPlanes) => {
    setLoading(true);
    try {
      const res = await endpoint();
      setPlans(res.data);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { fetchPlanes(); }, []);

  // Actualizar la lista de planes cuando el filtro cambie
  useEffect(() => {
    if (activeFilter === 'todos') fetchPlanes(getPlanes);
    else if (activeFilter === 'activos') fetchPlanes(getPlanesActivos);
    else if (activeFilter === 'inactivos') fetchPlanes(getPlanesNoActivos);
  }, [activeFilter]);

  // Handlers de barra de filtros
  const handleTodos = () => setActiveFilter('todos');
  const handleActivos = () => setActiveFilter('activos');
  const handleInactivos = () => setActiveFilter('inactivos');

  // Modal crear
  const openCreateModal = () => {
    setForm(initialPlanState);
    setFormError('');
    setModal({ open: true, type: 'create', plan: null });
  };

  // Modal editar
  const openEditModal = async (planId) => {
    setActionLoading(true);
    try {
      const res = await getPlanById(planId);
      setForm({
        nombre: res.data.nombre,
        precio: res.data.precio,
        limite_productos: res.data.limite_productos,
        limite_admins: res.data.limite_admins,
        limite_vendedores: res.data.limite_vendedores,
        descripcion: res.data.descripcion,
      });
      setFormError('');
      setModal({ open: true, type: 'edit', plan: { ...res.data } });
    } finally {
      setActionLoading(false);
    }
  };

  // Guardar (crear o editar)
  const handleSave = async () => {
    setActionLoading(true);
    setFormError('');
    try {
      // Validación simple
      if (!form.nombre || !form.precio || !form.limite_productos || !form.limite_admins || !form.limite_vendedores) {
        setFormError('Todos los campos son obligatorios.');
        setActionLoading(false);
        return;
      }
      if (modal.type === 'create') {
        await createPlan({
          ...form,
          precio: Number(form.precio),
          limite_productos: Number(form.limite_productos),
          limite_admins: Number(form.limite_admins),
          limite_vendedores: Number(form.limite_vendedores),
        });
      } else if (modal.type === 'edit') {
        await updatePlan(modal.plan.id_plan, {
          ...form,
          precio: Number(form.precio),
          limite_productos: Number(form.limite_productos),
          limite_admins: Number(form.limite_admins),
          limite_vendedores: Number(form.limite_vendedores),
        });
      }
      setModal({ open: false, type: null, plan: null });
      await fetchPlanes();
    } catch {
      setFormError('Error al guardar el plan.');
    } finally {
      setActionLoading(false);
    }
  };

  // Eliminar
  const handleDelete = async (planId) => {
    if (!window.confirm('¿Seguro que deseas eliminar este plan?')) return;
    setActionLoading(true);
    try {
      await deletePlan(planId);
      await fetchPlanes();
    } finally {
      setActionLoading(false);
    }
  };

  // Activar/desactivar
  const handleToggle = async (plan) => {
    setActionLoading(true);
    try {
      if (plan.activo) {
        await desactivarPlan(plan.id_plan);
      } else {
        await activarPlan(plan.id_plan);
      }
      await fetchPlanes();
    } finally {
      setActionLoading(false);
    }
  };

  const closeModal = () => setModal({ open: false, type: null, plan: null });

  return (
    <div style={s.container}>
      <div style={s.header}>
        <div>
           <h1 style={s.title}>Gestión de Planes</h1>
           <p style={s.subtitle}>Administra los planes de suscripción disponibles</p>
        </div>
        <button style={s.btnCreate} onClick={openCreateModal}>
          <Plus size={18} /> Crear plan
        </button>
      </div>

      <div style={s.card}>
        <h2 style={s.tableTitle}>Lista de Planes</h2>
        {/* Barra de filtros */}
          <div style={{ display: 'flex', gap: '14px', marginBottom: '22px', alignItems: 'center', flexWrap: 'wrap', background: palette.white, borderRadius: '12px', padding: '10px 18px', boxShadow: '0 1px 8px rgba(16,115,97,0.07)' }}>
            <span style={{ color: palette.accent2, fontWeight: 600, fontSize: 16, letterSpacing: '0.5px' }}>Mostrar:</span>
            <button style={activeFilter === 'todos' ? { ...btnFilter, ...btnFilterActive } : btnFilter} onClick={handleTodos}>Todos</button>
            <button style={activeFilter === 'activos' ? { ...btnFilter, ...btnFilterActive } : btnFilter} onClick={handleActivos}>Activos</button>
            <button style={activeFilter === 'inactivos' ? { ...btnFilter, ...btnFilterActive } : btnFilter} onClick={handleInactivos}>Inactivos</button>
        </div>
        <div style={s.tableContainer}>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Nombre</th>
                <th style={s.th}>Precio</th>
                <th style={s.th}>Límite Productos</th>
                <th style={s.th}>Límite Admins</th>
                <th style={s.th}>Límite Vendedores</th>
                <th style={s.th}>Descripción</th>
                <th style={s.th}>Estado</th>
                <th style={s.th}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} style={s.td}>Cargando...</td></tr>
              ) : plans.length === 0 ? (
                <tr><td colSpan={8} style={s.td}>No hay planes registrados.</td></tr>
              ) : plans.map((p) => (
                <tr key={p.id_plan}>
                  <td style={{...s.td, ...s.tdName}}>{p.nombre}</td>
                  <td style={s.td}>{p.precio}</td>
                  <td style={s.td}>{p.limite_productos}</td>
                  <td style={s.td}>{p.limite_admins}</td>
                  <td style={s.td}>{p.limite_vendedores}</td>
                  <td style={s.td}>{p.descripcion}</td>
                  <td style={s.td}>
                    <button style={s.btnToggle} onClick={() => handleToggle(p)} disabled={actionLoading} title={p.activo ? 'Desactivar' : 'Activar'}>
                      {p.activo ? <ToggleRight size={18} color={palette.green}/> : <ToggleLeft size={18} color={palette.red}/>} {p.activo ? 'Activo' : 'Inactivo'}
                    </button>
                  </td>
                  <td style={s.td}>
                    <div style={s.actions}>
                       <button style={s.btnEdit} onClick={() => openEditModal(p.id_plan)} disabled={actionLoading}><Edit2 size={14}/> Editar</button>
                       <button style={s.btnDelete} onClick={() => handleDelete(p.id_plan)} disabled={actionLoading}><Trash2 size={14}/> Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal crear/editar */}
      {modal.open && (
        <div style={s.modalOverlay}>
          <div style={s.modal}>
            <button style={s.modalClose} onClick={closeModal}><X size={22}/></button>
            <div style={s.modalTitle}>{modal.type === 'create' ? 'Crear Plan' : 'Editar Plan'}</div>
            {formError && <div style={s.modalError}>{formError}</div>}
            <div>
              <label style={s.modalLabel}>Nombre</label>
              <input style={s.modalInput} value={form.nombre} onChange={e => setForm(f => ({...f, nombre: e.target.value}))} disabled={actionLoading}/>
              <label style={s.modalLabel}>Precio</label>
              <input style={s.modalInput} type="number" value={form.precio} onChange={e => setForm(f => ({...f, precio: e.target.value}))} disabled={actionLoading}/>
              <label style={s.modalLabel}>Límite productos</label>
              <input style={s.modalInput} type="number" value={form.limite_productos} onChange={e => setForm(f => ({...f, limite_productos: e.target.value}))} disabled={actionLoading}/>
              <label style={s.modalLabel}>Límite admins</label>
              <input style={s.modalInput} type="number" value={form.limite_admins} onChange={e => setForm(f => ({...f, limite_admins: e.target.value}))} disabled={actionLoading}/>
              <label style={s.modalLabel}>Límite vendedores</label>
              <input style={s.modalInput} type="number" value={form.limite_vendedores} onChange={e => setForm(f => ({...f, limite_vendedores: e.target.value}))} disabled={actionLoading}/>
              <label style={s.modalLabel}>Descripción</label>
              <textarea style={s.modalTextarea} value={form.descripcion} onChange={e => setForm(f => ({...f, descripcion: e.target.value}))} disabled={actionLoading}/>
            </div>
            <div style={s.modalActions}>
              <button style={s.btnCreate} onClick={handleSave} disabled={actionLoading}>{modal.type === 'create' ? 'Crear' : 'Guardar'}</button>
              <button style={s.btnEdit} onClick={closeModal} disabled={actionLoading}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlansManager;