import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CaptchaRecovery = ({ onCaptchaChange }) => {
  const [captchaImg, setCaptchaImg] = useState('');
  const [captchaId, setCaptchaId] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getCaptcha();
    // eslint-disable-next-line
  }, []);

  const getCaptcha = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('http://localhost:8000/auth/recover/captcha');
      setCaptchaImg('data:image/png;base64,' + res.data.captcha);
      setCaptchaId(res.data.captcha_id);
      setCaptchaInput('');
      if (onCaptchaChange) {
        onCaptchaChange(res.data.captcha_id, '');
      }
    } catch {
      setError('No se pudo cargar el captcha');
    } finally {
      setLoading(false);
    }
  };

  const handleInput = (e) => {
    setCaptchaInput(e.target.value);
    if (onCaptchaChange) {
      onCaptchaChange(captchaId, e.target.value);
    }
  };

  return (
    <div style={{ width: '100%', marginBottom: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        {captchaImg && <img src={captchaImg} alt="captcha" style={{ height: 38, borderRadius: 6, border: '1px solid #E6EAEA' }} />}
        <button type="button" onClick={getCaptcha} disabled={loading} style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #1D7373', background: '#fff', color: '#1D7373', fontWeight: 500, cursor: 'pointer' }}>
          Recargar
        </button>
      </div>
      <input
        type="text"
        value={captchaInput}
        onChange={handleInput}
        required
        placeholder="Escribe el captcha"
        style={{
          padding: '10px',
          borderRadius: 8,
          border: '1px solid #E6EAEA',
          fontSize: 16,
          background: '#F5F7F8',
          color: '#0A3A40',
          outline: 'none',
          width: '100%'
        }}
      />
      {error && <div style={{ color: '#F87171', marginTop: 6, fontWeight: 500 }}>{error}</div>}
    </div>
  );
};

export default CaptchaRecovery;
