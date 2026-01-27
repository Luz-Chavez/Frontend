import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getProveedores, createProveedor, updateProveedor, deleteProveedor } from '../../api/proveedores.api';
import { Truck, Pencil, Trash2, Plus, Search, X, Mail, Phone, Settings } from 'lucide-react';
import ProveedorManager from './ProveedorManager'; // ✅ Importamos el componente nuevo

export default function Proveedores({ readOnly = false }) {
  const { user } = useAuth();
  const [proveedores, setProveedores] = useState([]);
  const [filteredProveedores, setFilteredProveedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modales
  const [showModal, setShowModal] = useState(false);
  const [managerProveedor, setManagerProveedor] = useState(null); // Para el Manager Avanzado

  const [editingId, setEditingId] = useState(null);
  const [newProv, setNewProv] = useState({ nombre: '', contacto: '', email: '' });

  // Permisos - readOnly fuerza modo solo lectura
  const puedeEditar = !readOnly && (user?.rol === "adminmicroempresa");

  // ✅ CORRECCIÓN ERROR 422: Esperar a que el usuario exista
  // También cargar para vendedores (solo lectura)
  useEffect(() => {
    if (user?.microempresa?.id_microempresa) {
      cargarData(user.microempresa.id_microempresa);
    }
  }, [user]);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const results = proveedores.filter(p => p.nombre.toLowerCase().includes(term));
    setFilteredProveedores(results);
  }, [searchTerm, proveedores]);

  const cargarData = async (idMicro) => {
    setLoading(true);
    try {
      const res = await getProveedores(idMicro);
      setProveedores(res.data);
      setFilteredProveedores(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const idMicro = user?.microempresa?.id_microempresa;
    if (!idMicro) return;

    try {
      if (editingId) {
        await updateProveedor(editingId, newProv, idMicro);
      } else {
        await createProveedor({ ...newProv, id_microempresa: idMicro });
      }
      setShowModal(false);
      setNewProv({ nombre: '', contacto: '', email: '' });
      setEditingId(null);
      cargarData(idMicro);
    } catch (error) { alert("Error al guardar"); }
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar proveedor?")) return;
    try {
      await deleteProveedor(id, user.microempresa.id_microempresa);
      cargarData(user.microempresa.id_microempresa);
    } catch (e) { alert("Error"); }
  };

  const handleEdit = (p) => {
    setNewProv({ nombre: p.nombre, contacto: p.contacto, email: p.email });
    setEditingId(p.id_proveedor);
    setShowModal(true);
  };

  return (
    <div style={containerStyle}>
      <h2 style={headerStyle}><Truck size={28} /> Gestión de Proveedores</h2>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: '300px' }}>
          <Search size={18} style={{ position: 'absolute', left: 10, top: 12, color: '#1D7373' }} />
          <input placeholder="Buscar..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ ...inputStyle, paddingLeft: 35 }} />
        </div>
        {puedeEditar && (
          <button onClick={() => setShowModal(true)} style={primaryBtnStyle}><Plus size={18} /> Nuevo Proveedor</button>
        )}
      </div>

      {loading ? <div style={{ textAlign: 'center' }}>Cargando...</div> : (
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 16 }}>
          <thead>
            <tr style={{ background: "#E6EAEA" }}>
              <th style={thStyle}>Nombre</th>
              <th style={thStyle}>Contacto</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredProveedores.map(p => (
              <tr key={p.id_proveedor} style={{ borderBottom: "1px solid #E6EAEA" }}>
                <td style={tdStyle}><strong>{p.nombre}</strong></td>
                <td style={tdStyle}><div style={{ display: 'flex', gap: 5 }}><Phone size={14} color="#1D7373" /> {p.contacto}</div></td>
                <td style={tdStyle}><div style={{ display: 'flex', gap: 5 }}><Mail size={14} color="#1D7373" /> {p.email}</div></td>
                <td style={tdStyle}>
                  {/* BOTÓN GESTIONAR - solo si puede editar */}
                  {puedeEditar && (
                    <>
                      <button onClick={() => setManagerProveedor(p)} title="Gestionar Productos/Pagos" style={{ ...iconBtn, border: "2px solid #1D7373", color: "#1D7373", marginRight: 8, background: "#E6F4EA" }}>
                        <Settings size={18} />
                      </button>
                      <button onClick={() => handleEdit(p)} title="Editar" style={{ ...iconBtn, border: "2px solid #0A3A40", color: "#0A3A40", marginRight: 8 }}>
                        <Pencil size={18} />
                      </button>
                      <button onClick={() => handleDelete(p.id_proveedor)} title="Eliminar" style={{ ...iconBtn, border: "2px solid #EF4444", color: "#EF4444" }}>
                        <Trash2 size={18} />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal Básico */}
      {showModal && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <button onClick={() => setShowModal(false)} style={closeModalBtn}><X size={20} /></button>
            <h3 style={{ color: "#1D7373", marginBottom: 20, textAlign: 'center' }}>{editingId ? 'Editar' : 'Nuevo'} Proveedor</h3>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
              <input required placeholder="Nombre" style={inputStyle} value={newProv.nombre} onChange={e => setNewProv({ ...newProv, nombre: e.target.value })} />
              <input required placeholder="Teléfono" style={inputStyle} value={newProv.contacto} onChange={e => setNewProv({ ...newProv, contacto: e.target.value })} />
              <input required placeholder="Email" style={inputStyle} value={newProv.email} onChange={e => setNewProv({ ...newProv, email: e.target.value })} />
              <button type="submit" style={{ ...primaryBtnStyle, justifyContent: 'center' }}>Guardar</button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Avanzado */}
      {managerProveedor && (
        <ProveedorManager
          proveedor={managerProveedor}
          idMicroempresa={user?.microempresa?.id_microempresa}
          onClose={() => setManagerProveedor(null)}
        />
      )}
    </div>
  );
}

// Estilos
const containerStyle = { maxWidth: 1000, margin: "40px auto", background: "#fff", borderRadius: 16, boxShadow: "0 4px 16px #0002", padding: 32 };
const headerStyle = { textAlign: "center", fontWeight: 700, marginBottom: 24, color: "#1D7373", fontSize: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' };
const thStyle = { padding: "12px 10px", textAlign: "left", color: "#042326", fontWeight: 700, fontSize: 16, borderBottom: "2px solid #1D7373" };
const tdStyle = { padding: "12px 10px", fontSize: 15, color: "#0A3A40" };
const inputStyle = { padding: "10px 14px", borderRadius: 8, border: "1px solid #cbd5e0", fontSize: 15, width: '100%', outline: 'none', color: '#0A3A40', boxSizing: 'border-box' };
const primaryBtnStyle = { background: "#1D7373", color: "#F5F7F8", border: "none", borderRadius: 8, padding: "10px 16px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 };
const iconBtn = { padding: "6px", borderRadius: 6, background: "#F5F7F8", cursor: "pointer", transition: "all 0.2s" };
const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };
const modalContentStyle = { background: 'white', padding: 32, borderRadius: 12, width: '400px', position: 'relative', boxShadow: "0 4px 20px rgba(0,0,0,0.15)" };
const closeModalBtn = { position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', color: '#666' };