import { useState, useEffect } from 'react';
import { 
    getMetodosPago, createMetodoPago, toggleMetodoPago,
    getProductosProveedor, asociarProducto, toggleProductoProveedor, getProductosGlobales,
    getProductosNoActivos
} from '../../api/proveedores.api';
import { X, CreditCard, Package, Plus, CheckCircle, Ban, Trash2 } from 'lucide-react';

export default function ProveedorManager({ proveedor, idMicroempresa, onClose }) {
    const [activeTab, setActiveTab] = useState('pagos');

    return (
        <div style={overlayStyle}>
            <div style={modalStyle}>
                <div style={headerStyle}>
                    <h3 style={{ margin: 0, color: '#1D7373', fontSize: 20 }}>Administrar: {proveedor.nombre}</h3>
                    <button onClick={onClose} style={closeBtnStyle}><X size={20} /></button>
                </div>

                {/* TABS */}
                <div style={tabsContainerStyle}>
                    <button onClick={() => setActiveTab('pagos')} style={activeTab === 'pagos' ? activeTabStyle : tabStyle}>
                        <CreditCard size={18} /> Métodos de Pago
                    </button>
                    <button onClick={() => setActiveTab('productos')} style={activeTab === 'productos' ? activeTabStyle : tabStyle}>
                        <Package size={18} /> Productos Suministrados
                    </button>
                </div>

                {/* CONTENIDO */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '10px 4px' }}>
                    {activeTab === 'pagos' ? (
                        <MetodosPagoManager proveedor={proveedor} idMicro={idMicroempresa} />
                    ) : (
                        <ProductosManager proveedor={proveedor} idMicro={idMicroempresa} />
                    )}
                </div>
            </div>
        </div>
    );
}

// --- SUB-COMPONENTE: MÉTODOS DE PAGO ---
import { getMetodosPagoNoActivos } from '../../api/proveedores.api';

