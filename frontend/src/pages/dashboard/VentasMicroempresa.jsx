import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { getClientesInfo } from "../../api/clientes.api";

const VentasMicroempresa = () => {
  const { user } = useAuth();
  const [ventas, setVentas] = useState([]);
  const [clientesInfo, setClientesInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.microempresa?.id_microempresa) return;
    setLoading(true);
    axios
      .get(`/ventas/microempresa/${user.microempresa.id_microempresa}`)
      .then(async (res) => {
        setVentas(res.data);
        // Obtener info de clientes
        const ids = res.data.map(v => v.id_cliente);
        const info = await getClientesInfo(ids);
        setClientesInfo(info);
        setLoading(false);
      })
      .catch((err) => {
        setError("Error al cargar las ventas");
        setLoading(false);
      });
  }, [user]);

  if (loading) return <div>Cargando ventas...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={{ padding: 24, background: '#002F2C', minHeight: '100vh' }}>
      <h2 style={{ color: '#10B981', marginBottom: 24 }}>Ventas de la Microempresa</h2>
      {ventas.length === 0 ? (
        <p style={{ color: '#fff' }}>No hay ventas registradas.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 16, background: '#01322E', borderRadius: 8, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <thead>
            <tr style={{ background: '#10B981' }}>
              <th style={{ color: '#fff', padding: 12, textAlign: 'left' }}>ID Venta</th>
              <th style={{ color: '#fff', padding: 12, textAlign: 'left' }}>Cliente</th>
              <th style={{ color: '#fff', padding: 12, textAlign: 'left' }}>Total</th>
              <th style={{ color: '#fff', padding: 12, textAlign: 'left' }}>Estado</th>
              {/* <th style={{ color: '#fff', padding: 12, textAlign: 'left' }}>Tipo</th> */}
              <th style={{ color: '#fff', padding: 12, textAlign: 'left' }}>Fecha</th>
              <th style={{ color: '#fff', padding: 12, textAlign: 'left' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ventas.map((venta, idx) => (
              <tr key={venta.id_venta} style={{ background: idx % 2 === 0 ? '#01443C' : '#01322E' }}>
                <td style={{ color: '#fff', padding: 10 }}>{venta.id_venta}</td>
                <td style={{ color: '#fff', padding: 10 }}>
                  {clientesInfo[venta.id_cliente]
                    ? `${clientesInfo[venta.id_cliente].nombre || ''} (${clientesInfo[venta.id_cliente].email || 'Sin correo'})`
                    : venta.id_cliente}
                </td>
                <td style={{ color: '#fff', padding: 10 }}>${venta.total}</td>
                <td style={{ color: '#fff', padding: 10 }}>{venta.estado}</td>
                {/* <td style={{ color: '#fff', padding: 10 }}>{venta.tipo}</td> */}
                <td style={{ color: '#fff', padding: 10 }}>{new Date(venta.fecha).toLocaleString()}</td>
                <td style={{ padding: 10 }}>
                  <Link to={`/dashboard/ventas/${venta.id_venta}`} style={{ color: '#10B981', textDecoration: 'underline', fontWeight: 500 }}>Ver Detalles</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default VentasMicroempresa;
