// Componente reutilizable para mostrar información de un plan
import React from "react";
import { ShoppingCart, User, Users } from "lucide-react";

export default function PlanInfo({ plan }) {
  if (!plan) return null;
  return (
    <div style={{
      margin: '0 auto',
      padding: '32px 28px',
      borderRadius: '16px',
      background: 'linear-gradient(90deg, #1D7373 0%, #107361 100%)',
      color: '#F5F7F8',
      boxShadow: '0 4px 16px #1D737344',
      maxWidth: 480,
      fontSize: '17px',
      fontWeight: 500,
      position: 'relative',
      border: '2px solid #107361'
    }}>
      <div style={{
        fontSize: '26px',
        fontWeight: 800,
        marginBottom: 10,
        letterSpacing: 1,
        textShadow: '0 2px 8px #0002'
      }}>{plan.nombre}</div>
      <div style={{
        marginBottom: 18,
        fontStyle: 'italic',
        color: '#E6EAEA',
        fontWeight: 400
      }}>{plan.descripcion}</div>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '24px',
        marginTop: 10,
        marginBottom: 8
      }}>
        {plan.limite_productos !== undefined && (
          <span style={infoTag}>
            <ShoppingCart size={18} style={{ verticalAlign: "middle", marginRight: 6, color: "#107361" }} />
            Productos: <b>{plan.limite_productos}</b>
          </span>
        )}
        {plan.limite_admins !== undefined && (
          <span style={infoTag}>
            <User size={18} style={{ verticalAlign: "middle", marginRight: 6, color: "#107361" }} />
            Admins: <b>{plan.limite_admins}</b>
          </span>
        )}
        {plan.limite_vendedores !== undefined && (
          <span style={infoTag}>
            <Users size={18} style={{ verticalAlign: "middle", marginRight: 6, color: "#107361" }} />
            Vendedores: <b>{plan.limite_vendedores}</b>
          </span>
        )}
      </div>
      <div style={{
        marginTop: 18,
        fontSize: 15,
        color: '#E6EAEA',
        opacity: 0.8
      }}>
        Vigencia: <b>{plan.vigencia || 'Indefinida'}</b>
      </div>
    </div>
  );
}

const infoTag = {
  background: '#F5F7F8',
  color: '#107361',
  borderRadius: '8px',
  padding: '6px 16px',
  fontWeight: 700,
  fontSize: '15px',
  boxShadow: '0 2px 8px #1D737344',
  border: '1.5px solid #E6EAEA'
};
