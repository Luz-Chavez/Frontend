import React, { useState } from "react";
import ProductCard from "../../components/ProductCard";
import ProductStockDetail from "../../components/ProductStockDetail";
import ProductEditModal from "../../components/ProductEditModal";
import mockCategorias from "./mockCategorias";

// Mock de microempresas
const mockEmpresas = [
  { id: 1, nombre: "Microempresa A" },
  { id: 2, nombre: "Microempresa B" },
  { id: 3, nombre: "Microempresa C" }
];

// Mock de productos globales
const mockProductosInicial = [
  {
    id_producto: 101,
    nombre: "Agua Mineral",
    descripcion: "Botella 500ml",
    precio_venta: 12,
    costo_compra: 8,
    codigo: "AGUA500",
    imagen: "",
    estado: "activo",
    id_categoria: 1,
    id_microempresa: 1,
    microempresa: "Microempresa A",
    fecha_creacion: "2026-01-01",
    stock: { id_producto: 101, cantidad: 20, stock_minimo: 5, id_stock: 1, ultima_actualizacion: "2026-01-15" }
  },
  {
    id_producto: 102,
    nombre: "Papas Fritas",
    descripcion: "Bolsa 100g",
    precio_venta: 15,
    costo_compra: 10,
    codigo: "PAPA100",
    imagen: "",
    estado: "inactivo",
    id_categoria: 2,
    id_microempresa: 2,
    microempresa: "Microempresa B",
    fecha_creacion: "2026-01-02",
    stock: { id_producto: 102, cantidad: 0, stock_minimo: 3, id_stock: 2, ultima_actualizacion: "2026-01-16" }
  },
  {
    id_producto: 103,
    nombre: "Detergente",
    descripcion: "1L",
    precio_venta: 25,
    costo_compra: 18,
    codigo: "DETER1L",
    imagen: "",
    estado: "activo",
    id_categoria: 3,
    id_microempresa: 3,
    microempresa: "Microempresa C",
    fecha_creacion: "2026-01-03",
    stock: { id_producto: 103, cantidad: 5, stock_minimo: 2, id_stock: 3, ultima_actualizacion: "2026-01-17" }
  }
];

const palette = {
  fondo: "#F5F7F8",
  card: "#fff",
  sombra: "0 2px 8px 0 rgba(10,58,64,0.10)",
  verdeClaro: "#C6F6D5",
  texto: "#042326",
  info: "#1D7373",
  alerta: "#E57373"
};


