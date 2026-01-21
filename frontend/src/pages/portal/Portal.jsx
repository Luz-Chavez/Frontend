import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProductosConStock } from '../../api/productos.api';
import { getCategoriasActivas } from '../../api/categorias.api';
import './Portal.css';

/**
 * Componentes de Iconos SVG para evitar dependencias externas.
 * Replican el estilo visual de la imagen de referencia.
 */
const IconSearch = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
);
const IconCart = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
);
const IconHeart = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
);
const IconUser = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);
const IconFilter = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
);

export default function Portal() {
    // Estados de datos y control
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
    const [busqueda, setBusqueda] = useState("");
    const [cargando, setCargando] = useState(true);

    const navigate = useNavigate();
    const BASE_URL = 'http://localhost:8000'; // Ajustar según backend

    // Carga inicial de datos
    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            const [resProductos, resCategorias] = await Promise.all([
                getProductosConStock(),
                getCategoriasActivas()
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
            
            {/* SECCIÓN SUPERIOR: NAVEGACIÓN Y LOGO */}
            <header className="site-header">
                {/* 1. Top Nav (Izquierda) 
                <nav className="top-nav-links">
                    <a href="#" className="nav-link">MUJER</a>
                    <a href="#" className="nav-link">HOMBRE</a>
                    <a href="#" className="nav-link active-section">NIÑAS Y NIÑOS</a>
                    <a href="#" className="nav-link">FAMILIA</a>
                </nav>*/}

                {/* 2. Logo (Centro) */}
                <div className="brand-logo">
                    NUESTRA TIENDA
                    <span className="trademark">®</span>
                </div>

                {/* 3. Iconos Funcionales (Derecha) */}
                <div className="header-icons">
                    <button className="icon-btn" title="Buscar"><IconSearch /></button>
                    <button className="icon-btn" title="Carrito"><IconCart /></button>
                    <button className="icon-btn" title="Favoritos"><IconHeart /></button>
                    <button className="icon-btn" title="Cuenta" onClick={() => navigate('/login')}><IconUser /></button>
                </div>
            </header>

            {/* SECCIÓN DE BARRA DE HERRAMIENTAS (Igual a la imagen) */}
            <div className="toolbar-container">
                <div className="toolbar-left">
                    <button className="btn-ocultar-filtros">
                        Ocultar filtros <span style={{marginLeft: '5px', color: '#cc0000'}}>ø</span>
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
                            {/* Renderizado de categorías reales */}
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
                                    <div key={prod.id_producto} className="product-card">
                                        <div className="card-image">
                                            <img 
                                                src={prod.imagen ? `${BASE_URL}${prod.imagen}` : "https://via.placeholder.com/300x400?text=Producto"} 
                                                alt={prod.nombre} 
                                            />
                                        </div>
                                        <div className="card-info">
                                            <h4 className="card-title">{prod.nombre}</h4>
                                            <p className="card-price">{parseFloat(prod.precio_venta).toFixed(2)}</p>
                                            
                                            
                                        </div>
                                    </div>
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