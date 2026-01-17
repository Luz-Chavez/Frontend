import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../services/apiClient";


export default function CompanyEdit() {
  const { user, setUser, refreshMicroempresa } = useAuth();
  const [original, setOriginal] = useState(null);
  const [form, setForm] = useState({ nombre: "", nit: "", direccion: "", telefono: "", moneda: "" });
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Cargar datos actuales de la microempresa al montar
  useEffect(() => {
    async function fetchEmpresa() {
      if (user?.microempresa?.id_microempresa) {
        try {
          const res = await apiClient.get(`/microempresas/${user.microempresa.id_microempresa}`);
          setOriginal(res.data);
          setForm({
            nombre: res.data.nombre || "",
            nit: res.data.nit || "",
            direccion: res.data.direccion || "",
            telefono: res.data.telefono || "",
            moneda: res.data.moneda || ""
          });
        } catch {
          // Si falla la carga, puedes manejarlo aquí si lo necesitas
        }
      }
    }
    fetchEmpresa();
    // eslint-disable-next-line
  }, [user?.microempresa?.id_microempresa]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    const payload = { ...form };
    try {
      const res = await apiClient.put(`/microempresas/${user?.microempresa?.id_microempresa}`, payload);
      if (res && res.status === 200) {
        setUser({ ...user, microempresa: { ...user.microempresa, ...res.data } });
        setSuccess("Datos de la empresa actualizados correctamente");
        setOriginal({ ...original, ...res.data });
        // Espera a que el contexto se refresque antes de redirigir
        await refreshMicroempresa();
        setTimeout(() => navigate("/dashboard"), 800);
      }
    } catch {
      // ...
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="company-edit-container" style={{ maxWidth: 500, margin: "40px auto", background: "#fff", borderRadius: 16, boxShadow: "0 4px 16px #0002", padding: 32 }}>
      <h2 style={{ textAlign: "center", fontWeight: 700, marginBottom: 24, color: "#2d3748" }}>Editar Microempresa</h2>
      <form onSubmit={handleSubmit} className="company-edit-form">
        <div className="form-group" style={{ marginBottom: 18 }}>
          <label htmlFor="nombre" style={{ fontWeight: 500, color: "#4a5568" }}>Nombre</label>
          <input
            id="nombre"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            className="form-input"
            style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #cbd5e0", marginTop: 6, fontSize: 16 }}
            placeholder="Nombre de la empresa"
            required
          />
        </div>
        <div className="form-group" style={{ marginBottom: 18 }}>
          <label htmlFor="nit" style={{ fontWeight: 500, color: "#4a5568" }}>NIT</label>
          <input
            id="nit"
            name="nit"
            value={form.nit}
            onChange={handleChange}
            className="form-input"
            style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #cbd5e0", marginTop: 6, fontSize: 16 }}
            placeholder="NIT de la empresa"
            required
          />
        </div>
        <div className="form-group" style={{ marginBottom: 18 }}>
          <label htmlFor="direccion" style={{ fontWeight: 500, color: "#4a5568" }}>Dirección</label>
          <input
            id="direccion"
            name="direccion"
            value={form.direccion}
            onChange={handleChange}
            className="form-input"
            style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #cbd5e0", marginTop: 6, fontSize: 16 }}
            placeholder="Dirección de la empresa"
            required
          />
        </div>
        <div className="form-group" style={{ marginBottom: 18 }}>
          <label htmlFor="telefono" style={{ fontWeight: 500, color: "#4a5568" }}>Teléfono</label>
          <input
            id="telefono"
            name="telefono"
            value={form.telefono}
            onChange={handleChange}
            className="form-input"
            style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #cbd5e0", marginTop: 6, fontSize: 16 }}
            placeholder="Teléfono de contacto"
            required
          />
        </div>
        <div className="form-group" style={{ marginBottom: 18 }}>
          <label htmlFor="moneda" style={{ fontWeight: 500, color: "#4a5568" }}>Moneda</label>
          {/* Renderizado dinámico de monedas con icono */}
          <select
            id="moneda"
            name="moneda"
            value={form.moneda}
            onChange={handleChange}
            className="form-input"
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: 8,
              border: "1.5px solid #1D7373",
              marginTop: 6,
              fontSize: 16,
              background: "#F5F7F8",
              color: "#042326",
              fontWeight: 500,
              outline: "none",
              boxShadow: "0 2px 8px #E6EAEA",
              transition: "border-color 0.2s"
            }}
            required
            onFocus={e => e.target.style.borderColor = '#107361'}
            onBlur={e => e.target.style.borderColor = '#1D7373'}
          >
            <option value="">Selecciona una moneda</option>
            {[
              { code: 'USD', label: 'Dólar estadounidense (USD)' },
              { code: 'EUR', label: 'Euro (EUR)' },
              { code: 'JPY', label: 'Yen japonés (JPY)' },
              { code: 'GBP', label: 'Libra esterlina (GBP)' },
              { code: 'AUD', label: 'Dólar australiano (AUD)' },
              { code: 'CAD', label: 'Dólar canadiense (CAD)' },
              { code: 'CHF', label: 'Franco suizo (CHF)' },
              { code: 'CNY', label: 'Yuan chino (CNY)' },
              { code: 'HKD', label: 'Dólar de Hong Kong (HKD)' },
              { code: 'NZD', label: 'Dólar neozelandés (NZD)' },
              { code: 'BOB', label: 'Boliviano (BOB)' },
            ].map(({ code, label }) => (
              <option key={code} value={code}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary"
          style={{
            width: "100%",
            padding: "12px 0",
            borderRadius: 8,
            background: loading ? "#0F5959" : "#1D7373",
            color: "#F5F7F8",
            fontWeight: 600,
            fontSize: 17,
            border: "none",
            marginTop: 10,
            cursor: loading ? "not-allowed" : "pointer",
            transition: "background 0.2s"
          }}
        >
          {loading ? "Guardando..." : "Guardar Cambios"}
        </button>
        {success && <div style={{ color: "#38a169", marginTop: 16, textAlign: "center", fontWeight: 500 }}>{success}</div>}
      </form>
    </div>
  );
}
