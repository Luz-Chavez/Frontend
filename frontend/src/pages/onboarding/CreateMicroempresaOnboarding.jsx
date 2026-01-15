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
        navigate("/dashboard");
      });
    } catch {
      setError("No se pudo completar el proceso. Intenta de nuevo.");
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "40px auto", background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px #0001", padding: 32 }}>
      <h2>Crear Microempresa</h2>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <input name="nombre" placeholder="Nombre" value={empresa.nombre} onChange={handleChange} style={{ width: "100%", marginBottom: 8 }} />
      <input name="nit" placeholder="NIT" value={empresa.nit} onChange={handleChange} style={{ width: "100%", marginBottom: 8 }} />
      <input name="direccion" placeholder="Dirección" value={empresa.direccion} onChange={handleChange} style={{ width: "100%", marginBottom: 8 }} />
      <input name="telefono" placeholder="Teléfono" value={empresa.telefono} onChange={handleChange} style={{ width: "100%", marginBottom: 8 }} />
      <select name="moneda" value={empresa.moneda} onChange={handleChange} style={{ width: "100%", marginBottom: 8 }}>
        <option value="BOB">BOB</option>
        <option value="USD">USD</option>
      </select>
      <button onClick={handleEmpresa}>Crear Empresa</button>
    </div>
  );
}

export default CreateMicroempresaOnboarding;
