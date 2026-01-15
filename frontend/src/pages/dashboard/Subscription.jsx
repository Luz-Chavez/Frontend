
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import apiClient from "../../services/apiClient";
import PlanInfo from "../../components/PlanInfo";

function Subscription() {
  const { user } = useAuth();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPlan() {
      try {
        const res = await apiClient.get(`/suscripciones/microempresa/${user?.microempresa?.id_microempresa}/plan`);
        setPlan(res.data);
      } catch {
        setError("No se pudo cargar el plan actual");
      } finally {
        setLoading(false);
      }
    }
    if (user?.microempresa?.id_microempresa) fetchPlan();
  }, [user]);

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px #0001", padding: 32 }}>
      <h2>Plan Actual de la Empresa</h2>
      {loading && <div>Cargando...</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
      {plan && <PlanInfo plan={plan} />}
    </div>
  );
}

export default Subscription;