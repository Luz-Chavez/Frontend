import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getVentasPorEmpresa, validarPagoVenta, rechazarPagoVenta } from "../../api/ventas.api";
import { getClientesPorMicroempresa } from "../../api/clientes.api";
import { getProductosActivosPorMicroempresa } from "../../api/productos.api";
import Swal from "sweetalert2";

// === ICONOS SVG ===
const IconCheck = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const IconX = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const IconRefresh = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
  </svg>
);

const IconChart = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

const IconClipboard = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
  </svg>
);

const IconDollar = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const IconClock = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);

const IconCheckCircle = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const IconShoppingCart = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const IconUser = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export default function Ventas() {
  const { user } = useAuth();
  const [ventas, setVentas] = useState([]);
  const [clientes, setClientes] = useState({});
  const [productos, setProductos] = useState({});
  const [loading, setLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState("TODOS");

  const idMicroempresa =
    user?.microempresa?.id_microempresa ||
    user?.admin_microempresa?.id_microempresa ||
    user?.id_microempresa;

  useEffect(() => {
    if (idMicroempresa) {
      cargarDatos();
    } else {
      setLoading(false);
    }
  }, [idMicroempresa, filtroEstado]);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      // Cargar ventas
      const filtros = {};
      if (filtroEstado !== "TODOS") filtros.estado = filtroEstado;
      const resVentas = await getVentasPorEmpresa(idMicroempresa, filtros);
      const ventasOrdenadas = resVentas.data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
      setVentas(ventasOrdenadas);

      // Cargar clientes para mapear nombres
      try {
        const resClientes = await getClientesPorMicroempresa(idMicroempresa);
        const clientesMap = {};
        resClientes.data.forEach(c => {
          clientesMap[c.id_cliente] = c;
        });
        setClientes(clientesMap);
      } catch (e) {
        console.warn("No se pudieron cargar clientes:", e);
      }

      // Cargar productos para mapear nombres
      try {
        const resProductos = await getProductosActivosPorMicroempresa(idMicroempresa);
        const productosMap = {};
        resProductos.data.forEach(p => {
          productosMap[p.id_producto] = p;
        });
        setProductos(productosMap);
      } catch (e) {
        console.warn("No se pudieron cargar productos:", e);
      }
    } catch (error) {
      console.error("Error cargando ventas:", error);
    } finally {
      setLoading(false);
    }
  };

  const getClienteNombre = (idCliente) => {
    if (!idCliente) return "Cliente no registrado";
    const cliente = clientes[idCliente];
    return cliente ? cliente.nombre : `Cliente #${idCliente}`;
  };

  const getProductoNombre = (idProducto) => {
    const producto = productos[idProducto];
    return producto ? producto.nombre : `Producto #${idProducto}`;
  };

  const handleValidar = async (venta) => {
    const result = await Swal.fire({
      title: '¿Validar Pago y Entrega?',
      text: `Se descontará el stock de la venta #${venta.id_venta} y se marcará como PAGADA.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10B981',
      cancelButtonColor: '#94A3B8',
      confirmButtonText: 'Sí, validar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await validarPagoVenta(venta.id_venta);
        Swal.fire({ icon: 'success', title: '¡Validado!', text: 'Stock actualizado.', timer: 1500 });
        cargarDatos();
      } catch (error) {
        Swal.fire('Error', 'No se pudo validar la venta.', 'error');
      }
    }
  };

  const handleRechazar = async (idVenta) => {
    const result = await Swal.fire({
      title: '¿Rechazar Venta?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      confirmButtonText: 'Sí, rechazar',
      cancelButtonText: 'Cancelar'
    });
    if (result.isConfirmed) {
      await rechazarPagoVenta(idVenta);
      cargarDatos();
    }
  };

  const getBadgeStyle = (estado) => {
    const base = { padding: '8px 14px', borderRadius: '50px', fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'inline-flex', alignItems: 'center', gap: '5px' };
    switch (estado) {
      case "PAGADA": return { ...base, background: 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)', color: '#065F46', border: '1px solid #6EE7B7' };
      case "PENDIENTE_PAGO": return { ...base, background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)', color: '#92400E', border: '1px solid #FCD34D' };
      case "CANCELADA": return { ...base, background: 'linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)', color: '#991B1B', border: '1px solid #FCA5A5' };
      default: return { ...base, background: '#F1F5F9', color: '#475569' };
    }
  };

  const styles = {
    wrapper: { padding: '28px', maxWidth: '1400px', margin: '0 auto', fontFamily: "'Inter', system-ui, sans-serif" },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' },
    title: { fontSize: '1.6rem', fontWeight: '800', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '12px' },
    titleIcon: { width: '44px', height: '44px', background: 'linear-gradient(135deg, #0A3A40 0%, #1D7373 100%)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' },
    filterContainer: { display: 'flex', background: '#F1F5F9', borderRadius: '12px', padding: '5px', gap: '4px' },
    filterBtn: (active) => ({ padding: '10px 18px', border: 'none', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer', background: active ? 'white' : 'transparent', color: active ? '#0A3A40' : '#64748B', boxShadow: active ? '0 2px 6px rgba(0,0,0,0.06)' : 'none', display: 'flex', alignItems: 'center', gap: '5px' }),
    refreshBtn: { display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px', background: 'white', border: '2px solid #E2E8F0', borderRadius: '10px', fontSize: '0.85rem', fontWeight: '600', color: '#475569', cursor: 'pointer' },
    statsBar: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '24px' },
    statCard: (color) => ({ background: 'white', borderRadius: '14px', padding: '18px 20px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)', border: '1px solid #E2E8F0', borderLeft: `4px solid ${color}` }),
    statLabel: { fontSize: '0.75rem', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' },
    statValue: { fontSize: '1.5rem', fontWeight: '800', color: '#0F172A' },
    tableContainer: { background: 'white', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)', border: '1px solid #E2E8F0', overflow: 'hidden' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { padding: '16px 20px', textAlign: 'left', fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#64748B', background: '#FAFBFC', borderBottom: '2px solid #E2E8F0' },
    td: { padding: '16px 20px', borderBottom: '1px solid #F1F5F9' },
    idCell: { fontWeight: '700', color: '#0F172A', fontSize: '0.95rem' },
    clienteCell: { display: 'flex', alignItems: 'center', gap: '8px', color: '#64748B', fontSize: '0.85rem' },
    totalCell: { fontWeight: '800', color: '#0A3A40', fontSize: '1rem' },
    actionBtn: (type) => ({ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '8px 14px', borderRadius: '8px', border: 'none', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', marginRight: '6px', ...(type === 'validate' ? { background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', color: 'white', boxShadow: '0 4px 10px rgba(16, 185, 129, 0.25)' } : { background: '#FEE2E2', color: '#DC2626' }) }),
    emptyState: { padding: '60px 30px', textAlign: 'center' },
    errorContainer: { padding: '50px', textAlign: 'center', background: '#FEF2F2', borderRadius: '16px', border: '2px dashed #FECACA' }
  };

  const totalVentas = ventas.length;
  const ventasPendientes = ventas.filter(v => v.estado === "PENDIENTE_PAGO").length;
  const ventasPagadas = ventas.filter(v => v.estado === "PAGADA").length;
  const montoTotal = ventas.reduce((acc, v) => acc + parseFloat(v.total || 0), 0);

  if (!idMicroempresa) {
    return (
      <div style={styles.wrapper}>
        <div style={styles.errorContainer}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#DC2626', marginBottom: '10px' }}>Error de Configuración</h2>
          <p style={{ color: '#991B1B' }}>No se detectó una microempresa asociada.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <h1 style={styles.title}>
          <div style={styles.titleIcon}><IconChart size={22} /></div>
          Gestión de Ventas
        </h1>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={styles.filterContainer}>
            {[{ key: "TODOS", label: "Todas" }, { key: "PENDIENTE_PAGO", label: "Pendientes", icon: <IconClock size={13} /> }, { key: "PAGADA", label: "Pagadas", icon: <IconCheckCircle size={13} /> }].map((f) => (
              <button key={f.key} onClick={() => setFiltroEstado(f.key)} style={styles.filterBtn(filtroEstado === f.key)}>{f.icon}{f.label}</button>
            ))}
          </div>
          <button onClick={cargarDatos} style={styles.refreshBtn}><IconRefresh /> Actualizar</button>
        </div>
      </div>

      <div style={styles.statsBar}>
        <div style={styles.statCard('#0A3A40')}><p style={styles.statLabel}><IconShoppingCart size={14} /> Total Ventas</p><p style={styles.statValue}>{totalVentas}</p></div>
        <div style={styles.statCard('#F59E0B')}><p style={styles.statLabel}><IconClock size={14} /> Pendientes</p><p style={styles.statValue}>{ventasPendientes}</p></div>
        <div style={styles.statCard('#10B981')}><p style={styles.statLabel}><IconCheckCircle size={14} /> Pagadas</p><p style={styles.statValue}>{ventasPagadas}</p></div>
        <div style={styles.statCard('#1D7373')}><p style={styles.statLabel}><IconDollar size={14} /> Ingresos</p><p style={styles.statValue}>Bs. {montoTotal.toFixed(2)}</p></div>
      </div>

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Cliente</th>
              <th style={styles.th}>Productos</th>
              <th style={styles.th}>Fecha</th>
              <th style={styles.th}>Total</th>
              <th style={{ ...styles.th, textAlign: 'center' }}>Estado</th>
              <th style={{ ...styles.th, textAlign: 'center' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" style={{ ...styles.td, textAlign: 'center', padding: '50px' }}><div style={{ color: '#64748B' }}>Cargando ventas...</div></td></tr>
            ) : ventas.length === 0 ? (
              <tr><td colSpan="7" style={styles.td}><div style={styles.emptyState}><IconClipboard size={40} style={{ color: '#CBD5E1', marginBottom: '12px' }} /><p style={{ color: '#64748B' }}>No se encontraron ventas</p></div></td></tr>
            ) : (
              ventas.map((venta) => (
                <tr key={venta.id_venta} style={{ transition: 'background 0.2s ease' }} onMouseEnter={(e) => e.currentTarget.style.background = '#FAFBFC'} onMouseLeave={(e) => e.currentTarget.style.background = 'white'}>
                  <td style={{ ...styles.td, ...styles.idCell }}>#{venta.id_venta}</td>
                  <td style={styles.td}>
                    <div style={styles.clienteCell}>
                      <div style={{ width: '28px', height: '28px', background: '#E2E8F0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <IconUser size={14} />
                      </div>
                      <span style={{ fontWeight: '600', color: '#1E293B' }}>{getClienteNombre(venta.id_cliente)}</span>
                    </div>
                  </td>
                  <td style={{ ...styles.td, color: '#64748B', fontSize: '0.85rem', maxWidth: '200px' }}>
                    {venta.detalles && venta.detalles.length > 0
                      ? venta.detalles.map((d, i) => <div key={i} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>• {getProductoNombre(d.id_producto)} (x{d.cantidad})</div>)
                      : <span style={{ color: '#94A3B8' }}>Sin detalles</span>
                    }
                  </td>
                  <td style={{ ...styles.td, color: '#64748B', fontSize: '0.85rem' }}>
                    {new Date(venta.fecha).toLocaleDateString('es-BO', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td style={{ ...styles.td, ...styles.totalCell }}>Bs. {parseFloat(venta.total).toFixed(2)}</td>
                  <td style={{ ...styles.td, textAlign: 'center' }}>
                    <span style={getBadgeStyle(venta.estado)}>
                      {venta.estado === "PAGADA" && <IconCheckCircle size={11} />}
                      {venta.estado === "PENDIENTE_PAGO" && <IconClock size={11} />}
                      {venta.estado === "CANCELADA" && <IconX size={11} />}
                      {venta.estado.replace("_", " ")}
                    </span>
                  </td>
                  <td style={{ ...styles.td, textAlign: 'center' }}>
                    {venta.estado === "PENDIENTE_PAGO" && (
                      <>
                        <button onClick={() => handleValidar(venta)} style={styles.actionBtn('validate')}><IconCheck /> Validar</button>
                        <button onClick={() => handleRechazar(venta.id_venta)} style={styles.actionBtn('reject')}><IconX /> Rechazar</button>
                      </>
                    )}
                    {venta.estado === "PAGADA" && <span style={{ color: '#10B981', fontWeight: '600', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}><IconCheckCircle size={14} /> Completada</span>}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}