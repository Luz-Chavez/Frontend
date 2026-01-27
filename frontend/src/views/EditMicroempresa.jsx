import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getMicroempresaById, getRubros, updateMicroempresa } from "../api/microempresas.api";
import apiClient from "../services/apiClient";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./EditMicroempresa.css";
import RubroSelect from "./RubroSelect";
import PaisSelect from "./PaisSelect";
import "./EditMicroempresa.atencion.css";
import { geocodeDireccion } from "../services/geocoding";
import { useAuth } from "../context/AuthContext";

// Icono personalizado para el marker
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});



const MONEDAS = [
  "USD", "EUR", "GBP", "JPY", "CNY", "INR", "CAD", "AUD", "CHF", "SEK", "NOK", "MXN", "BRL", "ARS", "CLP", "BOB"
];

const PAISES = [
  { code: "+591", flag: "🇧🇴" },
  { code: "+54", flag: "🇦🇷" },
  { code: "+56", flag: "🇨🇱" },
  { code: "+57", flag: "🇨🇴" },
  { code: "+51", flag: "🇵🇪" },
  { code: "+52", flag: "🇲🇽" },
  { code: "+1", flag: "🇺🇸" },
];

const DIAS = [
  "LUNES", "MARTES", "MIÉRCOLES", "JUEVES", "VIERNES", "SÁBADO", "DOMINGO"
];

function groupConsecutiveDays(arr) {
  if (!arr.length) return "";
  const indices = arr.map((d) => DIAS.indexOf(d)).sort((a, b) => a - b);
  let grupos = [], grupo = [indices[0]];
  for (let i = 1; i < indices.length; i++) {
    if (indices[i] === indices[i - 1] + 1) grupo.push(indices[i]);
    else { grupos.push(grupo); grupo = [indices[i]]; }
  }
  grupos.push(grupo);
  return grupos.map(g => g.length === 1 ? DIAS[g[0]] : DIAS[g[0]] + " A " + DIAS[g[g.length - 1]]).join(" - ");
}

function Horarios({ bloques, setBloques }) {
  const addBloque = () => setBloques([...bloques, { start: "", end: "" }]);
  const removeBloque = (i) => setBloques(bloques.filter((_, idx) => idx !== i));
  const updateBloque = (i, key, val) => setBloques(bloques.map((b, idx) => idx === i ? { ...b, [key]: val } : b));
  return (
    <div className="horarios-blocks">
      {bloques.map((b, i) => (
        <div className="horario-row" key={i}>
          <input type="time" value={b.start} onChange={e => updateBloque(i, "start", e.target.value)} />
          <span>-</span>
          <input type="time" value={b.end} onChange={e => updateBloque(i, "end", e.target.value)} />
          <button type="button" className="btn-del" onClick={() => removeBloque(i)}>✕</button>
        </div>
      ))}
      <button type="button" className="btn-add" onClick={addBloque}>Agregar bloque</button>
    </div>
  );
}

