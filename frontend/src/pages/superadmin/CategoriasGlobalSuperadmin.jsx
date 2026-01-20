import React, { useState, useEffect } from "react";
import { getTodasCategorias, editarCategoriaGlobal, activarCategoriaGlobal, desactivarCategoriaGlobal, eliminarCategoriaGlobal, getCategoriasActivas, getCategoriasInactivas } from "../../api/categorias.api";
import { getMicroempresas } from "../../api/microempresas.api";
import CategoryCard from "../../components/CategoryCard";
import EditCategoryModal from "../../components/EditCategoryModal";

// Estado para microempresas


const palette = {
  fondo: "#F5F7F8",
  card: "#fff",
  sombra: "0 2px 8px 0 rgba(10,58,64,0.10)",
  rojoSuave: "#FCA5A5",
  texto: "#042326",
  info: "#1D7373"
};

function CategoriasGlobalSuperadmin() {
  const [empresaFiltro, setEmpresaFiltro] = useState("");
  const [microempresas, setMicroempresas] = useState([]);
    // Cargar microempresas al montar
    useEffect(() => {
      getMicroempresas()
        .then(res => setMicroempresas(res.data))
        .catch(() => setMicroempresas([]));
    }, []);
  const [estadoFiltro, setEstadoFiltro] = useState("todos");
  const [nombreFiltro, setNombreFiltro] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Cargar categorías según filtro de estado
  useEffect(() => {
    setLoading(true);
    let fetch;
    if (estadoFiltro === "activas") {
      fetch = getCategoriasActivas;
    } else if (estadoFiltro === "inactivas") {
      fetch = getCategoriasInactivas;
    } else {
      fetch = getTodasCategorias;
    }
    fetch()
      .then(res => setCategorias(res.data))
      .catch(() => setError("Error al cargar categorías"))
      .finally(() => setLoading(false));
  }, [estadoFiltro]);
  const [modalEditar, setModalEditar] = useState(null); // categoría a editar o null

  // Filtrado funcional
  const categoriasFiltradas = categorias.filter(c => {
    if (empresaFiltro && String(c.id_microempresa) !== String(empresaFiltro)) return false;
    // Solo filtrar por estado si el filtro es "todos"
    if (estadoFiltro === "todos") {
      // Si el usuario está en "todos", puede querer filtrar por estado manualmente (opcional)
      // Si quieres mostrar todas, no pongas nada aquí
    }
    if (nombreFiltro && !c.nombre.toLowerCase().includes(nombreFiltro.toLowerCase())) return false;
    return true;
  });

  // Handlers reales
  const handleEditar = categoria => {
    setModalEditar(categoria);
  };
  // Helper para recargar según filtro
  const recargarCategorias = async () => {
    let fetch;
    if (estadoFiltro === "activas") {
      fetch = getCategoriasActivas;
    } else if (estadoFiltro === "inactivas") {
      fetch = getCategoriasInactivas;
    } else {
      fetch = getTodasCategorias;
    }
    const res = await fetch();
    setCategorias(res.data);
  };

  const handleGuardarEdicion = async catEditada => {
    setLoading(true);
    try {
      await editarCategoriaGlobal(catEditada.id_categoria, catEditada);
      await recargarCategorias();
      setModalEditar(null);
    } catch {
      setError("Error al editar la categoría");
    } finally {
      setLoading(false);
    }
  };
  const handleActivar = async id_categoria => {
    setLoading(true);
    try {
      await activarCategoriaGlobal(id_categoria);
      await recargarCategorias();
    } catch {
      setError("Error al activar la categoría");
    } finally {
      setLoading(false);
    }
  };
  const handleDesactivar = async id_categoria => {
    setLoading(true);
    try {
      await desactivarCategoriaGlobal(id_categoria);
      await recargarCategorias();
    } catch {
      setError("Error al desactivar la categoría");
    } finally {
      setLoading(false);
    }
  };
  const handleEliminar = async id_categoria => {
    setLoading(true);
    try {
      await eliminarCategoriaGlobal(id_categoria);
      await recargarCategorias();
    } catch {
      setError("Error al eliminar la categoría");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", padding: 24 }}>
      <h2 style={{ color: palette.info, fontWeight: 800, fontSize: "2rem", marginBottom: 32 }}>
        Todas las categorías
      </h2>
      {/* Barra de filtros */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 28, alignItems: "center" }}>
        <select
          value={empresaFiltro}
          onChange={e => setEmpresaFiltro(e.target.value)}
          style={{ padding: "0.6em 1em", borderRadius: 8, border: "1px solid #1D7373", minWidth: 180 }}
        >
          <option value="">Todas las microempresas</option>
          {microempresas.map(emp => (
            <option key={emp.id_microempresa || emp.id} value={emp.id_microempresa || emp.id}>{emp.nombre}</option>
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
            background: estadoFiltro === "activas" ? palette.info : palette.card,
            color: estadoFiltro === "activas" ? "#fff" : palette.texto,
            border: "1px solid #1D7373",
            borderRadius: 8,
            padding: "0.6em 1.2em",
            fontWeight: 600,
            cursor: "pointer"
          }}
          onClick={() => setEstadoFiltro("activas")}
        >
          Activas
        </button>
        <button
          style={{
            background: estadoFiltro === "inactivas" ? palette.info : palette.card,
            color: estadoFiltro === "inactivas" ? "#fff" : palette.texto,
            border: "1px solid #1D7373",
            borderRadius: 8,
            padding: "0.6em 1.2em",
            fontWeight: 600,
            cursor: "pointer"
          }}
          onClick={() => setEstadoFiltro("inactivas")}
        >
          Inactivas
        </button>
        <input
          type="text"
          placeholder="Buscar categoría..."
          value={nombreFiltro}
          onChange={e => setNombreFiltro(e.target.value)}
          style={{ padding: "0.6em 1em", borderRadius: 8, border: "1px solid #1D7373", minWidth: 200 }}
        />
      </div>
      {/* Listado de categorías */}
      {loading && <div style={{ color: palette.info, fontWeight: 500, fontSize: "1.1rem", marginBottom: 12 }}>Cargando categorías...</div>}
      {error && <div style={{ color: palette.rojoSuave, fontWeight: 500, fontSize: "1.1rem", marginBottom: 12 }}>{error}</div>}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
        {categoriasFiltradas.length === 0 ? (
          <div style={{ color: palette.rojoSuave, fontWeight: 500, fontSize: "1.2rem", gridColumn: "1/-1" }}>
            No hay categorías que coincidan con los filtros.
          </div>
        ) : (
          categoriasFiltradas.map(cat => (
            <div key={cat.id_categoria} style={{ background: cat.estado === "inactiva" ? palette.rojoSuave : palette.card, borderRadius: 16, boxShadow: palette.sombra, padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, justifyContent: "space-between" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: "1.1rem", color: palette.info }}>{cat.nombre}</div>
                  <div style={{ color: palette.texto, fontSize: 14 }}>{cat.descripcion}</div>
                  <div style={{ color: "#888", fontSize: 13, marginTop: 2 }}>Microempresa: <b>{cat.microempresa}</b></div>
                  <div style={{ color: "#888", fontSize: 13 }}>Estado: <b style={{ color: cat.estado === "activa" ? palette.info : palette.rojoSuave }}>{cat.estado}</b></div>
                </div>
                {/* Acciones de administración solo para superadmin */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <button onClick={() => handleEditar(cat)} style={{ background: palette.info, color: "#fff", border: "none", borderRadius: 8, padding: "0.3em 0.9em", fontWeight: 600, cursor: "pointer", fontSize: 13 }}>Editar</button>
                  <button
                    onClick={async () => {
                      setLoading(true);
                      try {
                        const isActiva = typeof cat.estado === "string" ? cat.estado.toLowerCase() === "activa" : !!cat.estado;
                        if (isActiva) {
                          await desactivarCategoriaGlobal(cat.id_categoria);
                        } else {
                          await activarCategoriaGlobal(cat.id_categoria);
                        }
                        await recargarCategorias();
                      } catch {
                        setError("Error al cambiar el estado de la categoría");
                      } finally {
                        setLoading(false);
                      }
                    }}
                    style={{
                      background: (typeof cat.estado === "string" ? cat.estado.toLowerCase() === "activa" : !!cat.estado) ? palette.rojoSuave : palette.info,
                      color: "#fff",
                      border: "none",
                      borderRadius: 8,
                      padding: "0.3em 0.9em",
                      fontWeight: 600,
                      cursor: "pointer",
                      fontSize: 13
                    }}
                  >
                    {(typeof cat.estado === "string" ? cat.estado.toLowerCase() === "activa" : !!cat.estado) ? "Desactivar" : "Activar"}
                  </button>
                  <button onClick={() => handleEliminar(cat.id_categoria)} style={{ background: "#fff", color: palette.rojoSuave, border: `1px solid ${palette.rojoSuave}`, borderRadius: 8, padding: "0.3em 0.9em", fontWeight: 600, cursor: "pointer", fontSize: 13 }}>Eliminar</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {/* Modal de edición de categoría */}
      {modalEditar && (
        <EditCategoryModal
          categoria={modalEditar}
          onClose={() => setModalEditar(null)}
          onSave={handleGuardarEdicion}
        />
      )}
    </div>
  );
}

export default CategoriasGlobalSuperadmin;
