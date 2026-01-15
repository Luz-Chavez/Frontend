
import { useState } from "react";
import apiClient from "../../services/apiClient";
import { useNavigate } from "react-router-dom";

function Recovery() {


  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await apiClient.post("/auth/recover", { email });
      let receivedToken = null;
      if (res.data) {
        if (typeof res.data === "string") {
          receivedToken = res.data;
        } else if (res.data.reset_token) {
          receivedToken = res.data.reset_token;
        } else if (res.data.token) {
          receivedToken = res.data.token;
        }
      }
      setSuccess("Redirigiendo...");
      setTimeout(() => {
        if (receivedToken) {
          navigate("/reset-password", { state: { token: receivedToken } });
        } else {
          navigate("/reset-password");
        }
      }, 1000);
    } catch {
      setError("No se pudo enviar el correo de recuperación.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "60px auto", background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px #0001", padding: 32 }}>
      <h2>Recuperar Contraseña</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <label>Email</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ padding: 10 }} />
        <button type="submit" disabled={loading} style={{ padding: 10, background: '#10B981', color: 'white', border: 'none', borderRadius: 6 }}>
          {loading ? "Enviando..." : "Enviar instrucciones"}
        </button>
      </form>
      {success && <div style={{ color: 'green', marginTop: 10 }}>{success}</div>}
      {/* El token ya no se muestra aquí, se redirige automáticamente */}
      {error && <div style={{ color: 'red', marginTop: 10 }}>{error}</div>}
    </div>
  );
}

export default Recovery;
