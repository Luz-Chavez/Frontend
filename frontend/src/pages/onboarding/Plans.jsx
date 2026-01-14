import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Plans = () => {
  const navigate = useNavigate();

  const plans = [
    { id: 1, name: "Básico", price: "29", features: ["3 Usuarios", "Inventario básico", "Soporte por correo"], color: "#6B7280" },
    { id: 2, name: "Profesional", price: "59", features: ["10 Usuarios", "Inventario ilimitado", "Reportes avanzados", "Soporte prioritario"], color: "#059669", recommended: true },
    { id: 3, name: "Empresarial", price: "99", features: ["Usuarios ilimitados", "API Access", "Gestor de cuenta dedicado"], color: "#111827" },
  ];

  const handleSelect = (planId) => {
    // Aquí guardaríamos el plan en el estado o localstorage
    navigate("/onboarding/payment");
  };

  const s = {
    container: { maxWidth: '1000px', margin: '40px auto', padding: '0 20px', textAlign: 'center' },
    title: { fontSize: '32px', fontWeight: 'bold', color: '#111827', marginBottom: '10px' },
    subtitle: { color: '#6B7280', marginBottom: '40px' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' },
    
    card: { backgroundColor: 'white', borderRadius: '16px', padding: '30px', border: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column', position: 'relative', transition: 'transform 0.2s', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' },
    recommendedBadge: { position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#059669', color: 'white', padding: '4px 12px', borderRadius: '99px', fontSize: '12px', fontWeight: '600' },
    
    planName: { fontSize: '18px', fontWeight: '600', color: '#374151', marginBottom: '10px' },
    price: { fontSize: '42px', fontWeight: 'bold', color: '#111827', marginBottom: '20px' },
    features: { textAlign: 'left', marginBottom: '30px', flex: 1 },
    featureItem: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', color: '#4B5563', fontSize: '14px' },
    
    button: { width: '100%', padding: '12px', borderRadius: '8px', border: 'none', fontWeight: '600', cursor: 'pointer', fontSize: '16px', transition: 'background 0.2s' }
  };

  return (
    <div style={s.container}>
      <h1 style={s.title}>Elige el plan perfecto para tu negocio</h1>
      <p style={s.subtitle}>Comienza gratis y escala según tus necesidades</p>

      <div style={s.grid}>
        {plans.map((p) => (
          <div key={p.id} style={{ ...s.card, borderColor: p.recommended ? '#059669' : '#E5E7EB' }}>
            {p.recommended && <div style={s.recommendedBadge}>Más Popular</div>}
            
            <h3 style={s.planName}>{p.name}</h3>
            <div style={s.price}>${p.price}<span style={{fontSize:'16px', color:'#6B7280', fontWeight:'400'}}>/mes</span></div>
            
            <div style={s.features}>
              {p.features.map((f, i) => (
                <div key={i} style={s.featureItem}>
                  <Check size={16} color="#059669" /> {f}
                </div>
              ))}
            </div>

            <button 
              onClick={() => handleSelect(p.id)}
              style={{ ...s.button, backgroundColor: p.recommended ? '#059669' : '#1F2937', color: 'white' }}
            >
              Elegir {p.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Plans;