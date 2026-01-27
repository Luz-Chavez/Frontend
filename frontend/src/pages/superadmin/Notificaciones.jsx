import { useEffect, useState } from "react";
import { Bell, Check, Trash2, Mail } from "lucide-react";
import { getNotificaciones, markNotificacionLeida, deleteNotificacion } from "../../api/notificaciones.api";
import { useAuth } from "../../context/AuthContext";

const palette = {
    primary: '#0A3A40',
    secondary: '#1D7373',
    white: '#FFFFFF',
    lightBg: '#F8FAFC',
    gray: '#64748B',
    border: '#E2E8F0',
    accent: '#10B981',
    readBg: '#F1F5F9',
    unreadBg: '#FFFFFF'
};

const s = {
    container: { maxWidth: '800px', margin: '0 auto', padding: '20px' },
    header: { marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    title: { fontSize: '24px', fontWeight: 'bold', color: palette.primary, display: 'flex', alignItems: 'center', gap: '10px' },
    list: { display: 'flex', flexDirection: 'column', gap: '10px' },
    item: {
        padding: '16px',
        borderRadius: '12px',
        border: `1px solid ${palette.border}`,
        display: 'flex',
        gap: '16px',
        alignItems: 'flex-start',
        transition: 'all 0.2s',
    },
    iconBox: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        backgroundColor: palette.lightBg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: palette.secondary,
        flexShrink: 0
    },
    content: { flex: 1 },
    subject: { fontWeight: '600', color: palette.primary, fontSize: '15px', marginBottom: '4px' },
    message: { color: palette.gray, fontSize: '14px', lineHeight: '1.4' },
    date: { fontSize: '12px', color: '#94A3B8', marginTop: '8px' },
    actions: { display: 'flex', gap: '8px' },
    btnIcon: {
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        color: palette.gray,
        padding: '4px',
        borderRadius: '4px',
        transition: 'color 0.2s, background 0.2s'
    }
};

const Notificaciones = () => {
    const { user } = useAuth();
    const [notificaciones, setNotificaciones] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNotificaciones = async () => {
        setLoading(true);
        try {
            // Fetch general notifications or user specific
            // Backend: getNotificaciones() usually returns list for current user or general
            const res = await getNotificaciones();
            setNotificaciones(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotificaciones();
    }, []);

    const handleMarkRead = async (id) => {
        try {
            await markNotificacionLeida(id);
            setNotificaciones(prev => prev.map(n => n.id_notificacion === id ? { ...n, leida: true } : n));
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteNotificacion(id);
            setNotificaciones(prev => prev.filter(n => n.id_notificacion !== id));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div style={s.container}>
            <div style={s.header}>
                <h1 style={s.title}>
                    <Bell size={28} /> Notificaciones
                </h1>
                {/* <button style={{...s.btnIcon, fontSize: '14px', fontWeight: 600, color: palette.secondary}}>
            Marcar todas como leídas
        </button> */}
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: 20, color: palette.gray }}>Cargando...</div>
            ) : notificaciones.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 40, color: palette.gray, background: palette.white, borderRadius: 12, border: `1px solid ${palette.border}` }}>
                    <Mail size={40} style={{ marginBottom: 10, opacity: 0.5 }} />
                    <p>No tienes notificaciones nuevas</p>
                </div>
            ) : (
                <div style={s.list}>
                    {notificaciones.map(n => (
                        <div key={n.id_notificacion} style={{ ...s.item, backgroundColor: n.leida ? palette.readBg : palette.unreadBg }}>
                            <div style={{ ...s.iconBox, backgroundColor: n.leida ? '#E2E8F0' : '#E0F2FE', color: n.leida ? '#64748B' : '#0284C7' }}>
                                <Bell size={20} />
                            </div>
                            <div style={s.content}>
                                <div style={s.subject}>{n.titulo || 'Notificación del Sistema'}</div>
                                <div style={s.message}>{n.mensaje}</div>
                                <div style={s.date}>{new Date(n.fecha_creacion).toLocaleString()}</div>
                            </div>
                            <div style={s.actions}>
                                {!n.leida && (
                                    <button
                                        style={{ ...s.btnIcon, color: palette.accent }}
                                        title="Marcar como leída"
                                        onClick={() => handleMarkRead(n.id_notificacion)}
                                    >
                                        <Check size={18} />
                                    </button>
                                )}
                                <button
                                    style={{ ...s.btnIcon, color: palette.red }}
                                    title="Eliminar"
                                    onClick={() => handleDelete(n.id_notificacion)}
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Notificaciones;
