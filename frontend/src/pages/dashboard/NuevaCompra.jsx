import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getProveedores, getProductosProveedor, getMetodosPago } from '../../api/proveedores.api';
import { createCompra } from '../../api/compras.api';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Plus, Trash2, CreditCard, QrCode, Banknote } from 'lucide-react';

export default function NuevaCompra() {
    const { user } = useAuth();
    const navigate = useNavigate();
    
    // Estados
    const [proveedores, setProveedores] = useState([]);
    const [selectedProveedor, setSelectedProveedor] = useState('');
    const [productosDisponibles, setProductosDisponibles] = useState([]);
    const [metodosPago, setMetodosPago] = useState([]);
    
    const [itemsCompra, setItemsCompra] = useState([]);
    const [currentItem, setCurrentItem] = useState({ producto_id: '', cantidad: 1, precio_unitario: 0 });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user?.microempresa?.id_microempresa) {
            getProveedores(user.microempresa.id_microempresa)
                .then(res => setProveedores(res.data));
        }
    }, [user]);

    const handleProveedorChange = async (e) => {
        const idProv = e.target.value;
        setSelectedProveedor(idProv);
        setItemsCompra([]); 
        setMetodosPago([]);
        
        if (idProv && user?.microempresa?.id_microempresa) {
            try {
                const prodRes = await getProductosProveedor(idProv, user.microempresa.id_microempresa);
                setProductosDisponibles(prodRes.data);

                const pagoRes = await getMetodosPago(idProv, user.microempresa.id_microempresa);
                setMetodosPago(pagoRes.data);

            } catch (error) {
                console.error("Error cargando datos del proveedor");
            }
        }
    };

    const handleProductSelect = (e) => {
        const idProd = parseInt(e.target.value);
        const prod = productosDisponibles.find(p => p.id_producto === idProd);
        
        if (prod) {
            setCurrentItem({
                producto_id: idProd,
                cantidad: 1,
                precio_unitario: prod.precio_referencia || 0
            });
        }
    };

    const agregarItem = () => {
        const prod = productosDisponibles.find(p => p.id_producto === parseInt(currentItem.producto_id));
        if (!prod) return;
        
        const nombreProducto = prod.producto ? prod.producto.nombre : `Producto #${prod.id_producto}`;

        setItemsCompra([...itemsCompra, {
            ...currentItem, 
            nombre: nombreProducto,
            subtotal: currentItem.cantidad * currentItem.precio_unitario
        }]);
        setCurrentItem({ producto_id: '', cantidad: 1, precio_unitario: 0 });
    };

    const guardar = async () => {
        if (!user?.microempresa?.id_microempresa) return;
        setLoading(true);
        try {
            // Nota: Se asume que el método de pago es EFECTIVO para el registro inicial, 
            // el pago real se hace mirando el QR.
            await createCompra({
                id_microempresa: user.microempresa.id_microempresa,
                id_proveedor: parseInt(selectedProveedor),
                detalles: itemsCompra.map(i => ({
                    id_producto: i.producto_id,
                    cantidad: i.cantidad,
                    precio_unitario: i.precio_unitario
                })),
                metodo_pago: "EFECTIVO", 
                observacion: "Compra registrada desde panel web"
            });
            alert("✅ Compra registrada con éxito");
            navigate('/dashboard/compras');
        } catch(e) { 
            alert("Error al registrar la compra"); 
        } finally { 
            setLoading(false); 
        }
    };

    return (
        <div style={mainContainerStyle}>
            {/* Header y Botón Volver */}
            <div style={{ marginBottom: 30 }}>
                <button onClick={() => navigate('/dashboard/compras')} style={backBtnStyle}>
                    <ArrowLeft size={20} /> Volver al Historial
                </button>
                <h2 style={pageTitleStyle}>
                    <ShoppingCart size={32} style={{ color: '#1D7373' }} /> Registrar Nueva Compra
                </h2>
                <p style={{ color: '#64748B', marginTop: 5 }}>Selecciona un proveedor y arma tu pedido.</p>
            </div>

            <div style={gridLayout}>
                
                {/* === COLUMNA IZQUIERDA: Formulario y Tabla === */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 25 }}>
                    
                    {/* 1. SELECCIÓN DE PROVEEDOR */}
                    <div style={cardStyle}>
                        <h3 style={cardHeaderStyle}>1. Datos del Proveedor</h3>
                        <div style={{ padding: 20 }}>
                            <label style={labelStyle}>Seleccionar Proveedor</label>
                            <select style={inputStyle} value={selectedProveedor} onChange={handleProveedorChange}>
                                <option value="">-- Seleccionar --</option>
                                {proveedores.map(p => (
                                    <option key={p.id_proveedor} value={p.id_proveedor}>{p.nombre}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* 2. AGREGAR PRODUCTOS */}
                    <div style={{...cardStyle, opacity: selectedProveedor ? 1 : 0.7, pointerEvents: selectedProveedor ? 'auto' : 'none'}}>
                        <h3 style={cardHeaderStyle}>2. Armar Pedido</h3>
                        <div style={{ padding: 20 }}>
                            {productosDisponibles.length === 0 ? (
                                <p style={emptyStateStyle}>
                                    ⚠️ Este proveedor no tiene productos configurados.
                                </p>
                            ) : (
                                <div style={productFormGrid}>
                                    <div style={{ gridColumn: 'span 2' }}>
                                        <label style={labelStyle}>Producto</label>
                                        <select style={inputStyle} value={currentItem.producto_id} onChange={handleProductSelect}>
                                            <option value="">Seleccionar producto...</option>
                                            {productosDisponibles.map(p => (
                                                <option key={p.id_producto} value={p.id_producto}>
                                                    {p.producto ? p.producto.nombre : `ID: ${p.id_producto}`}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Cantidad</label>
                                        <input type="number" min="1" style={inputStyle} value={currentItem.cantidad} 
                                            onChange={e => setCurrentItem({...currentItem, cantidad: parseFloat(e.target.value)})} />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Costo U. (Bs)</label>
                                        {/* ESTILO DIFERENTE PARA SOLO LECTURA */}
                                        <input 
                                            type="number" 
                                            style={inputStyle} 
                                            value={currentItem.precio_unitario}
                                            min={0}
                                            step={0.01}
                                            onChange={e => setCurrentItem({ ...currentItem, precio_unitario: parseFloat(e.target.value) })}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                                         <button onClick={agregarItem} disabled={!currentItem.producto_id} style={actionBtnStyle}>
                                            <Plus size={22} /> Agregar
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 3. TABLA RESUMEN */}
                    {itemsCompra.length > 0 && (
                        <div style={{...cardStyle, overflow: 'hidden'}}>
                             <h3 style={cardHeaderStyle}>3. Resumen del Pedido</h3>
                            <table style={tableStyle}>
                                <thead style={tableHeaderStyle}>
                                    <tr>
                                        <th style={thStyle}>Producto</th>
                                        <th style={thStyle} align="center">Cant.</th>
                                        <th style={thStyle} align="right">Costo U.</th>
                                        <th style={thStyle} align="right">Subtotal</th>
                                        <th style={thStyle}></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {itemsCompra.map((item, i) => (
                                        <tr key={i} style={tableRowStyle}>
                                            <td style={tdStyle}><strong>{item.nombre}</strong></td>
                                            <td style={tdStyle} align="center">{item.cantidad}</td>
                                            <td style={tdStyle} align="right">{item.precio_unitario.toFixed(2)} Bs</td>
                                            <td style={{...tdStyle, color: '#1D7373', fontWeight: 700}} align="right">
                                                {item.subtotal.toFixed(2)} Bs
                                            </td>
                                            <td style={tdStyle} align="center">
                                                <button onClick={() => setItemsCompra(prev => prev.filter((_, idx) => idx !== i))} style={deleteBtnStyle}>
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                             {/* TOTAL Y BOTÓN FINAL */}
                            <div style={totalSectionStyle}>
                                <div style={{textAlign: 'right', marginBottom: 20}}>
                                    <span style={{color: '#64748B', fontSize: 14}}>Total a Pagar</span>
                                    <h3 style={{ color: '#0A3A40', margin: '5px 0 0 0', fontSize: 32, fontWeight: 800 }}>
                                       {itemsCompra.reduce((a, b) => a + b.subtotal, 0).toFixed(2)} <span style={{fontSize: 20, color: '#1D7373'}}>Bs</span>
                                    </h3>
                                </div>
                                <button onClick={guardar} disabled={loading} style={submitStyle}>
                                    {loading ? "Procesando Pedido..." : `CONFIRMAR COMPRA (${itemsCompra.length} items)`}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* === COLUMNA DERECHA: DATOS DE PAGO (QR MEJORADO) === */}
                <div>
                    {selectedProveedor ? (
                        <div style={paymentCardStyle}>
                            <div style={paymentHeaderStyle}>
                                <CreditCard size={24} color="white"/>
                                <h3 style={{margin: 0, color: 'white', fontSize: 18}}>Información de Pago</h3>
                            </div>
                            
                            <div style={{ padding: 25 }}>
                                {metodosPago.length > 0 ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                        {metodosPago.map(m => (
                                            <div key={m.id_metodo_pago}>
                                                {m.tipo === 'QR' ? (
                                                    // --- SECCIÓN QR DESTACADA ---
                                                    <div style={qrContainerStyle}>
                                                        <div style={qrHeaderStyle}>
                                                             <QrCode size={20} /> Escanea para pagar con QR
                                                        </div>
                                                        {/* Simulamos un marco de escaneo */}
                                                        <div style={qrFrameStyle}>
                                                             {/* Si tuvieras la imagen real: <img src={m.qr_imagen} ... /> */}
                                                             {/* Como placeholder usamos un icono gigante */}
                                                            <QrCode size={100} color="#2D3748" strokeWidth={1.5} />
                                                        </div>
                                                        <p style={{textAlign: 'center', color: '#64748B', fontSize: 13, marginTop: 10}}>
                                                            {m.descripcion || "Usa tu aplicación bancaria para escanear."}
                                                        </p>
                                                    </div>
                                                ) : (
                                                    // --- OTRAS FORMAS DE PAGO (Banco, Efectivo) ---
                                                     <div style={otherMethodStyle}>
                                                        <div style={{display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8}}>
                                                            <Banknote size={18} color="#1D7373"/>
                                                            <strong>{m.tipo.replace('_', ' ')}</strong>
                                                        </div>
                                                        <div style={{ fontSize: 14, color: '#475569' }}>{m.descripcion}</div>
                                                        {m.datos_pago && (
                                                            <div style={paymentDataBoxStyle}>
                                                                {m.datos_pago}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div style={{ textAlign: 'center', color: '#94A3B8', padding: '30px 0' }}>
                                        <CreditCard size={48} style={{ marginBottom: 10, opacity: 0.5 }} />
                                        <p>Este proveedor no tiene métodos de pago registrados.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                         // Estado vacío columna derecha
                        <div style={emptyRightColumnStyle}>
                            <ShoppingCart size={60} color="#CBD5E1"/>
                            <p style={{color: '#94A3B8', marginTop: 20, textAlign: 'center'}}>
                                Selecciona un proveedor para ver sus productos y opciones de pago disponibles.
                            </p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

// --- NUEVOS ESTILOS MEJORADOS (Legibilidad y QR) ---

// Contenedores Principales
const mainContainerStyle = { maxWidth: 1200, margin: "30px auto", padding: "0 20px" };
const gridLayout = { display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: 30, alignItems: 'start' };

// Títulos y Botones de Navegación
const pageTitleStyle = { color: "#1E293B", fontWeight: 800, fontSize: 30, margin: '10px 0 5px 0', display: 'flex', alignItems: 'center', gap: 12 };
const backBtnStyle = { display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', color: '#64748B', fontWeight: 600, fontSize: 14, cursor: 'pointer', padding: 0, transition: 'color 0.2s' };

// Tarjetas (Cards) Generales
const cardStyle = { background: '#fff', borderRadius: 12, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)", border: '1px solid #E2E8F0', overflow: 'hidden' };
const cardHeaderStyle = { background: '#F8FAFC', padding: '15px 20px', margin: 0, borderBottom: '1px solid #E2E8F0', color: '#334155', fontSize: 16, fontWeight: 700 };
const emptyStateStyle = { color: '#B45309', background: '#FFFBEB', padding: 15, borderRadius: 8, border: '1px solid #FCD34D', display: 'flex', alignItems: 'center', gap: 10 };
const emptyRightColumnStyle = { height: '100%', minHeight: '400px', border: '3px dashed #E2E8F0', borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20 };

// Formularios e Inputs
const productFormGrid = { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 15, alignItems: 'end' };
const labelStyle = { display: 'block', marginBottom: 6, color: '#334155', fontWeight: 700, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.5px' };
const inputStyle = { padding: "12px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 15, width: '100%', boxSizing: 'border-box', outline: 'none', color: '#1E293B', transition: 'border-color 0.2s', backgroundColor: '#fff' };
// Estilo específico para el input de solo lectura (costo)
const readOnlyInputStyle = { ...inputStyle, backgroundColor: '#F1F5F9', color: '#475569', borderColor: '#E2E8F0', cursor: 'not-allowed', fontWeight: 700 };
const actionBtnStyle = { background: '#1D7373', color: 'white', border: 'none', borderRadius: 8, padding: 0, cursor: 'pointer', height: '45px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' };

// Tabla
const tableStyle = { width: '100%', borderCollapse: 'collapse' };
const tableHeaderStyle = { background: '#F1F5F9', borderBottom: '1px solid #E2E8F0' };
const thStyle = { padding: "15px 20px", textAlign: "left", fontSize: 13, fontWeight: 700, color: '#475569', textTransform: 'uppercase' };
const tableRowStyle = { borderBottom: '1px solid #F1F5F9' };
const tdStyle = { padding: "15px 20px", fontSize: 15, color: "#334155" };
const deleteBtnStyle = { color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer', padding: 5, display: 'flex', alignItems: 'center' };

// Sección Total
const totalSectionStyle = { padding: 25, background: '#F8FAFC', borderTop: '1px solid #E2E8F0' };
const submitStyle = { width: '100%', padding: "15px", borderRadius: 10, background: "#1D7373", color: "#fff", fontWeight: 800, fontSize: 18, border: "none", cursor: "pointer", boxShadow: "0 10px 15px -3px rgba(29, 115, 115, 0.2)", transition: 'transform 0.1s' };

// === ESTILOS NUEVOS PARA LA TARJETA DE PAGO Y QR ===
const paymentCardStyle = { ...cardStyle, border: 'none', boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" };
const paymentHeaderStyle = { background: 'linear-gradient(135deg, #1D7373 0%, #0D5050 100%)', padding: '20px 25px', display: 'flex', alignItems: 'center', gap: 12 };

// Contenedor del QR destacado
const qrContainerStyle = { background: '#fff', border: '2px solid #1D7373', borderRadius: 12, padding: 20, marginBottom: 20, boxShadow: "0 4px 6px -1px rgba(29, 115, 115, 0.1)" };
const qrHeaderStyle = { textAlign: 'center', fontWeight: 700, color: '#1D7373', marginBottom: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 };
const qrFrameStyle = { width: '160px', height: '160px', margin: '0 auto', border: '4px dashed #CBD5E1', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC' };

// Otros métodos de pago
const otherMethodStyle = { background: '#fff', border: '1px solid #E2E8F0', borderRadius: 10, padding: 15 };
const paymentDataBoxStyle = { background: '#F1F5F9', padding: '10px 12px', borderRadius: 6, fontFamily: 'monospace', fontSize: 14, color: '#334155', border: '1px solid #E2E8F0', marginTop: 8, wordBreak: 'break-all' };