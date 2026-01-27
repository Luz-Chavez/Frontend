
import { useState } from "react";
import apiClient from "../../services/apiClient";
import { useNavigate } from "react-router-dom";
import CaptchaRecovery from "../../components/CaptchaRecovery";
import NotificationAlert from "../../components/NotificationAlert";

function Recovery() {



  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");
  const [captchaId, setCaptchaId] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const form = new FormData();
      form.append('email', email);
      form.append('captcha_id', captchaId);
      form.append('captcha_input', captchaInput);
      const res = await apiClient.post("/auth/recover", form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data && res.data.ok === false && res.data.detail) {
        setError("Error: " + res.data.detail);
        setShowAlert(true);
        setLoading(false);
        return;
      }
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
          navigate("/auth/reset-password", { state: { token: receivedToken } });
        } else {
          navigate("/auth/reset-password");
        }
      }, 1000);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.detail) {
        setError("Error: " + err.response.data.detail);
        setShowAlert(true);
      } else {
        setError("No se pudo enviar el correo de recuperación.");
        setShowAlert(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0A3A40 0%, #1D7373 100%)'
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '20px',
        boxShadow: '0 4px 32px rgba(16, 115, 97, 0.10)',
        padding: '40px 32px',
        minWidth: 370,
        maxWidth: 410,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <div style={{
          background: '#1D7373',
          width: 64,
          height: 64,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 24
        }}>
          {/* Icono simple tipo candado */}
          <svg width="36" height="36" fill="none" viewBox="0 0 24 24">
            <rect x="7" y="11" width="10" height="7" rx="2" fill="#fff" />
            <circle cx="12" cy="15" r="1.5" fill="#1D7373" />
            <rect x="9.5" y="7" width="5" height="4" rx="2.5" fill="#1D7373" />
          </svg>
        </div>
        <div style={{ fontWeight: 500, fontSize: 26, color: '#0A3A40', marginBottom: 8, textAlign: 'center' }}>Recuperar Contraseña</div>
        <div style={{ color: '#0A3A40', fontSize: 16, marginBottom: 28, textAlign: 'center' }}>
          Ingresa tu email para recibir instrucciones de recuperación
        </div>
        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <label style={{ color: '#0A3A40', fontWeight: 500, marginBottom: 4 }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{
              padding: '12px',
              borderRadius: 8,
              border: '1px solid #E6EAEA',
              fontSize: 16,
              marginBottom: 12,
              background: '#F5F7F8',
              color: '#0A3A40',
              outline: 'none'
            }}
          />
          <CaptchaRecovery
            onCaptchaChange={(id, input) => {
              setCaptchaId(id);
              setCaptchaInput(input);
            }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '12px',
              background: '#1D7373',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 17,
              marginTop: 8,
              width: '100%',
              boxShadow: '0 2px 8px rgba(16, 115, 97, 0.08)',
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? "Enviando..." : "Enviar instrucciones"}
          </button>
        </form>
        {success && <div style={{ color: '#107361', marginTop: 14, fontWeight: 500 }}>{success}</div>}
        {/* {error && <div style={{ color: '#F87171', marginTop: 14, fontWeight: 500 }}>{error}</div>} */}
        {showAlert && error && (
          <NotificationAlert
            mensaje={error}
            tipo="alerta"
            onClose={() => setShowAlert(false)}
          />
        )}
      </div>
    </div>
  );
}

export default Recovery;
