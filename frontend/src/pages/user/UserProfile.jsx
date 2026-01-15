import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext.js";
import { getPlanesRequest } from "../../api/user.api";
import { useNavigate } from "react-router-dom";

function UserProfile() {
  const { user } = useAuth();
  const [planes, setPlanes] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({ nombre: '', email: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPlanes() {
      try {
        const res = await getPlanesRequest();
        setPlanes(res.data);
      } catch (err) {
        setError('Error al cargar los planes');
      }
    }
    fetchPlanes();
  }, []);

  useEffect(() => {
    if (user) {
      setEditData({ nombre: user.nombre || '', email: user.email || '' });
    }
  }, [user]);

  const handleEdit = () => setEditMode(true);
  const handleCancel = () => setEditMode(false);

  const handleChange = e => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setError('');
    try {
      const res = await fetch(`/usuarios/${user.id_usuario}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify(editData)
      });
      if (!res.ok) throw new Error('Error al actualizar usuario');
      setEditMode(false);
      window.location.reload();
    } catch (err) {
      setError('No se pudo actualizar el usuario');
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #0001', padding: 32 }}>
      <h2 style={{ fontWeight: 'bold', fontSize: 24, marginBottom: 16 }}>Perfil de Usuario</h2>
      {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
      <div style={{ marginBottom: 24 }}>
        {editMode ? (
          <>
            <label>Nombre:<br /><input name="nombre" value={editData.nombre} onChange={handleChange} style={{ width: '100%', marginBottom: 8 }} /></label><br />
            <label>Email:<br /><input name="email" value={editData.email} onChange={handleChange} style={{ width: '100%', marginBottom: 8 }} /></label><br />
            <button onClick={handleSave} style={{ marginRight: 8 }}>Guardar</button>
            <button onClick={handleCancel}>Cancelar</button>
          </>
        ) : (
          <>
            <strong>Nombre:</strong> {user?.nombre}<br />
            <strong>Email:</strong> {user?.email}<br />
            <strong>Rol:</strong> {user?.rol}<br />
            <button onClick={handleEdit} style={{ marginTop: 8 }}>Editar Usuario</button>
          </>
        )}
      </div>
      <h3 style={{ fontSize: 20, marginBottom: 12 }}>Planes Disponibles</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {planes.map(plan => (
          <li key={plan.id_plan} style={{ marginBottom: 16, border: '1px solid #eee', borderRadius: 8, padding: 16 }}>
            <strong>{plan.nombre}</strong> - ${plan.precio}<br />
            <span>{plan.descripcion}</span><br />
            <button onClick={() => navigate(`/user/plan/${plan.id_plan}`)} style={{ marginTop: 8 }}>Ver Detalles y Pagar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserProfile;
