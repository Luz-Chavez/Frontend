import { useEffect, useState } from 'react';
import axios from 'axios';
import './Portal.css';

// Iconos SVG
const IconSearch = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const IconCart = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>;
const IconTrash = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>;
const IconClose = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IconCreditCard = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>;
const UserIconSmall = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight:5}}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const IconPlus = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;

export default function Portal() {
    // --- ESTADOS ---
    const [productos, setProductos] = useState([]);
    const [carrito, setCarrito] = useState([]);
    
    // ✅ ACTUALIZADO: Estado del cliente con documento y email
    const [cliente, setCliente] = useState({ nombre: '', telefono: '', documento: '', email: '' });
    
    const [tarjeta, setTarjeta] = useState({ numero: '', titular: '', expiracion: '', cvv: '' });
    const [busqueda, setBusqueda] = useState("");
    const [loading, setLoading] = useState(false);
    const [ventaGenerada, setVentaGenerada] = useState(null);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [customQuantities, setCustomQuantities] = useState({});

    const ID_MICROEMPRESA = 5; 
    const BASE_URL = 'http://localhost:8000'; 

    useEffect(() => {
        const cargarProductos = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/productos/portal/${ID_MICROEMPRESA}/listado`);
                setProductos(res.data);
            } catch (error) {
                console.error("Error cargando productos:", error);
            }
        };
        cargarProductos();
    }, []);

    const toggleCart = () => setIsCartOpen(!isCartOpen);

    const agregarAlCarrito = (producto, cantidadAgregar) => {
        if (ventaGenerada) setVentaGenerada(null);
        setCarrito(prev => {
            const existe = prev.find(item => item.id_producto === producto.id_producto);
            if (existe) {
                return prev.map(item => item.id_producto === producto.id_producto ? { ...item, cantidad: item.cantidad + cantidadAgregar } : item);
            } else {
                return [...prev, { ...producto, cantidad: cantidadAgregar }];
            }
        });
        setIsCartOpen(true);
    };

    const eliminarDelCarrito = (id_producto) => {
        setCarrito(prev => prev.filter(item => item.id_producto !== id_producto));
        if (carrito.length <= 1) setVentaGenerada(null);
    };

    const calcularTotal = () => carrito.reduce((total, item) => total + (item.precio_venta * item.cantidad), 0);

    const handleCustomQtyChange = (idProducto, value) => {
        setCustomQuantities(prev => ({ ...prev, [idProducto]: value }));
    };

    const addCustomQuantity = (producto) => {
        const qty = parseInt(customQuantities[producto.id_producto]);
        if (qty && qty > 0) {
            agregarAlCarrito(producto, qty);
            setCustomQuantities(prev => ({ ...prev, [producto.id_producto]: '' }));
        }
    };

    // --- PROCESAR VENTA ---
    const procesarVenta = async (e) => {
        e.preventDefault();
        if(carrito.length === 0) return alert("Carrito vacío");
        if(tarjeta.numero.length < 13) return alert("Revisa la tarjeta.");
        
        setLoading(true);

        const payload = {
            venta: {
                id_microempresa: ID_MICROEMPRESA,
                total: 0,
                estado: "PENDIENTE_PAGO",
                tipo: "ONLINE",
                detalles: carrito.map(p => ({
                    id_producto: p.id_producto,
                    cantidad: p.cantidad,
                    precio_unitario: p.precio_venta,
                    subtotal: p.cantidad * p.precio_venta
                })),
                pagos: [{
                    metodo: "TARJETA",
                    comprobante_url: `Visa terminada en ${tarjeta.numero.slice(-4)} | Titular: ${tarjeta.titular}`,
                    estado: "PENDIENTE",
                    fecha: new Date().toISOString()
                }]
            },
            // ✅ ACTUALIZADO: Enviamos todos los campos nuevos
            cliente: { 
                nombre: cliente.nombre, 
                telefono: cliente.telefono,
                documento: cliente.documento,
                email: cliente.email
            }
        };

        try {
            const res = await axios.post(`${BASE_URL}/ventas/ventas/checkout`, payload);
            setVentaGenerada(res.data);
            setCarrito([]); 
            setTarjeta({ numero: '', titular: '', expiracion: '', cvv: '' });
            // Opcional: Limpiar cliente si quieres forzar reingreso
            // setCliente({ nombre: '', telefono: '', documento: '', email: '' }); 
        } catch (error) {
            console.error(error);
            alert("Error al procesar.");
        } finally {
            setLoading(false);
        }
    };

    const simularValidacionAdmin = async () => {
        if (!ventaGenerada) return;
        try {
            await axios.put(`${BASE_URL}/ventas/ventas/${ventaGenerada.id_venta}/pago/validar`);
            alert("✅ Pago validado correctamente.");
            window.location.reload();
        } catch (error) {
            alert("Error al validar pago");
        }
    };

    const productosFiltrados = productos.filter(p => p.nombre.toLowerCase().includes(busqueda.toLowerCase()));

    return (
        <div className="portal-wrapper">
            <header className="site-header">
                <div className="header-container">
                    <div className="brand-logo">NUESTRA TIENDA <span className="trademark">®</span></div>
                    <div className="search-bar-container">
                        <div className="search-wrapper">
                            <IconSearch />
                            <input type="text" placeholder="Buscar..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)}/>
                        </div>
                    </div>
                    <div className="header-actions">
                        <button className="cart-btn" onClick={toggleCart}>
                            <IconCart />
                            {carrito.length > 0 && <span className="cart-badge">{carrito.length}</span>}
                        </button>
                    </div>
                </div>
            </header>

            <main className="main-content">
                <div className="product-grid">
                    {productosFiltrados.map((prod) => (
                        <div key={prod.id_producto} className="product-card">
                            <div className="card-image-wrapper">
                                <img src={prod.imagen ? `${BASE_URL}${prod.imagen}` : "https://via.placeholder.com/300x400"} alt={prod.nombre} />
                                <div className="card-overlay">
                                    <button className="quick-add-btn" onClick={() => agregarAlCarrito(prod, 1)}>Agregar (+1)</button>
                                </div>
                            </div>
                            <div className="card-details">
                                <h3 className="product-name">{prod.nombre}</h3>
                                <p className="product-price">${parseFloat(prod.precio_venta).toFixed(2)}</p>
                                
                                <div className="test-buttons">
                                    <button className="btn-test btn-blue" onClick={() => agregarAlCarrito(prod, 2)}>+2</button>
                                    <button className="btn-test btn-purple" onClick={() => agregarAlCarrito(prod, 3)}>+3</button>
                                    <button className="btn-test btn-orange" onClick={() => agregarAlCarrito(prod, 4)}>+4</button>
                                </div>

                                <div className="custom-qty-container">
                                    <input 
                                        type="number" 
                                        min="1"
                                        placeholder="Cant." 
                                        className="custom-qty-input"
                                        value={customQuantities[prod.id_producto] || ''}
                                        onChange={(e) => handleCustomQtyChange(prod.id_producto, e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && addCustomQuantity(prod)}
                                    />
                                    <button className="btn-add-custom" onClick={() => addCustomQuantity(prod)} title="Agregar cantidad personalizada">
                                        <IconPlus />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            <div className={`cart-overlay ${isCartOpen ? 'open' : ''}`} onClick={toggleCart}></div>
            <aside className={`cart-drawer ${isCartOpen ? 'open' : ''}`}>
                <div className="cart-header">
                    <h2>Carrito ({carrito.reduce((acc, item) => acc + item.cantidad, 0)})</h2>
                    <button className="close-cart-btn" onClick={toggleCart}><IconClose /></button>
                </div>

                <div className="cart-items">
                    {carrito.length === 0 ? (
                        <div className="empty-cart">
                            <IconCart />
                            <p>Tu carrito está vacío</p>
                            <button className="start-shopping-btn" onClick={toggleCart}>Seguir comprando</button>
                        </div>
                    ) : (
                        carrito.map(item => (
                            <div key={item.id_producto} className="cart-item">
                                <div className="item-info">
                                    <h4>{item.nombre}</h4>
                                    <p className="item-qty">{item.cantidad} x <strong>${item.precio_venta}</strong></p>
                                </div>
                                <div className="item-total">
                                    <span>${(item.cantidad * item.precio_venta).toFixed(2)}</span>
                                    <button className="delete-btn" onClick={() => eliminarDelCarrito(item.id_producto)}><IconTrash /></button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {(carrito.length > 0 || ventaGenerada) && (
                    <div className="cart-footer">
                        {carrito.length > 0 && (
                            <div className="total-row">
                                <span>Total:</span>
                                <span className="total-price">${calcularTotal().toFixed(2)}</span>
                            </div>
                        )}

                        {!ventaGenerada ? (
                            <form onSubmit={procesarVenta} className="checkout-form">
                                <div className="form-section-title"><UserIconSmall/> Datos Personales</div>
                                {/* ✅ NUEVOS CAMPOS AQUÍ */}
                                <div className="form-group">
                                    <input required value={cliente.nombre} onChange={e => setCliente({...cliente, nombre: e.target.value})} placeholder="Nombre Completo" className="input-field"/>
                                </div>
                                <div className="form-group">
                                    <input required value={cliente.documento} onChange={e => setCliente({...cliente, documento: e.target.value})} placeholder="Documento (CI / NIT)" className="input-field"/>
                                </div>
                                <div className="form-group">
                                    <input required value={cliente.telefono} onChange={e => setCliente({...cliente, telefono: e.target.value})} placeholder="Teléfono" className="input-field"/>
                                </div>
                                <div className="form-group">
                                    <input type="email" value={cliente.email} onChange={e => setCliente({...cliente, email: e.target.value})} placeholder="Correo Electrónico (Opcional)" className="input-field"/>
                                </div>
                                <button type="submit" className="checkout-btn" disabled={loading}>
                                    {loading ? 'Procesando...' : `GENERAR VENTA $${calcularTotal()}`}
                                </button>
                            </form>
                        ) : (
                            <div className="success-message">
                                <p className="success-title">✅ ¡Pago Procesado!</p>
                                <button className="validate-btn" onClick={simularValidacionAdmin}>👮 Validar Pago & Stock</button>
                                <button className="new-order-btn" onClick={() => { setVentaGenerada(null); setCarrito([]); }}>Nueva Compra</button>
                            </div>
                        )}
                    </div>
                )}
            </aside>
        </div>
    );
}