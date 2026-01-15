import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import apiClient from "../../services/apiClient";


export default function CompanyEdit() {
  const { user, setUser } = useAuth();
  const [original, setOriginal] = useState(null);
  const [form, setForm] = useState({ nombre: "", nit: "", direccion: "", telefono: "", moneda: "" });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
          setError("No se pudo cargar la información de la microempresa");
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
    setError("");
    setSuccess("");
    // Solo enviar los campos que cambiaron
    const payload = {};
    for (const key of Object.keys(form)) {
      if (form[key] !== (original?.[key] || "")) {
        payload[key] = form[key];
      }
    }
    if (Object.keys(payload).length === 0) {
      setError("No hay cambios para guardar");
      setLoading(false);
      return;
    }
    try {
      const res = await apiClient.put(`/microempresas/${user?.microempresa?.id_microempresa}`, payload);
      setUser({ ...user, microempresa: { ...user.microempresa, ...res.data } });
      setSuccess("Datos de la empresa actualizados correctamente");
      setOriginal({ ...original, ...res.data });
    } catch {
      setError("No se pudo actualizar la microempresa");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px #0001", padding: 32 }}>
      <h2>Editar Microempresa</h2>
      <form onSubmit={handleSubmit}>
        <label>Nombre</label>
        <input name="nombre" value={form.nombre} onChange={handleChange} style={{ width: "100%", marginBottom: 12 }} />
        <label>NIT</label>
        <input name="nit" value={form.nit} onChange={handleChange} style={{ width: "100%", marginBottom: 12 }} />
        <label>Dirección</label>
        <input name="direccion" value={form.direccion} onChange={handleChange} style={{ width: "100%", marginBottom: 12 }} />
        <label>Teléfono</label>
        <input name="telefono" value={form.telefono} onChange={handleChange} style={{ width: "100%", marginBottom: 12 }} />
        <label>Moneda</label>
        <input name="moneda" value={form.moneda} onChange={handleChange} style={{ width: "100%", marginBottom: 12 }} />
        <button type="submit" disabled={loading} style={{ marginTop: 10 }}>
          {loading ? "Guardando..." : "Guardar Cambios"}
        </button>
        {success && <div style={{ color: "green", marginTop: 10 }}>{success}</div>}
        {error && <div style={{ color: "red", marginTop: 10 }}>{error}</div>}
      </form>
    </div>
  );
}
