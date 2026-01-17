
import { useEffect, useState } from "react";
import { Eye, Power, X, Filter } from "lucide-react";
import {
  getMicroempresas,
  getMicroempresaById,
  activarMicroempresa,
  desactivarMicroempresa,
  getPlanMicroempresa,
  getMicroempresasPorNombre,
  getMicroempresasPorNit,
  getMicroempresasPorPlan,
  getMicroempresasActivas,
  getMicroempresasInactivas
} from "../../api/microempresas.api";
import { getPlanes } from "../../api/planes.api";


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

const s = {
  container: { maxWidth: '1200px' },
  header: { marginBottom: '30px' },
  title: { fontSize: '28px', color: palette.darkBg, fontWeight: 'bold', marginBottom: '5px' },
  subtitle: { color: palette.accent2, fontSize: '16px' },
  card: { backgroundColor: palette.white, borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: `1px solid ${palette.gray}`, padding: '20px' },
  tableTitle: { fontSize: '16px', fontWeight: '500', color: palette.accent2, marginBottom: '20px' },
  tableContainer: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' },
  th: { padding: '12px 24px', borderBottom: `1px solid ${palette.gray}`, color: palette.accent2, fontSize: '13px', fontWeight: '600', backgroundColor: 'transparent' },
  td: { padding: '16px 24px', borderBottom: `1px solid ${palette.white}`, color: palette.darkBg, fontSize: '14px', verticalAlign: 'middle' },
  tdName: { fontSize: '16.5px', fontWeight: 600, color: palette.accent4, letterSpacing: '0.1px' },
  badgeActive: { backgroundColor: palette.green, color: 'white', padding: '4px 12px', borderRadius: '99px', fontSize: '12px', fontWeight: '600' },
  badgeInactive: { backgroundColor: palette.red, color: 'white', padding: '4px 12px', borderRadius: '99px', fontSize: '12px', fontWeight: '600' },
  actions: { display: 'flex', gap: '8px' },
  btnView: { padding: '6px 12px', borderRadius: '6px', border: `1px solid ${palette.gray}`, backgroundColor: 'white', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', color: palette.accent2, fontWeight: '500' },
  btnAction: { padding: '6px 12px', borderRadius: '6px', border: `1px solid ${palette.gray}`, backgroundColor: 'white', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', color: palette.accent2, fontWeight: '500' },
  btnFilter: {
    padding: '7px 18px',
    borderRadius: '8px',
    border: `1.5px solid ${palette.accent3}`,
    background: `linear-gradient(90deg, ${palette.accent4} 0%, ${palette.accent3} 100%)`,
    color: 'white',
    fontWeight: 600,
    fontSize: '15px',
    boxShadow: '0 1px 6px rgba(16,115,97,0.10)',
    cursor: 'pointer',
    transition: 'background 0.2s, box-shadow 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginBottom: '2px',
  },
  btnFilterActive: {
    background: palette.gray,
    color: palette.accent4,
    boxShadow: '0 2px 12px rgba(16,115,97,0.18)',
    border: `2px solid ${palette.accent4}`,
    fontWeight: 700,
  },
  selectFilter: {
    padding: '7px 14px',
    borderRadius: '8px',
    border: `1.5px solid ${palette.accent3}`,
    background: 'white',
    color: palette.accent2,
    fontWeight: 600,
    fontSize: '15px',
    boxShadow: '0 1px 6px rgba(16,115,97,0.10)',
    cursor: 'pointer',
    marginBottom: '2px',
    outline: 'none',
    appearance: 'none',
    transition: 'border 0.2s',
  },
  selectFilterActive: {
    border: `2px solid ${palette.accent4}`,
    background: `linear-gradient(90deg, #fff 0%, ${palette.accent4}22 100%)`,
    color: palette.accent4,
  },
  modalOverlay: { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.25)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  modal: { background: palette.white, borderRadius: '18px', padding: '36px 32px 28px 32px', minWidth: '370px', maxWidth: '95vw', boxShadow: '0 6px 32px rgba(16, 115, 97, 0.18)', position: 'relative', border: `1.5px solid ${palette.gray}` },
  modalClose: { position: 'absolute', top: 18, right: 18, background: 'none', border: 'none', cursor: 'pointer', color: palette.accent2, fontSize: 22, transition: 'color 0.2s' },
  modalTitle: { fontSize: '24px', fontWeight: 'bold', color: palette.accent4, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px', letterSpacing: '0.5px' },
  modalSubtitle: { color: palette.accent2, fontSize: '15px', marginBottom: '18px', fontWeight: 500 },
  modalSection: { marginBottom: '18px', padding: '18px 0', borderBottom: `1px solid ${palette.gray}` },
  modalLabel: { fontWeight: '600', color: palette.accent2, minWidth: '120px', display: 'inline-block', fontSize: '14px' },
  modalValue: { color: palette.darkBg, fontSize: '15px', fontWeight: 500, marginLeft: '2px' },
  modalBadge: { display: 'inline-block', padding: '4px 14px', borderRadius: '99px', fontSize: '13px', fontWeight: 600, background: palette.accent3, color: 'white', marginLeft: '8px', letterSpacing: '0.5px' },
  modalPlan: { background: palette.gray, borderRadius: '10px', padding: '14px 18px', marginTop: '10px', marginBottom: '6px', boxShadow: '0 1px 4px rgba(16,115,97,0.07)' },
  modalPlanTitle: { fontWeight: 'bold', color: palette.accent4, fontSize: '16px', marginBottom: '4px' },
  modalPlanDesc: { color: palette.accent2, fontSize: '14px', marginBottom: '2px' },
  modalPlanLimit: { color: palette.accent1, fontSize: '13px', marginRight: '12px', fontWeight: 500 },
  modalRow: { display: 'flex', alignItems: 'center', marginBottom: '8px' },
  modalIcon: { marginRight: '8px', color: palette.accent3, minWidth: 20 },
};

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, data: null, plan: null });
  const [actionLoading, setActionLoading] = useState(false);
  const [planes, setPlanes] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [activeFilter, setActiveFilter] = useState("todas");

  // Cargar planes para el filtro
  useEffect(() => {
    getPlanes().then(res => setPlanes(res.data));
  }, []);

  // Función para cargar empresas según endpoint
  const fetchEmpresas = async (endpoint = getMicroempresas) => {
    setLoading(true);
    try {
      const res = await endpoint();
      const empresas = res.data;
      const empresasConPlan = await Promise.all(empresas.map(async (e) => {
        let plan = null;
        try {
          const planRes = await getPlanMicroempresa(e.id_microempresa);
          plan = planRes.data?.nombre || "Sin plan";
        } catch {
          plan = "Sin plan";
        }
        return { ...e, plan };
      }));
      setCompanies(empresasConPlan);
    } finally {
      setLoading(false);
    }
  };

  // Cargar todas por defecto
  useEffect(() => {
    fetchEmpresas();
  }, []);

  // Endpoints para filtros
  // Handlers de barra de filtros
  const handleDefault = () => {
    setActiveFilter("todas");
    setSelectedPlan("");
    fetchEmpresas(getMicroempresas);
  };
  const handleNombre = () => {
    setActiveFilter("nombre");
    setSelectedPlan("");
    fetchEmpresas(getMicroempresasPorNombre);
  };
  const handleNit = () => {
    setActiveFilter("nit");
    setSelectedPlan("");
    fetchEmpresas(getMicroempresasPorNit);
  };
  const handleActivas = () => {
    setActiveFilter("activas");
    setSelectedPlan("");
    fetchEmpresas(getMicroempresasActivas);
  };
  const handleInactivas = () => {
    setActiveFilter("inactivas");
    setSelectedPlan("");
    fetchEmpresas(getMicroempresasInactivas);
  };
  const handlePlan = (e) => {
    const id = e.target.value;
    setSelectedPlan(id);
    setActiveFilter("");
    if (id) fetchEmpresas(() => getMicroempresasPorPlan(id));
    else handleDefault();
  };

  // Activar/desactivar microempresa
  const handleToggleEstado = async (empresa) => {
    setActionLoading(true);
    try {
      if (empresa.estado) {
        await desactivarMicroempresa(empresa.id_microempresa);
      } else {
        await activarMicroempresa(empresa.id_microempresa);
      }
      // Refrescar lista
      const res = await getMicroempresas();
      const empresas = res.data;
      const empresasConPlan = await Promise.all(empresas.map(async (e) => {
        let plan = null;
        try {
          const planRes = await getPlanMicroempresa(e.id_microempresa);
          plan = planRes.data?.nombre || "Sin plan";
        } catch {
          plan = "Sin plan";
        }
        return { ...e, plan };
      }));
      setCompanies(empresasConPlan);
    } finally {
      setActionLoading(false);
    }
  };

  // Mostrar modal con detalles
  const handleShowDetails = async (empresa) => {
    setActionLoading(true);
    try {
      const res = await getMicroempresaById(empresa.id_microempresa);
      let plan = null;
      try {
        const planRes = await getPlanMicroempresa(empresa.id_microempresa);
        plan = planRes.data;
      } catch {
        plan = null;
      }
      setModal({ open: true, data: res.data, plan });
    } finally {
      setActionLoading(false);
    }
  };

  const closeModal = () => setModal({ open: false, data: null, plan: null });

  return (
    <div style={s.container}>
      <div style={s.header}>
        <h1 style={s.title}>Gestión de Microempresas</h1>
        <p style={s.subtitle}>Administra todas las microempresas del sistema</p>
      </div>

      {/* Barra de filtros */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '18px', alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ color: palette.accent2, fontWeight: 500, fontSize: 15, display: 'flex', alignItems: 'center', gap: 6 }}><Filter size={18}/> Filtros:</span>
        <button style={activeFilter === 'todas' ? { ...s.btnFilter, ...s.btnFilterActive } : s.btnFilter} onClick={handleDefault}>Todas</button>
        <button style={activeFilter === 'nombre' ? { ...s.btnFilter, ...s.btnFilterActive } : s.btnFilter} onClick={handleNombre}>Por nombre</button>
        <button style={activeFilter === 'nit' ? { ...s.btnFilter, ...s.btnFilterActive } : s.btnFilter} onClick={handleNit}>Por NIT</button>
        <button style={activeFilter === 'activas' ? { ...s.btnFilter, ...s.btnFilterActive } : s.btnFilter} onClick={handleActivas}>Activas</button>
        <button style={activeFilter === 'inactivas' ? { ...s.btnFilter, ...s.btnFilterActive } : s.btnFilter} onClick={handleInactivas}>Inactivas</button>
        <select
          style={{ ...s.selectFilter, width: 180 }}
          value={selectedPlan}
          onChange={handlePlan}
        >
          <option value="" style={{ color: !selectedPlan ? palette.accent4 : palette.accent2, fontWeight: !selectedPlan ? 700 : 600 }}>Por plan...</option>
          {planes.map(p => (
            <option
              key={p.id_plan}
              value={p.id_plan}
              style={{
                color: selectedPlan === p.id_plan ? palette.accent4 : palette.accent2,
                fontWeight: selectedPlan === p.id_plan ? 700 : 600,
                backgroundColor: selectedPlan === p.id_plan ? palette.gray : 'white',
              }}
            >
              {p.nombre}
            </option>
          ))}
        </select>
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
              {loading ? (
                <tr><td colSpan={5} style={s.td}>Cargando...</td></tr>
              ) : companies.length === 0 ? (
                <tr><td colSpan={5} style={s.td}>No hay microempresas registradas.</td></tr>
              ) : companies.map((c) => (
                <tr key={c.id_microempresa}>
                  <td style={{...s.td, ...s.tdName}}>{c.nombre}</td>
                  <td style={s.td}>{c.nit}</td>
                  <td style={s.td}>{c.plan}</td>
                  <td style={s.td}>
                    <span style={c.estado ? s.badgeActive : s.badgeInactive}>
                      {c.estado ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td style={s.td}>
                    <div style={s.actions}>
                      <button style={s.btnView} onClick={() => handleShowDetails(c)} disabled={actionLoading}><Eye size={14}/> Ver</button>
                      <button style={s.btnAction} onClick={() => handleToggleEstado(c)} disabled={actionLoading}>
                        <Power size={14}/> {c.estado ? 'Desactivar' : 'Activar'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de detalles */}
      {modal.open && (
        <div style={s.modalOverlay}>
          <div style={s.modal}>
            <button style={s.modalClose} onClick={closeModal} title="Cerrar"><X size={22}/></button>
            <div style={s.modalTitle}>
              <Eye size={22} style={s.modalIcon}/> {modal.data.nombre}
              <span style={{...s.modalBadge, background: modal.data.estado ? palette.green : palette.red}}>
                {modal.data.estado ? 'Activo' : 'Inactivo'}
              </span>
            </div>
            <div style={s.modalSubtitle}>Información completa de la microempresa</div>
            <div style={s.modalSection}>
              <div style={s.modalRow}><span style={s.modalLabel}>NIT:</span> <span style={s.modalValue}>{modal.data.nit}</span></div>
              <div style={s.modalRow}><span style={s.modalLabel}>Dirección:</span> <span style={s.modalValue}>{modal.data.direccion}</span></div>
              <div style={s.modalRow}><span style={s.modalLabel}>Teléfono:</span> <span style={s.modalValue}>{modal.data.telefono}</span></div>
              <div style={s.modalRow}><span style={s.modalLabel}>Moneda:</span> <span style={s.modalValue}>{modal.data.moneda}</span></div>
              <div style={s.modalRow}><span style={s.modalLabel}>Fecha de registro:</span> <span style={s.modalValue}>{new Date(modal.data.fecha_registro).toLocaleString()}</span></div>
            </div>
            <div style={s.modalSection}>
              <div style={s.modalLabel}>Plan actual:</div>
              {modal.plan ? (
                <div style={s.modalPlan}>
                  <div style={s.modalPlanTitle}>{modal.plan.nombre}</div>
                  <div style={s.modalPlanDesc}>{modal.plan.descripcion}</div>
                  <div style={{marginTop: '8px'}}>
                    <span style={s.modalPlanLimit}>Precio: <b>{modal.plan.precio}</b></span>
                    <span style={s.modalPlanLimit}>Límite productos: <b>{modal.plan.limite_productos}</b></span>
                    <span style={s.modalPlanLimit}>Límite admins: <b>{modal.plan.limite_admins}</b></span>
                    <span style={s.modalPlanLimit}>Límite vendedores: <b>{modal.plan.limite_vendedores}</b></span>
                  </div>
                </div>
              ) : (
                <div style={{color: palette.red, fontWeight: 500, marginTop: 8}}>Sin plan activo</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Companies;