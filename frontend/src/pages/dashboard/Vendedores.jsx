import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import apiClient from "../../services/apiClient";
import { useNavigate } from "react-router-dom";
import { Trash2, ToggleLeft, ToggleRight, Pencil, X, Eye, EyeOff } from "lucide-react";

export default function Vendedores() {
  const { user } = useAuth();
  const [vendedores, setVendedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Estado para modal de edición
  const [editModal, setEditModal] = useState(null);
  const [editForm, setEditForm] = useState({ nombre: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");

  useEffect(() => {
    async function fetchVendedores() {
      try {
        const res = await apiClient.get(`/microempresas/${user?.microempresa?.id_microempresa}/vendedores`);
        setVendedores(res.data);
      } catch {
        setError("No se pudo cargar la lista de vendedores");
      } finally {
        setLoading(false);
      }
    }
    if (user?.microempresa?.id_microempresa) fetchVendedores();
  }, [user]);

  const handleDelete = async (id_usuario) => {
    if (!window.confirm("¿Seguro que deseas eliminar este vendedor?")) return;
    try {
      await apiClient.delete(`/vendedores/${id_usuario}`);
      setVendedores(vendedores.filter(v => v.id_usuario !== id_usuario));
    } catch {
      alert("No se pudo eliminar el vendedor.");
    }
  };

  const handleToggleEstado = async (id_usuario, estadoActual) => {
    try {
      await apiClient.put(`/vendedores/${id_usuario}/baja-logica`);
      setVendedores(vendedores.map(v => v.id_usuario === id_usuario ? { ...v, estado: !estadoActual } : v));
    } catch {
      alert("No se pudo cambiar el estado del vendedor.");
    }
  };

  // Abrir modal de edición
  const handleOpenEdit = (vendedor) => {
    setEditForm({
      nombre: vendedor.nombre,
      email: vendedor.email,
      password: "" // Vacío por defecto - solo se enviará si se llena
    });
    setEditModal(vendedor);
    setEditError("");
  };

  // Guardar cambios
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError("");

    try {
      const data = {
        nombre: editForm.nombre,
        email: editForm.email
      };

      // Solo enviar password si se completó
      if (editForm.password && editForm.password.length > 0) {
        if (editForm.password.length < 6) {
          setEditError("La contraseña debe tener al menos 6 caracteres");
          setEditLoading(false);
          return;
        }
        data.password = editForm.password;
      }

      await apiClient.put(`/vendedores/${editModal.id_usuario}`, data);

      // Actualizar lista
      setVendedores(vendedores.map(v =>
        v.id_usuario === editModal.id_usuario
          ? { ...v, nombre: editForm.nombre, email: editForm.email }
          : v
      ));
      setEditModal(null);
    } catch (err) {
      const msg = err.response?.data?.detail || "Error al actualizar vendedor";
      setEditError(typeof msg === 'object' ? JSON.stringify(msg) : msg);
    } finally {
      setEditLoading(false);
    }
  };

  const s = {
    table: { width: "100%", marginTop: 20, borderCollapse: "collapse" },
    th: { background: "#E6EAEA", color: "#042326", fontWeight: 600, padding: "12px", borderBottom: "2px solid #1D7373", textAlign: "left" },
    td: { padding: "12px", borderBottom: "1px solid #E6EAEA", color: "#042326", fontSize: 15 },
    estado: (activo) => ({
      display: "inline-flex", alignItems: "center", gap: 6,
      background: activo ? "#D1FAE5" : "#FECACA",
      color: activo ? "#107361" : "#EF4444",
      fontWeight: 600, fontSize: 13, borderRadius: 99, padding: "4px 12px"
    }),
    actions: { display: "flex", gap: 8, justifyContent: "center" },
    actionBtn: {
      background: 'none',
      border: '1px solid #E6EAEA',
      borderRadius: 6,
      padding: 6,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  };

  const modalStyles = {
    overlay: {
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center',
      justifyContent: 'center', zIndex: 1000
    },
    content: {
      background: 'white', padding: 32, borderRadius: 16, width: 400,
      position: 'relative', boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
    },
    closeBtn: {
      position: 'absolute', top: 16, right: 16, background: 'none',
      border: 'none', cursor: 'pointer', color: '#64748B'
    },
    input: {
      padding: '10px 14px', borderRadius: 8, border: '1.5px solid #1D7373',
      background: '#fff', color: '#042326', fontSize: 15, width: '100%',
      boxSizing: 'border-box', outline: 'none'
    },
    label: {
      color: '#0A3A40', fontWeight: 500, display: 'block', marginBottom: 6, marginTop: 16
    },
    btn: {
      padding: '12px', background: '#1D7373', color: 'white', border: 'none',
      borderRadius: 10, fontWeight: 600, fontSize: 16, cursor: 'pointer',
      width: '100%', marginTop: 24
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", background: "#fff", borderRadius: 16, boxShadow: "0 4px 20px rgba(0,0,0,0.08)", padding: 32 }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, color: '#0A3A40', marginBottom: 10 }}>
        Vendedores de la Microempresa
      </h2>

      {user?.rol === 'adminmicroempresa' && (
        <button
          onClick={() => navigate('/dashboard/vendedores/crear')}
          style={{
            margin: '16px 0', padding: '10px 18px', background: '#1D7373',
            color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600,
            fontSize: 15, cursor: 'pointer'
          }}
        >
          + Agregar Vendedor
        </button>
      )}

      {loading && <div style={{ color: '#042326' }}>Cargando...</div>}
      {error && <div style={{ color: '#EF4444', fontWeight: 500 }}>{error}</div>}

      <table style={s.table}>
        <thead>
          <tr>
            <th style={s.th}>Nombre</th>
            <th style={s.th}>Email</th>
            <th style={s.th}>Estado</th>
            <th style={{ ...s.th, textAlign: 'center' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {vendedores.map(v => (
            <tr key={v.id_usuario}>
              <td style={s.td}><strong>{v.nombre}</strong></td>
              <td style={s.td}>{v.email}</td>
              <td style={s.td}>
                <span style={s.estado(v.estado)}>
                  {v.estado ? <ToggleRight size={18} color="#107361" /> : <ToggleLeft size={18} color="#EF4444" />}
                  {v.estado ? "Activo" : "Inactivo"}
                </span>
              </td>
              <td style={s.td}>
                <div style={s.actions}>
                  <button
                    title="Editar vendedor"
                    onClick={() => handleOpenEdit(v)}
                    style={{ ...s.actionBtn, borderColor: '#1D7373' }}
                  >
                    <Pencil size={18} color="#1D7373" />
                  </button>
                  <button
                    title="Cambiar estado"
                    onClick={() => handleToggleEstado(v.id_usuario, v.estado)}
                    style={s.actionBtn}
                  >
                    {v.estado ? <ToggleRight size={18} color="#107361" /> : <ToggleLeft size={18} color="#EF4444" />}
                  </button>
                  <button
                    title="Eliminar vendedor"
                    onClick={() => handleDelete(v.id_usuario)}
                    style={{ ...s.actionBtn, borderColor: '#EF4444' }}
                  >
                    <Trash2 size={18} color="#EF4444" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de edición */}
      {editModal && (
        <div style={modalStyles.overlay}>
          <div style={modalStyles.content}>
            <button onClick={() => setEditModal(null)} style={modalStyles.closeBtn}>
              <X size={22} />
            </button>

            <h3 style={{ color: '#0A3A40', fontWeight: 700, fontSize: 20, marginBottom: 8, textAlign: 'center' }}>
              Editar Vendedor
            </h3>
            <p style={{ color: '#64748B', fontSize: 14, textAlign: 'center', marginBottom: 16 }}>
              Modifica los datos del vendedor
            </p>

            <form onSubmit={handleSaveEdit}>
              <label style={{ ...modalStyles.label, marginTop: 0 }}>Nombre</label>
              <input
                type="text"
                value={editForm.nombre}
                onChange={e => setEditForm({ ...editForm, nombre: e.target.value })}
                required
                style={modalStyles.input}
              />

              <label style={modalStyles.label}>Email</label>
              <input
                type="email"
                value={editForm.email}
                onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                required
                style={modalStyles.input}
              />

              <label style={modalStyles.label}>
                Nueva contraseña <span style={{ color: '#64748B', fontWeight: 400 }}>(dejar vacío para no cambiar)</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={editForm.password}
                  onChange={e => setEditForm({ ...editForm, password: e.target.value })}
                  placeholder="Mínimo 6 caracteres"
                  style={{ ...modalStyles.input, paddingRight: 45 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: 10, top: '50%',
                    transform: 'translateY(-50%)', background: 'none',
                    border: 'none', cursor: 'pointer', color: '#64748B'
                  }}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {editError && (
                <div style={{ color: '#EF4444', marginTop: 12, fontSize: 14, textAlign: 'center' }}>
                  {editError}
                </div>
              )}

              <button
                type="submit"
                disabled={editLoading}
                style={{
                  ...modalStyles.btn,
                  opacity: editLoading ? 0.7 : 1,
                  cursor: editLoading ? 'not-allowed' : 'pointer'
                }}
              >
                {editLoading ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