function Mapa({ latitud, longitud, setLatitud, setLongitud, zoomTo, onZoomDone }) {
  const mapRef = useRef();
  function DraggableMarker() {
    const [position, setPosition] = useState([latitud, longitud]);
    const markerRef = useRef(null);
    useMapEvents({
      click(e) {
        setPosition([e.latlng.lat, e.latlng.lng]);
        setLatitud(e.latlng.lat);
        setLongitud(e.latlng.lng);
      },
    });
    useEffect(() => {
      setPosition([latitud, longitud]);
      // eslint-disable-next-line
    }, [latitud, longitud]); // Dependencias necesarias para actualizar posición
    return (
      <Marker
        draggable
        eventHandlers={{
          dragend: () => {
            const marker = markerRef.current;
            if (marker) {
              const pos = marker.getLatLng();
              setPosition([pos.lat, pos.lng]);
              setLatitud(pos.lat);
              setLongitud(pos.lng);
            }
          },
        }}
        position={position}
        icon={markerIcon}
        ref={markerRef}
      />
    );
  }
  useEffect(() => {
    if (mapRef.current && zoomTo) {
      mapRef.current.setView([latitud, longitud], 15, { animate: true });
      if (onZoomDone) setTimeout(onZoomDone, 800);
    }
  }, [latitud, longitud, zoomTo, onZoomDone]);
  return (
    <MapContainer
      center={[-16.2902, -63.5887]}
      zoom={5.5}
      scrollWheelZoom={true}
      className="mapa-edit"
      style={{ height: "440px", width: "100%" }}
      whenCreated={mapInstance => { mapRef.current = mapInstance; }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <DraggableMarker />
    </MapContainer>
  );
}


function EditMicroempresa() {
    const [rubros, setRubros] = useState([]);
    // Cargar rubros al montar
    useEffect(() => {
      async function fetchRubros() {
        try {
          const response = await getRubros();
          setRubros(Array.isArray(response.data) ? response.data : []);
        } catch {
          setRubros([]);
        }
      }
      fetchRubros();
    }, []);
  const { id_microempresa: paramId } = useParams();
  const { user } = useAuth();
  const [form, setForm] = useState({
    nombre: "",
    nit: "",
    correo_contacto: "",
    direccion: "",
    telefono: "",
    pais: PAISES[0].code,
    tipo_atencion: "PRESENCIAL",
    latitud: -16.2902,
    longitud: -63.5887,
    dias_atencion: [],
    horario_atencion: [],
    moneda: "BOB",
    // impuestos: "",
    logo: null,
    logoPreview: null,
    id_rubro: ""
  });
  const [errores, setErrores] = useState({});
  const [toast, setToast] = useState(null);
  const [horarios, setHorarios] = useState([]);
  const [direccionInput, setDireccionInput] = useState("");
  const [geoLoading, setGeoLoading] = useState(false);
  const [zoomToMap, setZoomToMap] = useState(false);
  const [loading, setLoading] = useState(true);
  // Cargar datos de la microempresa al montar
  useEffect(() => {
    // Calcular el id_microempresa de forma segura en cada render
    let id_microempresa = paramId;
    if (!id_microempresa && user && user.microempresa && user.microempresa.id_microempresa) {
      id_microempresa = user.microempresa.id_microempresa;
    }
    console.log("useEffect ejecutado. id_microempresa:", id_microempresa);
    async function fetchMicroempresa() {
      console.log("fetchMicroempresa ejecutada. id_microempresa:", id_microempresa);
      setLoading(true);
      try {
        const response = await getMicroempresaById(id_microempresa);
        console.log("Respuesta de getMicroempresaById:", response);
        const { data } = response;
        setForm(f => {
          let pais = f.pais;
          let telefono = data.telefono || "";
          if (typeof telefono === 'string' && telefono.trim().length > 0 && telefono.includes(' ')) {
            const split = telefono.split(' ');
            pais = split[0];
            telefono = split.slice(1).join(' ');
          }
          // Si la extensión no es válida, usar la primera del array de países
          if (!PAISES.some(p => p.code === pais)) {
            pais = PAISES[0].code;
          }
          return {
            ...f,
            nombre: data.nombre || "",
            nit: data.nit || "",
            correo_contacto: data.correo_contacto || "",
            direccion: data.direccion || "",
            telefono,
            pais,
            tipo_atencion: data.tipo_atencion || "PRESENCIAL",
            latitud: data.latitud ?? -16.2902,
            longitud: data.longitud ?? -63.5887,
            dias_atencion: data.dias_atencion ? (Array.isArray(data.dias_atencion) ? data.dias_atencion : data.dias_atencion.split(",")) : [],
            horario_atencion: data.horario_atencion ? (Array.isArray(data.horario_atencion) ? data.horario_atencion : data.horario_atencion.split(",")) : [],
            moneda: data.moneda || "BOB",
            logo: typeof data.logo === 'string' ? data.logo : '', // Asegura que sea string
            logoPreview: null, // Solo para preview local
            id_rubro: data.id_rubro || ""
          };
        });
        setDireccionInput(data.direccion || "");
        // Si el backend trae bloques de horario, poblar horarios
        if (data.horario_atencion) {
          // Si es string tipo "08:00-12:00,14:00-18:00"
          const bloques = (Array.isArray(data.horario_atencion) ? data.horario_atencion : data.horario_atencion.split(","))
            .map(b => {
              const [start, end] = b.split("-").map(s => s.trim());
              return start && end ? { start, end } : null;
            })
            .filter(Boolean);
          setHorarios(bloques);
        }
      } catch {
        setToast("Error al cargar microempresa");
      } finally {
        setLoading(false);
      }
    }
    if (id_microempresa) fetchMicroempresa();
    else console.warn("id_microempresa no está definido, no se hace la llamada al backend");
  }, [paramId, user]);

  // Logo preview
  const handleLogo = e => {
    const file = e.target.files[0];
    if (!file) return;
    if (!/(jpg|jpeg|png)$/i.test(file.name.split('.').pop())) {
      setToast("Solo JPG o PNG");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setToast("Máximo 5MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = ev => setForm(f => ({ ...f, logoPreview: ev.target.result, logo: file }));
    reader.readAsDataURL(file);
  };

  // Días de atención
  const toggleDia = dia => {
    setForm(f => {
      const arr = f.dias_atencion.includes(dia)
        ? f.dias_atencion.filter(d => d !== dia)
        : [...f.dias_atencion, dia];
      return { ...f, dias_atencion: arr };
    });
  };

  // Teléfono preview
  const telefonoPreview = `${form.pais} ${form.telefono}`;

  // Horario string
  // const horarioString = horarios.filter(h => h.start && h.end).map(h => `${h.start} - ${h.end}`).join(" | ");

  // Días string
  const diasString = groupConsecutiveDays(form.dias_atencion);

  // Validación
  const validar = () => {
    let err = {};
    if (!form.nombre.trim()) err.nombre = "Requerido";
    if (!form.nit.trim()) err.nit = "Requerido";
    if (!form.correo_contacto.trim() || !/^[^@]+@[^@]+\.[^@]+$/.test(form.correo_contacto)) err.correo_contacto = "Correo inválido";
    if (!form.dias_atencion.length) err.dias_atencion = "Selecciona al menos un día";
    setErrores(err);
    return Object.keys(err).length === 0;
  };


  // Submit
  const handleSubmit = async e => {
    e.preventDefault();
    if (!validar()) return setToast("Corrige los errores");

    // Calcular el id_microempresa de forma segura
    let id_microempresa = paramId;
    if (!id_microempresa && user && user.microempresa && user.microempresa.id_microempresa) {
      id_microempresa = user.microempresa.id_microempresa;
    }
    if (!id_microempresa) {
      setToast("No se encontró el id de la microempresa");
      return;
    }

    // El valor ya es correcto: "PRESENCIAL", "VIRTUAL" o "HIBRIDA"
    let tipo_atencion = form.tipo_atencion;

    // No enviar logo ni logoPreview en el payload principal
    const { logo, logoPreview, pais, telefono, ...formSinLogo } = form;
    const payload = {
      ...formSinLogo,
      telefono: `${pais} ${telefono}`.trim(), // Teléfono completo
      tipo_atencion,
      dias_atencion: Array.isArray(form.dias_atencion) ? form.dias_atencion.join(",") : "",
      horario_atencion: Array.isArray(horarios) ? horarios.filter(h => h.start && h.end).map(h => `${h.start}-${h.end}`).join(",") : "",
      id_rubro: form.id_rubro ? Number(form.id_rubro) : null
    };
    setToast("Guardando...");
    try {
      await updateMicroempresa(id_microempresa, payload);
      // Subir logo solo si hay uno nuevo seleccionado (File)
      if (logo && typeof logo !== 'string') {
        const formData = new FormData();
        formData.append("file", logo);
        try {
          await apiClient.patch(`/microempresas/${id_microempresa}/logo`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
          });
          setToast("Microempresa y logo actualizados correctamente");
        } catch {
          setToast("Microempresa actualizada, pero error al subir el logo");
        }
      } else {
        setToast("Microempresa actualizada correctamente");
      }
    } catch {
      setToast("Error al actualizar microempresa");
    }
  };

  useEffect(() => {
    if (toast === "Ubicación encontrada") {
      const t = setTimeout(() => setToast(null), 2500);
      setZoomToMap(false);
      return () => clearTimeout(t);
    }
  }, [toast]);

  if (loading) return <div className="edit-microempresa-card"><div style={{padding:40, textAlign:'center'}}>Cargando datos...</div></div>;
  return (
    <div className="edit-microempresa-card">
      <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:2}}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" style={{color:'#1D7373'}}><path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        <div>
          <h2 style={{margin:'0 0 2px 0', color:'#042326'}}>Editar Microempresa</h2>
          <div style={{color:'#0F5959',fontSize:'1.08em',marginBottom:8}}>Actualiza la información de tu negocio</div>
        </div>
      </div>
      <form className="edit-microempresa-form" onSubmit={handleSubmit}>
        {/* Información de la Microempresa */}
        <div style={{marginBottom:24}}>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{color:'#042326'}}><path d="M3 21V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14M16 21v-4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span style={{fontWeight:600,fontSize:'1.13em', color:'#042326'}}>Información de la Microempresa</span>
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label>Nombre de la microempresa *</label>
              <input value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} placeholder="Ej: Tienda La Esquina" />
              {errores.nombre && <span className="error">{errores.nombre}</span>}
            </div>
            <div className="form-group">
              <label>NIT *</label>
              <input value={form.nit} onChange={e => setForm(f => ({ ...f, nit: e.target.value }))} placeholder="Ej: 123456789-0" />
              {errores.nit && <span className="error">{errores.nit}</span>}
            </div>
            <div className="form-group">
              <label>Correo de contacto *</label>
              <input value={form.correo_contacto} onChange={e => setForm(f => ({ ...f, correo_contacto: e.target.value }))} placeholder="Ej: contacto@tienda.com" />
              {errores.correo_contacto && <span className="error">{errores.correo_contacto}</span>}
            </div>
            <div className="form-group">
              <label>Rubro *</label>
              <RubroSelect
                value={form.id_rubro}
                onChange={id => setForm(f => ({ ...f, id_rubro: id }))}
                rubros={rubros}
              />
            </div>
          </div>
        </div>

        {/* Ubicación: solo si es presencial o híbrida */}
        {(form.tipo_atencion === "PRESENCIAL" || form.tipo_atencion === "HIBRIDA") && (
          <div style={{marginBottom:24}}>
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{color:'#042326'}}><path d="M12 21s-6-5.686-6-10A6 6 0 0 1 18 11c0 4.314-6 10-6 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="11" r="2" stroke="currentColor" strokeWidth="2"/></svg>
              <span style={{fontWeight:600,fontSize:'1.13em', color:'#042326'}}>Ubicación</span>
            </div>
            <div className="form-group">
              <label>Dirección</label>
              <input
                value={direccionInput}
                onChange={e => setDireccionInput(e.target.value)}
                placeholder="Ej: Bolivia, La Paz, Ciudad de La Paz, Av. Principal #123"
                style={{marginBottom:8}}
              />
              <button
                type="button"
                className="btn-geocodificar"
                style={{marginBottom:8}}
                disabled={geoLoading || !direccionInput.trim()}
                onClick={async () => {
                  setGeoLoading(true);
                  try {
                    const { lat, lon } = await geocodeDireccion(direccionInput);
                    setForm(f => ({ ...f, direccion: direccionInput, latitud: lat, longitud: lon }));
                    setZoomToMap(true);
                    setToast("Ubicación encontrada");
                  } catch {
                    setToast("No se encontró la ubicación");
                  } finally {
                    setGeoLoading(false);
                  }
                }}
              >{geoLoading ? "Buscando..." : "Buscar en el mapa"}</button>
            </div>
            <div className="form-group" style={{marginTop:16}}>
              <label>Selecciona la ubicación en el mapa</label>
              <div style={{width:'100%',maxWidth:'100%',height:'460px',borderRadius:'10px',overflow:'hidden',margin:'10px 0'}}>
                <Mapa
                  latitud={form.latitud}
                  longitud={form.longitud}
                  setLatitud={lat => setForm(f => ({ ...f, latitud: lat }))}
                  setLongitud={lng => setForm(f => ({ ...f, longitud: lng }))}
                  zoomTo={zoomToMap}
                  onZoomDone={() => setZoomToMap(false)}
                />
              </div>
              <div className="latlng-preview">Latitud: {form.latitud} | Longitud: {form.longitud}</div>
            </div>
          </div>
        )}

        {/* Teléfono */}
        <div style={{marginBottom:24}}>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{color:'#042326'}}><path d="M22 16.92V21a2 2 0 0 1-2.18 2A19.72 19.72 0 0 1 3 5.18 2 2 0 0 1 5 3h4.09a2 2 0 0 1 2 1.72c.13 1.13.37 2.23.72 3.28a2 2 0 0 1-.45 2.11l-1.27 1.27a16 16 0 0 0 6.29 6.29l1.27-1.27a2 2 0 0 1 2.11-.45c1.05.35 2.15.59 3.28.72A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span style={{fontWeight:600,fontSize:'1.13em', color:'#042326'}}>Teléfono</span>
          </div>
          <div className="telefono-card">
            <div className="telefono-row">
              <div className="telefono-pais-select">
                <PaisSelect value={form.pais} onChange={val => setForm(f => ({ ...f, pais: val }))} />
              </div>
              <input
                className="telefono-input"
                value={form.telefono}
                onChange={e => setForm(f => ({ ...f, telefono: e.target.value }))}
                placeholder="Ej: 71234567"
                style={{flex:1,minWidth:0}}
              />
            </div>
            <div className="telefono-preview">Número completo: {telefonoPreview}</div>
          </div>
        </div>

        {/* Atención */}
        <div className="atencion-section">
          <div className="atencion-header">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{color:'#1D7373'}}><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span className="atencion-title">Atención</span>
          </div>
          <div className="atencion-card">
            <div className="atencion-row">
              <span className="atencion-label">Tipo de atención</span>
              <div className="atencion-radio-group">
                <label className={`atencion-radio ${form.tipo_atencion==='PRESENCIAL' ? 'active' : ''}`}>
                  <input type="radio" name="tipo_atencion" value="PRESENCIAL" checked={form.tipo_atencion==='PRESENCIAL'} onChange={e=>setForm(f=>({...f,tipo_atencion:e.target.value}))} />
                  Presencial
                </label>
                <label className={`atencion-radio ${form.tipo_atencion==='VIRTUAL' ? 'active' : ''}`}>
                  <input type="radio" name="tipo_atencion" value="VIRTUAL" checked={form.tipo_atencion==='VIRTUAL'} onChange={e=>setForm(f=>({...f,tipo_atencion:e.target.value}))} />
                  Virtual
                </label>
                <label className={`atencion-radio ${form.tipo_atencion==='HIBRIDA' ? 'active' : ''}`}>
                  <input type="radio" name="tipo_atencion" value="HIBRIDA" checked={form.tipo_atencion==='HIBRIDA'} onChange={e=>setForm(f=>({...f,tipo_atencion:e.target.value}))} />
                  Híbrida
                </label>
              </div>
            </div>
            <div className="atencion-row">
              <span className="atencion-label">Días de atención</span>
              <div className="dias-btn-row">
                {DIAS.map((dia) => (
                  <button
                    type="button"
                    key={dia}
                    className={`dia-btn${form.dias_atencion.includes(dia) ? ' selected' : ''}`}
                    onClick={() => toggleDia(dia)}
                  >
                    <span className="dia-btn-check">{form.dias_atencion.includes(dia) ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="11" fill="#1D7373"/><path d="M7 13l3 3 7-7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="11" fill="#F8FAFB" stroke="#1D7373" strokeWidth="2"/></svg>
                    )}</span>
                    <span className="dia-btn-label">{dia.charAt(0) + dia.slice(1).toLowerCase()}</span>
                  </button>
                ))}
              </div>
              {errores.dias_atencion && <span className="error">{errores.dias_atencion}</span>}
            </div>
            {form.dias_atencion.length > 0 && (
              <div className="dias-preview-bar">{diasString}</div>
            )}
            <div className="atencion-row horarios-row">
              <span className="atencion-label">Horarios de atención</span>
              <div className="horarios-blocks">
                {horarios.map((b, i) => (
                  <div className="horario-row" key={i}>
                    <input type="time" value={b.start} onChange={e => setHorarios(horarios.map((h, idx) => idx === i ? { ...h, start: e.target.value } : h))} className="horario-input" />
                    <span className="horario-sep">-</span>
                    <input type="time" value={b.end} onChange={e => setHorarios(horarios.map((h, idx) => idx === i ? { ...h, end: e.target.value } : h))} className="horario-input" />
                    <button type="button" className="btn-del-horario" onClick={() => setHorarios(horarios.filter((_, idx) => idx !== i))}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="11" fill="#F8FAFB" stroke="#E74C3C" strokeWidth="2"/><path d="M8 8l8 8M16 8l-8 8" stroke="#E74C3C" strokeWidth="2" strokeLinecap="round"/></svg>
                    </button>
                  </div>
                ))}
                <button type="button" className="btn-add-horario" onClick={() => setHorarios([...horarios, { start: '', end: '' }])}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="11" fill="#F8FAFB" stroke="#1D7373" strokeWidth="2"/><path d="M12 8v8M8 12h8" stroke="#1D7373" strokeWidth="2" strokeLinecap="round"/></svg>
                  <span>Agregar bloque de descanso</span>
                </button>
              </div>
            </div>
            {horarios.filter(h => h.start && h.end).length > 0 && (
              <div className="horarios-preview-bar">{horarios.filter(h => h.start && h.end).map(h => `${h.start} - ${h.end}`).join(' | ')}</div>
            )}
          </div>
        </div>

        {/* Configuración Comercial */}
        <div style={{marginBottom:24}}>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{color:'#042326'}}><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path d="M12 8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M8 12h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            <span style={{fontWeight:600,fontSize:'1.13em', color:'#042326'}}>Configuración Comercial</span>
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label>Moneda</label>
              <select value={form.moneda} onChange={e => setForm(f => ({ ...f, moneda: e.target.value }))}>
                {MONEDAS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Logo */}
        <div style={{marginBottom:24}}>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{color:'#042326'}}><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            <span style={{fontWeight:600,fontSize:'1.13em', color:'#042326'}}>Logo</span>
          </div>
          <div className="form-group logo-upload-area">
            <label htmlFor="logo-upload-input" className="logo-upload-label">
              <input id="logo-upload-input" type="file" accept="image/png,image/jpeg" onChange={handleLogo} style={{display:'none'}} />
              <div className="logo-preview-circle">
                {form.logoPreview ? (
                  <img src={form.logoPreview} alt="Logo preview" className="logo-preview-img" />
                ) : (
                  (typeof form.logo === 'string' && form.logo) ? (
                    <img
                      src={`http://localhost:8000/${form.logo}`}
                      alt="Logo actual"
                      className="logo-preview-img"
                      onError={e => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <span className="logo-preview-placeholder">Vista previa<br/>JPG o PNG<br/>máx 5MB</span>
                  )
                )}
              </div>
              <div className="logo-upload-text">
                {form.logoPreview ? "Cambiar logo" : "Arrastra tu logo aquí o haz clic para seleccionar"}
              </div>
            </label>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={() => setToast("Cancelado (simulado)")}>Cancelar</button>
          <button type="submit" className="btn-save">Guardar cambios</button>
        </div>
      </form>
      {toast && <div className="toast-edit-microempresa">{toast}</div>}
    </div>
  );
}

export default EditMicroempresa;
