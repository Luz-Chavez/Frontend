import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import { useParams, Link } from "react-router-dom";

const DetalleVenta = () => {
  const { id_venta } = useParams();
  const [detalles, setDetalles] = useState([]);
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      axios.get(`/ventas/${id_venta}/detalles`),
      axios.get(`/ventas/${id_venta}/pagos`)
    ])
      .then(([detallesRes, pagosRes]) => {
        setDetalles(detallesRes.data);
        setPagos(pagosRes.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Error al cargar los detalles o pagos de la venta");
        setLoading(false);
      });
  }, [id_venta]);

  if (loading) return <div style={{ color: '#fff', background: '#002F2C', minHeight: '100vh', padding: 24 }}>Cargando detalles...</div>;
  if (error) return <div style={{ color: '#fff', background: '#002F2C', minHeight: '100vh', padding: 24 }}>{error}</div>;

  return (
    <div style={{ background: '#002F2C', minHeight: '100vh', padding: 24 }}>
      <h2 style={{ color: '#10B981', marginBottom: 24 }}>Detalles de la Venta #{id_venta}</h2>
      <Link to="/dashboard/ventas" style={{ color: '#10B981', textDecoration: 'underline', marginBottom: 24, display: 'inline-block' }}>← Volver a ventas</Link>
      <h3 style={{ color: '#fff', marginTop: 24 }}>Productos</h3>
      {detalles.length === 0 ? (
        <p style={{ color: '#fff' }}>No hay detalles para esta venta.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 12, background: '#01322E', borderRadius: 8, overflow: 'hidden' }}>
          <thead>
            <tr style={{ background: '#10B981' }}>
              <th style={{ color: '#fff', padding: 10 }}>ID Detalle</th>
              <th style={{ color: '#fff', padding: 10 }}>ID Producto</th>
              <th style={{ color: '#fff', padding: 10 }}>Cantidad</th>
              <th style={{ color: '#fff', padding: 10 }}>Precio Unitario</th>
              <th style={{ color: '#fff', padding: 10 }}>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {detalles.map((d, idx) => (
              <tr key={d.id_detalle} style={{ background: idx % 2 === 0 ? '#01443C' : '#01322E' }}>
                <td style={{ color: '#fff', padding: 10 }}>{d.id_detalle}</td>
                <td style={{ color: '#fff', padding: 10 }}>{d.id_producto}</td>
                <td style={{ color: '#fff', padding: 10 }}>{d.cantidad}</td>
                <td style={{ color: '#fff', padding: 10 }}>${d.precio_unitario}</td>
                <td style={{ color: '#fff', padding: 10 }}>${d.subtotal}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <h3 style={{ color: '#fff', marginTop: 32 }}>Pagos</h3>
      {pagos.length === 0 ? (
        <p style={{ color: '#fff' }}>No hay pagos registrados para esta venta.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 12, background: '#01322E', borderRadius: 8, overflow: 'hidden' }}>
          <thead>
            <tr style={{ background: '#10B981' }}>
              <th style={{ color: '#fff', padding: 10 }}>ID Pago</th>
              <th style={{ color: '#fff', padding: 10 }}>Método</th>
              <th style={{ color: '#fff', padding: 10 }}>Estado</th>
              <th style={{ color: '#fff', padding: 10 }}>Fecha</th>
              <th style={{ color: '#fff', padding: 10 }}>Comprobante</th>
            </tr>
          </thead>
          <tbody>
            {pagos.map((p, idx) => (
              <tr key={p.id_pago} style={{ background: idx % 2 === 0 ? '#01443C' : '#01322E' }}>
                <td style={{ color: '#fff', padding: 10 }}>{p.id_pago}</td>
                <td style={{ color: '#fff', padding: 10 }}>{p.metodo}</td>
                <td style={{ color: '#fff', padding: 10 }}>{p.estado}</td>
                <td style={{ color: '#fff', padding: 10 }}>{new Date(p.fecha).toLocaleString()}</td>
                <td style={{ color: '#fff', padding: 10 }}>
                  {p.comprobante_url ? (
                    <a href={p.comprobante_url} target="_blank" rel="noopener noreferrer" style={{ color: '#10B981', textDecoration: 'underline' }}>Ver Comprobante</a>
                  ) : (
                    'Sin comprobante'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DetalleVenta;
