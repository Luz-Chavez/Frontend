import { CheckCircle, CreditCard, AlertTriangle } from "lucide-react";

const Subscription = () => {
  const s = {
    container: { maxWidth: '800px', margin: '0 auto' },
    header: { marginBottom: '30px', textAlign: 'center' },
    title: { fontSize: '28px', color: '#111827', fontWeight: 'bold' },
    subtitle: { color: '#6B7280', fontSize: '16px', marginTop: '5px' },
    
    card: { backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', padding: '40px', border: '1px solid #E5E7EB', position: 'relative', overflow: 'hidden' },
    activeBadge: { position: 'absolute', top: '20px', right: '20px', backgroundColor: '#D1FAE5', color: '#065F46', padding: '6px 16px', borderRadius: '99px', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' },
    
    planName: { fontSize: '24px', fontWeight: 'bold', color: '#111827', marginBottom: '10px' },
    price: { fontSize: '48px', fontWeight: '800', color: '#111827' },
    period: { fontSize: '16px', color: '#6B7280', fontWeight: '400' },
    
    featuresTitle: { marginTop: '30px', marginBottom: '15px', fontWeight: '600', color: '#374151' },
    featuresList: { listStyle: 'none', padding: 0, margin: 0 },
    featureItem: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', color: '#4B5563' },
    
    actions: { marginTop: '40px', borderTop: '1px solid #E5E7EB', paddingTop: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    nextDate: { fontSize: '14px', color: '#6B7280' },
    btnUpgrade: { backgroundColor: '#002F2C', color: 'white', padding: '12px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '15px' }
  };

  return (
    <div style={s.container}>
      <div style={s.header}>
        <h1 style={s.title}>Tu Suscripción</h1>
        <p style={s.subtitle}>Detalles de tu plan actual y facturación</p>
      </div>

      <div style={s.card}>
        <div style={s.activeBadge}>
          <CheckCircle size={16} /> Activo
        </div>

        <div style={s.planName}>Plan Profesional</div>
        <div style={s.price}>
          $59 <span style={s.period}>/ mes</span>
        </div>

        <div style={s.featuresTitle}>Incluye:</div>
        <ul style={s.featuresList}>
          <li style={s.featureItem}><CheckCircle size={18} color="#10B981"/> Hasta 10 usuarios</li>
          <li style={s.featureItem}><CheckCircle size={18} color="#10B981"/> Inventario ilimitado</li>
          <li style={s.featureItem}><CheckCircle size={18} color="#10B981"/> Soporte prioritario 24/7</li>
          <li style={s.featureItem}><CheckCircle size={18} color="#10B981"/> Análisis de ventas avanzado</li>
        </ul>

        <div style={s.actions}>
          <div>
            <div style={{ fontWeight: '600', color: '#374151', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CreditCard size={18} /> Método de pago
            </div>
            <div style={s.nextDate}>Visa terminada en 4242 • Próximo cobro: 15 Ene 2026</div>
          </div>
          <button style={s.btnUpgrade}>Cambiar Plan</button>
        </div>
      </div>

      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#FFFBEB', borderRadius: '8px', border: '1px solid #FCD34D', color: '#92400E', display: 'flex', gap: '10px', fontSize: '14px' }}>
        <AlertTriangle size={20} />
        <span>¿Necesitas cancelar? Contacta a soporte o desactiva la renovación automática en configuración.</span>
      </div>
    </div>
  );
};

export default Subscription;