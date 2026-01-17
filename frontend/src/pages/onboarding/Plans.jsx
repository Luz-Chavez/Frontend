import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPlanesRequest } from "../../api/user.api";

const Plans = () => {
  const navigate = useNavigate();
  const [planes, setPlanes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPlanes() {
      try {
        const res = await getPlanesRequest();
        setPlanes(res.data);
      } catch {
        setError("Error al cargar los planes");
      } finally {
        setLoading(false);
      }
    }
    fetchPlanes();
  }, []);

  const handleSelect = (plan) => {
    navigate("/onboarding/payment", { state: { plan } });
  };

  const s = {
    container: { maxWidth: '1100px', margin: '48px auto', padding: '0 20px', textAlign: 'center' },
    title: { fontSize: '34px', fontWeight: 800, color: '#0A3A40', marginBottom: '8px', letterSpacing: 0.2 },
    subtitle: { color: '#1D7373', marginBottom: '38px', fontSize: '17px', fontWeight: 500 },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '36px' },
    card: { backgroundColor: '#fff', borderRadius: '18px', padding: '36px 30px 30px 30px', border: '1.5px solid #E6EAEA', display: 'flex', flexDirection: 'column', position: 'relative', transition: 'transform 0.18s', boxShadow: '0 6px 32px #1D737320', alignItems: 'center' },
    recommendedBadge: { position: 'absolute', top: '-16px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#1D7373', color: 'white', padding: '5px 18px', borderRadius: '99px', fontSize: '13px', fontWeight: '700', boxShadow: '0 2px 8px #E6EAEA' },
    planName: { fontSize: '20px', fontWeight: 700, color: '#0A3A40', marginBottom: '12px', letterSpacing: 0.1 },
    price: { fontSize: '46px', fontWeight: 800, color: '#107361', marginBottom: '18px', letterSpacing: 0.5 },
    features: { textAlign: 'left', marginBottom: '32px', flex: 1, width: '100%', maxWidth: 320 },
    featureItem: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '13px', color: '#042326', fontSize: '15px', fontWeight: 500 },
    button: { width: '100%', padding: '14px', borderRadius: '9px', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: '17px', transition: 'background 0.2s', backgroundColor: '#1D7373', color: '#F5F7F8', marginTop: 8, boxShadow: '0 2px 8px #E6EAEA' }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(120deg, #1D7373 0%, #F5F7F8 100%)'
    }}>
      <div style={s.container}>
        <h1 style={s.title}>Elige el plan perfecto para tu negocio</h1>
        <p style={s.subtitle}>Comienza gratis y escala según tus necesidades</p>
        {loading && <div>Cargando planes...</div>}
        {error && <div style={{color:'red'}}>{error}</div>}
        <div style={s.grid}>
          {planes.map((p) => (
            <div
              key={p.id_plan}
              style={{
                ...s.card,
                borderColor: p.recommended ? '#1D7373' : '#E6EAEA',
                boxShadow: p.recommended ? '0 8px 32px #1D737340' : s.card.boxShadow,
                transform: p.recommended ? 'scale(1.04)' : 'none',
                zIndex: p.recommended ? 2 : 1
              }}
            >
              {p.recommended && <div style={s.recommendedBadge}>Más Popular</div>}
              <h3 style={s.planName}>{p.nombre}</h3>
              <div style={s.price}>${p.precio}<span style={{fontSize:'17px', color:'#4a5568', fontWeight:'500'}}>/mes</span></div>
              <div style={s.features}>
                <div style={s.featureItem}><Check size={16} color="#1D7373" />Límite de productos: <b>{p.limite_productos}</b></div>
                <div style={s.featureItem}><Check size={16} color="#1D7373" />Límite de admins: <b>{p.limite_admins}</b></div>
                <div style={s.featureItem}><Check size={16} color="#1D7373" />Límite de vendedores: <b>{p.limite_vendedores}</b></div>
                {p.descripcion && <div style={s.featureItem}><Check size={16} color="#1D7373" />{p.descripcion}</div>}
              </div>
              <button
                onClick={() => handleSelect(p)}
                style={{
                  ...s.button,
                  backgroundColor: p.recommended ? '#1D7373' : '#107361',
                  color: '#F5F7F8',
                  boxShadow: p.recommended ? '0 2px 12px #1D737340' : s.button.boxShadow
                }}
              >
                Elegir {p.nombre}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Plans;