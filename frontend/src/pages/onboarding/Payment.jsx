import { CreditCard, Lock, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Payment = () => {
  const navigate = useNavigate();

  const handlePayment = (e) => {
    e.preventDefault();
    // Simulamos proceso de pago exitoso
    Swal.fire({
      title: '¡Pago Exitoso!',
      text: 'Tu microempresa ha sido activada.',
      icon: 'success',
      confirmButtonColor: '#059669'
    }).then(() => {
        // En una app real, aquí recargarías el usuario del contexto
        // Para la demo, lo mandamos al dashboard (suponiendo que el backend ya actualizó el estado)
        navigate("/dashboard"); 
    });
  };

  const s = {
    wrapper: { display: 'flex', justifyContent: 'center', padding: '40px 20px' },
    card: { backgroundColor: 'white', maxWidth: '500px', width: '100%', borderRadius: '16px', padding: '30px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' },
    header: { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' },
    title: { fontSize: '20px', fontWeight: 'bold' },
    
    summary: { backgroundColor: '#F3F4F6', padding: '15px', borderRadius: '8px', marginBottom: '25px' },
    row: { display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '14px' },
    total: { display: 'flex', justifyContent: 'space-between', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #D1D5DB', fontWeight: 'bold', fontSize: '16px' },
    
    form: { display: 'flex', flexDirection: 'column', gap: '15px' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '5px' },
    label: { fontSize: '13px', fontWeight: '500', color: '#374151' },
    input: { padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '14px' },
    rowInputs: { display: 'flex', gap: '15px' },
    
    btnPay: { backgroundColor: '#059669', color: 'white', padding: '12px', borderRadius: '8px', border: 'none', fontWeight: '600', cursor: 'pointer', marginTop: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' },
    secure: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', color: '#6B7280', fontSize: '12px', marginTop: '15px' }
  };

  return (
    <div style={s.wrapper}>
      <div style={s.card}>
        <div style={s.header}>
            <button onClick={() => navigate(-1)} style={{border:'none', background:'transparent', cursor:'pointer'}}><ArrowLeft /></button>
            <h2 style={s.title}>Finalizar Suscripción</h2>
        </div>

        <div style={s.summary}>
            <div style={s.row}><span>Plan Profesional</span><span>$59.00</span></div>
            <div style={s.row}><span>Impuestos (0%)</span><span>$0.00</span></div>
            <div style={s.total}><span>Total a pagar</span><span>$59.00 / mes</span></div>
        </div>

        <form onSubmit={handlePayment} style={s.form}>
            <div style={s.inputGroup}>
                <label style={s.label}>Nombre en la tarjeta</label>
                <input style={s.input} type="text" placeholder="Como aparece en la tarjeta" required />
            </div>

            <div style={s.inputGroup}>
                <label style={s.label}>Número de tarjeta</label>
                <div style={{position:'relative'}}>
                    <input style={{...s.input, width:'95%', paddingLeft:'40px'}} type="text" placeholder="0000 0000 0000 0000" required />
                    <CreditCard size={18} style={{position:'absolute', left:'12px', top:'12px', color:'#9CA3AF'}} />
                </div>
            </div>

            <div style={s.rowInputs}>
                <div style={s.inputGroup}>
                    <label style={s.label}>Fecha exp.</label>
                    <input style={s.input} type="text" placeholder="MM/YY" required />
                </div>
                <div style={s.inputGroup}>
                    <label style={s.label}>CVC</label>
                    <input style={s.input} type="text" placeholder="123" required />
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