import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // Agregado useParams
import { getProductosConStock } from '../../api/productos.api';
import { getCategoriasActivas } from '../../api/categorias.api';
import { getMicroempresaById } from '../../api/microempresas.api';

// --- NUEVOS COMPONENTES ---
import CartWidget from '../../components/portal/CartWidget';
import CartDrawer from '../../components/portal/CartDrawer';
import CardProducto from '../../components/portal/CardProducto';

import './Portal.css';

/**
 * Componentes de Iconos SVG
 */
const IconSearch = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
);
// IconCart ya no es necesario porque lo maneja CartWidget, pero lo puedes dejar si quieres
const IconHeart = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
);
const IconUser = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
);

export default function Portal() {
    // 1. Obtener ID de la empresa de la URL (asegúrate que tu ruta sea /portal/:id_microempresa)
    const { id_microempresa } = useParams();


    // 2. Estado para el Drawer del Carrito
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Estados de datos
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
    const [busqueda, setBusqueda] = useState("");
    const [cargando, setCargando] = useState(true);
    const [nombreMicroempresa, setNombreMicroempresa] = useState('');

    const navigate = useNavigate();

    // Carga inicial de datos

    useEffect(() => {
        if (id_microempresa) {
            cargarDatos(id_microempresa);
            cargarNombreMicroempresa(id_microempresa);
        }
    }, [id_microempresa]);

    const cargarNombreMicroempresa = async (id) => {
        try {
            const res = await getMicroempresaById(id);
            setNombreMicroempresa(res.data.nombre || 'Nuestra Tienda');
        } catch {
            setNombreMicroempresa('Nuestra Tienda');
        }
    };

    const cargarDatos = async (id) => {
        try {
            // Nota: Asegúrate de que tus APIs acepten el ID si es necesario
            const [resProductos, resCategorias] = await Promise.all([
                getProductosConStock(id), // Pasar ID si la API lo requiere
                getCategoriasActivas(id)
            ]);
            setProductos(resProductos.data);
            setCategorias(resCategorias.data);
        } catch (error) {
            console.error("Error cargando datos:", error);
        } finally {
            setCargando(false);
        }
    };

    // Lógica de filtrado
    const productosFiltrados = productos.filter((prod) => {
        const matchCat = categoriaSeleccionada ? prod.id_categoria === categoriaSeleccionada : true;
        const matchSearch = prod.nombre.toLowerCase().includes(busqueda.toLowerCase());
        return matchCat && matchSearch;
    });

    return (
        <div className="portal-wrapper">

            {/* 3. COMPONENTE DRAWER (Panel Lateral) */}
            <CartDrawer
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                idMicroempresa={id_microempresa}
            />

            {/* SECCIÓN SUPERIOR: NAVEGACIÓN Y LOGO */}
            <header className="site-header">
                {/* Logo */}
                <div className="brand-logo">
                    {nombreMicroempresa || 'Nuestra Tienda'}
                    <span className="trademark">®</span>
                </div>

                {/* Iconos Funcionales */}
                <div className="header-icons">
                    {/*<button className="icon-btn" title="Buscar"><IconSearch /></button>*/}
                    <CartWidget onOpen={() => setIsCartOpen(true)} />
                    <button className="icon-btn" title="Favoritos"><IconHeart /></button>
                    <button className="icon-btn" title="Cuenta" onClick={() => navigate('/login')}><IconUser /></button>
                </div>
            </header>

            {/* HERO BANNER - Impacto Visual 
            <section className="hero-banner">
                <div className="hero-content">
                    <div className="hero-badge">Envío Gratis en tu Primera Compra</div>
                    <h1>Descubre lo Mejor</h1>
                    <p>Productos de calidad seleccionados especialmente para ti</p>
                </div>
            </section>*/}

            {/* SECCIÓN DE BARRA DE HERRAMIENTAS */}
            <div className="toolbar-container">
                <div className="toolbar-left">
                    <button className="btn-ocultar-filtros">
                        Ocultar filtros <span style={{ marginLeft: '5px', color: '#cc0000' }}>ø</span>
                    </button>
                </div>

                <div className="toolbar-center">
                    <div className="search-bar-wrapper">
                        <span className="search-label">Filtros:</span>
                        <input
                            type="text"
                            className="toolbar-search-input"
                            placeholder="Buscar"
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                        />
                    </div>
                </div>

                <div className="toolbar-right">
                    <span>{productosFiltrados.length} Resultados</span>
                </div>
            </div>

            {/* LAYOUT PRINCIPAL */}
            <div className="main-content-layout">

                {/* SIDEBAR DE FILTROS */}
                <aside className="sidebar">
                    <div className="sidebar-section">
                        <h3 className="sidebar-title">CATEGORÍAS</h3>
                        <ul className="sidebar-list">
                            <li
                                className={`sidebar-item ${categoriaSeleccionada === null ? 'active' : ''}`}
                                onClick={() => setCategoriaSeleccionada(null)}
                            >
                                Ver Todo
                            </li>
                            {categorias.map((cat) => (
                                <li
                                    key={cat.id_categoria}
                                    className={`sidebar-item ${categoriaSeleccionada === cat.id_categoria ? 'active' : ''}`}
                                    onClick={() => setCategoriaSeleccionada(cat.id_categoria)}
                                >
                                    {cat.nombre}
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>

                {/* GRID DE PRODUCTOS */}
                <main className="product-grid-container">
                    {cargando ? (
                        <p className="loading-text">Cargando catálogo...</p>
                    ) : (
                        <div className="grid-layout">
                            {productosFiltrados.length > 0 ? (
                                productosFiltrados.map((prod) => (
                                    /* 5. USAR EL NUEVO COMPONENTE CARD */
                                    <CardProducto key={prod.id_producto} producto={prod} />
                                ))
                            ) : (
                                <div className="no-results">
                                    <p>No se encontraron productos.</p>
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}