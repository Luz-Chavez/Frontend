import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import apiClient from "../../services/apiClient";
import PlanInfo from "../../components/PlanInfo";

function SellerSubscription() {
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
    <div style={{
      maxWidth: 600,
      margin: "40px auto",
      background: "#F5F7F8",
      borderRadius: 18,
      boxShadow: "0 6px 24px #1D737344",
      padding: 40,
      position: "relative"
    }}>
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: 12,
        borderTopLeftRadius: 18,
        borderTopRightRadius: 18,
        background: "linear-gradient(90deg, #1D7373 0%, #107361 100%)"
      }} />
      <h2 style={{
        textAlign: "center",
        fontWeight: 800,
        fontSize: 28,
        color: "#107361",
        marginBottom: 32,
        letterSpacing: 1
      }}>
        Plan Actual de la Microempresa
      </h2>
      {loading && <div style={{ textAlign: "center", color: "#1D7373", fontWeight: 600 }}>Cargando...</div>}
      {error && <div style={{ color: "#EF4444", textAlign: "center", fontWeight: 600 }}>{error}</div>}
      {plan && <PlanInfo plan={plan} />}
      <div style={{
        marginTop: 32,
        textAlign: "center",
        color: "#0A3A40",
        fontSize: 15,
        opacity: 0.7
      }}>
        Si deseas cambiar de plan, contacta al soporte o revisa las opciones disponibles en la sección de administración.
      </div>
    </div>
  );
}

export default SellerSubscription;
