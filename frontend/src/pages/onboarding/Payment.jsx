import { CreditCard, Lock, ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";

const Payment = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const plan = state?.plan;

  const handlePayment = (e) => {
    e.preventDefault();
    // Simulamos proceso de pago exitoso
    Swal.fire({
      title: '¡Pago Exitoso!',
      text: 'Ahora crea tu microempresa.',
      icon: 'success',
      confirmButtonColor: '#059669'
    }).then(() => {
        // Redirigir a la vista de creación de microempresa, pasando el plan
        navigate("/onboarding/create-microempresa", { state: { plan } });
    });
  };

  const s = {
    wrapper: {
      minHeight: '100vh',
      background: 'linear-gradient(120deg, #1D7373 0%, #F5F7F8 100%)',
      display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0 20px'
    },
    card: {
      backgroundColor: '#fff', maxWidth: '440px', width: '100%', borderRadius: '18px', padding: '38px 32px 32px 32px',
      boxShadow: '0 6px 32px #1D737320', border: '1.5px solid #E6EAEA'
    },
    header: { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '28px' },
    title: { fontSize: '23px', fontWeight: 700, color: '#0A3A40', letterSpacing: 0.2 },
    summary: { backgroundColor: 'rgba(245,247,248,0.98)', padding: '18px', borderRadius: '10px', marginBottom: '28px', border: '1.5px solid #E6EAEA', color: '#0A3A40' },
    row: { display: 'flex', justifyContent: 'space-between', marginBottom: '7px', fontSize: '15px', color: '#0A3A40', fontWeight: 600, letterSpacing: 0.1 },
    total: { display: 'flex', justifyContent: 'space-between', marginTop: '12px', paddingTop: '12px', borderTop: '1.5px solid #000', fontWeight: 800, fontSize: '18px', color: '#1D7373', letterSpacing: 0.2 },
    form: { display: 'flex', flexDirection: 'column', gap: '17px' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
    label: { fontSize: '14px', fontWeight: 600, color: '#1D7373' },
    input: { padding: '12px', borderRadius: '8px', border: '1.5px solid #1D7373', fontSize: '15px', color: '#042326', fontWeight: 500, background: '#F5F7F8', outline: 'none', transition: 'border-color 0.2s' },
    rowInputs: { display: 'flex', gap: '15px', flexWrap: 'wrap' },
    btnPay: { backgroundColor: '#1D7373', color: '#F5F7F8', padding: '13px', borderRadius: '9px', border: 'none', fontWeight: 700, cursor: 'pointer', marginTop: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', fontSize: '16px', boxShadow: '0 2px 8px #E6EAEA', transition: 'background 0.2s' },
    secure: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', color: '#4a5568', fontSize: '13px', marginTop: '18px' }
  };

  return (
    <div style={s.wrapper}>
      <div style={s.card}>
        <div style={s.header}>
          <button onClick={() => navigate(-1)} style={{border:'none', background:'transparent', cursor:'pointer', color:'#1D7373', padding:0}}><ArrowLeft size={22}/></button>
          <h2 style={s.title}>Finalizar Suscripción</h2>
        </div>

        <div style={s.summary}>
          <div style={s.row}>
            <span style={{color:'#0A3A40'}}>{plan?.nombre || 'Plan'}</span>
            <span style={{color:'#0A3A40'}}>${plan?.precio || '0.00'}</span>
          </div>
          <div style={s.row}>
            <span style={{color:'#0A3A40'}}>Impuestos (0%)</span>
            <span style={{color:'#0A3A40'}}>$0.00</span>
          </div>
          <div style={s.total}>
            <span style={{color:'#107361'}}>Total a pagar</span>
            <span style={{color:'#107361'}}>${plan?.precio || '0.00'} / mes</span>
          </div>
        </div>

        <form onSubmit={handlePayment} style={s.form} autoComplete="off">
          <div style={s.inputGroup}>
            <label style={s.label}>Nombre en la tarjeta</label>
            <input style={s.input} type="text" placeholder="Como aparece en la tarjeta" required onFocus={e => e.target.style.borderColor = '#107361'} onBlur={e => e.target.style.borderColor = '#1D7373'} />
          </div>

          <div style={s.inputGroup}>
            <label style={s.label}>Número de tarjeta</label>
            <div style={{position:'relative'}}>
              <input style={{...s.input, width:'100%', paddingLeft:'40px'}} type="text" placeholder="0000 0000 0000 0000" required onFocus={e => e.target.style.borderColor = '#107361'} onBlur={e => e.target.style.borderColor = '#1D7373'} />
              <CreditCard size={18} style={{position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)', color:'#1D7373'}} />
            </div>
          </div>

          <div style={s.rowInputs}>
            <div style={{...s.inputGroup, minWidth: 120, flex: 1}}>
              <label style={s.label}>Fecha exp.</label>
              <input style={s.input} type="text" placeholder="MM/YY" required onFocus={e => e.target.style.borderColor = '#107361'} onBlur={e => e.target.style.borderColor = '#1D7373'} />
            </div>
            <div style={{...s.inputGroup, minWidth: 120, flex: 1}}>
              <label style={s.label}>CVC</label>
              <input style={s.input} type="text" placeholder="123" required onFocus={e => e.target.style.borderColor = '#107361'} onBlur={e => e.target.style.borderColor = '#1D7373'} />
            </div>
          </div>

          <button type="submit" style={s.btnPay}>
            <Lock size={16} /> Pagar y Activar
          </button>
        </form>

        <div style={s.secure}>
          <Lock size={12} /> Pagos encriptados y seguros
        </div>
      </div>
    </div>
  );
};

export default Payment;