// Componente reutilizable para mostrar información de un plan
import React from "react";

export default function PlanInfo({ plan }) {
  if (!plan) return null;
  return (
    <div style={{
      margin: '16px 0',
      padding: '20px',
      borderRadius: '12px',
      background: 'linear-gradient(90deg, #059669 0%, #10b981 100%)',
      color: 'white',
      boxShadow: '0 2px 8px #0002',
      maxWidth: 500,
      marginLeft: 'auto',
      marginRight: 'auto',
      fontSize: '16px',
      fontWeight: 500
    }}>
      <div style={{fontSize: '22px', fontWeight: 700, marginBottom: 8, letterSpacing: 1}}>{plan.nombre}</div>
      <div style={{marginBottom: 10, fontStyle: 'italic'}}>{plan.descripcion}</div>
      <div style={{display: 'flex', flexWrap: 'wrap', gap: '18px'}}>
        {plan.limite_productos !== undefined && (
          <span>🛒 Productos: <b>{plan.limite_productos}</b></span>
        )}
        {plan.limite_admins !== undefined && (
          <span>👤 Admins: <b>{plan.limite_admins}</b></span>
        )}
        {plan.limite_vendedores !== undefined && (
          <span>🧑‍💼 Vendedores: <b>{plan.limite_vendedores}</b></span>
        )}
      </div>
    </div>
  );
}
