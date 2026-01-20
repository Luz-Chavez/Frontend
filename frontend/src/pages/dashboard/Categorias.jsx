import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import apiClient from "../../api/axios.js";
import CategoryCard from "../../components/CategoryCard";
import EditCategoryModal from "../../components/EditCategoryModal";
import CreateCategoryModal from "../../components/CreateCategoryModal";



function CategoriasVista() {
  const { user } = useAuth();
  const [categoriasEditadas, setCategoriasEditadas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("todas");
  const [modalEditar, setModalEditar] = useState(null);
  const [modalCrear, setModalCrear] = useState(false);
  const [error, setError] = useState("");


  // Cargar categorías desde el backend
  useEffect(() => {
    const fetchCategorias = async () => {
      if (!user?.microempresa?.id && !user?.microempresa?.id_microempresa) return;
      setLoading(true);
      try {
        // Listar categorías por microempresa
        const id_micro = user.microempresa.id || user.microempresa.id_microempresa;
        const res = await apiClient.get(`/productos/categoria/microempresa/${id_micro}`);
        setCategoriasEditadas(res.data);
      } catch {
        setError("Error al cargar categorías");
      } finally {
        setLoading(false);
      }
    };
    if (user?.rol === "adminmicroempresa") {
      fetchCategorias();
    }
  }, [user]);

  // Filtrado
  const categoriasFiltradas = categoriasEditadas.filter(cat => {
    if (filtro === "todas") return true;
    if (filtro === "activas") return cat.activo;
    if (filtro === "inactivas") return !cat.activo;
    return true;
  });

  // Handlers reales
  const handleEditar = categoria => setModalEditar(categoria);

  const handleGuardarEdicion = async catEditada => {
    try {
        const body = {
          nombre: catEditada.nombre,
          activo: catEditada.activo
        };
        if (catEditada.descripcion && catEditada.descripcion.trim() !== "") {
          body.descripcion = catEditada.descripcion.trim();
        }
        const res = await apiClient.put(`/productos/categoria/${catEditada.id_categoria}`, body);
      setCategoriasEditadas(prev => prev.map(c => c.id_categoria === catEditada.id_categoria ? res.data : c));
      setModalEditar(null);
    } catch {
      setError("Error al actualizar la categoría");
    }
  };

  const handleActivar = async id_categoria => {
    try {
      await apiClient.post(`/productos/categoria/${id_categoria}/activar`);
      setCategoriasEditadas(prev => prev.map(c => c.id_categoria === id_categoria ? { ...c, activo: true } : c));
    } catch {
      setError("Error al activar la categoría");
    }
  };

  const handleDesactivar = async id_categoria => {
    try {
      await apiClient.delete(`/productos/categoria/${id_categoria}`);
      setCategoriasEditadas(prev => prev.map(c => c.id_categoria === id_categoria ? { ...c, activo: false } : c));
    } catch {
      setError("Error al desactivar la categoría");
    }
  };

  const handleEliminar = async id_categoria => {
    try {
      await apiClient.delete(`/productos/categoria/${id_categoria}`);
      setCategoriasEditadas(prev => prev.filter(c => c.id_categoria !== id_categoria));
    } catch {
      setError("Error al eliminar la categoría");
    }
  };

  const handleCrear = async nuevaCat => {
    try {
      // Crear categoría: solo nombre y descripción
      const body = { nombre: nuevaCat.nombre , descripcion: nuevaCat.descripcion };
      console.log(body);
      if (nuevaCat.descripcion && nuevaCat.descripcion.trim() !== "") {
        body.descripcion = nuevaCat.descripcion;
      }
      const res = await apiClient.post("/productos/categoria", body, {
        headers: { "Content-Type": "application/json" }
      });
      setCategoriasEditadas(prev => [...prev, res.data]);
      setModalCrear(false);
    } catch {
      setError("Error al crear la categoría");
    }
  };

  // Estilos
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
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.titulo}>
        Categorías de {user?.microempresa?.nombre || "Microempresa"}
      </div>
      <div style={styles.filtrosBar}>
        <button
          style={{ ...styles.filtroBtn, ...(filtro === "todas" ? styles.filtroBtnActive : {}) }}
          onClick={() => setFiltro("todas")}
        >
          Todas
        </button>
        <button
          style={{ ...styles.filtroBtn, ...(filtro === "activas" ? styles.filtroBtnActive : {}) }}
          onClick={() => setFiltro("activas")}
        >
          Activas
        </button>
        <button
          style={{ ...styles.filtroBtn, ...(filtro === "inactivas" ? styles.filtroBtnActive : {}) }}
          onClick={() => setFiltro("inactivas")}
        >
          Inactivas
        </button>
        {user?.rol === "adminmicroempresa" && (
          <button
            style={{ ...styles.filtroBtn, background: "#10B981", marginLeft: "auto" }}
            onClick={() => setModalCrear(true)}
          >
            Crear nueva categoría
          </button>
        )}
      </div>
      {error && <div style={{ color: "#E57373", fontWeight: 500, marginBottom: 12 }}>{error}</div>}
      {loading ? (
        <div style={{ color: "#1D7373", fontWeight: 500, fontSize: "1.2rem" }}>Cargando categorías...</div>
      ) : (
        <div style={styles.listado}>
          {categoriasFiltradas.length === 0 ? (
            <div style={{ color: "#E57373", fontWeight: 500, fontSize: "1.2rem" }}>
              No hay categorías que coincidan con los filtros.
            </div>
          ) : (
            categoriasFiltradas.map(cat => (
              <CategoryCard
                key={cat.id_categoria}
                categoria={cat}
                onEdit={user?.rol === "adminmicroempresa" || user?.rol === "superadmin" ? () => handleEditar(cat) : undefined}
                onToggle={user?.rol === "adminmicroempresa" || user?.rol === "superadmin" ? () => (cat.activo ? handleDesactivar(cat.id_categoria) : handleActivar(cat.id_categoria)) : undefined}
                onDelete={user?.rol === "adminmicroempresa" || user?.rol === "superadmin" ? () => handleEliminar(cat.id_categoria) : undefined}
              />
            ))
          )}
        </div>
      )}
      {modalEditar && (
        <EditCategoryModal
          categoriaSeleccionada={modalEditar}
          onClose={() => setModalEditar(null)}
          onSave={handleGuardarEdicion}
        />
      )}
      {modalCrear && (
        <CreateCategoryModal
          onClose={() => setModalCrear(false)}
          onCrearCategoria={handleCrear}
        />
      )}
    </div>
  );
}

export default CategoriasVista;
