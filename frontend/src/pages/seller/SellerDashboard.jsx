import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { getPlanMicroempresa, getSuscripcionById } from "../../api/microempresas.api";
import { FaBuilding, FaMoneyBillWave } from "react-icons/fa";

const palette = {
  darkBg: '#042326', accent1: '#0A3A40', accent2: '#0F5959', accent3: '#1D7373', accent4: '#107361', white: '#F5F7F8', gray: '#E6EAEA', green: '#1D7373', red: '#EF4444',
};
const s = {
  container: { maxWidth: '1200px', margin: '0 auto', padding: '24px' },
  header: { marginBottom: '30px' },
  title: { fontSize: '28px', color: palette.darkBg, fontWeight: 'bold', marginBottom: '5px' },
  subtitle: { color: palette.accent2, fontSize: '16px' },
  card: { backgroundColor: palette.white, borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: `1px solid ${palette.gray}`, padding: '20px', marginBottom: '24px' },
  tableTitle: { fontSize: '16px', fontWeight: '500', color: palette.accent2, marginBottom: '20px' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' },
  th: { padding: '12px 24px', borderBottom: `1px solid ${palette.gray}`, color: palette.accent2, fontSize: '13px', fontWeight: '600', backgroundColor: 'transparent' },
  td: { padding: '16px 24px', borderBottom: `1px solid ${palette.white}`, color: palette.darkBg, fontSize: '14px', verticalAlign: 'middle' },
  tdName: { fontSize: '16.5px', fontWeight: 600, color: palette.accent4, letterSpacing: '0.1px' },
  badgeActive: { backgroundColor: palette.green, color: 'white', padding: '4px 12px', borderRadius: '99px', fontSize: '12px', fontWeight: '600' },
  badgeInactive: { backgroundColor: palette.red, color: 'white', padding: '4px 12px', borderRadius: '99px', fontSize: '12px', fontWeight: '600' },
};

const SellerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [plan, setPlan] = useState(null);
  const [suscripcion, setSuscripcion] = useState(null);
  // Eliminado loading, ya no se usa

  useEffect(() => {
    const fetchAll = async () => {
      if (user?.microempresa && user?.id_suscripcion) {
        try {
          const [planRes, susRes] = await Promise.all([
            getPlanMicroempresa(user.microempresa.id_microempresa),
            getSuscripcionById(user.id_suscripcion),
          ]);
          setPlan(planRes.data);
          setSuscripcion(susRes.data);
        } catch {
          // Puedes mostrar un error si lo deseas, pero para evitar el warning, dejamos un comentario.
        }
      }
    };
    fetchAll();
    // Log visual para depuración
    console.log('user:', user);
    console.log('microempresa:', user.microempresa);
  }, [user]);

  return (
    <div style={s.container}>
      <div style={s.header}>
        <h1 style={s.title}>Panel de Vendedor</h1>
        <p style={s.subtitle}>Información de tu microempresa</p>
      </div>
      {/* Microempresa info */}
      {!user.microempresa && (
        <div style={{color: 'red', marginBottom: 16}}>
          <b>Debug:</b> No se encontró información de la microempresa.<br/>
          <pre>{JSON.stringify(user, null, 2)}</pre>
        </div>
      )}
      {user.microempresa && (
        <div style={{
          background: '#fff',
          borderRadius: 16,
          border: '1.5px solid #E6EAEA',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          padding: '32px 36px',
          marginBottom: 32,
          display: 'flex',
          flexDirection: 'column',
          gap: 18
        }}>
          <div style={{ display: 'flex', alignItems: 'center', fontSize: 20, color: '#0A3A40', fontWeight: 600, marginBottom: 18 }}>
            <FaBuilding size={24} style={{ marginRight: 10 }} /> Información de la microempresa
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '32px 60px',
            alignItems: 'start',
            fontSize: 16
          }}>
            <div>
              <div style={{ color: '#1D7373', fontWeight: 500, marginBottom: 2 }}>Nombre</div>
              <div style={{ color: '#0A3A40', fontWeight: 700, fontSize: 26 }}>{user.microempresa.nombre || '-'}</div>
            </div>
            <div>
              <div style={{ color: '#1D7373', fontWeight: 500, marginBottom: 2 }}>NIT</div>
              <div style={{ color: '#0A3A40', fontWeight: 700, fontSize: 26 }}>{user.microempresa.nit || '-'}</div>
            </div>
            <div>
              <div style={{ color: '#1D7373', fontWeight: 500, marginBottom: 2 }}>Dirección</div>
              <div style={{ color: '#0A3A40', fontWeight: 700, fontSize: 26 }}>{user.microempresa.direccion || '-'}</div>
            </div>
            <div>
              <div style={{ color: '#1D7373', fontWeight: 500, marginBottom: 2 }}>Teléfono</div>
              <div style={{ color: '#0A3A40', fontWeight: 700, fontSize: 26 }}>{user.microempresa.telefono || '-'}</div>
            </div>
            <div>
              <div style={{ color: '#1D7373', fontWeight: 500, marginBottom: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
                Moneda
              </div>
              <div style={{ color: '#0A3A40', fontWeight: 700, fontSize: 26, display: 'flex', alignItems: 'center', gap: 14 }}>
                <FaMoneyBillWave style={{ color: '#22c55e', fontSize: '1.3em' }} />
                {user.microempresa.moneda || '-'}
              </div>
            </div>
            <div>
              <div style={{ color: '#1D7373', fontWeight: 500, marginBottom: 2 }}>Estado</div>
              <span style={{
                display: 'inline-block',
                padding: '4px 14px',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 700,
                background: user.microempresa.estado ? '#1D7373' : '#F87171',
                color: '#fff',
                marginTop: 2
              }}>{user.microempresa.estado ? 'Activo' : 'Inactivo'}</span>
            </div>
          </div>
        </div>
      )}
      {/* Suscripción info */}
      {suscripcion && (
        <div style={s.card}>
          <h2 style={s.tableTitle}>Suscripción</h2>
          <div style={{color: palette.accent1}}><b>ID Suscripción:</b> {suscripcion.id_suscripcion}</div>
          <div style={{color: palette.accent1}}><b>Fecha inicio:</b> {new Date(suscripcion.fecha_inicio).toLocaleString()}</div>
          <div style={{color: palette.accent1}}><b>Fecha fin:</b> {new Date(suscripcion.fecha_fin).toLocaleString()}</div>
          <div style={{color: palette.accent1}}><b>Estado:</b> {suscripcion.estado ? 'Activa' : 'Inactiva'}</div>
        </div>
      )}
      {/* Plan info */}
      {plan && (
        <div style={s.card}>
          <h2 style={s.tableTitle}>Suscripción actual</h2>
          <div style={{color: palette.accent1}}><b>Nombre:</b> {plan.nombre}</div>
          <div style={{color: palette.accent1}}><b>Descripción:</b> {plan.descripcion}</div>
          <div style={{color: palette.accent1}}><b>Precio:</b> {plan.precio}</div>
          <div style={{color: palette.accent1}}><b>Límite productos:</b> {plan.limite_productos}</div>
          <div style={{color: palette.accent1}}><b>Límite admins:</b> {plan.limite_admins}</div>
          <div style={{color: palette.accent1}}><b>Límite vendedores:</b> {plan.limite_vendedores}</div>
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;
