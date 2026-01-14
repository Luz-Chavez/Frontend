import { Building2, Save, Upload, MapPin, Phone, Mail } from "lucide-react";

const CompanyProfile = () => {
  const s = {
    container: { maxWidth: '800px', margin: '0 auto' },
    header: { marginBottom: '30px' },
    title: { fontSize: '28px', color: '#111827', fontWeight: 'bold' },
    
    card: { backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '30px', border: '1px solid #E5E7EB' },
    
    // Sección del Logo
    logoSection: { display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px', paddingBottom: '30px', borderBottom: '1px solid #F3F4F6' },
    logoBox: { width: '80px', height: '80px', backgroundColor: '#F3F4F6', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF' },
    uploadBtn: { padding: '8px 16px', border: '1px solid #D1D5DB', borderRadius: '8px', backgroundColor: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: '500', display: 'flex', gap: '8px', alignItems: 'center' },
    
    formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '15px' },
    label: { fontSize: '13px', fontWeight: '500', color: '#374151' },
    input: { padding: '10px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '14px', width: '100%' },
    
    btnSave: { backgroundColor: '#065F46', color: 'white', padding: '12px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px' }
  };

  return (
    <div style={s.container}>
      <div style={s.header}>
        <h1 style={s.title}>Perfil de la Microempresa</h1>
      </div>

      <div style={s.card}>
        <div style={s.logoSection}>
           <div style={s.logoBox}><Building2 size={32}/></div>
           <div>
             <h3 style={{marginBottom:'5px', fontSize:'16px'}}>Logotipo</h3>
             <button style={s.uploadBtn}><Upload size={14}/> Subir imagen</button>
           </div>
        </div>

        <form>
          <div style={s.formGrid}>
            <div style={s.inputGroup}>
                <label style={s.label}>Nombre de la Empresa</label>
                <input style={s.input} type="text" defaultValue="Tienda La Esquina" />
            </div>
            <div style={s.inputGroup}>
                <label style={s.label}>NIT / Razón Social</label>
                <input style={s.input} type="text" defaultValue="123456789-0" />
            </div>
          </div>

          <div style={s.inputGroup}>
              <label style={s.label}>Dirección</label>
              <div style={{position:'relative'}}>
                 <input style={{...s.input, paddingLeft:'35px'}} type="text" defaultValue="Av. Principal #123, La Paz" />
                 <MapPin size={16} style={{position:'absolute', left:'10px', top:'12px', color:'#9CA3AF'}}/>
              </div>
          </div>

          <div style={s.formGrid}>
            <div style={s.inputGroup}>
                <label style={s.label}>Teléfono</label>
                <div style={{position:'relative'}}>
                   <input style={{...s.input, paddingLeft:'35px'}} type="text" defaultValue="+591 70000000" />
                   <Phone size={16} style={{position:'absolute', left:'10px', top:'12px', color:'#9CA3AF'}}/>
                </div>
            </div>
            <div style={s.inputGroup}>
                <label style={s.label}>Correo de contacto</label>
                <div style={{position:'relative'}}>
                   <input style={{...s.input, paddingLeft:'35px'}} type="email" defaultValue="contacto@laesquina.com" />
                   <Mail size={16} style={{position:'absolute', left:'10px', top:'12px', color:'#9CA3AF'}}/>
                </div>
            </div>
          </div>

          <div style={{textAlign:'right'}}>
            <button type="button" style={s.btnSave}>
               <Save size={18} /> Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanyProfile;