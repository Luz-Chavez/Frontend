/**
 * GestionGlobal.jsx - Vista unificada para SuperAdmin
 * Gestión de: Microempresas, Admins, Vendedores, Clientes, Productos, Categorías, Proveedores
 */
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
    Building2, Users, UserCheck, Package,
    Tag, Truck, Eye, Power, Search, ChevronLeft, ChevronRight,
    Trash2
} from "lucide-react";

// APIs
import {
    getMicroempresas,
    activarMicroempresa, desactivarMicroempresa
} from "../../api/microempresas.api";
import { getAdmins, deleteAdmin } from "../../api/superadmin.api";
import { getVendedores, bajaLogicaVendedor } from "../../api/superadmin.api";
import { getClientesGlobal } from "../../api/superadmin.api";
import { getProductosGlobal } from "../../api/superadmin.api";
import { getCategoriasGlobal } from "../../api/superadmin.api";
import { getProveedoresGlobal } from "../../api/superadmin.api";

// Paleta de colores para fondo claro
const palette = {
    darkBg: '#0A3A40',
    primary: '#0A3A40',
    secondary: '#1D7373',
    accent: '#1D7373',
    white: '#FFFFFF',
    lightBg: '#F8FAFC',
    gray: '#64748B',
    border: '#E2E8F0',
    green: '#10B981',
    red: '#EF4444',
};

// Estilos
const s = {
    container: {
        maxWidth: '1400px',
        margin: '0 auto',
    },
    header: {
        marginBottom: '24px'
    },
    title: {
        fontSize: '28px',
        color: palette.darkBg,
        fontWeight: '700',
        marginBottom: '6px'
    },
    subtitle: {
        color: palette.gray,
        fontSize: '15px'
    },
    tabsContainer: {
        display: 'flex',
        gap: '6px',
        marginBottom: '24px',
        background: palette.white,
        padding: '6px',
        borderRadius: '12px',
        border: `1px solid ${palette.border}`,
        overflowX: 'auto',
    },
    tab: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 16px',
        borderRadius: '8px',
        border: 'none',
        background: 'transparent',
        color: palette.gray,
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500',
        transition: 'all 0.2s ease',
        whiteSpace: 'nowrap',
    },
    tabActive: {
        background: palette.primary,
        color: palette.white,
    },
    toolbar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '16px',
    },
    searchBox: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        background: palette.white,
        padding: '12px 18px',
        borderRadius: '10px',
        border: `1px solid ${palette.border}`,
        minWidth: '300px',
    },
    searchInput: {
        background: 'transparent',
        border: 'none',
        outline: 'none',
        color: palette.darkBg,
        fontSize: '14px',
        width: '100%',
    },
    filterSelect: {
        padding: '12px 18px',
        borderRadius: '10px',
        border: `1px solid ${palette.border}`,
        background: palette.white,
        color: palette.darkBg,
        fontSize: '14px',
        cursor: 'pointer',
    },
    card: {
        background: palette.white,
        borderRadius: '12px',
        border: `1px solid ${palette.border}`,
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
    },
    th: {
        padding: '14px 20px',
        textAlign: 'left',
        background: '#F8FAFC',
        color: palette.gray,
        fontSize: '12px',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        borderBottom: `1px solid ${palette.border}`,
    },
    td: {
        padding: '14px 20px',
        borderBottom: `1px solid ${palette.border}`,
        color: palette.darkBg,
        fontSize: '14px',
    },
    badge: {
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '600',
    },
    badgeActive: {
        background: 'rgba(16, 185, 129, 0.1)',
        color: palette.green,
    },
    badgeInactive: {
        background: 'rgba(239, 68, 68, 0.1)',
        color: palette.red,
    },
    actions: {
        display: 'flex',
        gap: '6px',
    },
    btnAction: {
        padding: '8px',
        borderRadius: '6px',
        border: `1px solid ${palette.border}`,
        background: palette.white,
        cursor: 'pointer',
        color: palette.gray,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s',
    },
    btnDanger: {
        borderColor: 'rgba(239, 68, 68, 0.3)',
        color: palette.red,
    },
    btnSuccess: {
        borderColor: 'rgba(16, 185, 129, 0.3)',
        color: palette.green,
    },
    pagination: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '16px',
        padding: '20px',
        color: palette.gray,
    },
    paginationBtn: {
        padding: '8px 14px',
        borderRadius: '8px',
        border: `1px solid ${palette.border}`,
        background: palette.white,
        color: palette.darkBg,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '13px',
    },
    emptyState: {
        padding: '60px 20px',
        textAlign: 'center',
        color: palette.gray,
    },
    loading: {
        padding: '60px 20px',
        textAlign: 'center',
        color: palette.secondary,
    },
    statsBar: {
        display: 'flex',
        gap: '16px',
        marginBottom: '20px',
    },
    statCard: {
        background: palette.white,
        padding: '16px 24px',
        borderRadius: '10px',
        border: `1px solid ${palette.border}`,
        flex: 1,
    },
    statLabel: {
        fontSize: '12px',
        color: palette.gray,
        marginBottom: '4px',
    },
    statValue: {
        fontSize: '24px',
        fontWeight: '700',
        color: palette.darkBg,
    },
};

