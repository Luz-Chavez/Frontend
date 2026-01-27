import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, Shield, Power, Trash2, Pencil, X, Eye, EyeOff } from "lucide-react";
import { getSuperadmins, deleteSuperadmin } from "../../api/superadmin.api";
import apiClient from "../../services/apiClient";

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

const Admins = () => {
  const navigate = useNavigate();
  const [superadmins, setSuperadmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal editar
  const [editModal, setEditModal] = useState(null);
  const [editForm, setEditForm] = useState({ nombre: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");

  // Cargar superadmins
  const fetchSuperadmins = async () => {
    try {
      setLoading(true);
      const res = await getSuperadmins();
      setSuperadmins(res.data);
    } catch (err) {
      setError("Error al cargar superadmins");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuperadmins();
  }, []);

  // Eliminar superadmin
  const handleDelete = async (id) => {
    if (!confirm("¿Estás seguro de eliminar este SuperAdmin?")) return;
    try {
      await deleteSuperadmin(id);
      fetchSuperadmins();
    } catch (err) {
      alert("Error al eliminar: " + (err.response?.data?.detail || "Error desconocido"));
    }
  };

  // Toggle estado
  const handleToggleEstado = async (id, estadoActual) => {
    try {
      // Cambiar estado del usuario
      await apiClient.put(`/superadmins/${id}`, {
        nombre: superadmins.find(s => s.id_usuario === id)?.nombre,
        email: superadmins.find(s => s.id_usuario === id)?.email
      });
      fetchSuperadmins();
    } catch (err) {
      alert("Error al cambiar estado");
    }
  };

  // Abrir modal editar
  const handleOpenEdit = (admin) => {
    setEditForm({ nombre: admin.nombre, email: admin.email, password: "" });
    setEditModal(admin);
    setEditError("");
  };

  // Guardar edición
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError("");

    try {
      const data = { nombre: editForm.nombre, email: editForm.email };
      if (editForm.password && editForm.password.length >= 6) {
        data.password = editForm.password;
      }
      await apiClient.put(`/superadmins/${editModal.id_usuario}`, data);
      setEditModal(null);
      fetchSuperadmins();
    } catch (err) {
      setEditError(err.response?.data?.detail || "Error al actualizar");
    } finally {
      setEditLoading(false);
    }
  };

  const s = {
    container: { maxWidth: '1200px' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' },
    title: { fontSize: '28px', color: palette.primary, fontWeight: 'bold', marginBottom: '5px' },
    subtitle: { color: palette.gray, fontSize: '16px' },
    btnCreate: {
      backgroundColor: palette.secondary, color: 'white', padding: '10px 20px',
      borderRadius: '8px', border: 'none', display: 'flex', alignItems: 'center',
      gap: '8px', cursor: 'pointer', fontWeight: '500', fontSize: '14px'
    },
    card: {
      backgroundColor: 'white', borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: `1px solid ${palette.border}`,
      padding: '0', overflow: 'hidden'
    },
    table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
    th: {
      padding: '14px 20px', borderBottom: `1px solid ${palette.border}`,
      backgroundColor: palette.lightBg, color: palette.gray, fontSize: '12px',
      textTransform: 'uppercase', fontWeight: '600'
    },
    td: {
      padding: '14px 20px', borderBottom: `1px solid ${palette.border}`,
      color: palette.primary, fontSize: '14px', verticalAlign: 'middle'
    },
    userCell: { display: 'flex', alignItems: 'center', gap: '12px' },
    avatar: {
      width: '40px', height: '40px', borderRadius: '50%',
      backgroundColor: palette.secondary, display: 'flex',
      alignItems: 'center', justifyContent: 'center', color: 'white'
    },
    userInfo: { display: 'flex', flexDirection: 'column' },
    userName: { fontWeight: '600', color: palette.primary },
    userEmail: { fontSize: '13px', color: palette.gray },
    badgeActive: {
      backgroundColor: 'rgba(16, 185, 129, 0.1)', color: palette.green,
      padding: '4px 12px', borderRadius: '99px', fontSize: '12px', fontWeight: '600'
    },
    badgeInactive: {
      backgroundColor: 'rgba(239, 68, 68, 0.1)', color: palette.red,
      padding: '4px 12px', borderRadius: '99px', fontSize: '12px', fontWeight: '600'
    },
    actions: { display: 'flex', gap: '8px' },
    btnAction: {
      padding: '8px', borderRadius: '6px', border: `1px solid ${palette.border}`,
      backgroundColor: 'white', cursor: 'pointer', color: palette.gray,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      transition: 'all 0.2s'
    },
    // Modal
    overlay: {
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center',
      justifyContent: 'center', zIndex: 1000
    },
    modal: {
      background: 'white', padding: 32, borderRadius: 16, width: 400,
      position: 'relative', boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
    },
    modalTitle: { fontSize: 20, fontWeight: 700, color: palette.primary, marginBottom: 20, textAlign: 'center' },
    input: {
      padding: '10px 14px', borderRadius: 8, border: `1.5px solid ${palette.secondary}`,
      background: '#fff', color: palette.primary, fontSize: 15, width: '100%',
      boxSizing: 'border-box', outline: 'none', marginBottom: 16
    },
    label: { color: palette.primary, fontWeight: 500, display: 'block', marginBottom: 6 },
    btnSave: {
      padding: 12, background: palette.secondary, color: 'white', border: 'none',
      borderRadius: 10, fontWeight: 600, fontSize: 16, cursor: 'pointer', width: '100%', marginTop: 8
    },
    stats: {
      display: 'flex', gap: 16, marginBottom: 24
    },
    statCard: {
      background: 'white', padding: '16px 24px', borderRadius: 10,
      border: `1px solid ${palette.border}`, flex: 1
    },
    statLabel: { fontSize: 12, color: palette.gray, marginBottom: 4 },
    statValue: { fontSize: 24, fontWeight: 700, color: palette.primary }
  };

  const activos = superadmins.filter(s => s.estado).length;
  const inactivos = superadmins.length - activos;

  return (
    <div style={s.container}>
      <div style={s.header}>
        <div>
          <h1 style={s.title}>Gestión de SuperAdmins</h1>
          <p style={s.subtitle}>Administra los accesos privilegiados del sistema</p>
        </div>
        <button style={s.btnCreate} onClick={() => navigate('/register-superadmin')}>
          <UserPlus size={18} /> Nuevo SuperAdmin
        </button>
      </div>

      {/* Stats */}
      <div style={s.stats}>
        <div style={s.statCard}>
          <div style={s.statLabel}>Total SuperAdmins</div>
          <div style={s.statValue}>{superadmins.length}</div>
        </div>
        <div style={s.statCard}>
          <div style={s.statLabel}>Activos</div>
          <div style={{ ...s.statValue, color: palette.green }}>{activos}</div>
        </div>
        <div style={s.statCard}>
          <div style={s.statLabel}>Inactivos</div>
          <div style={{ ...s.statValue, color: palette.red }}>{inactivos}</div>
        </div>
      </div>

      {loading && <div style={{ textAlign: 'center', padding: 40, color: palette.gray }}>Cargando...</div>}
      {error && <div style={{ textAlign: 'center', padding: 40, color: palette.red }}>{error}</div>}

      {!loading && !error && (
        <div style={s.card}>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Administrador</th>
                <th style={s.th}>Estado</th>
                <th style={s.th}>ID</th>
                <th style={{ ...s.th, textAlign: 'center' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {superadmins.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ ...s.td, textAlign: 'center', padding: 40, color: palette.gray }}>
                    No hay SuperAdmins registrados
                  </td>
                </tr>
              ) : (
                superadmins.map((admin) => (
                  <tr key={admin.id_usuario}>
                    <td style={s.td}>
                      <div style={s.userCell}>
                        <div style={s.avatar}><Shield size={20} /></div>
                        <div style={s.userInfo}>
                          <span style={s.userName}>{admin.nombre}</span>
                          <span style={s.userEmail}>{admin.email}</span>
                        </div>
                      </div>
                    </td>
                    <td style={s.td}>
                      <span style={admin.estado ? s.badgeActive : s.badgeInactive}>
                        {admin.estado ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td style={{ ...s.td, color: palette.gray }}>#{admin.id_usuario}</td>
                    <td style={s.td}>
                      <div style={{ ...s.actions, justifyContent: 'center' }}>
                        <button
                          style={{ ...s.btnAction, borderColor: palette.secondary, color: palette.secondary }}
                          title="Editar"
                          onClick={() => handleOpenEdit(admin)}
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          style={{ ...s.btnAction, borderColor: palette.red, color: palette.red }}
                          title="Eliminar"
                          onClick={() => handleDelete(admin.id_usuario)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Editar */}
      {editModal && (
        <div style={s.overlay}>
          <div style={s.modal}>
            <button
              onClick={() => setEditModal(null)}
              style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', color: palette.gray }}
            >
              <X size={22} />
            </button>

            <h3 style={s.modalTitle}>Editar SuperAdmin</h3>

            <form onSubmit={handleSaveEdit}>
              <label style={s.label}>Nombre</label>
              <input
                type="text"
                value={editForm.nombre}
                onChange={e => setEditForm({ ...editForm, nombre: e.target.value })}
                required
                style={s.input}
              />

              <label style={s.label}>Email</label>
              <input
                type="email"
                value={editForm.email}
                onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                required
                style={s.input}
              />

              <label style={s.label}>
                Nueva contraseña <span style={{ color: palette.gray, fontWeight: 400, fontSize: 13 }}>(opcional)</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={editForm.password}
                  onChange={e => setEditForm({ ...editForm, password: e.target.value })}
                  placeholder="Dejar vacío para no cambiar"
                  style={{ ...s.input, paddingRight: 45 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: 10, top: 10,
                    background: 'none', border: 'none', cursor: 'pointer', color: palette.gray
                  }}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {editError && <div style={{ color: palette.red, marginBottom: 12, fontSize: 14 }}>{editError}</div>}

              <button type="submit" disabled={editLoading} style={{ ...s.btnSave, opacity: editLoading ? 0.7 : 1 }}>
                {editLoading ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admins;