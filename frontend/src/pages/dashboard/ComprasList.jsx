import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext'; // ✅ Importamos Auth
import { getCompras, getCompraDetalles, descargarCompraPDF } from '../../api/compras.api';
import { getProductosActivosPorMicroempresa } from '../../api/productos.api';
import CompraDetalles from '../../components/CompraDetalles';
import axios from '../../api/axios';
import { Link } from 'react-router-dom';
import { ShoppingBag, Calendar, User, Plus } from 'lucide-react';

export default function ComprasList() {
    const { user } = useAuth();
    const [compras, setCompras] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState({ open: false, detalles: [], productos: {} });
    const [loadingDetalles, setLoadingDetalles] = useState(false);

    useEffect(() => {
        if (user?.microempresa?.id_microempresa) {
            cargarHistorial(user.microempresa.id_microempresa);
        }
    }, [user]);

    const cargarHistorial = async (idMicro) => {
        setLoading(true);
        try {
            const res = await getCompras(idMicro);
            setCompras(res.data);
        } catch (err) {
            console.error("Error cargando historial de compras", err);
        } finally {
            setLoading(false);
        }
    };

    // Cargar detalles y nombres de productos
    const verDetalles = async (id_compra) => {
        setLoadingDetalles(true);
        try {
            // 1. Obtener detalles de la compra usando la API correcta
            const resDetalles = await getCompraDetalles(id_compra);
            // Soportar respuesta con detalles anidados o como array directo
            let detalles = [];
            if (Array.isArray(resDetalles.data)) {
                detalles = resDetalles.data;
            } else if (Array.isArray(resDetalles.data?.detalles)) {
                detalles = resDetalles.data.detalles;
            } else if (resDetalles.data?.data && Array.isArray(resDetalles.data.data)) {
                detalles = resDetalles.data.data;
            }
            // 2. Obtener productos activos de la microempresa
            let productos = {};
            if (user?.microempresa?.id_microempresa) {
                const resProds = await getProductosActivosPorMicroempresa(user.microempresa.id_microempresa);
                productos = {};
                (resProds.data || []).forEach(p => { productos[p.id_producto] = p; });
            }
            setModal({ open: true, detalles, productos });
        } catch (e) {
            alert('No se pudieron cargar los detalles de la compra');
        } finally {
            setLoadingDetalles(false);
        }
    };

    const cerrarModal = () => setModal({ open: false, detalles: [], productos: {} });

    // Descargar PDF de la compra
    const handleDescargarPDF = async (id_compra) => {
        try {
            const res = await descargarCompraPDF(id_compra);
            const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `compra_${id_compra}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (e) {
            alert('No se pudo descargar el PDF de la compra.');
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
                            <th style={thStyle}></th>
                            <th style={thStyle}>PDF</th>
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
                                <td style={tdStyle}>
                                    <button onClick={() => verDetalles(c.id_compra)} style={{
                                        background: '#F3F4F6', color: '#1D7373', border: '1px solid #1D7373', borderRadius: 6,
                                        padding: '6px 14px', fontWeight: 600, cursor: 'pointer', fontSize: 14
                                    }}>
                                        Ver Detalles
                                    </button>
                                </td>
                                <td style={tdStyle}>
                                    <button onClick={() => handleDescargarPDF(c.id_compra)} style={{
                                        background: '#10B981', color: '#fff', border: 'none', borderRadius: 6,
                                        padding: '6px 14px', fontWeight: 600, cursor: 'pointer', fontSize: 14
                                    }}>
                                        Descargar PDF
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Modal de detalles */}
            {modal.open && (
                <div style={modalOverlayStyle}>
                    <div style={modalBoxStyle}>
                        <button onClick={cerrarModal} style={{ position: 'absolute', top: 12, right: 16, background: 'none', border: 'none', fontSize: 22, color: '#1D7373', cursor: 'pointer' }}>×</button>
                        {loadingDetalles ? (
                            <div style={{ textAlign: 'center', color: '#1D7373', padding: 30 }}>Cargando detalles...</div>
                        ) : (
                            <CompraDetalles detalles={modal.detalles} productos={modal.productos} />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

// Estilos Reutilizados
const thStyle = { padding: "12px 10px", textAlign: "left", color: "#042326", fontWeight: 700, fontSize: 16, borderBottom: "2px solid #1D7373" };
const tdStyle = { padding: "12px 10px", fontSize: 15, color: "#0A3A40" };

const modalOverlayStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.25)', zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center'
};
const modalBoxStyle = {
    background: '#fff', borderRadius: 14, boxShadow: '0 8px 32px #0003', padding: 32, minWidth: 420, maxWidth: 600, position: 'relative'
};