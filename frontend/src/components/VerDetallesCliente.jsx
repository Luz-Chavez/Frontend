import React from "react";

export default function VerDetallesCliente({ cliente, onClose }) {
  if (!cliente) return null;
  return (
    <div style={{ minWidth: 350, maxWidth: 420, color: '#1e293b' }}>
      <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1D7373', marginBottom: 18 }}>Detalles del Cliente</h2>
      <div style={{ marginBottom: 12, fontSize: '1rem' }}>
        <strong style={{ color: '#0f172a' }}>Nombre:</strong> <span style={{ color: '#334155' }}>{cliente.nombre}</span>
      </div>
      <div style={{ marginBottom: 12, fontSize: '1rem' }}>
        <strong style={{ color: '#0f172a' }}>Documento:</strong> <span style={{ color: '#334155' }}>{cliente.documento || 'No registrado'}</span>
      </div>
      <div style={{ marginBottom: 12, fontSize: '1rem' }}>
        <strong style={{ color: '#0f172a' }}>Correo:</strong> <span style={{ color: '#334155' }}>{cliente.correo || 'No registrado'}</span>
      </div>
      <div style={{ marginBottom: 12, fontSize: '1rem' }}>
        <strong style={{ color: '#0f172a' }}>Teléfono:</strong> <span style={{ color: '#334155' }}>{cliente.telefono || 'No registrado'}</span>
      </div>
      <div style={{ marginBottom: 12, fontSize: '1rem' }}>
        <strong style={{ color: '#0f172a' }}>Dirección:</strong> <span style={{ color: '#334155' }}>{cliente.direccion || 'No registrada'}</span>
      </div>
      <button onClick={onClose} style={{ marginTop: 18, background: '#1D7373', color: 'white', border: 'none', borderRadius: 6, padding: '8px 20px', fontWeight: 600, cursor: 'pointer' }}>
        Cerrar
      </button>
    </div>
  );
}