// Configuración de tabs
const TABS = [
    { id: 'empresas', label: 'Microempresas', icon: Building2 },
    { id: 'admins', label: 'Admins', icon: UserCheck },
    { id: 'vendedores', label: 'Vendedores', icon: Users },
    { id: 'clientes', label: 'Clientes', icon: Users },
    { id: 'productos', label: 'Productos', icon: Package },
    { id: 'categorias', label: 'Categorías', icon: Tag },
    { id: 'proveedores', label: 'Proveedores', icon: Truck },
];

const ITEMS_PER_PAGE = 10;

const GestionGlobal = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'empresas');
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [empresaFilter, setEmpresaFilter] = useState('');
    const [empresas, setEmpresas] = useState([]);
    const [page, setPage] = useState(1);

    // Sincronizar tab con URL
    useEffect(() => {
        const tabFromUrl = searchParams.get('tab');
        if (tabFromUrl && TABS.find(t => t.id === tabFromUrl)) {
            setActiveTab(tabFromUrl);
        }
    }, [searchParams]);

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
        setSearchParams({ tab: tabId });
    };

    // Cargar lista de empresas para filtros
    useEffect(() => {
        getMicroempresas()
            .then(res => setEmpresas(res.data || []))
            .catch(() => setEmpresas([]));
    }, []);

    // Cargar datos según tab activo
    useEffect(() => {
        setLoading(true);
        setPage(1);
        setSearch('');

        const loadData = async () => {
            try {
                let result = [];
                switch (activeTab) {
                    case 'empresas':
                        const res = await getMicroempresas();
                        result = res.data || [];
                        break;
                    case 'admins':
                        const adminsRes = await getAdmins();
                        result = adminsRes.data || [];
                        break;
                    case 'vendedores':
                        const vendRes = await getVendedores();
                        result = vendRes.data || [];
                        break;
                    case 'clientes':
                        const cliRes = await getClientesGlobal();
                        result = cliRes.data || [];
                        break;
                    case 'productos':
                        const prodRes = await getProductosGlobal();
                        result = prodRes.data || [];
                        break;
                    case 'categorias':
                        const catRes = await getCategoriasGlobal();
                        result = catRes.data || [];
                        break;
                    case 'proveedores':
                        if (empresaFilter) {
                            const provRes = await getProveedoresGlobal(empresaFilter);
                            result = provRes.data || [];
                        } else {
                            result = [];
                        }
                        break;
                    default:
                        result = [];
                }
                setData(result);
                setFilteredData(result);
            } catch (error) {
                console.error('Error cargando datos:', error);
                setData([]);
                setFilteredData([]);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [activeTab, empresaFilter]);

    // Filtrar por búsqueda
    useEffect(() => {
        if (!search.trim()) {
            setFilteredData(data);
            return;
        }

        const searchLower = search.toLowerCase();
        const filtered = data.filter(item => {
            const nombre = item.nombre?.toLowerCase() || '';
            const email = item.email?.toLowerCase() || '';
            const nit = item.nit?.toLowerCase() || '';
            return nombre.includes(searchLower) || email.includes(searchLower) || nit.includes(searchLower);
        });
        setFilteredData(filtered);
        setPage(1);
    }, [search, data]);

    // Paginación
    const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
    const paginatedData = filteredData.slice(
        (page - 1) * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE
    );

    // Toggle estado de microempresa
    const handleToggleEmpresa = async (empresa) => {
        try {
            if (empresa.activo) {
                await desactivarMicroempresa(empresa.id_microempresa);
            } else {
                await activarMicroempresa(empresa.id_microempresa);
            }
            const res = await getMicroempresas();
            setData(res.data || []);
        } catch (error) {
            console.error('Error:', error);
            alert('Error al cambiar el estado');
        }
    };

    // Eliminar admin
    const handleDeleteAdmin = async (id) => {
        if (!confirm('¿Estás seguro de eliminar este admin?')) return;
        try {
            await deleteAdmin(id);
            const res = await getAdmins();
            setData(res.data || []);
        } catch (error) {
            console.error('Error:', error);
            alert('Error al eliminar');
        }
    };

    // Baja lógica vendedor
    const handleBajaVendedor = async (id) => {
        if (!confirm('¿Estás seguro de dar de baja este vendedor?')) return;
        try {
            await bajaLogicaVendedor(id);
            const res = await getVendedores();
            setData(res.data || []);
        } catch (error) {
            console.error('Error:', error);
            alert('Error al dar de baja');
        }
    };

    // Obtener nombre de empresa por ID
    const getEmpresaNombre = (id) => {
        const emp = empresas.find(e => e.id_microempresa === id);
        return emp ? emp.nombre : `ID: ${id}`;
    };

    // Stats
    const stats = {
        empresas: { total: data.length, activos: data.filter(d => d.activo).length },
        admins: { total: data.length, activos: data.filter(d => d.estado).length },
        vendedores: { total: data.length, activos: data.filter(d => d.estado).length },
        clientes: { total: data.length, activos: data.filter(d => d.estado).length },
        productos: { total: data.length, activos: data.filter(d => d.estado).length },
        categorias: { total: data.length, activos: data.filter(d => d.activo).length },
        proveedores: { total: data.length, activos: data.filter(d => d.estado).length },
    };

    // Renderizar columnas según tab
    const renderTableHeader = () => {
        switch (activeTab) {
            case 'empresas':
                return (
                    <tr>
                        <th style={s.th}>Nombre</th>
                        <th style={s.th}>NIT</th>
                        <th style={s.th}>Contacto</th>
                        <th style={s.th}>Tipo Atención</th>
                        <th style={s.th}>Estado</th>
                        <th style={s.th}>Acciones</th>
                    </tr>
                );
            case 'admins':
            case 'vendedores':
                return (
                    <tr>
                        <th style={s.th}>Nombre</th>
                        <th style={s.th}>Email</th>
                        <th style={s.th}>Microempresa</th>
                        <th style={s.th}>Estado</th>
                        <th style={s.th}>Acciones</th>
                    </tr>
                );
            case 'clientes':
                return (
                    <tr>
                        <th style={s.th}>Nombre</th>
                        <th style={s.th}>Documento</th>
                        <th style={s.th}>Teléfono</th>
                        <th style={s.th}>Email</th>
                        <th style={s.th}>Estado</th>
                    </tr>
                );
            case 'productos':
                return (
                    <tr>
                        <th style={s.th}>Nombre</th>
                        <th style={s.th}>Precio Venta</th>
                        <th style={s.th}>Categoría</th>
                        <th style={s.th}>Estado</th>
                    </tr>
                );
            case 'categorias':
                return (
                    <tr>
                        <th style={s.th}>Nombre</th>
                        <th style={s.th}>Descripción</th>
                        <th style={s.th}>Estado</th>
                    </tr>
                );
            case 'proveedores':
                return (
                    <tr>
                        <th style={s.th}>Nombre</th>
                        <th style={s.th}>Contacto</th>
                        <th style={s.th}>Email</th>
                        <th style={s.th}>Estado</th>
                    </tr>
                );
            default:
                return null;
        }
    };

    // Renderizar filas según tab
    const renderTableRows = () => {
        if (loading) {
            return (
                <tr>
                    <td colSpan="6" style={s.loading}>Cargando datos...</td>
                </tr>
            );
        }

        if (paginatedData.length === 0) {
            return (
                <tr>
                    <td colSpan="6" style={s.emptyState}>
                        {activeTab === 'proveedores' && !empresaFilter
                            ? 'Selecciona una microempresa para ver sus proveedores'
                            : 'No hay datos para mostrar'}
                    </td>
                </tr>
            );
        }

        switch (activeTab) {
            case 'empresas':
                return paginatedData.map((item) => (
                    <tr key={item.id_microempresa}>
                        <td style={s.td}><strong>{item.nombre}</strong></td>
                        <td style={s.td}>{item.nit}</td>
                        <td style={s.td}>{item.correo_contacto || '-'}</td>
                        <td style={s.td}>{item.tipo_atencion}</td>
                        <td style={s.td}>
                            <span style={{ ...s.badge, ...(item.activo ? s.badgeActive : s.badgeInactive) }}>
                                {item.activo ? 'Activo' : 'Inactivo'}
                            </span>
                        </td>
                        <td style={s.td}>
                            <div style={s.actions}>
                                <button
                                    style={{ ...s.btnAction, ...(item.activo ? s.btnDanger : s.btnSuccess) }}
                                    title={item.activo ? 'Desactivar' : 'Activar'}
                                    onClick={() => handleToggleEmpresa(item)}
                                >
                                    <Power size={16} />
                                </button>
                                <button style={s.btnAction} title="Ver detalles">
                                    <Eye size={16} />
                                </button>
                            </div>
                        </td>
                    </tr>
                ));

            case 'admins':
                return paginatedData.map((item) => (
                    <tr key={item.id_usuario}>
                        <td style={s.td}><strong>{item.nombre}</strong></td>
                        <td style={s.td}>{item.email}</td>
                        <td style={s.td}>
                            <span style={{
                                background: 'rgba(29,115,115,0.1)',
                                padding: '4px 10px',
                                borderRadius: '6px',
                                fontSize: '12px',
                                color: palette.secondary
                            }}>
                                {getEmpresaNombre(item.id_microempresa)}
                            </span>
                        </td>
                        <td style={s.td}>
                            <span style={{ ...s.badge, ...(item.estado ? s.badgeActive : s.badgeInactive) }}>
                                {item.estado ? 'Activo' : 'Inactivo'}
                            </span>
                        </td>
                        <td style={s.td}>
                            <div style={s.actions}>
                                <button style={s.btnAction} title="Ver"><Eye size={16} /></button>
                                <button
                                    style={{ ...s.btnAction, ...s.btnDanger }}
                                    title="Eliminar"
                                    onClick={() => handleDeleteAdmin(item.id_usuario)}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </td>
                    </tr>
                ));

            case 'vendedores':
                return paginatedData.map((item) => (
                    <tr key={item.id_usuario}>
                        <td style={s.td}><strong>{item.nombre}</strong></td>
                        <td style={s.td}>{item.email}</td>
                        <td style={s.td}>
                            <span style={{
                                background: 'rgba(29,115,115,0.1)',
                                padding: '4px 10px',
                                borderRadius: '6px',
                                fontSize: '12px',
                                color: palette.secondary
                            }}>
                                {getEmpresaNombre(item.id_microempresa)}
                            </span>
                        </td>
                        <td style={s.td}>
                            <span style={{ ...s.badge, ...(item.estado ? s.badgeActive : s.badgeInactive) }}>
                                {item.estado ? 'Activo' : 'Inactivo'}
                            </span>
                        </td>
                        <td style={s.td}>
                            <div style={s.actions}>
                                <button style={s.btnAction} title="Ver"><Eye size={16} /></button>
                                {item.estado && (
                                    <button
                                        style={{ ...s.btnAction, ...s.btnDanger }}
                                        title="Dar de baja"
                                        onClick={() => handleBajaVendedor(item.id_usuario)}
                                    >
                                        <Power size={16} />
                                    </button>
                                )}
                            </div>
                        </td>
                    </tr>
                ));

            case 'clientes':
                return paginatedData.map((item) => (
                    <tr key={item.id_cliente}>
                        <td style={s.td}><strong>{item.nombre}</strong></td>
                        <td style={s.td}>{item.documento || '-'}</td>
                        <td style={s.td}>{item.telefono || '-'}</td>
                        <td style={s.td}>{item.email || '-'}</td>
                        <td style={s.td}>
                            <span style={{ ...s.badge, ...(item.estado ? s.badgeActive : s.badgeInactive) }}>
                                {item.estado ? 'Activo' : 'Inactivo'}
                            </span>
                        </td>
                    </tr>
                ));

            case 'productos':
                return paginatedData.map((item) => (
                    <tr key={item.id_producto}>
                        <td style={s.td}><strong>{item.nombre}</strong></td>
                        <td style={s.td}>
                            <span style={{ color: palette.green, fontWeight: '600' }}>
                                ${item.precio_venta?.toFixed(2) || '0.00'}
                            </span>
                        </td>
                        <td style={s.td}>{item.categoria?.nombre || '-'}</td>
                        <td style={s.td}>
                            <span style={{ ...s.badge, ...(item.estado ? s.badgeActive : s.badgeInactive) }}>
                                {item.estado ? 'Activo' : 'Inactivo'}
                            </span>
                        </td>
                    </tr>
                ));

            case 'categorias':
                return paginatedData.map((item) => (
                    <tr key={item.id_categoria}>
                        <td style={s.td}><strong>{item.nombre}</strong></td>
                        <td style={s.td}>{item.descripcion || '-'}</td>
                        <td style={s.td}>
                            <span style={{ ...s.badge, ...(item.activo ? s.badgeActive : s.badgeInactive) }}>
                                {item.activo ? 'Activo' : 'Inactivo'}
                            </span>
                        </td>
                    </tr>
                ));

            case 'proveedores':
                return paginatedData.map((item) => (
                    <tr key={item.id_proveedor}>
                        <td style={s.td}><strong>{item.nombre}</strong></td>
                        <td style={s.td}>{item.contacto || '-'}</td>
                        <td style={s.td}>{item.email || '-'}</td>
                        <td style={s.td}>
                            <span style={{ ...s.badge, ...(item.estado ? s.badgeActive : s.badgeInactive) }}>
                                {item.estado ? 'Activo' : 'Inactivo'}
                            </span>
                        </td>
                    </tr>
                ));

            default:
                return null;
        }
    };

    const currentTabLabel = TABS.find(t => t.id === activeTab)?.label || 'Gestión';

    return (
        <div style={s.container}>
            {/* Header */}
            <div style={s.header}>
                <h1 style={s.title}>{currentTabLabel}</h1>
                <p style={s.subtitle}>Administración global del sistema</p>
            </div>

            {/* Tabs - OCULTOS POR SOLICITUD DE USUARIO (Redundante con Sidebar)
            <div style={s.tabsContainer}>
                {TABS.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            style={{
                                ...s.tab,
                                ...(activeTab === tab.id ? s.tabActive : {})
                            }}
                            onClick={() => handleTabChange(tab.id)}
                        >
                            <Icon size={18} />
                            {tab.label}
                        </button>
                    );
                })}
            </div>
            */}

            {/* Stats */}
            {!loading && (
                <div style={s.statsBar}>
                    <div style={s.statCard}>
                        <div style={s.statLabel}>Total</div>
                        <div style={s.statValue}>{stats[activeTab]?.total || 0}</div>
                    </div>
                    <div style={s.statCard}>
                        <div style={s.statLabel}>Activos</div>
                        <div style={{ ...s.statValue, color: palette.green }}>
                            {stats[activeTab]?.activos || 0}
                        </div>
                    </div>
                    <div style={s.statCard}>
                        <div style={s.statLabel}>Inactivos</div>
                        <div style={{ ...s.statValue, color: palette.red }}>
                            {(stats[activeTab]?.total || 0) - (stats[activeTab]?.activos || 0)}
                        </div>
                    </div>
                </div>
            )}

            {/* Toolbar */}
            <div style={s.toolbar}>
                <div style={s.searchBox}>
                    <Search size={18} color={palette.gray} />
                    <input
                        type="text"
                        placeholder="Buscar por nombre, email, NIT..."
                        style={s.searchInput}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {activeTab === 'proveedores' && (
                    <select
                        style={s.filterSelect}
                        value={empresaFilter}
                        onChange={(e) => setEmpresaFilter(e.target.value)}
                    >
                        <option value="">Seleccionar microempresa</option>
                        {empresas.map((emp) => (
                            <option key={emp.id_microempresa} value={emp.id_microempresa}>
                                {emp.nombre}
                            </option>
                        ))}
                    </select>
                )}
            </div>

            {/* Tabla */}
            <div style={s.card}>
                <table style={s.table}>
                    <thead>
                        {renderTableHeader()}
                    </thead>
                    <tbody>
                        {renderTableRows()}
                    </tbody>
                </table>

                {/* Paginación */}
                {totalPages > 1 && (
                    <div style={s.pagination}>
                        <button
                            style={{ ...s.paginationBtn, opacity: page === 1 ? 0.5 : 1 }}
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                        >
                            <ChevronLeft size={16} /> Anterior
                        </button>
                        <span>
                            Página <strong>{page}</strong> de <strong>{totalPages}</strong>
                        </span>
                        <button
                            style={{ ...s.paginationBtn, opacity: page === totalPages ? 0.5 : 1 }}
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                        >
                            Siguiente <ChevronRight size={16} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GestionGlobal;
