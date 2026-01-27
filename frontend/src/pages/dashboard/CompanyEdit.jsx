import { useAuth } from "../../context/AuthContext";
import { getRubros } from "../../api/microempresas.api";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../services/apiClient";


export default function CompanyEdit() {
  const { user, setUser, refreshMicroempresa } = useAuth();
  const [original, setOriginal] = useState(null);
  const [form, setForm] = useState({
    nombre: "",
    nit: "",
    correo_contacto: "",
    direccion: "",
    telefono: "",
    tipo_atencion: "",
    latitud: "",
    longitud: "",
    dias_atencion: "",
    horario_atencion: "",
    moneda: "",
    logo: "",
    id_rubro: ""
  });
  const [rubros, setRubros] = useState([]);
  const [diasSeleccionados, setDiasSeleccionados] = useState([]);
    // Cargar rubros al montar
    useEffect(() => {
      async function fetchRubros() {
        try {
          const res = await getRubros();
          setRubros(Array.isArray(res.data) ? res.data : []);
        } catch {
          setRubros([]);
        }
      }
      fetchRubros();
    }, []);
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
            correo_contacto: res.data.correo_contacto || "",
            direccion: res.data.direccion || "",
            telefono: res.data.telefono || "",
            tipo_atencion: res.data.tipo_atencion || "",
            latitud: res.data.latitud || "",
            longitud: res.data.longitud || "",
            dias_atencion: res.data.dias_atencion || "",
            horario_atencion: res.data.horario_atencion || "",
            moneda: res.data.moneda || "",
            logo: res.data.logo || "",
            id_rubro: res.data.id_rubro || ""
          });
          // Si hay días guardados, intentar parsear para marcar los checkboxes
          if (res.data.dias_atencion) {
            // Intentar parsear el string a días seleccionados (solo si coincide con el formato generado)
            // No es perfecto, pero ayuda a mantener la selección visual
            const diasSemana = ["LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SABADO", "DOMINGO"];
            let seleccion = [];
            diasSemana.forEach((dia, idx) => {
              if (res.data.dias_atencion.toUpperCase().includes(dia)) {
                seleccion.push(idx);
              }
            });
            setDiasSeleccionados(seleccion);
          }
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

  // Días de la semana para selección
  const diasSemana = [
    { label: "Lunes", value: 0 },
    { label: "Martes", value: 1 },
    { label: "Miércoles", value: 2 },
    { label: "Jueves", value: 3 },
    { label: "Viernes", value: 4 },
    { label: "Sábado", value: 5 },
    { label: "Domingo", value: 6 }
  ];

  // Manejar selección de días
  const handleDiaToggle = idx => {
    let nuevosDias;
    if (diasSeleccionados.includes(idx)) {
      nuevosDias = diasSeleccionados.filter(d => d !== idx);
    } else {
      nuevosDias = [...diasSeleccionados, idx].sort((a, b) => a - b);
    }
    setDiasSeleccionados(nuevosDias);
  };

  // Generar string de días de atención
  function generarStringDias(dias) {
    if (!dias.length) return "";
    // Agrupar días consecutivos
    let grupos = [];
    let grupoActual = [dias[0]];
    for (let i = 1; i < dias.length; i++) {
      if (dias[i] === dias[i - 1] + 1) {
        grupoActual.push(dias[i]);
      } else {
        grupos.push(grupoActual);
        grupoActual = [dias[i]];
      }
    }
    grupos.push(grupoActual);
    // Convertir a string
    return grupos.map(g => {
      if (g.length === 1) return diasSemana[g[0]].label.toUpperCase();
      return diasSemana[g[0]].label.toUpperCase() + " A " + diasSemana[g[g.length - 1]].label.toUpperCase();
    }).join(" - ");
  }

  // Actualizar el campo de string de días de atención cuando cambian los días seleccionados
  useEffect(() => {
    setForm(f => ({ ...f, dias_atencion: generarStringDias(diasSeleccionados) }));
    // eslint-disable-next-line
  }, [diasSeleccionados]);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    // Ajustar tipos para los campos numéricos
    const payload = {
      ...form,
      dias_atencion: form.dias_atencion,
      latitud: form.latitud === "" ? null : parseFloat(form.latitud),
      longitud: form.longitud === "" ? null : parseFloat(form.longitud),
      id_rubro: form.id_rubro === "" ? null : parseInt(form.id_rubro)
    };
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
    <div className="company-edit-container" style={{
      maxWidth: 480,
      margin: "32px auto",
      background: "#fff",
      borderRadius: 18,
      boxShadow: "0 6px 32px #0001, 0 1.5px 8px #1D737320",
      padding: "28px 28px 18px 28px",
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minHeight: 0
    }}>
      <h2 style={{ textAlign: "center", fontWeight: 700, marginBottom: 18, color: "#1D7373", letterSpacing: 0.5, fontSize: 26 }}>Editar Microempresa</h2>
      <form onSubmit={handleSubmit} className="company-edit-form" style={{ width: '100%', maxWidth: 400, margin: '0 auto' }}>
        {/* Nombre */}
        <div className="form-group" style={{ marginBottom: 13 }}>
          <label htmlFor="nombre" style={{ fontWeight: 500, color: "#4a5568", display: 'block', marginBottom: 6 }}>Nombre</label>
          <input
            id="nombre"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            className="form-input"
            style={{
              width: "100%",
              padding: "12px 16px",
              borderRadius: 8,
              border: "1.5px solid #1D7373",
              background: "#F5F7F8",
              color: "#0A3A40",
              fontWeight: 400,
              fontSize: 16,
              outline: "none",
              boxShadow: "0 2px 8px #E6EAEA",
              transition: "border-color 0.2s",
              marginTop: 0
            }}
            placeholder="Nombre de la empresa"
            required
            onFocus={e => e.target.style.borderColor = '#107361'}
            onBlur={e => e.target.style.borderColor = '#1D7373'}
          />
        </div>
        {/* NIT */}
        <div className="form-group" style={{ marginBottom: 13 }}>
          <label htmlFor="nit" style={{ fontWeight: 500, color: "#4a5568", display: 'block', marginBottom: 6 }}>NIT</label>
          <input
            id="nit"
            name="nit"
            value={form.nit}
            onChange={handleChange}
            className="form-input"
            style={{
              width: "100%",
              padding: "12px 16px",
              borderRadius: 8,
              border: "1.5px solid #1D7373",
              background: "#F5F7F8",
              color: "#0A3A40",
              fontWeight: 600,
              fontSize: 16,
              outline: "none",
              boxShadow: "0 2px 8px #E6EAEA",
              transition: "border-color 0.2s",
              marginTop: 0
            }}
            placeholder="NIT de la empresa"
            required
            onFocus={e => e.target.style.borderColor = '#107361'}
            onBlur={e => e.target.style.borderColor = '#1D7373'}
          />
        </div>
        {/* Correo de contacto */}
        <div className="form-group" style={{ marginBottom: 13 }}>
          <label htmlFor="correo_contacto" style={{ fontWeight: 500, color: "#4a5568", display: 'block', marginBottom: 6 }}>Correo de contacto</label>
          <input
            id="correo_contacto"
            name="correo_contacto"
            value={form.correo_contacto}
            onChange={handleChange}
            className="form-input"
            style={{
              width: "100%",
              padding: "12px 16px",
              borderRadius: 8,
              border: "1.5px solid #1D7373",
              background: "#F5F7F8",
              color: "#0A3A40",
              fontWeight: 600,
              fontSize: 16,
              outline: "none",
              boxShadow: "0 2px 8px #E6EAEA",
              transition: "border-color 0.2s",
              marginTop: 0
            }}
            placeholder="Correo de contacto"
            type="email"
            onFocus={e => e.target.style.borderColor = '#107361'}
            onBlur={e => e.target.style.borderColor = '#1D7373'}
          />
        </div>
        {/* Dirección */}
        <div className="form-group" style={{ marginBottom: 13 }}>
          <label htmlFor="direccion" style={{ fontWeight: 500, color: "#4a5568", display: 'block', marginBottom: 6 }}>Dirección</label>
          <input
            id="direccion"
            name="direccion"
            value={form.direccion}
            onChange={handleChange}
            className="form-input"
            style={{
              width: "100%",
              padding: "12px 16px",
              borderRadius: 8,
              border: "1.5px solid #1D7373",
              background: "#F5F7F8",
              color: "#0A3A40",
              fontWeight: 600,
              fontSize: 16,
              outline: "none",
              boxShadow: "0 2px 8px #E6EAEA",
              transition: "border-color 0.2s",
              marginTop: 0
            }}
            placeholder="Dirección de la empresa"
            required
            onFocus={e => e.target.style.borderColor = '#107361'}
            onBlur={e => e.target.style.borderColor = '#1D7373'}
          />
        </div>
        {/* Teléfono */}
        <div className="form-group" style={{ marginBottom: 13 }}>
          <label htmlFor="telefono" style={{ fontWeight: 500, color: "#4a5568", display: 'block', marginBottom: 6 }}>Teléfono</label>
          <input
            id="telefono"
            name="telefono"
            value={form.telefono}
            onChange={handleChange}
            className="form-input"
            style={{
              width: "100%",
              padding: "12px 16px",
              borderRadius: 8,
              border: "1.5px solid #1D7373",
              background: "#F5F7F8",
              color: "#0A3A40",
              fontWeight: 600,
              fontSize: 16,
              outline: "none",
              boxShadow: "0 2px 8px #E6EAEA",
              transition: "border-color 0.2s",
              marginTop: 0
            }}
            placeholder="Teléfono de contacto"
            required
            onFocus={e => e.target.style.borderColor = '#107361'}
            onBlur={e => e.target.style.borderColor = '#1D7373'}
          />
        </div>
        {/* Tipo de atención */}
        <div className="form-group" style={{ marginBottom: 13 }}>
          <label htmlFor="tipo_atencion" style={{ fontWeight: 500, color: "#4a5568", display: 'block', marginBottom: 6 }}>Tipo de atención</label>
          <select
            id="tipo_atencion"
            name="tipo_atencion"
            value={form.tipo_atencion}
            onChange={handleChange}
            className="form-input"
            style={{
              width: "100%",
              padding: "12px 16px",
              borderRadius: 8,
              border: "1.5px solid #1D7373",
              background: "#F5F7F8",
              color: form.tipo_atencion ? "#0A3A40" : "#6B7280",
              fontWeight: 600,
              fontSize: 16,
              outline: "none",
              boxShadow: "0 2px 8px #E6EAEA",
              transition: "border-color 0.2s"
            }}
            required
            onFocus={e => e.target.style.borderColor = '#107361'}
            onBlur={e => e.target.style.borderColor = '#1D7373'}
          >
            <option value="" disabled>Selecciona el tipo de atención</option>
            <option value="PRESENCIAL" style={{ color: '#0A3A40', fontWeight: 600 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                {/* Icono edificio */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ verticalAlign: 'middle', marginRight: 4 }}><rect x="4" y="3" width="16" height="18" rx="2" fill="#1D7373"/><rect x="7" y="6" width="2" height="2" fill="#fff"/><rect x="11" y="6" width="2" height="2" fill="#fff"/><rect x="15" y="6" width="2" height="2" fill="#fff"/><rect x="7" y="10" width="2" height="2" fill="#fff"/><rect x="11" y="10" width="2" height="2" fill="#fff"/><rect x="15" y="10" width="2" height="2" fill="#fff"/><rect x="7" y="14" width="2" height="2" fill="#fff"/><rect x="11" y="14" width="2" height="2" fill="#fff"/><rect x="15" y="14" width="2" height="2" fill="#fff"/></svg>
                Presencial
              </span>
            </option>
            <option value="VIRTUAL" style={{ color: '#0A3A40', fontWeight: 600 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                {/* Icono laptop */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ verticalAlign: 'middle', marginRight: 4 }}><rect x="3" y="6" width="18" height="10" rx="2" fill="#1D7373"/><rect x="1" y="18" width="22" height="2" rx="1" fill="#1D7373"/></svg>
                Virtual
              </span>
            </option>
            <option value="HIBRIDA" style={{ color: '#0A3A40', fontWeight: 600 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                {/* Icono hibrido (mezcla edificio y laptop) */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ verticalAlign: 'middle', marginRight: 4 }}><rect x="2" y="3" width="8" height="14" rx="2" fill="#1D7373"/><rect x="5" y="6" width="2" height="2" fill="#fff"/><rect x="5" y="10" width="2" height="2" fill="#fff"/><rect x="14" y="8" width="8" height="6" rx="2" fill="#1D7373"/><rect x="13" y="16" width="10" height="2" rx="1" fill="#1D7373"/></svg>
                Híbrida
              </span>
            </option>
          </select>
          <div style={{ fontSize: 13, color: '#6B7280', marginTop: 4 }}>
            Elige cómo se brinda la atención en tu empresa.
          </div>
        </div>
        {/* Días de atención */}
        <div className="form-group" style={{ marginBottom: 13 }}>
          <label style={{ fontWeight: 500, color: "#4a5568", display: 'block', marginBottom: 6 }}>Días de atención</label>
          <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 10, marginLeft: 2 }}>
            Selecciona los días en los que tu empresa atiende. Haz clic para activar o desactivar cada día.
          </div>
          <div style={{
            display: 'flex',
            gap: 10,
            flexWrap: 'wrap',
            background: '#F0F4F8',
            borderRadius: 12,
            padding: '18px 12px 10px 12px',
            boxShadow: '0 2px 12px #E6EAEA',
            justifyContent: 'center',
            minHeight: 60,
            border: '1.5px solid #E6EAEA',
            position: 'relative'
          }}>
            {diasSemana.map((dia, idx) => (
              <button
                type="button"
                key={dia.value}
                title={diasSeleccionados.includes(idx) ? `Quitar ${dia.label}` : `Agregar ${dia.label}`}
                aria-pressed={diasSeleccionados.includes(idx)}
                onClick={() => handleDiaToggle(idx)}
                style={{
                  padding: '10px 18px',
                  borderRadius: 10,
                  border: diasSeleccionados.includes(idx)
                    ? '2px solid #107361'
                    : '2px solid #CBD5E1',
                  background: diasSeleccionados.includes(idx)
                    ? 'linear-gradient(90deg, #1D7373 60%, #107361 100%)'
                    : 'linear-gradient(90deg, #F5F7F8 60%, #E6EAEA 100%)',
                  color: diasSeleccionados.includes(idx) ? '#fff' : '#0A3A40',
                  fontWeight: 600,
                  fontSize: 15,
                  cursor: 'pointer',
                  outline: 'none',
                  boxShadow: diasSeleccionados.includes(idx)
                    ? '0 4px 16px #1D737340'
                    : '0 2px 8px #E6EAEA',
                  transition: 'all 0.18s cubic-bezier(.4,2,.6,1)',
                  minWidth: 90,
                  position: 'relative',
                  letterSpacing: 0.5,
                  borderBottom: diasSeleccionados.includes(idx) ? '4px solid #38a169' : '2px solid #CBD5E1',
                  boxSizing: 'border-box',
                  userSelect: 'none',
                  filter: diasSeleccionados.includes(idx) ? 'brightness(1.05)' : 'none',
                }}
                onMouseOver={e => {
                  if (!diasSeleccionados.includes(idx)) e.currentTarget.style.background = 'linear-gradient(90deg, #E6EAEA 60%, #F5F7F8 100%)';
                }}
                onMouseOut={e => {
                  if (!diasSeleccionados.includes(idx)) e.currentTarget.style.background = 'linear-gradient(90deg, #F5F7F8 60%, #E6EAEA 100%)';
                }}
              >
                {diasSeleccionados.includes(idx) && (
                  <span style={{
                    display: 'inline-block',
                    marginRight: 6,
                    verticalAlign: 'middle',
                    color: '#38a169',
                    fontSize: 17,
                    fontWeight: 700
                  }}>
                    {/* Check SVG */}
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" style={{ verticalAlign: 'middle' }}><circle cx="10" cy="10" r="10" fill="#38a169"/><path d="M6 10.5L9 13.5L14 8.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </span>
                )}
                {dia.label}
              </button>
            ))}
          </div>
        </div>
        {/* Horario de atención */}
        <div className="form-group" style={{ marginBottom: 18 }}>
          <label htmlFor="horario_atencion" style={{ fontWeight: 500, color: "#4a5568", display: 'block', marginBottom: 6 }}>Horario de atención</label>
          <input
            id="horario_atencion"
            name="horario_atencion"
            value={form.horario_atencion}
            onChange={handleChange}
            className="form-input"
            style={{
              width: "100%",
              padding: "12px 16px",
              borderRadius: 8,
              border: "1.5px solid #1D7373",
              background: "#F5F7F8",
              color: "#0A3A40",
              fontWeight: 600,
              fontSize: 16,
              outline: "none",
              boxShadow: "0 2px 8px #E6EAEA",
              transition: "border-color 0.2s",
              marginTop: 0
            }}
            placeholder="Ej: 08:00 - 18:00"
            onFocus={e => e.target.style.borderColor = '#107361'}
            onBlur={e => e.target.style.borderColor = '#1D7373'}
          />
        </div>
        {/* Latitud y Longitud */}
        <div className="form-group" style={{ marginBottom: 13, display: 'flex', gap: 10 }}>
          <div style={{ flex: 1 }}>
            <label htmlFor="latitud" style={{ fontWeight: 500, color: "#4a5568", display: 'block', marginBottom: 6 }}>Latitud</label>
            <input
              id="latitud"
              name="latitud"
              value={form.latitud}
              onChange={handleChange}
              className="form-input"
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: 8,
                border: "1.5px solid #1D7373",
                background: "#F5F7F8",
                color: "#0A3A40",
                fontWeight: 600,
                fontSize: 16,
                outline: "none",
                boxShadow: "0 2px 8px #E6EAEA",
                transition: "border-color 0.2s",
                marginTop: 0
              }}
              placeholder="Latitud"
              type="number"
              step="any"
              onFocus={e => e.target.style.borderColor = '#107361'}
              onBlur={e => e.target.style.borderColor = '#1D7373'}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label htmlFor="longitud" style={{ fontWeight: 500, color: "#4a5568", display: 'block', marginBottom: 6 }}>Longitud</label>
            <input
              id="longitud"
              name="longitud"
              value={form.longitud}
              onChange={handleChange}
              className="form-input"
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: 8,
                border: "1.5px solid #1D7373",
                background: "#F5F7F8",
                color: "#0A3A40",
                fontWeight: 600,
                fontSize: 16,
                outline: "none",
                boxShadow: "0 2px 8px #E6EAEA",
                transition: "border-color 0.2s",
                marginTop: 0
              }}
              placeholder="Longitud"
              type="number"
              step="any"
              onFocus={e => e.target.style.borderColor = '#107361'}
              onBlur={e => e.target.style.borderColor = '#1D7373'}
            />
          </div>
        </div>
        {/* Moneda */}
        <div className="form-group" style={{ marginBottom: 13 }}>
          <label htmlFor="moneda" style={{ fontWeight: 500, color: "#4a5568" }}>Moneda</label>
          <select id="moneda" name="moneda" value={form.moneda} onChange={handleChange} className="form-input" style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1.5px solid #1D7373", marginTop: 6, fontSize: 16, background: "#F5F7F8", color: "#042326", fontWeight: 500, outline: "none", boxShadow: "0 2px 8px #E6EAEA", transition: "border-color 0.2s" }} required onFocus={e => e.target.style.borderColor = '#107361'} onBlur={e => e.target.style.borderColor = '#1D7373'}>
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
              <option key={code} value={code}>{label}</option>
            ))}
          </select>
        </div>
        {/* Logo */}
        <div className="form-group" style={{ marginBottom: 13 }}>
          <label htmlFor="logo" style={{ fontWeight: 500, color: "#4a5568" }}>Logo (URL)</label>
          <input id="logo" name="logo" value={form.logo} onChange={handleChange} className="form-input" style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #cbd5e0", marginTop: 6, fontSize: 16 }} placeholder="URL del logo" type="text" />
        </div>
        {/* Rubro */}
        <div className="form-group" style={{ marginBottom: 18 }}>
          <label htmlFor="id_rubro" style={{ fontWeight: 500, color: "#4a5568" }}>Rubro</label>
          <select
            id="id_rubro"
            name="id_rubro"
            value={form.id_rubro}
            onChange={handleChange}
            className="form-input"
            style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1.5px solid #1D7373", marginTop: 6, fontSize: 16, background: "#F5F7F8", color: "#042326", fontWeight: 500, outline: "none", boxShadow: "0 2px 8px #E6EAEA", transition: "border-color 0.2s" }}
            required
            onFocus={e => e.target.style.borderColor = '#107361'}
            onBlur={e => e.target.style.borderColor = '#1D7373'}
          >
            <option value="">Selecciona un rubro</option>
            {rubros.map(rubro => (
              <option key={rubro.id_rubro} value={rubro.id_rubro}>
                {rubro.nombre} {rubro.activo === false ? '(Inactivo)' : ''}
              </option>
            ))}
          </select>
          {rubros.length > 0 && (
            <div style={{ fontSize: 13, color: '#6B7280', marginTop: 4 }}>
              {rubros.find(r => String(r.id_rubro) === String(form.id_rubro))?.descripcion || 'Selecciona un rubro para ver su descripción.'}
            </div>
          )}
        </div>
        <button type="submit" disabled={loading} className="btn-primary" style={{
          width: "100%",
          padding: "12px 0",
          borderRadius: 8,
          background: loading ? "#0F5959" : "#1D7373",
          color: "#F5F7F8",
          fontWeight: 600,
          fontSize: 17,
          border: "none",
          marginTop: 18,
          marginBottom: 2,
          cursor: loading ? "not-allowed" : "pointer",
          transition: "background 0.2s",
          boxShadow: '0 2px 8px #1D737320'
        }}>
          {loading ? "Guardando..." : "Guardar Cambios"}
        </button>
        {success && <div style={{ color: "#38a169", marginTop: 12, textAlign: "center", fontWeight: 500 }}>{success}</div>}
      </form>
    </div>
  );
}
