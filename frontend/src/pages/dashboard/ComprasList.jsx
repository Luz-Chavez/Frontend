import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext'; // ✅ Importamos Auth
import { getCompras } from '../../api/compras.api';
import { Link } from 'react-router-dom';
import { ShoppingBag, Calendar, User, Plus } from 'lucide-react';

export default function ComprasList() {
    const { user } = useAuth(); // ✅ Obtenemos el usuario
    const [compras, setCompras] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Solo cargamos si existe la microempresa en el usuario
        if (user?.microempresa?.id_microempresa) {
            cargarHistorial(user.microempresa.id_microempresa);
        }
    }, [user]);

    const cargarHistorial = async (idMicro) => {
        setLoading(true);
        try {
            // Pasamos el ID al backend
            const res = await getCompras(idMicro);
            setCompras(res.data);
        } catch (err) {
            console.error("Error cargando historial de compras", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 1000, margin: "40px auto", background: "#fff", borderRadius: 16, boxShadow: "0 4px 16px #0002", padding: 32 }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h2 style={{ color: "#1D7373", fontWeight: 700, fontSize: '24px', display: 'flex', alignItems: 'center', gap: 10, margin: 0 }}>
                    <ShoppingBag /> Historial de Compras
                </h2>
                <Link to="/dashboard/compras/nueva" style={{ textDecoration: 'none' }}>
                    <button style={{ 
                        background: "#1D7373", color: "#F5F7F8", border: "none", borderRadius: 8, 
                        padding: "10px 16px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 
                    }}>
                        <Plus size={18} /> Registrar Compra
                    </button>
                </Link>
            </div>

            {loading ? (
                <div style={{ textAlign: "center", padding: 20, color: '#1D7373' }}>Cargando historial...</div>
            ) : compras.length === 0 ? (
                <div style={{ textAlign: "center", color: "#4a5568", padding: 40, background: '#F5F7F8', borderRadius: 8 }}>
                    <ShoppingBag size={48} style={{ color: '#cbd5e0', marginBottom: 10 }} />
                    <p>No se han registrado compras aún.</p>
                </div>
            ) : (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ background: "#E6EAEA" }}>
                            <th style={thStyle}>ID</th>
                            <th style={thStyle}>Fecha</th>
                            <th style={thStyle}>Proveedor</th>
                            <th style={thStyle}>Total</th>
                            <th style={thStyle}>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {compras.map(c => (
                            <tr key={c.id_compra || c.id} style={{ borderBottom: "1px solid #E6EAEA" }}>
                                <td style={tdStyle}>#{c.id_compra}</td>
                                <td style={tdStyle}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <Calendar size={14} color="#666" /> 
                                        {new Date(c.fecha).toLocaleDateString()}
                                    </div>
                                </td>
                                <td style={tdStyle}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <User size={14} color="#666" /> 
                                        {c.proveedor?.nombre}
                                    </div>
                                </td>
                                <td style={{ ...tdStyle, fontWeight: 'bold' }}>{c.total} Bs</td>
                                <td style={tdStyle}>
                                    <span style={{ 
                                        background: c.estado === 'CONFIRMADO' ? '#E6F4EA' : '#FFF4E5', 
                                        color: c.estado === 'CONFIRMADO' ? '#10B981' : '#F59E0B',
                                        padding: '4px 10px', borderRadius: 12, fontSize: 12, fontWeight: 700, 
                                        border: `1px solid ${c.estado === 'CONFIRMADO' ? '#10B981' : '#F59E0B'}`
                                    }}>
                                        {c.estado}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

// Estilos Reutilizados
const thStyle = { padding: "12px 10px", textAlign: "left", color: "#042326", fontWeight: 700, fontSize: 16, borderBottom: "2px solid #1D7373" };
const tdStyle = { padding: "12px 10px", fontSize: 15, color: "#0A3A40" };