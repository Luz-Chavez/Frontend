import { useEffect, useState } from 'react';
import axios from 'axios';
import { getProductosConStock } from '../../api/productos.api'; // Asegúrate que esta importación sea correcta o usa axios directo
import './Portal.css';

// Iconos SVG simples
const IconSearch = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const IconCart = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>;
const IconTrash = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>;

export default function Portal() {
    // --- ESTADOS ---
    const [productos, setProductos] = useState([]);
    const [carrito, setCarrito] = useState([]);
    const [cliente, setCliente] = useState({ nombre: '', telefono: '' });
    const [busqueda, setBusqueda] = useState("");
    const [loading, setLoading] = useState(false);
    const [ventaGenerada, setVentaGenerada] = useState(null); // Para guardar el ID de la venta y mostrar botón de validar

    const ID_MICROEMPRESA = 1; // Ajustar según tu BD
    const BASE_URL = 'http://localhost:8000'; 

    // --- CARGA DE DATOS ---
    useEffect(() => {
        const cargarProductos = async () => {
            try {
                // Usamos axios directo para asegurar que llama a tu endpoint corregido
                const res = await axios.get(`${BASE_URL}/productos/portal/${ID_MICROEMPRESA}/listado`);
                setProductos(res.data);
            } catch (error) {
                console.error("Error cargando productos:", error);
            }
        };
        cargarProductos();
    }, []);

    // --- LÓGICA DEL CARRITO (REQUISITOS 1 y 2) ---
    const agregarAlCarrito = (producto, cantidadAgregar) => {
        setCarrito(prev => {
            const existe = prev.find(item => item.id_producto === producto.id_producto);
            if (existe) {
                return prev.map(item => 
                    item.id_producto === producto.id_producto 
                        ? { ...item, cantidad: item.cantidad + cantidadAgregar } 
                        : item
                );
            } else {
                return [...prev, { ...producto, cantidad: cantidadAgregar }];
            }
        });
    };

    const eliminarDelCarrito = (id_producto) => {
        setCarrito(prev => prev.filter(item => item.id_producto !== id_producto));
    };

    const calcularTotal = () => {
        return carrito.reduce((total, item) => total + (item.precio_venta * item.cantidad), 0);
    };

    // --- PROCESAR VENTA (REQUISITO 3) ---
    const procesarVenta = async (e) => {
        e.preventDefault();
        if(carrito.length === 0) return alert("Carrito vacío");
        
        setLoading(true);

        const payload = {
            venta: {
                id_microempresa: ID_MICROEMPRESA,
                total: 0, // Backend calcula
                estado: "PENDIENTE_PAGO",
                tipo: "ONLINE",
                detalles: carrito.map(p => ({
                    id_producto: p.id_producto,
                    cantidad: p.cantidad,
                    precio_unitario: p.precio_venta,
                    subtotal: p.cantidad * p.precio_venta
                }))
            },
            cliente: {
                nombre: cliente.nombre,
                telefono: cliente.telefono
            }
        };

        try {
            const res = await axios.post(`${BASE_URL}/ventas/ventas/checkout`, payload);
            setVentaGenerada(res.data); // Guardamos la respuesta para mostrar el paso siguiente
            setCarrito([]);
            alert(`✅ Venta #${res.data.id_venta} creada (Pendiente de Pago)`);
        } catch (error) {
            console.error(error);
            alert("Error al procesar la venta. Revisa la consola.");
        } finally {
            setLoading(false);
        }
    };

    // --- VALIDAR PAGO Y DESCONTAR STOCK (REQUISITO 4) ---
    const simularValidacionAdmin = async () => {
        if (!ventaGenerada) return;
        try {
            await axios.put(`${BASE_URL}/ventas/ventas/${ventaGenerada.id_venta}/pago/validar`);
            alert("✅ Pago validado por Admin. EL STOCK SE HA DESCONTADO.");
            setVentaGenerada(null);
            setCliente({ nombre: '', telefono: '' });
            // Recargar página para ver cambios en stock (opcional)
            window.location.reload();
        } catch (error) {
            console.error(error);
            alert("Error al validar pago");
        }
    };

    // Filtrado visual
    const productosFiltrados = productos.filter(p => 
        p.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <div className="portal-wrapper">
            
            {/* HEADER */}
            <header className="site-header">
                <div className="brand-logo">NUESTRA TIENDA <span className="trademark">®</span></div>
                <div className="header-icons">
                    <div className="icon-btn">
                        <IconCart /> 
                        <span style={{marginLeft:5, fontWeight:'bold'}}>{carrito.length}</span>
                    </div>
                </div>
            </header>

            {/* TOOLBAR */}
            <div className="toolbar-container">
                <div className="toolbar-center">
                    <input 
                        type="text" 
                        className="toolbar-search-input"
                        placeholder="Buscar productos..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                </div>
            </div>

            {/* LAYOUT PRINCIPAL */}
            <div className="main-content-layout">
                
                {/* ZONA DE PRODUCTOS (IZQUIERDA) */}
                <main className="product-grid-container" style={{flex: 2}}>
                    <div className="grid-layout">
                        {productosFiltrados.map((prod) => (
                            <div key={prod.id_producto} className="product-card">
                                <div className="card-image">
                                    <img 
                                        src={prod.imagen ? `${BASE_URL}${prod.imagen}` : "https://via.placeholder.com/300x400"} 
                                        alt={prod.nombre} 
                                    />
                                </div>
                                <div className="card-info">
                                    <h4 className="card-title">{prod.nombre}</h4>
                                    <p className="card-price">${prod.precio_venta}</p>
                                    
                                    {/* --- BOTONES DE PRUEBA (REQUISITO 1) --- */}
                                    <div style={{display: 'flex', gap: '5px', marginTop: '10px'}}>
                                        <button 
                                            onClick={() => agregarAlCarrito(prod, 2)}
                                            style={{background: '#e3f2fd', border: '1px solid #2196f3', color:'#0d47a1', padding:'5px', cursor:'pointer', borderRadius:'4px', flex:1}}
                                        >
                                            +2 Unid.
                                        </button>
                                        <button 
                                            onClick={() => agregarAlCarrito(prod, 3)}
                                            style={{background: '#f3e5f5', border: '1px solid #9c27b0', color:'#4a148c', padding:'5px', cursor:'pointer', borderRadius:'4px', flex:1}}
                                        >
                                            +3 Unid.
                                        </button>
                                        <button 
                                            onClick={() => agregarAlCarrito(prod, 4)}
                                            style={{background: '#fff3e0', border: '1px solid #ff9800', color:'#e65100', padding:'5px', cursor:'pointer', borderRadius:'4px', flex:1}}
                                        >
                                            +4 Unid.
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>

                {/* SIDEBAR - CARRITO Y CHECKOUT (DERECHA) */}
                <aside className="sidebar" style={{width: '350px', background: '#f9f9f9', padding: '20px', borderRadius: '8px'}}>
                    <h3 className="sidebar-title" style={{borderBottom:'2px solid #ddd', paddingBottom:'10px'}}>
                        🛒 CARRITO DE COMPRAS
                    </h3>

                    {/* LISTA DE ÍTEMS */}
                    <div style={{marginBottom: '20px', maxHeight: '300px', overflowY: 'auto'}}>
                        {carrito.length === 0 ? <p style={{color:'#999'}}>El carrito está vacío</p> : null}
                        
                        {carrito.map(item => (
                            <div key={item.id_producto} style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:'1px solid #eee'}}>
                                <div>
                                    <div style={{fontWeight:'bold', fontSize:'14px'}}>{item.nombre}</div>
                                    <div style={{fontSize:'12px', color:'#666'}}>
                                        {item.cantidad} x ${item.precio_venta}
                                    </div>
                                </div>
                                <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                                    <span style={{fontWeight:'bold'}}>${item.cantidad * item.precio_venta}</span>
                                    {/* BOTÓN ELIMINAR (REQUISITO 2) */}
                                    <button 
                                        onClick={() => eliminarDelCarrito(item.id_producto)}
                                        style={{background:'none', border:'none', color:'red', cursor:'pointer'}}
                                        title="Eliminar del carrito"
                                    >
                                        <IconTrash />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{fontSize:'18px', fontWeight:'bold', textAlign:'right', marginBottom:'20px'}}>
                        Total: ${calcularTotal()}
                    </div>

                    {/* FORMULARIO O MENSAJE DE ÉXITO */}
                    {!ventaGenerada ? (
                        <form onSubmit={procesarVenta} style={{display:'flex', flexDirection:'column', gap:'10px'}}>
                            <h4 style={{fontSize:'14px', textTransform:'uppercase', color:'#333'}}>Datos del Cliente</h4>
                            <input 
                                required
                                placeholder="Nombre Completo"
                                value={cliente.nombre}
                                onChange={e => setCliente({...cliente, nombre: e.target.value})}
                                style={{padding:'10px', border:'1px solid #ddd', borderRadius:'4px'}}
                            />
                            <input 
                                required
                                placeholder="Teléfono (Ej: 77777777)"
                                value={cliente.telefono}
                                onChange={e => setCliente({...cliente, telefono: e.target.value})}
                                style={{padding:'10px', border:'1px solid #ddd', borderRadius:'4px'}}
                            />
                            <button 
                                type="submit" 
                                disabled={loading || carrito.length === 0}
                                style={{
                                    background: carrito.length > 0 ? '#cc0000' : '#ccc', 
                                    color:'#fff', padding:'12px', border:'none', borderRadius:'4px', fontWeight:'bold', cursor:'pointer'
                                }}
                            >
                                {loading ? 'Procesando...' : 'CONFIRMAR COMPRA'}
                            </button>
                        </form>
                    ) : (
                        <div style={{background:'#e8f5e9', padding:'15px', borderRadius:'8px', border:'1px solid #4caf50', textAlign:'center'}}>
                            <p style={{color:'#2e7d32', fontWeight:'bold', marginBottom:'10px'}}>¡Venta en línea registrada!</p>
                            <p style={{fontSize:'12px', marginBottom:'15px'}}>El stock no baja hasta confirmar el pago.</p>
                            
                            {/* BOTÓN DE VALIDACIÓN (REQUISITO 4) */}
                            <button 
                                onClick={simularValidacionAdmin}
                                style={{background:'#4caf50', color:'white', border:'none', padding:'10px', borderRadius:'4px', width:'100%', cursor:'pointer', fontWeight:'bold'}}
                            >
                                👮 Simular Validación Admin (Bajar Stock)
                            </button>
                        </div>
                    )}
                </aside>
            </div>
        </div>
    );
}