import { useAuth } from "../../context/AuthContext";
export default function ClienteCreateBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  // Determinar base según rol
  const base = user?.rol === 'vendedor' ? '/seller/clientes' : '/dashboard/clientes';
  const path = location.pathname;
  const isTodos = path === `${base}`;
  const isActivos = path === `${base}/activos`;
  const isInactivos = path === `${base}/inactivos`;

  return (
    <div style={{ marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button
          style={{ ...filterBtnStyle, ...(isTodos ? activeBtnStyle : {}) }}
          onClick={() => navigate(`${base}`)}
        >
          Todos
        </button>
        <button
          style={{ ...filterBtnStyle, ...(isActivos ? activeBtnStyle : {}) }}
          onClick={() => navigate(`${base}/activos`)}
        >
          Activos
        </button>
        <button
          style={{ ...filterBtnStyle, ...(isInactivos ? activeBtnStyle : {}) }}
          onClick={() => navigate(`${base}/inactivos`)}
        >
          Inactivos
        </button>
      </div>
      <button
        style={crearBtnStyle}
        onClick={() => navigate(`${base}/crear`)}
      >
        Crear Cliente
      </button>
    </div>
  );
}

import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
const filterBtnStyle = {
  padding: "10px 22px",
  borderRadius: 8,
  background: "#E6EAEA",
  color: "#1D7373",
  fontWeight: 700,
  fontSize: 16,
  border: "2px solid #E6EAEA",
  cursor: "pointer",
  boxShadow: "0 2px 8px #E6EAEA",
  transition: "background 0.2s, color 0.2s, border 0.2s"
};

const activeBtnStyle = {
  background: "#1D7373",
  color: "#F5F7F8",
  border: "2px solid #1D7373"
};

const crearBtnStyle = {
  padding: "10px 22px",
  borderRadius: 8,
  background: "#107361",
  color: "#F5F7F8",
  fontWeight: 700,
  fontSize: 16,
  border: "none",
  cursor: "pointer",
  boxShadow: "0 2px 8px #E6EAEA"
};
