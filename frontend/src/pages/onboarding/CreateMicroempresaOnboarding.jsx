import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { getRubrosActivos, createMicroempresa } from "../../api/microempresas.api";

function CreateMicroempresaOnboarding() {
  const navigate = useNavigate();
  const location = useLocation();
  // Recuperar planId del estado de navegación
  const plan = location.state?.plan;
  const planId = plan?.id_plan;

  const [empresa, setEmpresa] = useState({
    nombre: "",
    nit: "",
    direccion: "",
    telefono: "",
    moneda: "BOB",
    tipo_atencion: "PRESENCIAL", // Valor por defecto
    id_rubro: "" // Debe seleccionarse
  });

  const [rubros, setRubros] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Cargar rubros disponibles
  useEffect(() => {
    getRubrosActivos()
      .then(res => {
        if (Array.isArray(res.data)) setRubros(res.data);
      })
      .catch(err => console.error("Error cargando rubros:", err));
  }, []);

  const handleChange = e => {
    setEmpresa({ ...empresa, [e.target.name]: e.target.value });
  };

  const handleEmpresa = async () => {
    setError("");

    // Validaciones básicas
    if (!empresa.nombre || !empresa.nit || !empresa.id_rubro) {
      setError("Por favor completa los campos obligatorios (Nombre, NIT, Rubro)");
      return;
    }

    setLoading(true);

    try {
      // 1. Crear microempresa
      const res = await createMicroempresa(empresa);
      const data = res.data;
      const empresaId = data.id_microempresa;

      // 2. Crear suscripción
      const fecha = new Date();
      fecha.setFullYear(fecha.getFullYear() + 1);

      // Si no hay planId (usuario llegó directo), asignamos plan básico (ID 1) como fallback o manejamos error
      // Asumiremos que si no hay plan, creamos la empresa sin suscripción inicial o con plan free
      if (planId) {
        const res2 = await fetch("http://127.0.0.1:8000/suscripciones/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("access_token")}`
          },
          body: JSON.stringify({
            id_microempresa: empresaId,
            id_plan: planId,
            fecha_fin: fecha.toISOString()
          })
        });
        if (!res2.ok) console.warn("No se pudo crear suscripción inicial");
      }

      // 3. Asignar usuario como admin
      const token = localStorage.getItem("access_token");
      const userId = JSON.parse(atob(token.split(".")[1])).sub;

      const res3 = await fetch(`http://127.0.0.1:8000/auth/admin/${userId}/asignar-microempresa?id_microempresa=${empresaId}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!res3.ok) throw new Error("Error al asignar usuario a microempresa");

      Swal.fire({
        title: "¡Microempresa creada!",
        text: "Ya eres administrador de tu microempresa.",
        icon: "success",
        confirmButtonColor: "#059669"
      }).then(() => {
        // Redirigir al inicio para que el guard redirija al dashboard correcto
        // O forzar recarga para actualizar el estado del usuario en el contexto
        window.location.href = "/";
      });

    } catch (err) {
      setError(typeof err.message === 'string' ? err.message : "No se pudo completar el proceso.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    marginTop: 6,
    padding: "12px 14px",
    borderRadius: 8,
    border: "1.5px solid #d1d5db",
    fontSize: 16,
    outline: "none",
    background: "#f9fafb",
    transition: "border 0.2s",
    boxSizing: "border-box"
  };

  return (
    <div
      style={{
        maxWidth: 500,
        margin: "40px auto",
        background: "#fff",
        borderRadius: 18,
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        padding: 40,
        display: "flex",
        flexDirection: "column",
        gap: 20,
        border: "1px solid #e5e7eb"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
        <div style={{ background: '#ECFDF5', padding: 10, borderRadius: 12 }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M3 21H21" stroke="#059669" strokeWidth="2" strokeLinecap="round" /><path d="M5 21V7L13 3V21" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M13 10L21 14V21" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
        <div>
          <h2 style={{ fontWeight: 700, fontSize: 24, color: "#111827", margin: 0 }}>Crear Microempresa</h2>
          <p style={{ margin: 0, color: '#6B7280', fontSize: 14 }}>Configura tu negocio para empezar</p>
        </div>
      </div>

      {error && (
        <div style={{
          background: "#FEF2F2",
          color: "#991B1B",
          border: "1px solid #FECACA",
          borderRadius: 8,
          padding: "12px",
          fontWeight: 500,
          fontSize: 14
        }}>{error}</div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ gridColumn: "1/-1" }}>
          <label style={{ fontWeight: 600, color: "#374151", fontSize: 14 }}>
            Nombre de la empresa <span style={{ color: '#EF4444' }}>*</span>
            <input
              name="nombre"
              placeholder="Ej: Mi Negocio S.R.L."
              value={empresa.nombre}
              onChange={handleChange}
              style={inputStyle}
              autoFocus
            />
          </label>
        </div>

        <div>
          <label style={{ fontWeight: 600, color: "#374151", fontSize: 14 }}>
            NIT <span style={{ color: '#EF4444' }}>*</span>
            <input
              name="nit"
              placeholder="Ej: 123456789"
              value={empresa.nit}
              onChange={handleChange}
              style={inputStyle}
            />
          </label>
        </div>

        <div>
          <label style={{ fontWeight: 600, color: "#374151", fontSize: 14 }}>
            Rubro <span style={{ color: '#EF4444' }}>*</span>
            <select
              name="id_rubro"
              value={empresa.id_rubro}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="">Seleccionar...</option>
              {rubros.map(r => (
                <option key={r.id_rubro} value={r.id_rubro}>{r.nombre}</option>
              ))}
            </select>
          </label>
        </div>

        <div style={{ gridColumn: "1/-1" }}>
          <label style={{ fontWeight: 600, color: "#374151", fontSize: 14 }}>
            Dirección
            <input
              name="direccion"
              placeholder="Ej: Av. Principal #123"
              value={empresa.direccion}
              onChange={handleChange}
              style={inputStyle}
            />
          </label>
        </div>

        <div>
          <label style={{ fontWeight: 600, color: "#374151", fontSize: 14 }}>
            Teléfono
            <input
              name="telefono"
              placeholder="Ej: 70012345"
              value={empresa.telefono}
              onChange={handleChange}
              style={inputStyle}
            />
          </label>
        </div>

        <div>
          <label style={{ fontWeight: 600, color: "#374151", fontSize: 14 }}>
            Moneda
            <select
              name="moneda"
              value={empresa.moneda}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="BOB">Boliviano (BOB)</option>
              <option value="USD">Dólar (USD)</option>
              <option value="EUR">Euro (EUR)</option>
            </select>
          </label>
        </div>

        <div style={{ gridColumn: "1/-1" }}>
          <label style={{ fontWeight: 600, color: "#374151", fontSize: 14 }}>
            Tipo de Atención <span style={{ color: '#EF4444' }}>*</span>
            <select
              name="tipo_atencion"
              value={empresa.tipo_atencion}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="PRESENCIAL">Atención Física</option>
              <option value="VIRTUAL">Virtual / Online</option>
              <option value="HIBRIDA">Híbrida (Ambas)</option>
            </select>
          </label>
        </div>
      </div>

      <button
        onClick={handleEmpresa}
        disabled={loading}
        style={{
          marginTop: 10,
          background: loading ? "#6EE7B7" : "#059669",
          color: "#fff",
          fontWeight: 700,
          fontSize: 16,
          border: "none",
          borderRadius: 8,
          padding: "14px 0",
          cursor: loading ? "not-allowed" : "pointer",
          transition: "all 0.2s"
        }}
        onMouseOver={e => !loading && (e.currentTarget.style.background = "#047857")}
        onMouseOut={e => !loading && (e.currentTarget.style.background = "#059669")}
      >
        {loading ? "Creando empresa..." : "Finalizar Registro"}
      </button>
    </div>
  );
}

export default CreateMicroempresaOnboarding;