function MetodosPagoManager({ proveedor, idMicro }) {
    const [metodos, setMetodos] = useState([]);
    const [noActivos, setNoActivos] = useState([]);
    const [form, setForm] = useState({ tipo: 'EFECTIVO', descripcion: '', datos_pago: '' });
    const [showForm, setShowForm] = useState(false);

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        const [res, noActivosRes] = await Promise.all([
            getMetodosPago(proveedor.id_proveedor, idMicro),
            getMetodosPagoNoActivos(proveedor.id_proveedor, idMicro)
        ]);
        setMetodos(res.data);
        setNoActivos(noActivosRes.data);
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await createMetodoPago(proveedor.id_proveedor, form, idMicro);
            setForm({ tipo: 'EFECTIVO', descripcion: '', datos_pago: '' });
            setShowForm(false);
            loadData();
        } catch (e) { alert("Error al guardar"); }
    };

    const handleToggle = async (id, status) => {
        await toggleMetodoPago(id, !status, idMicro);
        loadData();
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 15, alignItems: 'center' }}>
                <h4 style={{ margin: 0, color: '#0A3A40', fontSize: 16 }}>Métodos Registrados</h4>
                <button onClick={() => setShowForm(!showForm)} style={smallBtnStyle}>
                    {showForm ? 'Cancelar' : '+ Agregar Método'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleCreate} style={formBoxStyle}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <div>
                            <label style={labelStyle}>Tipo</label>
                            <select style={inputStyle} value={form.tipo} onChange={e => setForm({...form, tipo: e.target.value})}>
                                <option value="EFECTIVO">Efectivo</option>
                                <option value="CUENTA_BANCARIA">Cuenta Bancaria</option>
                                <option value="QR">QR</option>
                            </select>
                        </div>
                        <div>
                            <label style={labelStyle}>Banco / Descripción</label>
                            <input placeholder="Ej: Banco Bisa" style={inputStyle} value={form.descripcion} onChange={e => setForm({...form, descripcion: e.target.value})} />
                        </div>
                        <div style={{ gridColumn: 'span 2' }}>
                            <label style={labelStyle}>Datos (Cuenta, Link, etc)</label>
                            <input placeholder="Nº de cuenta o datos adicionales" style={inputStyle} value={form.datos_pago} onChange={e => setForm({...form, datos_pago: e.target.value})} />
                        </div>
                    </div>
                    <button type="submit" style={saveBtnStyle}>Guardar</button>
                </form>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {metodos.length === 0 ? <p style={{color: '#666', fontStyle: 'italic'}}>No hay métodos registrados.</p> : null}
                {metodos.map(m => (
                    <div key={m.id_metodo_pago} style={{ ...cardItemStyle, opacity: m.activo ? 1 : 0.6 }}>
                        <div style={{flex: 1}}>
                            <div style={{display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4}}>
                                <span style={{ fontWeight: 'bold', color: '#1D7373', fontSize: 14 }}>{m.tipo}</span>
                                {m.descripcion && <span style={{ fontSize: 14, color: '#333' }}>| {m.descripcion}</span>}
                            </div>
                            <div style={{ fontSize: 13, color: '#4B5563', background: '#F3F4F6', padding: '4px 8px', borderRadius: 4, display: 'inline-block' }}>
                                {m.datos_pago || "Sin datos adicionales"}
                            </div>
                        </div>
                        <button onClick={() => handleToggle(m.id_metodo_pago, m.activo)} style={iconBtnStyle} title={m.activo ? "Desactivar" : "Activar"}>
                            {m.activo ? <CheckCircle size={20} color="#10B981" /> : <Ban size={20} color="#EF4444" />}
                        </button>
                    </div>
                ))}
            </div>

            {/* Métodos de Pago No Activos */}
            <div style={{ marginTop: 30 }}>
                <h5 style={{ margin: '0 0 10px 0', color: '#B91C1C', fontSize: 15, fontWeight: 700 }}>Métodos de Pago No Activos</h5>
                {noActivos.length === 0 ? (
                    <p style={{ color: '#666', fontStyle: 'italic', marginLeft: 8 }}>No hay métodos de pago no activos.</p>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, background: '#FEF2F2', borderRadius: 8 }}>
                        <thead>
                            <tr>
                                <th style={thStyle}>Tipo</th>
                                <th style={thStyle}>Descripción</th>
                                <th style={thStyle}>Datos</th>
                                <th style={{...thStyle, textAlign: 'right'}}>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {noActivos.map(m => (
                                <tr key={m.id_metodo_pago} style={{ borderBottom: '1px solid #FCA5A5' }}>
                                    <td style={tdStyle}>{m.tipo}</td>
                                    <td style={tdStyle}>{m.descripcion || '-'}</td>
                                    <td style={tdStyle}>{m.datos_pago || 'Sin datos adicionales'}</td>
                                    <td style={{...tdStyle, textAlign: 'right'}}>
                                        <button onClick={() => handleToggle(m.id_metodo_pago, m.activo)} style={iconBtnStyle} title={m.activo ? "Desactivar" : "Activar"}>
                                            {m.activo ? <CheckCircle size={18} color="#10B981" /> : <Ban size={18} color="#EF4444" />}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

// --- SUB-COMPONENTE: PRODUCTOS ---
function ProductosManager({ proveedor, idMicro }) {
    const [productosProv, setProductosProv] = useState([]);
    const [globales, setGlobales] = useState([]);
    const [noActivos, setNoActivos] = useState([]);
    const [form, setForm] = useState({ id_producto: '', precio_referencia: '' });
    const [showForm, setShowForm] = useState(false);

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const [misProds, allProds, noActivosRes] = await Promise.all([
                getProductosProveedor(proveedor.id_proveedor, idMicro),
                getProductosGlobales(idMicro),
                getProductosNoActivos(proveedor.id_proveedor, idMicro)
            ]);
            setProductosProv(misProds.data);
            setGlobales(allProds.data);
            setNoActivos(noActivosRes.data);
        } catch (e) { console.error(e); }
    };

    const handleAssociate = async (e) => {
        e.preventDefault();
        try {
            await asociarProducto(proveedor.id_proveedor, form, idMicro);
            setForm({ id_producto: '', precio_referencia: '' });
            setShowForm(false);
            loadData();
        } catch (e) { alert("Error: Verifica que no esté ya asociado"); }
    };

    const handleToggle = async (idProd, status) => {
        await toggleProductoProveedor(proveedor.id_proveedor, idProd, !status, idMicro);
        loadData();
    };

    const disponibles = globales.filter(g => !productosProv.some(p => p.id_producto === g.id_producto));

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 15, alignItems: 'center' }}>
                <h4 style={{ margin: 0, color: '#0A3A40', fontSize: 16 }}>Productos Suministrados</h4>
                <button onClick={() => setShowForm(!showForm)} style={smallBtnStyle}>
                    {showForm ? 'Cancelar' : '+ Asociar Producto'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleAssociate} style={formBoxStyle}>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
                        <div>
                            <label style={labelStyle}>Producto</label>
                            <select required style={inputStyle} value={form.id_producto} onChange={e => setForm({...form, id_producto: e.target.value})}>
                                <option value="">-- Seleccionar --</option>
                                {disponibles.map(p => <option key={p.id_producto} value={p.id_producto}>{p.nombre}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={labelStyle}>Precio Ref. (Bs)</label>
                            <input type="number" step="0.50" style={inputStyle} value={form.precio_referencia} onChange={e => setForm({...form, precio_referencia: e.target.value})} />
                        </div>
                    </div>
                    <button type="submit" style={saveBtnStyle}>Asociar</button>
                </form>
            )}

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                <thead style={{ background: '#F3F4F6' }}>
                    <tr>
                        <th style={thStyle}>Producto</th>
                        <th style={thStyle}>Precio Ref.</th>
                        <th style={{...thStyle, textAlign: 'right'}}>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    {productosProv.map(p => (
                        <tr key={p.id_producto} style={{ borderBottom: '1px solid #E5E7EB' }}>
                            {/* CORRECCIÓN COLOR TEXTO TABLA */}
                            <td style={tdStyle}>{p.producto ? p.producto.nombre : `ID: ${p.id_producto}`}</td>
                            <td style={tdStyle}>{p.precio_referencia} Bs</td>
                            <td style={{...tdStyle, textAlign: 'right'}}>
                                <button onClick={() => handleToggle(p.id_producto, p.activo)} style={iconBtnStyle} title={p.activo ? "Desactivar" : "Activar"}>
                                    {p.activo ? <CheckCircle size={18} color="#10B981" /> : <Ban size={18} color="#EF4444" />}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Productos No Activos */}
            <div style={{ marginTop: 30 }}>
                <h5 style={{ margin: '0 0 10px 0', color: '#B91C1C', fontSize: 15, fontWeight: 700 }}>Productos No Activos</h5>
                {noActivos.length === 0 ? (
                    <p style={{ color: '#666', fontStyle: 'italic', marginLeft: 8 }}>No hay productos no activos.</p>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, background: '#FEF2F2', borderRadius: 8 }}>
                        <thead>
                            <tr>
                                <th style={thStyle}>Producto</th>
                                <th style={thStyle}>Precio Ref.</th>
                                <th style={{...thStyle, textAlign: 'right'}}>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {noActivos.map(p => (
                                <tr key={p.id_producto} style={{ borderBottom: '1px solid #FCA5A5' }}>
                                    <td style={tdStyle}>{p.producto ? p.producto.nombre : `ID: ${p.id_producto}`}</td>
                                    <td style={tdStyle}>{p.precio_referencia} Bs</td>
                                    <td style={{...tdStyle, textAlign: 'right'}}>
                                        <button onClick={() => handleToggle(p.id_producto, p.activo)} style={iconBtnStyle} title={p.activo ? "Desactivar" : "Activar"}>
                                            {p.activo ? <CheckCircle size={18} color="#10B981" /> : <Ban size={18} color="#EF4444" />}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

// --- ESTILOS CORREGIDOS (Alto Contraste) ---
const overlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 };
const modalStyle = { background: '#fff', width: '650px', maxHeight: '85vh', borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' };
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, borderBottom: '1px solid #eee', paddingBottom: 15 };
const tabsContainerStyle = { display: 'flex', gap: 20, marginBottom: 20, borderBottom: '1px solid #eee' };
const tabStyle = { padding: '10px 5px', background: 'none', border: 'none', borderBottom: '2px solid transparent', cursor: 'pointer', color: '#6B7280', display: 'flex', gap: 8, alignItems: 'center', fontSize: 14, fontWeight: 500 };
const activeTabStyle = { ...tabStyle, color: '#1D7373', borderBottom: '2px solid #1D7373', fontWeight: 'bold' };

// Botones
const closeBtnStyle = { background: 'none', border: 'none', cursor: 'pointer', color: '#666' };
const smallBtnStyle = { padding: '6px 12px', fontSize: 13, background: '#1D7373', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' };
const saveBtnStyle = { padding: '10px', background: '#1D7373', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, width: '100%', marginTop: 15 };
const iconBtnStyle = { background: 'none', border: 'none', cursor: 'pointer', padding: 4 };

// Formularios
const formBoxStyle = { background: '#F8FAFC', padding: 15, borderRadius: 8, marginBottom: 15, border: '1px solid #E2E8F0' };
const labelStyle = { display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 4, textTransform: 'uppercase' };
// 👇 AQUÍ ESTÁ LA CORRECCIÓN CLAVE DEL COLOR DE TEXTO
const inputStyle = { 
    padding: '10px', 
    borderRadius: 6, 
    border: '1px solid #D1D5DB', 
    width: '100%', 
    boxSizing: 'border-box', 
    outline: 'none', 
    fontSize: 14,
    color: '#111827', // Texto casi negro, no blanco
    backgroundColor: '#fff' 
};

// Tarjetas de Lista
const cardItemStyle = { 
    background: '#fff', 
    border: '1px solid #E5E7EB', 
    padding: '12px', 
    borderRadius: 8, 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
};

// Tabla
const thStyle = { padding: '10px 15px', textAlign: 'left', color: '#4B5563', fontSize: 13, fontWeight: 700, textTransform: 'uppercase' };
const tdStyle = { padding: '10px 15px', color: '#1F2937', borderBottom: '1px solid #E5E7EB' }; // Texto oscuro