import React, { useState, useEffect } from "react";
import { getProductosActivosConStock, getProductosActivosPorMicroempresa, getProductosInactivosSinStockPorMicroempresa, crearProducto, actualizarProducto, eliminarProductoFisico, activarProducto, desactivarProducto, getProductosConStock } from "../../api/productos.api";
import { getCategoriasByMicroempresa } from "../../api/categorias.api";
import { useAuth } from "../../context/AuthContext";
import ProductCard from "../../components/ProductCard";
import ProductStockDetail from "../../components/ProductStockDetail";
import ProductEditModal from "../../components/ProductEditModal";
import ProductCreateCard from "../../components/ProductCreateCard";
import ProductStockCreateCard from "../../components/ProductStockCreateCard";



// Mocks solo como fallback
const mockCategorias = [
  { id: 1, nombre: "Bebidas" },
  { id: 2, nombre: "Snacks" },
  { id: 3, nombre: "Limpieza" }
];



// Vista principal de productos
function ProductosVista({
  // categorias: propCategorias, // Eliminado porque no se usa
  user: propUser
}) {
  console.log("[Productos] Renderizando ProductosVista");
  // Obtener usuario real del contexto
  const { user } = useAuth();
  // Si no hay usuario en contexto, usar propUser o mock
  const usuario = React.useMemo(() => user || propUser || { rol: "adminmicroempresa", microempresa: { nombre: "Microempresa" }, has_microempresa: true }, [user, propUser]);

  // Log de usuario para depuración
  useEffect(() => {
    console.log("[Productos] Usuario en contexto:", usuario);
  }, [usuario]);

  // Estado de filtros (debe ir antes del useEffect que usa filtroRapido)
  const [categoriaId, setCategoriaId] = useState("");
  const [nombreFiltro, setNombreFiltro] = useState("");
  const [filtroRapido, setFiltroRapido] = useState("todos");
  // Estado para productos y loading/error
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar productos desde backend según filtro rápido y microempresa
  useEffect(() => {
    let cancel = false;
    const cargar = async () => {
      if (usuario.rol === "adminmicroempresa" && usuario.microempresa?.id_microempresa) {
        setLoading(true);
        setError(null);
        try {
          let res;
          if (filtroRapido === "todos") {
            res = await getProductosConStock(usuario.microempresa.id_microempresa);
          } else if (filtroRapido === "activos") {
            res = await getProductosActivosPorMicroempresa(usuario.microempresa.id_microempresa);
          } else if (filtroRapido === "inactivos") {
            res = await getProductosInactivosSinStockPorMicroempresa(usuario.microempresa.id_microempresa);
          } else if (filtroRapido === "stock0") {
            // Mostrar productos activos con stock 0
            res = await getProductosActivosConStock(usuario.microempresa.id_microempresa);
            if (!cancel && res) {
              setProductos(res.data.filter(p => p.stock?.cantidad === 0));
              setLoading(false);
            }
            return;
          }
          if (!cancel && res) {
            setProductos(res.data);
            setLoading(false);
          }
        } catch {
          if (!cancel) {
            setError("Error al cargar productos");
            setLoading(false);
          }
        }
      }
    };
    cargar();
    return () => { cancel = true; };
  }, [usuario.rol, usuario.microempresa?.id_microempresa, filtroRapido]);

  // Estado para categorías
  const [categorias, setCategorias] = useState([]);

  // Cargar categorías reales de la microempresa
  useEffect(() => {
    const fetchCategorias = async () => {
      if (usuario.rol === "adminmicroempresa" && usuario.microempresa?.id_microempresa) {
        try {
          const res = await getCategoriasByMicroempresa(usuario.microempresa.id_microempresa);
          setCategorias(res.data);
        } catch {
          // Si falla, usar mock
          setCategorias(mockCategorias);
        }
      } else {
        setCategorias(mockCategorias);
      }
    };
    fetchCategorias();
  }, [usuario.rol, usuario.microempresa?.id_microempresa]);
  // Estado de filtros (declarado antes del useEffect que lo usa)
  const [modalProducto, setModalProducto] = useState(null);
  const [modalCrear, setModalCrear] = useState(false);
  const [productoCreado, setProductoCreado] = useState(null);
  // Estado local de productos editados (para acciones locales)
  const [productosEditados, setProductosEditados] = useState([]);
  const [creando, setCreando] = useState(false);
  const [crearError, setCrearError] = useState("");
  // Sincronizar productosEditados con productos cargados del backend solo cuando cambian
  useEffect(() => {
    if (usuario.rol === "adminmicroempresa") {
      setProductosEditados(productos);
    }
  }, [productos, usuario.rol]);


  // Filtrado
  const productosFiltrados = productosEditados.filter(prod => {
    let match = true;
    if (categoriaId) match = match && prod.id_categoria === Number(categoriaId);
    if (nombreFiltro) match = match && prod.nombre.toLowerCase().includes(nombreFiltro.toLowerCase());
    if (filtroRapido === "activos") match = match && prod.estado === "activo";
    if (filtroRapido === "inactivos") match = match && prod.estado === "inactivo";
    if (filtroRapido === "stock0") match = match && prod.stock?.cantidad === 0;
    return match;
  });

  // Handlers de acciones (simulados)

    // Handler para el flujo de creación de producto (paso 1, integración backend)
    const handleProductoCreado = async (productoForm) => {
      if (usuario.rol !== "adminmicroempresa" || !usuario.microempresa?.id_microempresa) return;
      setCreando(true);
      setCrearError("");
      // Solo enviar los campos requeridos por el backend
      const {
        nombre,
        descripcion,
        precio_venta,
        costo_compra,
        codigo,
        estado,
        id_categoria
      } = productoForm;
      const data = {
        nombre,
        descripcion,
        precio_venta: Number(precio_venta),
        costo_compra: Number(costo_compra),
        codigo,
        estado: estado === "activo" || estado === true,
        id_categoria: Number(id_categoria),
        id_microempresa: usuario.microempresa.id_microempresa
      };
      // Si la imagen es un archivo (File), agregarla
      if (productoForm.imagen instanceof File) {
        data.imagen = productoForm.imagen;
      }
      try {
        const res = await crearProducto(data);
        setProductoCreado(res.data); // Abre el modal de stock
        setModalCrear(false);
        // Refrescar productos
        getProductosActivosConStock(usuario.microempresa.id_microempresa).then(r => setProductos(r.data));
      } catch {
        setCrearError("Error al crear producto. Verifica los datos.");
      } finally {
        setCreando(false);
      }
    };

    // Handler para el flujo de creación de stock (paso 2)
    const handleStockCreado = stock => {
      setProductosEditados(prev => [
        ...prev,
        {
          ...productoCreado,
          stock: {
            ...stock,
            id_stock: Date.now(),
            ultima_actualizacion: new Date().toISOString().slice(0, 10)
          }
        }
      ]);
      setProductoCreado(null);
    };
  const handleEditar = producto => setModalProducto(producto);
  // Handler para guardar edición de producto (integración backend)
  const handleGuardarEdicion = async (productoEditado) => {
    if (usuario.rol !== "adminmicroempresa") return;
    // Solo enviar los campos requeridos por el backend
    const {
      nombre,
      descripcion,
      precio_venta,
      costo_compra,
      codigo,
      estado,
      id_categoria
    } = productoEditado;
    const data = {
      nombre,
      descripcion,
      precio_venta: Number(precio_venta),
      costo_compra: Number(costo_compra),
      codigo,
      estado,
      id_categoria: Number(id_categoria)
    };
    try {
      await actualizarProducto(productoEditado.id_producto, data);
      // Refrescar productos
      if (usuario.microempresa?.id_microempresa) {
        const res = await getProductosActivosConStock(usuario.microempresa.id_microempresa);
        setProductos(res.data);
      }
    } catch {
      // Podrías mostrar un error aquí si lo deseas
    }
  };
  // Cambiar estado de producto (activar/desactivar) según estado actual
  const handleToggleEstado = async (productoId, estaActivo) => {
    if (usuario.rol !== "adminmicroempresa") return;
    try {
      if (estaActivo) {
        await desactivarProducto(productoId);
      } else {
        await activarProducto(productoId);
      }
      // Refrescar productos según filtro actual
      if (usuario.microempresa?.id_microempresa) {
        let res;
        if (filtroRapido === "todos") {
          res = await getProductosConStock(usuario.microempresa.id_microempresa);
        } else if (filtroRapido === "activos") {
          res = await getProductosActivosPorMicroempresa(usuario.microempresa.id_microempresa);
        } else if (filtroRapido === "inactivos") {
          res = await getProductosInactivosSinStockPorMicroempresa(usuario.microempresa.id_microempresa);
        } else if (filtroRapido === "stock0") {
          res = await getProductosActivosConStock(usuario.microempresa.id_microempresa);
          res.data = res.data.filter(p => p.stock?.cantidad === 0);
        }
        if (res) setProductos(res.data);
      }
    } catch {
      // Error al cambiar estado del producto
    }
  };
  // Handler para eliminar producto (integración backend)
  const handleEliminar = async (productoId) => {
    if (usuario.rol !== "adminmicroempresa") return;
    try {
      await eliminarProductoFisico(productoId);
      // Refrescar productos
      if (usuario.microempresa?.id_microempresa) {
        const res = await getProductosActivosConStock(usuario.microempresa.id_microempresa);
        setProductos(res.data);
      }
    } catch {
      // Podrías mostrar un error aquí si lo deseas
    }
  };

  // Permisos
  const puedeEditar = usuario.rol === "adminmicroempresa" ;

  // Estilos generales
  const styles = {
    container: {
      padding: "2.5rem 1.5rem 1.5rem 1.5rem",
      background: "#fff",
      minHeight: "100vh",
      color: "#042326",
      fontFamily: "inherit"
    },
    titulo: {
      fontSize: "2rem",
      fontWeight: 700,
      marginBottom: "1.5rem",
      color: "#042326",
      letterSpacing: "0.01em"
    },
    filtrosBar: {
      display: "flex",
      flexWrap: "wrap",
      gap: "1.2rem",
      alignItems: "center",
      marginBottom: "2rem",
      background: "#0A3A40",
      padding: "1rem 1.2rem",
      borderRadius: "1rem",
      boxShadow: "0 2px 8px 0 rgba(10,58,64,0.10)"
    },
    filtroLabel: { fontWeight: 500, marginRight: "0.5em" },
    filtroSelect: {
      background: "#0F5959", color: "#F5F7F8", border: "1px solid #1D7373",
      borderRadius: "0.7em", padding: "0.5em 1em", fontSize: "1rem"
    },
    filtroInput: {
      background: "#0F5959", color: "#F5F7F8", border: "1px solid #1D7373",
      borderRadius: "0.7em", padding: "0.5em 1em", fontSize: "1rem"
    },
    filtroBtn: {
      background: "#1D7373", color: "#fff", border: "none", borderRadius: "0.7em",
      fontWeight: 600, fontSize: "1rem", padding: "0.7em 1.2em", cursor: "pointer",
      boxShadow: "0 2px 8px 0 rgba(16,115,97,0.10)", transition: "background 0.2s"
    },
    filtroBtnActive: {
      background: "#107361", color: "#fff"
    },
    listado: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
      gap: "2.5rem",
      marginTop: "1.5rem",
      alignItems: "start"
    },
    cardWrapper: {
      display: "flex",
      flexDirection: "column",
      alignItems: "stretch",
      justifyContent: "flex-start",
      height: "100%"
    },
    acciones: {
      display: "flex",
      gap: "0.7rem",
      marginTop: "1.2rem",
      justifyContent: "center",
      flexWrap: "wrap"
    },
    accionBtn: {
      background: "#0F5959", color: "#F5F7F8", border: "none", borderRadius: "0.7em",
      fontWeight: 600, fontSize: "0.95rem", padding: "0.5em 1em", cursor: "pointer",
      boxShadow: "0 2px 8px 0 rgba(10,58,64,0.10)", transition: "background 0.2s"
    },
    accionBtnDanger: {
      background: "#E57373", color: "#fff"
    }
  };

  return (
    <div style={styles.container}>
      {/* Loading y error */}
      {loading && (
        <div style={{ color: "#107361", fontWeight: 500, fontSize: "1.2rem", marginBottom: 16 }}>
          Cargando productos...
        </div>
      )}
      {error && (
        <div style={{ color: "#E57373", fontWeight: 500, fontSize: "1.2rem", marginBottom: 16 }}>
          {error}
        </div>
      )}
      {/* Título con nombre de la microempresa */}
      <div style={styles.titulo}>{usuario.microempresa?.nombre || "Productos"}</div>

      {/* Barra de filtros */}
      <div style={styles.filtrosBar}>
        <div>
          <span style={styles.filtroLabel}>Categoría:</span>
          <select
            style={styles.filtroSelect}
            value={categoriaId}
            onChange={e => setCategoriaId(e.target.value)}
          >
            <option value="">Todas</option>
            {categorias.map(cat => (
              <option key={cat.id_categoria || cat.id} value={cat.id_categoria || cat.id}>{cat.nombre}</option>
            ))}
          </select>
        </div>
        <div>
          <span style={styles.filtroLabel}>Nombre:</span>
          <input
            style={styles.filtroInput}
            type="text"
            placeholder="Buscar producto..."
            value={nombreFiltro}
            onChange={e => setNombreFiltro(e.target.value)}
          />
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
                  {usuario.rol === "adminmicroempresa" && (
                    <button
                      style={{ ...styles.filtroBtn, background: "#10B981", marginLeft: "auto" }}
                      onClick={() => setModalCrear(true)}
                    >
                      Crear producto
                    </button>
                  )}
          <button
            style={{
              ...styles.filtroBtn,
              ...(filtroRapido === "todos" ? styles.filtroBtnActive : {})
            }}
            onClick={() => setFiltroRapido("todos")}
          >
            Todos
          </button>
          <button
            style={{
              ...styles.filtroBtn,
              ...(filtroRapido === "activos" ? styles.filtroBtnActive : {})
            }}
            onClick={() => setFiltroRapido("activos")}
          >
            Activos
          </button>
          <button
            style={{
              ...styles.filtroBtn,
              ...(filtroRapido === "inactivos" ? styles.filtroBtnActive : {})
            }}
            onClick={() => setFiltroRapido("inactivos")}
          >
            Inactivos
          </button>
          <button
            style={{
              ...styles.filtroBtn,
              ...(filtroRapido === "stock0" ? styles.filtroBtnActive : {})
            }}
            onClick={() => setFiltroRapido("stock0")}
          >
            Stock 0
          </button>
        </div>
      </div>

      {/* Listado de productos */}
      <div style={styles.listado}>
        {productosFiltrados.length === 0 ? (
          <div style={{ color: "#E57373", fontWeight: 500, fontSize: "1.2rem" }}>
            No hay productos que coincidan con los filtros.
          </div>
        ) : (
          productosFiltrados.map(producto => (
            <div key={producto.id_producto} style={styles.cardWrapper}>
              <ProductCard
                producto={producto}
                stock={producto.stock}
                onEdit={puedeEditar ? () => handleEditar(producto) : undefined}
                onToggle={puedeEditar ? (id, estaActivo) => handleToggleEstado(id, estaActivo) : undefined}
                onDelete={puedeEditar ? () => handleEliminar(producto.id_producto) : undefined}
              />
            </div>
          ))
        )}
      </div>

      {/* Modal de creación */}
      {modalCrear && (
        <ProductCreateCard
          categorias={categorias}
          onProductoCreado={handleProductoCreado}
          onClose={() => setModalCrear(false)}
        />
      )}
      {crearError && (
        <div style={{ color: "#E57373", fontWeight: 500, fontSize: "1.1rem", marginTop: 8 }}>{crearError}</div>
      )}
      {creando && (
        <div style={{ color: "#107361", fontWeight: 500, fontSize: "1.1rem", marginTop: 8 }}>Creando producto...</div>
      )}
      {productoCreado && (
        <ProductStockCreateCard
          producto={productoCreado}
          onGuardarStock={handleStockCreado}
          onClose={() => setProductoCreado(null)}
        />
      )}
      {/* Modal de edición */}
      {modalProducto && (
        <ProductEditModal
          producto={modalProducto}
          categorias={categorias}
          onClose={() => setModalProducto(null)}
          onSave={handleGuardarEdicion}
        />
      )}
    </div>
  );
}

export default ProductosVista;
