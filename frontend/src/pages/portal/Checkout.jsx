import React, { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import { crearVentaOnline, registrarPagoVenta } from "../../api/ventas.api";
import { verificarClientePorDocumento, obtenerClientePorId } from "../../api/clientes.api";
import { useNavigate, useParams } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Swal from "sweetalert2";

// === ICONOS SVG ===
const IconCheck = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const IconUser = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const IconCreditCard = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </svg>
);

const IconPackage = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12.89 1.45l8 4A2 2 0 0 1 22 7.24v9.53a2 2 0 0 1-1.11 1.79l-8 4a2 2 0 0 1-1.79 0l-8-4a2 2 0 0 1-1.1-1.8V7.24a2 2 0 0 1 1.11-1.79l8-4a2 2 0 0 1 1.78 0z" />
    <polyline points="2.32 6.16 12 11 21.68 6.16" />
    <line x1="12" y1="22.76" x2="12" y2="11" />
  </svg>
);

const IconShoppingBag = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

const IconSearch = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const IconUserPlus = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="8.5" cy="7" r="4" />
    <line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" />
  </svg>
);

const IconArrowLeft = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const IconArrowRight = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const IconLoader = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
    <line x1="12" y1="2" x2="12" y2="6" /><line x1="12" y1="18" x2="12" y2="22" />
    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" /><line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
    <line x1="2" y1="12" x2="6" y2="12" /><line x1="18" y1="12" x2="22" y2="12" />
    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" /><line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
  </svg>
);

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const { id_microempresa } = useParams();
  const navigate = useNavigate();

  const [paso, setPaso] = useState(0);
  const [loading, setLoading] = useState(false);
  const [documentoInput, setDocumentoInput] = useState("");
  const [verificando, setVerificando] = useState(false);
  const [clienteExistente, setClienteExistente] = useState(null);
  const [clienteId, setClienteId] = useState(null);
  const [clienteNuevo, setClienteNuevo] = useState({ nombre: "", documento: "", telefono: "", email: "" });
  const [ventaCreadaId, setVentaCreadaId] = useState(null);
  const [savedCart, setSavedCart] = useState([]);
  const [savedTotal, setSavedTotal] = useState(0);

  useEffect(() => {
    if (cart.length === 0 && paso === 0) {
      Swal.fire({ icon: 'info', title: 'Carrito vacío', text: 'Agrega productos antes de ir a caja.', confirmButtonColor: '#0A3A40' })
        .then(() => navigate(`/portal/${id_microempresa}`));
    }
    if (cart.length > 0) {
      setSavedCart([...cart]);
      setSavedTotal(cartTotal);
    }
  }, [cart, paso, navigate, id_microempresa, cartTotal]);

  const handleVerificarCI = async (e) => {
    e.preventDefault();
    if (!documentoInput.trim()) return;
    setVerificando(true);
    try {
      const res = await verificarClientePorDocumento(id_microempresa, documentoInput.trim());
      if (res.data.existe) {
        setClienteId(res.data.id_cliente);
        const clienteRes = await obtenerClientePorId(res.data.id_cliente);
        setClienteExistente(clienteRes.data);
        Swal.fire({ icon: 'success', title: '¡Bienvenido!', text: `Hola ${clienteRes.data.nombre}`, confirmButtonColor: '#0A3A40', timer: 2000 });
        setPaso(2);
      } else {
        setClienteNuevo({ ...clienteNuevo, documento: documentoInput });
        setPaso(1);
      }
    } catch (error) {
      Swal.fire("Error", "No se pudo verificar el documento.", "error");
    } finally {
      setVerificando(false);
    }
  };

  const handleRegistrarYPagar = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const idEmpresaInt = parseInt(id_microempresa);
      const totalActual = cartTotal > 0 ? cartTotal : savedTotal;
      const ventaPayload = {
        id_microempresa: idEmpresaInt, total: totalActual, estado: "PENDIENTE_PAGO", tipo: "ONLINE",
        detalles: cart.map(item => ({ id_producto: item.id_producto, cantidad: item.cantidad, precio_unitario: parseFloat(item.precio_venta), subtotal: item.cantidad * parseFloat(item.precio_venta) }))
      };
      const clientePayload = { ...clienteNuevo, id_microempresa: idEmpresaInt, fecha_creacion: new Date().toISOString() };
      setSavedTotal(totalActual);
      const res = await crearVentaOnline(ventaPayload, clientePayload);
      setVentaCreadaId(res.data.id_venta);
      clearCart();
      setPaso(2);
      Swal.fire({ icon: 'success', title: 'Pedido Registrado', text: 'Ahora realiza el pago por QR.', confirmButtonColor: '#0A3A40', timer: 2000 });
    } catch (error) {
      Swal.fire("Error", "No se pudo procesar. Intenta nuevamente.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCrearVentaClienteExistente = async () => {
    setLoading(true);
    try {
      const idEmpresaInt = parseInt(id_microempresa);
      const totalActual = cartTotal > 0 ? cartTotal : savedTotal;
      const ventaPayload = {
        id_microempresa: idEmpresaInt, id_cliente: clienteId, total: totalActual, estado: "PENDIENTE_PAGO", tipo: "ONLINE",
        detalles: cart.map(item => ({ id_producto: item.id_producto, cantidad: item.cantidad, precio_unitario: parseFloat(item.precio_venta), subtotal: item.cantidad * parseFloat(item.precio_venta) }))
      };
      setSavedTotal(totalActual);
      const res = await crearVentaOnline(ventaPayload, clienteExistente);
      setVentaCreadaId(res.data.id_venta);
      clearCart();
    } catch (error) {
      Swal.fire("Error", "No se pudo crear la venta.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (paso === 2 && clienteExistente && !ventaCreadaId && cart.length > 0) {
      handleCrearVentaClienteExistente();
    }
  }, [paso, clienteExistente]);

  const handleConfirmarPago = async () => {
    setLoading(true);
    try {
      await registrarPagoVenta(ventaCreadaId, "QR", "https://bucket-ejemplo.com/comprobante.jpg");
      setPaso(3);
      generarPDF();
      Swal.fire({ icon: 'success', title: '¡Pago Enviado!', text: 'Un administrador lo validará pronto.', confirmButtonColor: '#0A3A40' });
    } catch (error) {
      Swal.fire("Error", "No se pudo registrar el pago.", "error");
    } finally {
      setLoading(false);
    }
  };

  const generarPDF = () => {
    const doc = new jsPDF();
    const nombreCliente = clienteExistente?.nombre || clienteNuevo.nombre;
    doc.setFontSize(18); doc.text("Comprobante de Pedido", 14, 20);
    doc.setFontSize(12); doc.text(`Código: #${ventaCreadaId}`, 14, 30);
    doc.text(`Cliente: ${nombreCliente}`, 14, 38);
    doc.text(`Total: Bs. ${savedTotal.toFixed(2)}`, 14, 50);
    doc.save(`pedido_${ventaCreadaId}.pdf`);
  };

  const totalMostrar = cartTotal > 0 ? cartTotal : savedTotal;
  const productosAMostrar = cart.length > 0 ? cart : savedCart;

  // ========== COMPONENTE PANEL DE RESUMEN ==========
  const ResumenPanel = () => (
    <div style={styles.summaryPanel}>
      <h3 style={styles.summaryTitle}>
        <IconPackage size={20} /> Resumen de Compra
      </h3>
      <div style={styles.productList}>
        {productosAMostrar.map((item) => (
          <div key={item.id_producto} style={styles.productItem}>
            <div style={styles.productImage}>
              {item.imagen ? (
                <img src={`http://localhost:8000${item.imagen}`} alt={item.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#CBD5E1', fontSize: '0.7rem' }}>Sin foto</div>
              )}
            </div>
            <div style={styles.productInfo}>
              <p style={styles.productName}>{item.nombre}</p>
              <p style={styles.productQty}>Cant: {item.cantidad}</p>
            </div>
            <span style={styles.productPrice}>Bs. {(item.precio_venta * item.cantidad).toFixed(2)}</span>
          </div>
        ))}
      </div>
      <div style={styles.totalBox}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ opacity: 0.9 }}>Total a Pagar</span>
          <span style={{ fontSize: '1.75rem', fontWeight: '800' }}>Bs. {totalMostrar.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );

  const styles = {
    wrapper: { minHeight: '100vh', background: 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)', padding: '40px 20px', fontFamily: "'Inter', system-ui, sans-serif" },
    container: { maxWidth: '1100px', margin: '0 auto', background: 'white', borderRadius: '24px', boxShadow: '0 25px 80px rgba(10, 58, 64, 0.12)', overflow: 'hidden' },
    header: { background: 'linear-gradient(135deg, #0A3A40 0%, #1D7373 100%)', padding: '32px', textAlign: 'center', color: 'white' },
    headerTitle: { fontSize: '1.75rem', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '4px' },
    mainLayout: { display: 'grid', gridTemplateColumns: '1fr 360px', minHeight: '500px' },
    formSection: { padding: '40px' },
    summaryPanel: { background: '#F8FAFC', padding: '32px', borderLeft: '1px solid #E2E8F0' },
    summaryTitle: { fontSize: '1rem', fontWeight: '700', color: '#1E293B', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' },
    productList: { maxHeight: '300px', overflowY: 'auto', marginBottom: '20px' },
    productItem: { display: 'flex', gap: '12px', padding: '12px', background: 'white', borderRadius: '12px', marginBottom: '10px', alignItems: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.04)' },
    productImage: { width: '56px', height: '56px', borderRadius: '10px', overflow: 'hidden', background: '#E2E8F0', flexShrink: 0 },
    productInfo: { flex: 1 },
    productName: { fontWeight: '600', color: '#1E293B', fontSize: '0.9rem', margin: 0 },
    productQty: { color: '#64748B', fontSize: '0.8rem', margin: '4px 0 0 0' },
    productPrice: { fontWeight: '700', color: '#0A3A40', fontSize: '0.95rem' },
    totalBox: { background: 'linear-gradient(135deg, #0A3A40 0%, #1D7373 100%)', borderRadius: '14px', padding: '20px', color: 'white' },
    stepCard: { background: '#FAFBFC', borderRadius: '20px', padding: '36px', textAlign: 'center', border: '2px solid #E2E8F0' },
    input: { width: '100%', padding: '16px 20px', border: '2px solid #E2E8F0', borderRadius: '14px', fontSize: '1.1rem', outline: 'none', textAlign: 'center', fontWeight: '600', letterSpacing: '2px', background: 'white' },
    inputSmall: { width: '100%', padding: '14px 16px', border: '2px solid #E2E8F0', borderRadius: '12px', fontSize: '1rem', outline: 'none', background: 'white' },
    label: { display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '6px' },
    btn: { padding: '14px 28px', borderRadius: '14px', fontSize: '1rem', fontWeight: '700', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '10px', border: 'none', transition: 'all 0.3s ease' },
    btnPrimary: { background: 'linear-gradient(135deg, #0A3A40 0%, #1D7373 100%)', color: 'white', boxShadow: '0 10px 30px rgba(10, 58, 64, 0.25)' },
    btnSuccess: { background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', color: 'white', boxShadow: '0 10px 30px rgba(16, 185, 129, 0.3)' },
    qrContainer: { background: '#F1F5F9', border: '3px dashed #CBD5E1', borderRadius: '20px', padding: '28px', textAlign: 'center', marginBottom: '20px' },
    formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', textAlign: 'left' }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.headerTitle}><IconShoppingBag size={28} /> Finalizar Compra</h1>
          <p style={{ opacity: 0.8, margin: 0 }}>Proceso seguro y rápido</p>
        </div>

        <div style={styles.mainLayout}>
          <div style={styles.formSection}>

            {/* PASO 0: VERIFICAR CI */}
            {paso === 0 && (
              <div style={styles.stepCard}>
                <IconSearch size={48} style={{ color: '#1D7373', marginBottom: '20px' }} />
                <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#1E293B', marginBottom: '10px' }}>¿Ya eres cliente?</h2>
                <p style={{ color: '#64748B', marginBottom: '28px' }}>Ingresa tu CI para verificar</p>
                <form onSubmit={handleVerificarCI}>
                  <input type="text" value={documentoInput} onChange={(e) => setDocumentoInput(e.target.value)} placeholder="Tu CI / NIT" style={styles.input} required autoFocus />
                  <div style={{ marginTop: '20px' }}>
                    <button type="submit" disabled={verificando} style={{ ...styles.btn, ...styles.btnPrimary, opacity: verificando ? 0.7 : 1 }}>
                      {verificando ? <IconLoader size={20} /> : <IconSearch size={20} />}
                      {verificando ? "Verificando..." : "Verificar CI"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* PASO 1: REGISTRO CLIENTE NUEVO */}
            {paso === 1 && (
              <div style={styles.stepCard}>
                <IconUserPlus size={48} style={{ color: '#1D7373', marginBottom: '20px' }} />
                <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#1E293B', marginBottom: '10px' }}>¡Bienvenido!</h2>
                <p style={{ color: '#64748B', marginBottom: '28px' }}>Completa tus datos para continuar</p>
                <form onSubmit={handleRegistrarYPagar}>
                  <div style={styles.formGrid}>
                    <div><label style={styles.label}>CI / NIT</label><input value={clienteNuevo.documento} style={styles.inputSmall} disabled /></div>
                    <div><label style={styles.label}>Nombre Completo *</label><input value={clienteNuevo.nombre} onChange={(e) => setClienteNuevo({ ...clienteNuevo, nombre: e.target.value })} placeholder="Juan Pérez" style={styles.inputSmall} required /></div>
                    <div><label style={styles.label}>Teléfono *</label><input value={clienteNuevo.telefono} onChange={(e) => setClienteNuevo({ ...clienteNuevo, telefono: e.target.value })} placeholder="70012345" style={styles.inputSmall} required /></div>
                    <div><label style={styles.label}>Email (Opcional)</label><input type="email" value={clienteNuevo.email} onChange={(e) => setClienteNuevo({ ...clienteNuevo, email: e.target.value })} placeholder="correo@ejemplo.com" style={styles.inputSmall} /></div>
                  </div>
                  <div style={{ marginTop: '28px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
                    <button type="button" onClick={() => setPaso(0)} style={{ ...styles.btn, background: '#E2E8F0', color: '#475569' }}><IconArrowLeft size={18} /> Volver</button>
                    <button type="submit" disabled={loading} style={{ ...styles.btn, ...styles.btnPrimary, opacity: loading ? 0.7 : 1 }}>{loading ? "Procesando..." : "Registrar y Pagar"} {!loading && <IconArrowRight size={18} />}</button>
                  </div>
                </form>
              </div>
            )}

            {/* PASO 2: PAGO QR */}
            {paso === 2 && (
              <div style={styles.stepCard}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#1E293B', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                  <IconCreditCard size={24} /> Escanea el QR para Pagar
                </h2>
                <div style={styles.qrContainer}>
                  <div style={{ background: 'white', borderRadius: '16px', padding: '20px', display: 'inline-block', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=Pago-Bs${savedTotal.toFixed(2)}`} alt="QR" style={{ width: '160px', height: '160px' }} />
                    <p style={{ marginTop: '12px', fontSize: '1.5rem', fontWeight: '800', color: '#0A3A40' }}>Bs. {savedTotal.toFixed(2)}</p>
                  </div>
                </div>
                <div style={{ background: '#EFF6FF', borderRadius: '12px', padding: '14px', marginBottom: '20px', textAlign: 'left' }}>
                  <p style={{ margin: '3px 0', color: '#1E40AF', fontSize: '0.85rem' }}><strong>Banco:</strong> BCP</p>
                  <p style={{ margin: '3px 0', color: '#1E40AF', fontSize: '0.85rem' }}><strong>Cuenta:</strong> 123-45678-00</p>
                  <p style={{ margin: '3px 0', color: '#1E40AF', fontSize: '0.85rem' }}><strong>Titular:</strong> Empresa Demo S.R.L.</p>
                </div>
                <button onClick={handleConfirmarPago} disabled={loading || !ventaCreadaId} style={{ ...styles.btn, ...styles.btnSuccess, opacity: (loading || !ventaCreadaId) ? 0.7 : 1 }}>
                  {loading ? "Enviando..." : "Ya realicé el pago"} {!loading && <IconCheck size={20} />}
                </button>
              </div>
            )}

            {/* PASO 3: ÉXITO */}
            {paso === 3 && (
              <div style={{ ...styles.stepCard, background: '#ECFDF5', border: '2px solid #A7F3D0' }}>
                <div style={{ width: '80px', height: '80px', background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: 'white', boxShadow: '0 15px 30px rgba(16, 185, 129, 0.3)' }}>
                  <IconCheck size={40} />
                </div>
                <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#065F46', marginBottom: '8px' }}>¡Pedido Exitoso!</h2>
                <p style={{ color: '#047857', fontSize: '1rem', marginBottom: '28px' }}>Tu código: <strong>#{ventaCreadaId}</strong></p>
                <button onClick={() => navigate(`/portal/${id_microempresa}`)} style={{ ...styles.btn, background: '#065F46', color: 'white' }}><IconArrowLeft size={18} /> Volver a la tienda</button>
              </div>
            )}
          </div>

          {/* PANEL LATERAL: RESUMEN DE PRODUCTOS */}
          <ResumenPanel />
        </div>
      </div>
      <style>{`input:focus { border-color: #1D7373 !important; box-shadow: 0 0 0 4px rgba(29, 115, 115, 0.1); } @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}