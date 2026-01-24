import React from 'react';

// Componente para mostrar los detalles de una venta
export default function VentaDetalles({ detalles = [], productos = {} }) {
  // productos: objeto opcional para mostrar el nombre del producto si está disponible
  return (
    <div style={boxStyle}>
      <h4 style={titleStyle}>Detalles de la Venta</h4>
      <table style={tableStyle}>
        <thead style={{ background: '#F3F4F6' }}>
          <tr>
            <th style={thStyle}>Producto</th>
            <th style={thStyle}>Cantidad</th>
            <th style={thStyle}>Precio Unitario</th>
            <th style={thStyle}>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {detalles.length === 0 ? (
            <tr>
              <td colSpan={4} style={{ ...tdStyle, textAlign: 'center', color: '#888' }}>
                No hay detalles para mostrar.
              </td>
            </tr>
          ) : (
            detalles.map((d) => (
              <tr key={d.id_detalle} style={{ borderBottom: '1px solid #E5E7EB' }}>
                <td style={tdStyle}>{productos[d.id_producto]?.nombre || `ID: ${d.id_producto}`}</td>
                <td style={tdStyle}>{d.cantidad}</td>
                <td style={tdStyle}>{d.precio_unitario} Bs</td>
                <td style={tdStyle}>{d.subtotal} Bs</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// --- ESTILOS ---
const boxStyle = {
  background: '#fff',
  border: '1px solid #E5E7EB',
  borderRadius: 12,
  padding: 20,
  margin: '20px 0',
  boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
};
const titleStyle = {
  margin: 0,
  marginBottom: 16,
  color: '#1D7373',
  fontSize: 18,
  fontWeight: 700
};
const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: 14
};
const thStyle = {
  padding: '10px 15px',
  textAlign: 'left',
  color: '#4B5563',
  fontSize: 13,
  fontWeight: 700,
  textTransform: 'uppercase',
  borderBottom: '2px solid #E5E7EB'
};
const tdStyle = {
  padding: '10px 15px',
  color: '#1F2937',
  borderBottom: '1px solid #E5E7EB'
};