function ProductosGlobalSuperadmin() {
  const [empresaFiltro, setEmpresaFiltro] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("todos");
  const [nombreFiltro, setNombreFiltro] = useState("");
  const [productos, setProductos] = useState(mockProductosInicial);
  const [modalEditar, setModalEditar] = useState(null); // producto a editar o null

  // Filtrado funcional
  const productosFiltrados = productos.filter(p => {
    if (empresaFiltro && String(p.id_microempresa) !== String(empresaFiltro)) return false;
    if (estadoFiltro === "activos" && p.estado !== "activo") return false;
    if (estadoFiltro === "inactivos" && p.estado !== "inactivo") return false;
    if (estadoFiltro === "stock0" && p.stock.cantidad > 0) return false;
    if (nombreFiltro && !p.nombre.toLowerCase().includes(nombreFiltro.toLowerCase())) return false;
    return true;
  });

  // Handlers reales
  const handleEditar = producto => {
    setModalEditar(producto);
  };
  const handleGuardarEdicion = prodEditado => {
    setProductos(prev => prev.map(p => p.id_producto === prodEditado.id_producto ? { ...p, ...prodEditado } : p));
    setModalEditar(null);
  };
  const handleActivar = id_producto => {
    setProductos(prev => prev.map(p => p.id_producto === id_producto ? { ...p, estado: "activo" } : p));
  };
  const handleDesactivar = id_producto => {
    setProductos(prev => prev.map(p => p.id_producto === id_producto ? { ...p, estado: "inactivo" } : p));
  };
  const handleEliminar = id_producto => {
    setProductos(prev => prev.filter(p => p.id_producto !== id_producto));
  };

  return (
    <div style={{ maxWidth: 1100, margin: "40px auto", padding: 24 }}>
      <h2 style={{ color: palette.info, fontWeight: 800, fontSize: "2rem", marginBottom: 32 }}>
        Todos los productos
      </h2>
      {/* Barra de filtros */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 28, alignItems: "center" }}>
        <select
          value={empresaFiltro}
          onChange={e => setEmpresaFiltro(e.target.value)}
          style={{ padding: "0.6em 1em", borderRadius: 8, border: "1px solid #1D7373", minWidth: 180 }}
        >
          <option value="">Todas las microempresas</option>
          {mockEmpresas.map(emp => (
            <option key={emp.id} value={emp.id}>{emp.nombre}</option>
          ))}
        </select>
        <button
          style={{
            background: estadoFiltro === "todos" ? palette.info : palette.card,
            color: estadoFiltro === "todos" ? "#fff" : palette.texto,
            border: "1px solid #1D7373",
            borderRadius: 8,
            padding: "0.6em 1.2em",
            fontWeight: 600,
            cursor: "pointer"
          }}
          onClick={() => setEstadoFiltro("todos")}
        >
          Todos
        </button>
        <button
          style={{
            background: estadoFiltro === "activos" ? palette.info : palette.card,
            color: estadoFiltro === "activos" ? "#fff" : palette.texto,
            border: "1px solid #1D7373",
            borderRadius: 8,
            padding: "0.6em 1.2em",
            fontWeight: 600,
            cursor: "pointer"
          }}
          onClick={() => setEstadoFiltro("activos")}
        >
          Activos
        </button>
        <button
          style={{
            background: estadoFiltro === "inactivos" ? palette.info : palette.card,
            color: estadoFiltro === "inactivos" ? "#fff" : palette.texto,
            border: "1px solid #1D7373",
            borderRadius: 8,
            padding: "0.6em 1.2em",
            fontWeight: 600,
            cursor: "pointer"
          }}
          onClick={() => setEstadoFiltro("inactivos")}
        >
          Inactivos
        </button>
        <button
          style={{
            background: estadoFiltro === "stock0" ? palette.alerta : palette.card,
            color: estadoFiltro === "stock0" ? "#fff" : palette.texto,
            border: "1px solid #E57373",
            borderRadius: 8,
            padding: "0.6em 1.2em",
            fontWeight: 600,
            cursor: "pointer"
          }}
          onClick={() => setEstadoFiltro("stock0")}
        >
          Stock 0
        </button>
        <input
          type="text"
          placeholder="Buscar producto..."
          value={nombreFiltro}
          onChange={e => setNombreFiltro(e.target.value)}
          style={{ padding: "0.6em 1em", borderRadius: 8, border: "1px solid #1D7373", minWidth: 200 }}
        />
      </div>
      {/* Listado de productos */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 24 }}>
        {productosFiltrados.length === 0 ? (
          <div style={{ color: palette.alerta, fontWeight: 500, fontSize: "1.2rem", gridColumn: "1/-1" }}>
            No hay productos que coincidan con los filtros.
          </div>
        ) : (
          productosFiltrados.map(producto => (
            <div key={producto.id_producto} style={{ background: palette.card, borderRadius: 16, boxShadow: palette.sombra, padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
              {/* Info principal del producto */}
              <div style={{ display: "flex", alignItems: "center", gap: 16, justifyContent: "space-between" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: "1.1rem", color: palette.info }}>{producto.nombre}</div>
                  <div style={{ color: palette.texto, fontSize: 14 }}>{producto.descripcion}</div>
                  <div style={{ color: "#888", fontSize: 13, marginTop: 2 }}>Microempresa: <b>{producto.microempresa}</b></div>
                  <div style={{ color: "#888", fontSize: 13 }}>Código: {producto.codigo}</div>
                  <div style={{ color: "#888", fontSize: 13 }}>Estado: <b style={{ color: producto.estado === "activo" ? palette.info : palette.alerta }}>{producto.estado}</b></div>
                </div>
                {/* Acciones de administración solo para superadmin */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <button onClick={() => handleEditar(producto)} style={{ background: palette.info, color: "#fff", border: "none", borderRadius: 8, padding: "0.3em 0.9em", fontWeight: 600, cursor: "pointer", fontSize: 13 }}>Editar</button>
                  {producto.estado === "activo" ? (
                    <button onClick={() => handleDesactivar(producto.id_producto)} style={{ background: palette.alerta, color: "#fff", border: "none", borderRadius: 8, padding: "0.3em 0.9em", fontWeight: 600, cursor: "pointer", fontSize: 13 }}>Desactivar</button>
                  ) : (
                    <button onClick={() => handleActivar(producto.id_producto)} style={{ background: palette.info, color: "#fff", border: "none", borderRadius: 8, padding: "0.3em 0.9em", fontWeight: 600, cursor: "pointer", fontSize: 13 }}>Activar</button>
                  )}
                  <button onClick={() => handleEliminar(producto.id_producto)} style={{ background: "#fff", color: palette.alerta, border: `1px solid ${palette.alerta}`, borderRadius: 8, padding: "0.3em 0.9em", fontWeight: 600, cursor: "pointer", fontSize: 13 }}>Eliminar</button>
                </div>
              </div>
              {/* Info de stock destacada */}
              <div style={{ marginTop: 8 }}>
                <ProductStockDetail stock={producto.stock} />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal de edición de producto */}
      {modalEditar && (
        <ProductEditModal
          producto={modalEditar}
          categorias={mockCategorias}
          onClose={() => setModalEditar(null)}
          onSave={handleGuardarEdicion}
        />
      )}
    </div>
  );
}

export default ProductosGlobalSuperadmin;
