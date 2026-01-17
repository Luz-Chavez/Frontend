import { useEffect, useState } from "react";
import apiClient from "../../services/apiClient";
import { getMicroempresas } from "../../api/microempresas.api";

const palette = {
  accent1: '#0A3A40', accent2: '#0F5959', accent3: '#1D7373', accent4: '#107361', white: '#F5F7F8', gray: '#E6EAEA', green: '#1D7373', red: '#EF4444',
};

export default function AllClientes() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [microempresas, setMicroempresas] = useState([]);
  const [filtro, setFiltro] = useState("todos");
  const [empresaSel, setEmpresaSel] = useState("");
  const [mapaEmpresas, setMapaEmpresas] = useState({});

  // Cargar microempresas para el selector y crear mapa id->nombre
  useEffect(() => {
    getMicroempresas().then(res => {
      setMicroempresas(res.data);
      const map = {};
      res.data.forEach(e => { map[e.id_microempresa] = e.nombre; });
      setMapaEmpresas(map);
    });
  }, []);

  // Cargar clientes según filtro
  useEffect(() => {
    async function fetchClientes() {
      setLoading(true);
      setError("");
      let url = "/clientes";
      if (filtro === "activos") url = "/clientes/activos";
      else if (filtro === "inactivos") url = "/clientes/inactivos";
      else if (empresaSel) url = `/clientes/microempresa/${empresaSel}`;
      try {
        const res = await apiClient.get(url);
        setClientes(res.data);
      } catch {
        setError("No se pudo cargar la lista de clientes");
      } finally {
        setLoading(false);
      }
    }
    fetchClientes();
  }, [filtro, empresaSel]);

  return (
    <div style={{ maxWidth: 1100, margin: "40px auto", background: palette.white, borderRadius: 16, boxShadow: "0 4px 16px #0002", padding: 32 }}>
      <h2 style={{ textAlign: "center", fontWeight: 700, marginBottom: 24, color: palette.accent3 }}>
        Todos los Clientes del Sistema
      </h2>
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, alignItems: 'center', flexWrap: 'wrap' }}>
        <button onClick={() => { setFiltro("todos"); setEmpresaSel(""); }} style={filtro==="todos"&&!empresaSel?btnActive:btnNormal}>Todos</button>
        <button onClick={() => { setFiltro("activos"); setEmpresaSel(""); }} style={filtro==="activos"?btnActive:btnNormal}>Activos</button>
        <button onClick={() => { setFiltro("inactivos"); setEmpresaSel(""); }} style={filtro==="inactivos"?btnActive:btnNormal}>Inactivos</button>
        <select value={empresaSel} onChange={e=>{setEmpresaSel(e.target.value); setFiltro("");}} style={{padding:'8px 14px',borderRadius:8,border:'1.5px solid #1D7373',fontWeight:600,fontSize:15,minWidth:180}}>
          <option value="">Filtrar por microempresa...</option>
          {microempresas.map(e=>(<option key={e.id_microempresa} value={e.id_microempresa}>{e.nombre}</option>))}
        </select>
      </div>
      {loading ? (
        <div style={{ textAlign: "center", color: palette.accent2 }}>Cargando...</div>
      ) : error ? (
        <div style={{ textAlign: "center", color: palette.red }}>{error}</div>
      ) : clientes.length === 0 ? (
        <div style={{ textAlign: "center", color: "#4a5568" }}>No hay clientes registrados.</div>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 16 }}>
          <thead>
            <tr style={{ background: palette.gray }}>
              <th style={thStyle}>Nombre</th>
              <th style={thStyle}>Documento</th>
              <th style={thStyle}>Teléfono</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Estado</th>
              <th style={thStyle}>Microempresa</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map(cliente => (
              <tr key={cliente.id_cliente} style={{ borderBottom: `1px solid ${palette.gray}` }}>
                <td style={tdStyle}>{cliente.nombre}</td>
                <td style={tdStyle}>{cliente.documento}</td>
                <td style={tdStyle}>{cliente.telefono}</td>
                <td style={tdStyle}>{cliente.email}</td>
                <td style={tdStyle}>
                  <span style={{
                    display: "inline-block",
                    padding: "4px 12px",
                    borderRadius: 12,
                    fontWeight: 600,
                    color: cliente.estado ? palette.accent4 : palette.red,
                    background: cliente.estado ? "#E6F4EA" : "#FDEDED",
                    border: `1.5px solid ${cliente.estado ? palette.accent4 : palette.red}`
                  }}>
                    {cliente.estado ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td style={tdStyle}>{cliente.microempresa?.nombre || mapaEmpresas[cliente.id_microempresa] || cliente.id_microempresa || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
const btnNormal = {padding:'8px 18px',borderRadius:8,border:'1.5px solid #1D7373',background:'#fff',color:'#1D7373',fontWeight:600,fontSize:15,cursor:'pointer'};
const btnActive = {...btnNormal,background:'#1D7373',color:'#fff',border:'1.5px solid #107361'};

const thStyle = {
  padding: "10px 8px",
  textAlign: "left",
  color: "#042326",
  fontWeight: 700,
  fontSize: 16,
  borderBottom: "2px solid #1D7373"
};

const tdStyle = {
  padding: "10px 8px",
  fontSize: 15,
  color: "#0A3A40"
};
