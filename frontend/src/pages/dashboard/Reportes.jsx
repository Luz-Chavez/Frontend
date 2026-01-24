import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getDashboardData } from '../../api/reportes.api';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    PieChart, Pie, Cell, Legend 
} from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Filter } from 'lucide-react';

// ✅ COMPONENTE TOOLTIP PERSONALIZADO (Para arreglar el texto invisible)
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                padding: '12px',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
                <p style={{ margin: '0 0 5px', color: '#64748B', fontSize: '12px', fontWeight: 'bold' }}>{label}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <p style={{ margin: 0, color: '#10B981', fontSize: '14px', fontWeight: '600' }}>
                        Ingresos: {payload[0].value} Bs
                    </p>
                    <p style={{ margin: 0, color: '#EF4444', fontSize: '14px', fontWeight: '600' }}>
                        Egresos: {payload[1].value} Bs
                    </p>
                </div>
            </div>
        );
    }
    return null;
};

export default function Reportes() {
    const { user } = useAuth();
    const [periodo, setPeriodo] = useState('mes'); 
    const [data, setData] = useState({ ventas_totales: 0, gastos_totales: 0, ganancia_neta: 0, grafico: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.microempresa?.id_microempresa) {
            cargarDatos();
        }
    }, [user, periodo]);

    const cargarDatos = async () => {
        setLoading(true);
        try {
            const res = await getDashboardData(user.microempresa.id_microempresa, periodo);
            setData(res.data);
        } catch (error) {
            console.error("Error cargando reportes", error);
        } finally {
            setLoading(false);
        }
    };

    const pieData = [
        { name: 'Ganancia', value: Math.max(0, data.ganancia_neta) },
        { name: 'Gastos', value: data.gastos_totales },
    ];
    const COLORS = ['#10B981', '#EF4444'];

    return (
        <div style={containerStyle}>
            {/* Header */}
            <div style={headerContainerStyle}>
                <h2 style={titleStyle}>Reportes Financieros</h2>
                <div style={filterBarStyle}>
                    <div style={{display: 'flex', alignItems: 'center', gap: 8, color: '#64748B', fontWeight: 600, fontSize: 14}}>
                        <Filter size={18} /> Filtrar por:
                    </div>
                    <div style={{display: 'flex', gap: 5}}>
                        <button onClick={() => setPeriodo('mes')} style={periodo === 'mes' ? activeTabStyle : tabStyle}>Este Mes</button>
                        <button onClick={() => setPeriodo('trimestre')} style={periodo === 'trimestre' ? activeTabStyle : tabStyle}>Trimestre</button>
                        <button onClick={() => setPeriodo('anio')} style={periodo === 'anio' ? activeTabStyle : tabStyle}>Año</button>
                    </div>
                </div>
            </div>

            {/* KPI Cards */}
            <div style={gridKpiStyle}>
                <div style={kpiCardStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <div><p style={kpiLabelStyle}>Ingresos Totales</p><h3 style={kpiValueStyle}>{data.ventas_totales.toLocaleString()} Bs</h3></div>
                        <div style={{ ...iconBoxStyle, background: '#ECFDF5', color: '#10B981' }}><TrendingUp size={24} /></div>
                    </div>
                </div>
                <div style={kpiCardStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <div><p style={kpiLabelStyle}>Gastos Operativos</p><h3 style={kpiValueStyle}>{data.gastos_totales.toLocaleString()} Bs</h3></div>
                        <div style={{ ...iconBoxStyle, background: '#FEF2F2', color: '#EF4444' }}><TrendingDown size={24} /></div>
                    </div>
                </div>
                <div style={kpiCardStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <div><p style={kpiLabelStyle}>Ganancia Neta</p><h3 style={{...kpiValueStyle, color: '#1D7373'}}>{data.ganancia_neta.toLocaleString()} Bs</h3></div>
                        <div style={{ ...iconBoxStyle, background: '#F0FDFA', color: '#1D7373' }}><DollarSign size={24} /></div>
                    </div>
                </div>
            </div>

            {/* Gráficos */}
            <div style={gridChartsStyle}>
                <div style={chartCardStyle}>
                    <h3 style={chartTitleStyle}>Balance Ingresos vs Egresos</h3>
                    <div style={{ height: 350, width: '100%', marginTop: 20 }}>
                        <ResponsiveContainer>
                            <AreaChart data={data.grafico} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorCompras" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value/1000}k`} />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                
                                {/* ✅ USAMOS EL COMPONENTE PERSONALIZADO */}
                                <Tooltip content={<CustomTooltip />} />
                                
                                <Area type="monotone" dataKey="ventas" stroke="#10B981" fillOpacity={1} fill="url(#colorVentas)" name="Ingresos" strokeWidth={3} />
                                <Area type="monotone" dataKey="compras" stroke="#EF4444" fillOpacity={1} fill="url(#colorCompras)" name="Gastos" strokeWidth={3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div style={chartCardStyle}>
                    <h3 style={chartTitleStyle}>Distribución</h3>
                    <div style={{ height: 300, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                    {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36}/>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Estilos
const containerStyle = { padding: "30px 20px", maxWidth: 1200, margin: "0 auto" };
const headerContainerStyle = { marginBottom: 30, display: 'flex', flexDirection: 'column', gap: 20 };
const titleStyle = { fontSize: "28px", fontWeight: 800, color: "#1D7373", margin: 0 };
const filterBarStyle = { display: "flex", justifyContent: 'space-between', alignItems: "center", background: "#fff", padding: "10px 15px", borderRadius: "10px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E2E8F0" };
const tabStyle = { background: "transparent", color: "#64748B", border: "1px solid transparent", borderRadius: "6px", fontWeight: 600, fontSize: "14px", padding: "8px 16px", cursor: "pointer", transition: "all 0.2s" };
const activeTabStyle = { ...tabStyle, background: "#E6F4EA", color: "#1D7373", border: "1px solid #1D7373" };
const gridKpiStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: 30 };
const kpiCardStyle = { background: '#fff', padding: '24px', borderRadius: '12px', boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)", border: '1px solid #E2E8F0' };
const kpiLabelStyle = { color: '#64748B', fontSize: '14px', fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase' };
const kpiValueStyle = { color: '#1F2937', fontSize: '32px', fontWeight: 800, margin: 0 };
const iconBoxStyle = { width: 48, height: 48, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' };
const gridChartsStyle = { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, alignItems: 'start' };
const chartCardStyle = { background: '#fff', padding: '25px', borderRadius: '12px', boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)", border: '1px solid #E2E8F0' };
const chartTitleStyle = { margin: 0, color: '#1F2937', fontSize: 18, fontWeight: 700 };