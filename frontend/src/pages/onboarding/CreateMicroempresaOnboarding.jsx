import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";

function CreateMicroempresaOnboarding() {
  const navigate = useNavigate();
  const location = useLocation();
  // Recuperar planId del estado de navegación
  const plan = location.state?.plan;
  const planId = plan?.id_plan;
  const [empresa, setEmpresa] = useState({ nombre: "", nit: "", direccion: "", telefono: "", moneda: "BOB" });
  const [error, setError] = useState("");

  const handleChange = e => {
    setEmpresa({ ...empresa, [e.target.name]: e.target.value });
  };

  const handleEmpresa = async () => {
    setError("");
    try {
      // 1. Crear microempresa
      const res = await fetch("http://127.0.0.1:8000/microempresas/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("access_token")}`
        },
        body: JSON.stringify(empresa)
      });
      if (!res.ok) throw new Error("Error al crear microempresa");
      const data = await res.json();
      const empresaId = data.id_microempresa;
      // 2. Crear suscripción
      const fecha = new Date();
      fecha.setFullYear(fecha.getFullYear() + 1);
      const res2 = await fetch("http://127.0.0.1:8000/suscripciones/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("access_token")}`
        },
        body: JSON.stringify({
          id_microempresa: empresaId,
          id_plan: planId,
          fecha_fin: fecha.toISOString()
        })
      });
      if (!res2.ok) throw new Error("Error al crear suscripción");
      // 3. Asignar usuario como admin
      const userId = JSON.parse(atob(localStorage.getItem("access_token").split(".")[1])).sub;
      const res3 = await fetch(`http://127.0.0.1:8000/auth/admin/${userId}/asignar-microempresa?id_microempresa=${empresaId}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("access_token")}`
        }
      });
      if (!res3.ok) throw new Error("Error al asignar microempresa");
      Swal.fire({
        title: "¡Microempresa creada!",
        text: "Ya eres administrador de tu microempresa.",
        icon: "success",
        confirmButtonColor: "#059669"
      }).then(() => {
        navigate("/login");
      });
    } catch {
      setError("No se pudo completar el proceso. Intenta de nuevo.");
    }
  };

  return (
    <div
      style={{
        maxWidth: 420,
        margin: "48px auto",
        background: "#fff",
        borderRadius: 18,
        boxShadow: "0 4px 24px #0002",
        padding: 36,
        display: "flex",
        flexDirection: "column",
        gap: 18,
        border: "1.5px solid #e5e7eb"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><rect x="3" y="7" width="18" height="13" rx="3" fill="#059669"/><rect x="7" y="3" width="10" height="6" rx="2" fill="#10b981"/><rect x="9" y="11" width="6" height="2" rx="1" fill="#fff"/></svg>
        <h2 style={{ fontWeight: 700, fontSize: 26, color: "#111827", margin: 0 }}>Crear Microempresa</h2>
      </div>
      <div style={{ color: "#6b7280", fontSize: 16, marginBottom: 8 }}>
        Ingresa los datos de tu empresa para comenzar a gestionar tu negocio en la plataforma.
      </div>
      {error && (
        <div style={{
          background: "#fee2e2",
          color: "#b91c1c",
          border: "1px solid #fecaca",
          borderRadius: 8,
          padding: "10px 14px",
          fontWeight: 500,
          marginBottom: 4
        }}>{error}</div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <label style={{ fontWeight: 600, color: "#374151" }}>
          Nombre de la empresa
          <input
            name="nombre"
            placeholder="Ej: Mi Negocio S.R.L."
            value={empresa.nombre}
            onChange={handleChange}
            style={{
              width: "100%",
              marginTop: 6,
              padding: "12px 14px",
              borderRadius: 8,
              border: "1.5px solid #d1d5db",
              fontSize: 16,
              outline: "none",
              background: "#f9fafb",
              transition: "border 0.2s",
              boxSizing: "border-box"
            }}
            autoFocus
          />
        </label>
        <label style={{ fontWeight: 600, color: "#374151" }}>
          NIT
          <input
            name="nit"
            placeholder="Ej: 123456789"
            value={empresa.nit}
            onChange={handleChange}
            style={{
              width: "100%",
              marginTop: 6,
              padding: "12px 14px",
              borderRadius: 8,
              border: "1.5px solid #d1d5db",
              fontSize: 16,
              outline: "none",
              background: "#f9fafb",
              transition: "border 0.2s",
              boxSizing: "border-box"
            }}
          />
        </label>
        <label style={{ fontWeight: 600, color: "#374151" }}>
          Dirección
          <input
            name="direccion"
            placeholder="Ej: Av. Siempre Viva 123"
            value={empresa.direccion}
            onChange={handleChange}
            style={{
              width: "100%",
              marginTop: 6,
              padding: "12px 14px",
              borderRadius: 8,
              border: "1.5px solid #d1d5db",
              fontSize: 16,
              outline: "none",
              background: "#f9fafb",
              transition: "border 0.2s",
              boxSizing: "border-box"
            }}
          />
        </label>
        <label style={{ fontWeight: 600, color: "#374151" }}>
          Teléfono
          <input
            name="telefono"
            placeholder="Ej: 78945612"
            value={empresa.telefono}
            onChange={handleChange}
            style={{
              width: "100%",
              marginTop: 6,
              padding: "12px 14px",
              borderRadius: 8,
              border: "1.5px solid #d1d5db",
              fontSize: 16,
              outline: "none",
              background: "#f9fafb",
              transition: "border 0.2s",
              boxSizing: "border-box"
            }}
          />
        </label>
        <label style={{ fontWeight: 600, color: "#374151" }}>
          Moneda
          <select
            name="moneda"
            value={empresa.moneda}
            onChange={handleChange}
            style={{
              width: "100%",
              marginTop: 6,
              padding: "12px 14px",
              borderRadius: 8,
              border: "1.5px solid #d1d5db",
              fontSize: 16,
              background: "#f9fafb",
              color: "#111827",
              outline: "none",
              appearance: "none",
              WebkitAppearance: "none",
              MozAppearance: "none"
            }}
          >
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
              <option key={code} value={code}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <button
        onClick={handleEmpresa}
        style={{
          marginTop: 18,
          background: "linear-gradient(90deg, #059669 60%, #10b981 100%)",
          color: "#fff",
          fontWeight: 700,
          fontSize: 18,
          border: "none",
          borderRadius: 8,
          padding: "14px 0",
          boxShadow: "0 2px 8px #05966922",
          cursor: "pointer",
          transition: "background 0.2s, box-shadow 0.2s"
        }}
        onMouseOver={e => (e.currentTarget.style.background = "#047857")}
        onMouseOut={e => (e.currentTarget.style.background = "linear-gradient(90deg, #059669 60%, #10b981 100%)")}
      >
        Crear Empresa
      </button>
    </div>
  );
}

export default CreateMicroempresaOnboarding;
