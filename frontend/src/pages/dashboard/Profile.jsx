
import { useAuth } from "../../context/AuthContext";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../services/apiClient";
import { UserCircle2, Mail, Pencil, KeyRound } from "lucide-react";


export default function Profile() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  // Estado unificado para loading, error, success
  const [status, setStatus] = useState({ loading: false, error: "", success: "" });
  const [form, setForm] = useState({ nombre: user?.nombre || "", email: user?.email || "" });
  const [editMode, setEditMode] = useState(false);
  const originalForm = useRef({ nombre: user?.nombre || "", email: user?.email || "" });

  // Validación simple de email y nombre
  const validate = (nombre, email) => {
    if (!nombre.trim()) return "El nombre es obligatorio";
    if (!email.trim()) return "El email es obligatorio";
    // Validación básica de email
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return "Email inválido";
    return null;
  };

  // Maneja cambios en los inputs
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Limpiar error al modificar
    setStatus(s => ({ ...s, error: "" }));
  };

  // Maneja el submit del formulario
  const handleSubmit = async e => {
    e.preventDefault();
    setStatus({ loading: true, error: "", success: "" });

    // Validación previa
    const validationError = validate(form.nombre, form.email);
    if (validationError) {
      setStatus({ loading: false, error: validationError, success: "" });
      return;
    }

    try {
      // Enviar datos a la API
      const res = await apiClient.put(`/usuarios/${user.id_usuario}`, {
        nombre: form.nombre,
        email: form.email,
        estado: user.estado
      });
      // Log para depuración de estructura de respuesta
      console.log("Respuesta PUT /usuarios:", res);

      // Axios solo entra aquí si status es 2xx
      if (res && res.data && res.data.id_usuario) {
        // Actualizar context solo si la API responde correctamente
        setUser(prev => ({
          ...prev,
          nombre: res.data.nombre,
          email: res.data.email,
          estado: res.data.estado,
          rol: res.data.rol,
          id_usuario: res.data.id_usuario,
          id_microempresa: res.data.id_microempresa
        }));
        setStatus({ loading: false, error: "", success: "Datos actualizados correctamente" });
        setEditMode(false);
        setForm({ nombre: res.data.nombre, email: res.data.email });
        originalForm.current = { nombre: res.data.nombre, email: res.data.email };
      } else {
        setStatus({ loading: false, error: "Respuesta inesperada del servidor", success: "" });
      }
    } catch (err) {
      // Solución robusta: manejar errores de validación y red
      console.log("Error en PUT /usuarios:", err);
      if (err?.response) {
        if (err.response.status === 422 && err.response.data?.detail) {
          // Error de validación específico
          setStatus({ loading: false, error: err.response.data.detail[0]?.msg || "Error de validación", success: "" });
        } else {
          setStatus({ loading: false, error: err.response.data?.detail || "No se pudo actualizar el perfil", success: "" });
        }
      } else if (err?.request) {
        setStatus({ loading: false, error: "No hay respuesta del servidor. Verifica tu conexión.", success: "" });
      } else {
        setStatus({ loading: false, error: "Error desconocido al actualizar el perfil", success: "" });
      }
    }
  };

  // Confirmación antes de cancelar cambios
  const handleCancel = () => {
    if (form.nombre !== originalForm.current.nombre || form.email !== originalForm.current.email) {
      if (!window.confirm("¿Seguro que quieres descartar los cambios?")) return;
    }
    setEditMode(false);
    setStatus({ loading: false, error: "", success: "" });
    setForm({ ...originalForm.current });
  };

  // Envía la solicitud de recuperación y redirige directamente a reset-password
  const handlePasswordChange = async () => {
    if (!user?.email) return;
    try {
      // Opcional: feedback visual (puedes agregar un estado si quieres mostrar loading)
      const res = await apiClient.post("/auth/recover", { email: user.email });
      let receivedToken = null;
      if (res.data) {
        if (typeof res.data === "string") {
          receivedToken = res.data;
        } else if (res.data.reset_token) {
          receivedToken = res.data.reset_token;
        } else if (res.data.token) {
          receivedToken = res.data.token;
        }
      }
      // Redirige directamente a reset-password con el token recibido
      if (receivedToken) {
        navigate("/reset-password", { state: { token: receivedToken } });
      } else {
        navigate("/reset-password");
      }
    } catch {
      alert("No se pudo enviar el correo de recuperación. Intenta más tarde.");
    }
  };

  return (
    <div style={{
      maxWidth: 420,
      margin: "48px auto",
      background: "#F5F7F8",
      borderRadius: 18,
      boxShadow: "0 6px 24px #1D737344",
      padding: 36,
      position: "relative"
    }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 24 }}>
        <UserCircle2 size={80} color="#1D7373" style={{ marginBottom: 8 }} />
        <div style={{ fontWeight: 800, fontSize: 24, color: "#107361", marginBottom: 2 }}>{form.nombre || "Sin nombre"}</div>
        <div style={{ color: "#0A3A40", fontSize: 15, opacity: 0.7, marginBottom: 8 }}>
          <Mail size={18} style={{ verticalAlign: "middle", marginRight: 6 }} />
          {form.email}
        </div>
        {!editMode && (
          <button
            style={{ ...btnStyle, width: "auto", padding: "8px 18px", marginTop: 10, background: "#1D7373" }}
            onClick={() => setEditMode(true)}
          >
            <Pencil size={18} style={{ verticalAlign: "middle", marginRight: 6 }} /> Editar datos
          </button>
        )}
      </div>
      {editMode && (
        <form onSubmit={handleSubmit} style={{ marginBottom: 18 }}>
          <label style={labelStyle}>Nombre</label>
          <input
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            style={inputStyle}
            disabled={status.loading}
          />
          <label style={labelStyle}>Email</label>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            style={inputStyle}
            disabled={status.loading}
          />
          <div style={{ display: "flex", gap: 10 }}>
            <button
              type="submit"
              disabled={status.loading}
              style={{ ...btnStyle, flex: 1 }}
            >
              {status.loading ? "Guardando..." : "Guardar Cambios"}
            </button>
            <button
              type="button"
              style={{ ...btnStyle, flex: 1, background: "#EF4444" }}
              onClick={handleCancel}
              disabled={status.loading}
            >
              Cancelar
            </button>
          </div>
          {status.error && <div style={{ color: "#EF4444", marginTop: 10, fontWeight: 600 }}>{status.error}</div>}
        </form>
      )}

      {/* Mensaje de éxito y aviso de reinicio de sesión, visible siempre que haya éxito */}
      {status.success && (
        <div style={{ marginBottom: 18 }}>
          <div style={{ color: "#107361", marginTop: 10, fontWeight: 600 }}>{status.success}</div>
          <div style={{ color: "#0A3A40", marginTop: 6, fontSize: 14, fontWeight: 500, background: "#E6EAEA", borderRadius: 6, padding: "8px 12px" }}>
            Por favor, vuelve a iniciar sesión para visualizar los cambios reflejados en tu perfil.
          </div>
        </div>
      )}
      {/* Sección para cambio de contraseña */}
      <div style={{ marginTop: 28, textAlign: "center" }}>
        <button
          style={{ ...btnStyle, width: "auto", padding: "8px 18px", background: "#107361", display: "inline-flex", alignItems: "center" }}
          onClick={handlePasswordChange}
        >
          <KeyRound size={18} style={{ verticalAlign: "middle", marginRight: 6 }} />
          Cambiar contraseña
        </button>
        <div style={{ color: "#0A3A40", fontSize: 13, opacity: 0.6, marginTop: 10 }}>
          Se enviará un correo de recuperación a tu email registrado.
        </div>
      </div>
    </div>
  );
}

const labelStyle = {
  display: "block",
  fontWeight: 700,
  color: "#1D7373",
  marginBottom: 6,
  marginTop: 12,
  fontSize: 15
};

const inputStyle = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: 8,
  border: "1.5px solid #E6EAEA",
  fontSize: 16,
  marginBottom: 8,
  background: "#fff",
  color: "#0A3A40"
};

const btnStyle = {
  width: "100%",
  padding: "10px 0",
  borderRadius: 8,
  background: "#1D7373",
  color: "#F5F7F8",
  fontWeight: 700,
  fontSize: 16,
  border: "none",
  cursor: "pointer",
  marginTop: 12,
  boxShadow: "0 2px 8px #E6EAEA"
};
