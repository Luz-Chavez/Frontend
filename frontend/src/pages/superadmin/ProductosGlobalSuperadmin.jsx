import { useState, useEffect } from "react";
import { getMicroempresas } from "../../api/microempresas.api";
import { getProductosGlobal } from "../../api/superadmin.api";
import apiClient from "../../services/apiClient";
import ProductStockDetail from "../../components/ProductStockDetail";
import ProductEditModal from "../../components/ProductEditModal";

const palette = {
  primary: '#0A3A40',
  secondary: '#1D7373',
  accent: '#107361',
  white: '#FFFFFF',
  lightBg: '#F8FAFC',
  gray: '#64748B',
  border: '#E2E8F0',
  green: '#10B981',
  red: '#EF4444',
};

function ProductosGlobalSuperadmin() {
  const [empresaFiltro, setEmpresaFiltro] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("todos");
  const [nombreFiltro, setNombreFiltro] = useState("");
  const [productos, setProductos] = useState([]);
  const [microempresas, setMicroempresas] = useState([]);
  const [mapaEmpresas, setMapaEmpresas] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalEditar, setModalEditar] = useState(null);
  const [categorias, setCategorias] = useState([]);

  // Cargar microempresas
  useEffect(() => {
    getMicroempresas()
      .then(res => {
        setMicroempresas(res.data);
        const map = {};
        res.data.forEach(e => { map[e.id_microempresa] = e.nombre; });
        setMapaEmpresas(map);
      })
      .catch(() => setMicroempresas([]));
  }, []);

  // Cargar productos globales
  useEffect(() => {
    const fetchProductos = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await getProductosGlobal();
        setProductos(res.data);
      } catch (err) {
        setError("Error al cargar productos: " + (err.response?.data?.detail || err.message));
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, []);

  // Cargar categorías para el modal de edición
  useEffect(() => {
    apiClient.get('/productos/categorias/activas/global')
      .then(res => setCategorias(res.data))
      .catch(() => setCategorias([]));
  }, []);

  // Filtrado
  const productosFiltrados = productos.filter(p => {
    if (empresaFiltro && String(p.id_microempresa) !== String(empresaFiltro)) return false;
    if (estadoFiltro === "activos" && !p.estado) return false;
    if (estadoFiltro === "inactivos" && p.estado) return false;
    if (estadoFiltro === "stock0" && p.stock?.cantidad > 0) return false;
    if (nombreFiltro && !p.nombre.toLowerCase().includes(nombreFiltro.toLowerCase())) return false;
    return true;
  });

  // Handlers
  const handleEditar = producto => setModalEditar(producto);

  const handleGuardarEdicion = async prodEditado => {
    try {
      await apiClient.put(`/productos/${prodEditado.id_producto}`, {
        nombre: prodEditado.nombre,
        descripcion: prodEditado.descripcion,
        precio_venta: prodEditado.precio_venta,
        costo_compra: prodEditado.costo_compra,
        codigo: prodEditado.codigo,
        estado: prodEditado.estado,
        id_categoria: prodEditado.id_categoria
      });
      // Recargar productos
      const res = await getProductosGlobal();
      setProductos(res.data);
      setModalEditar(null);
    } catch (err) {
      alert("Error al guardar: " + (err.response?.data?.detail || err.message));
    }
  };

  const handleToggleEstado = async (producto) => {
    try {
      if (producto.estado) {
        await apiClient.put(`/productos/${producto.id_producto}/desactivar`);
      } else {
        await apiClient.put(`/productos/${producto.id_producto}/activar`);
      }
      const res = await getProductosGlobal();
      setProductos(res.data);
    } catch (err) {
      alert("Error: " + (err.response?.data?.detail || err.message));
    }
  };

  const handleEliminar = async (id_producto) => {
    if (!confirm("¿Eliminar este producto permanentemente?")) return;
    try {
      await apiClient.delete(`/productos/${id_producto}`);
      const res = await getProductosGlobal();
      setProductos(res.data);
    } catch (err) {
      alert("Error: " + (err.response?.data?.detail || err.message));
    }
  };

  const s = {
    container: { maxWidth: 1200, margin: "0 auto" },
    title: { fontSize: 28, fontWeight: 700, color: palette.primary, marginBottom: 8 },
    subtitle: { color: palette.gray, fontSize: 15, marginBottom: 24 },
    filters: { display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 24, alignItems: 'center' },
    select: { padding: '10px 16px', borderRadius: 8, border: `1px solid ${palette.border}`, minWidth: 200, fontSize: 14 },
    btn: { padding: '10px 18px', borderRadius: 8, border: `1px solid ${palette.secondary}`, background: 'white', color: palette.secondary, fontWeight: 600, fontSize: 14, cursor: 'pointer' },
    btnActive: { background: palette.secondary, color: 'white' },
    input: { padding: '10px 16px', borderRadius: 8, border: `1px solid ${palette.border}`, minWidth: 200, fontSize: 14 },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 20 },
    card: { background: 'white', borderRadius: 12, border: `1px solid ${palette.border}`, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
    cardTitle: { fontWeight: 700, fontSize: 16, color: palette.primary, marginBottom: 4 },
    cardText: { color: palette.gray, fontSize: 13, marginBottom: 2 },
    badge: (activo) => ({
      background: activo ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
      color: activo ? palette.green : palette.red,
      padding: '4px 12px', borderRadius: 99, fontSize: 12, fontWeight: 600, display: 'inline-block'
    }),
    actions: { display: 'flex', gap: 8, marginTop: 12 },
    actionBtn: { padding: '6px 14px', borderRadius: 6, fontWeight: 600, fontSize: 13, cursor: 'pointer', border: 'none' }
  };

  // Stats
  const total = productos.length;
  const activos = productos.filter(p => p.estado).length;
  const sinStock = productos.filter(p => !p.stock?.cantidad || p.stock.cantidad === 0).length;

  return (
    <div style={s.container}>
      <h1 style={s.title}>Todos los Productos</h1>
      <p style={s.subtitle}>Vista global de productos de todas las microempresas</p>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <div style={{ background: 'white', padding: '16px 24px', borderRadius: 10, border: `1px solid ${palette.border}`, flex: 1 }}>
          <div style={{ fontSize: 12, color: palette.gray }}>Total Productos</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: palette.primary }}>{total}</div>
        </div>
        <div style={{ background: 'white', padding: '16px 24px', borderRadius: 10, border: `1px solid ${palette.border}`, flex: 1 }}>
          <div style={{ fontSize: 12, color: palette.gray }}>Activos</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: palette.green }}>{activos}</div>
        </div>
        <div style={{ background: 'white', padding: '16px 24px', borderRadius: 10, border: `1px solid ${palette.border}`, flex: 1 }}>
          <div style={{ fontSize: 12, color: palette.gray }}>Sin Stock</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: palette.red }}>{sinStock}</div>
        </div>
      </div>

      {/* Filters */}
      <div style={s.filters}>
        <select value={empresaFiltro} onChange={e => setEmpresaFiltro(e.target.value)} style={s.select}>
          <option value="">Todas las microempresas</option>
          {microempresas.map(emp => (
            <option key={emp.id_microempresa} value={emp.id_microempresa}>{emp.nombre}</option>
          ))}
        </select>
        <button style={{ ...s.btn, ...(estadoFiltro === "todos" ? s.btnActive : {}) }} onClick={() => setEstadoFiltro("todos")}>Todos</button>
        <button style={{ ...s.btn, ...(estadoFiltro === "activos" ? s.btnActive : {}) }} onClick={() => setEstadoFiltro("activos")}>Activos</button>
        <button style={{ ...s.btn, ...(estadoFiltro === "inactivos" ? s.btnActive : {}) }} onClick={() => setEstadoFiltro("inactivos")}>Inactivos</button>
        <button style={{ ...s.btn, borderColor: palette.red, color: estadoFiltro === "stock0" ? 'white' : palette.red, ...(estadoFiltro === "stock0" ? { background: palette.red } : {}) }} onClick={() => setEstadoFiltro("stock0")}>Sin Stock</button>
        <input type="text" placeholder="Buscar producto..." value={nombreFiltro} onChange={e => setNombreFiltro(e.target.value)} style={s.input} />
      </div>

      {/* Loading/Error */}
      {loading && <div style={{ textAlign: 'center', padding: 40, color: palette.gray }}>Cargando productos...</div>}
      {error && <div style={{ textAlign: 'center', padding: 40, color: palette.red }}>{error}</div>}

      {/* Products Grid */}
      {!loading && !error && (
        <div style={s.grid}>
          {productosFiltrados.length === 0 ? (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 40, color: palette.gray }}>
              No hay productos que coincidan con los filtros.
            </div>
          ) : (
            productosFiltrados.map(producto => (
              <div key={producto.id_producto} style={s.card}>
                <div style={s.cardTitle}>{producto.nombre}</div>
                <div style={s.cardText}>{producto.descripcion}</div>
                <div style={s.cardText}>Código: <strong>{producto.codigo}</strong></div>
                <div style={s.cardText}>Precio: <strong>${producto.precio_venta}</strong></div>
                <div style={s.cardText}>Microempresa: <strong>{mapaEmpresas[producto.id_microempresa] || producto.id_microempresa}</strong></div>
                <div style={{ marginTop: 8 }}>
                  <span style={s.badge(producto.estado)}>
                    {producto.estado ? "Activo" : "Inactivo"}
                  </span>
                </div>
                {producto.stock && (
                  <div style={{ marginTop: 12 }}>
                    <ProductStockDetail stock={producto.stock} />
                  </div>
                )}
                <div style={s.actions}>
                  <button onClick={() => handleEditar(producto)} style={{ ...s.actionBtn, background: palette.secondary, color: 'white' }}>Editar</button>
                  <button onClick={() => handleToggleEstado(producto)} style={{ ...s.actionBtn, background: producto.estado ? palette.red : palette.green, color: 'white' }}>
                    {producto.estado ? "Desactivar" : "Activar"}
                  </button>
                  <button onClick={() => handleEliminar(producto.id_producto)} style={{ ...s.actionBtn, background: 'white', color: palette.red, border: `1px solid ${palette.red}` }}>Eliminar</button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal */}
      {modalEditar && (
        <ProductEditModal
          producto={modalEditar}
          categorias={categorias}
          onClose={() => setModalEditar(null)}
          onSave={handleGuardarEdicion}
        />
      )}
    </div>
  );
}

export default ProductosGlobalSuperadmin;
