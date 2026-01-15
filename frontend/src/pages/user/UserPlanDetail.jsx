import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.js";
import { getPlanByIdRequest } from "../../api/user.api";
import PlanInfo from "../../components/PlanInfo";

function UserPlanDetail() {
  const { id_plan } = useParams();
  const { user, setUser } = useAuth();
  const [plan, setPlan] = useState(null);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);
  const [empresa, setEmpresa] = useState({ nombre: "", nit: "", direccion: "", telefono: "", moneda: "BOB" });
  const [empresaId, setEmpresaId] = useState(null);
  // Eliminado: fechaFin no se usa
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPlan() {
      try {
        const res = await getPlanByIdRequest(id_plan);
        setPlan(res.data);
      } catch {
        setError("Error al cargar el plan");
      }
    }
    fetchPlan();
  }, [id_plan]);

  // Paso 1: Mostrar detalles del plan y botón para pagar
  if (step === 1) {
    return (
      <div style={{ maxWidth: 500, margin: "40px auto", background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px #0001", padding: 32 }}>
        <h2>Detalles del Plan</h2>
        {error && <div style={{ color: "red" }}>{error}</div>}
        {plan && <PlanInfo plan={plan} />}
        {plan && (
          <div style={{ margin: "16px 0" }}>
            <button onClick={() => setStep(2)}>Pagar este plan</button>
          </div>
        )}
      </div>
    );
  }





// Exportar PlanInfo al tope del archivo




  // Paso 2: Formulario para crear microempresa
  if (step === 2) {
    const handleChange = e => {
      setEmpresa({ ...empresa, [e.target.name]: e.target.value });
    };
    const handleEmpresa = async () => {
      setError("");
      try {
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
        setEmpresaId(data.id_microempresa);
        setStep(3);
      } catch {
        setError("No se pudo crear la microempresa");
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

  // Paso 3: Crear suscripción y asignar usuario como admin
  if (step === 3) {
    const handleSuscripcion = async () => {
      setError("");
      try {
        // Fecha fin: 1 año desde hoy
        const fecha = new Date();
        fecha.setFullYear(fecha.getFullYear() + 1);
        // Crear suscripción
        const res = await fetch("http://127.0.0.1:8000/suscripciones/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("access_token")}`
          },
          body: JSON.stringify({
            id_microempresa: empresaId,
            id_plan: parseInt(id_plan),
            fecha_fin: fecha.toISOString()
          })
        });
        if (!res.ok) throw new Error("Error al crear suscripción");
        // Asignar usuario como admin
        const res2 = await fetch(`http://127.0.0.1:8000/auth/admin/${user.id_usuario}/asignar-microempresa?id_microempresa=${empresaId}`, {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("access_token")}`
          }
        });
        if (!res2.ok) throw new Error("Error al asignar microempresa");
        // Refrescar datos del usuario
        const meRes = await fetch("http://127.0.0.1:8000/usuarios/me", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("access_token")}`
          }
        });
        if (meRes.ok) {
          const userData = await meRes.json();
          setUser(userData);
        }
        // Redirigir a dashboard de admin microempresa
        navigate("/dashboard");
      } catch {
        setError("No se pudo completar la suscripción");
      }
    };
    return (
      <div style={{ maxWidth: 500, margin: "40px auto", background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px #0001", padding: 32 }}>
        <h2>Confirmar Suscripción</h2>
        {error && <div style={{ color: "red" }}>{error}</div>}
        <p>Microempresa creada correctamente.</p>
        <button onClick={handleSuscripcion}>Finalizar y Activar Suscripción</button>
      </div>
    );
  }

  return null;
}

export default UserPlanDetail;
