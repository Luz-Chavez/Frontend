import { useState, useEffect } from "react";
import { getRubros, createRubro, updateRubro, toggleEstadoRubro } from "../../api/microempresas.api";
import { Plus, Edit2, ToggleLeft, ToggleRight, Search, X } from "lucide-react";

const palette = {
    primary: '#0A3A40',
    secondary: '#1D7373',
    accent: '#107361',
    white: '#FFFFFF',
    lightBg: '#F8FAFC',
    gray: '#64748B',
    border: '#E2E8F0',
    green: '#10B981',
    red: '#EF4444',
    card: '#FFFFFF',
};

export default function RubrosManager() {
    const [rubros, setRubros] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentRubro, setCurrentRubro] = useState(null); // null = crear, obj = editar
    const [formData, setFormData] = useState({ nombre: "", descripcion: "" });
    const [searchTerm, setSearchTerm] = useState("");
    const [actionLoading, setActionLoading] = useState(false);

    // Cargar rubros
    useEffect(() => {
        fetchRubros();
    }, []);

    const fetchRubros = async () => {
        setLoading(true);
        try {
            const res = await getRubros();
            setRubros(res.data);
        } catch (error) {
            console.error("Error cargando rubros:", error);
        } finally {
            setLoading(false);
        }
    };

    // Filtrar
    const filteredRubros = rubros.filter(r =>
        r.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.descripcion && r.descripcion.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Abrir Modal
    const openModal = (rubro = null) => {
        if (rubro) {
            setCurrentRubro(rubro);
            setFormData({ nombre: rubro.nombre, descripcion: rubro.descripcion || "" });
        } else {
            setCurrentRubro(null);
            setFormData({ nombre: "", descripcion: "" });
        }
        setModalOpen(true);
    };

    // Guardar (Crear/Editar)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setActionLoading(true);
        try {
            if (currentRubro) {
                await updateRubro(currentRubro.id_rubro, {
                    nombre: formData.nombre,
                    descripcion: formData.descripcion
                });
            } else {
                await createRubro({
                    nombre: formData.nombre,
                    descripcion: formData.descripcion,
                    activo: true
                });
            }
            setModalOpen(false);
            fetchRubros();
        } catch (error) {
            alert("Error al guardar: " + (error.response?.data?.detail || error.message));
        } finally {
            setActionLoading(false);
        }
    };

    // Cambiar estado
    const handleToggle = async (rubro) => {
        try {
            await toggleEstadoRubro(rubro.id_rubro, !rubro.activo);
            // Actualizar localmente para feedback inmediato
            setRubros(prev => prev.map(r =>
                r.id_rubro === rubro.id_rubro ? { ...r, activo: !r.activo } : r
            ));
        } catch (error) {
            alert("Error al cambiar estado");
            fetchRubros(); // Revertir si falla
        }
    };

    const s = {
        container: { maxWidth: 1000, margin: "0 auto", padding: 20 },
        header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 30 },
        title: { fontSize: 28, fontWeight: 700, color: palette.primary },
        btnCreate: {
            background: palette.secondary, color: "white", border: "none",
            padding: "10px 20px", borderRadius: 8, cursor: "pointer",
            fontWeight: 600, display: "flex", alignItems: "center", gap: 8
        },
        searchContainer: { display: "flex", alignItems: "center", background: "white", padding: "8px 16px", borderRadius: 8, border: `1px solid ${palette.border}`, marginBottom: 20, width: "fit-content" },
        inputSearch: { border: "none", outline: "none", fontSize: 14, marginLeft: 8, width: 200, color: palette.primary },

        grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 },
        card: { background: palette.card, borderRadius: 12, padding: 20, border: `1px solid ${palette.border}`, boxShadow: "0 2px 4px rgba(0,0,0,0.05)", position: 'relative' },
        cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 },
        rubroName: { fontSize: 18, fontWeight: 700, color: palette.primary },
        rubroDesc: { fontSize: 14, color: palette.gray, minHeight: 40 },
        cardFooter: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16, paddingTop: 16, borderTop: `1px solid ${palette.border}` },

        badge: (activo) => ({
            padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600,
            background: activo ? "#DCFCE7" : "#FEE2E2",
            color: activo ? palette.green : palette.red
        }),

        actionBtn: { background: "none", border: "none", cursor: "pointer", padding: 4, borderRadius: 4, display: 'flex', alignItems: 'center' },

        // Modal
        overlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 },
        modal: { background: "white", padding: 30, borderRadius: 16, width: 400, position: "relative" },
        modalTitle: { fontSize: 20, fontWeight: 700, color: palette.primary, marginBottom: 20 },
        formGroup: { marginBottom: 16 },
        label: { display: "block", marginBottom: 6, fontSize: 14, fontWeight: 600, color: palette.primary },
        input: { width: "100%", padding: "10px", borderRadius: 8, border: `1px solid ${palette.border}`, fontSize: 15, outline: 'none' },
        textarea: { width: "100%", padding: "10px", borderRadius: 8, border: `1px solid ${palette.border}`, fontSize: 15, minHeight: 80, resize: 'vertical', outline: 'none' },
        submitBtn: { width: "100%", padding: 12, background: palette.secondary, color: "white", border: "none", borderRadius: 8, fontWeight: 600, marginTop: 10, cursor: "pointer" }
    };

    return (
        <div style={s.container}>
            <div style={s.header}>
                <div>
                    <h1 style={s.title}>Gestión de Rubros</h1>
                    <p style={{ color: palette.gray }}>Categorías de negocio para microempresas</p>
                </div>
                <button style={s.btnCreate} onClick={() => openModal()}>
                    <Plus size={20} /> Nuevo Rubro
                </button>
            </div>

            <div style={s.searchContainer}>
                <Search size={18} color={palette.gray} />
                <input
                    style={s.inputSearch}
                    placeholder="Buscar rubro..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </div>

            {loading ? (
                <div style={{ textAlign: "center", color: palette.gray }}>Cargando...</div>
            ) : (
                <div style={s.grid}>
                    {filteredRubros.map(rubro => (
                        <div key={rubro.id_rubro} style={s.card}>
                            <div style={s.cardHeader}>
                                <div style={s.rubroName}>{rubro.nombre}</div>
                                <div style={s.badge(rubro.activo)}>
                                    {rubro.activo ? "Activo" : "Inactivo"}
                                </div>
                            </div>
                            <div style={s.rubroDesc}>{rubro.descripcion || "Sin descripción"}</div>

                            <div style={s.cardFooter}>
                                <button
                                    style={{ ...s.actionBtn, color: palette.secondary }}
                                    onClick={() => openModal(rubro)}
                                    title="Editar"
                                >
                                    <Edit2 size={18} />
                                </button>
                                <button
                                    style={{ ...s.actionBtn, color: rubro.activo ? palette.green : palette.gray }}
                                    onClick={() => handleToggle(rubro)}
                                    title={rubro.activo ? "Desactivar" : "Activar"}
                                >
                                    {rubro.activo ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {modalOpen && (
                <div style={s.overlay}>
                    <div style={s.modal}>
                        <button
                            onClick={() => setModalOpen(false)}
                            style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", cursor: "pointer" }}
                        >
                            <X size={20} color={palette.gray} />
                        </button>
                        <h3 style={s.modalTitle}>{currentRubro ? "Editar Rubro" : "Crear Rubro"}</h3>
                        <form onSubmit={handleSubmit}>
                            <div style={s.formGroup}>
                                <label style={s.label}>Nombre</label>
                                <input
                                    style={s.input}
                                    value={formData.nombre}
                                    onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                                    required
                                    placeholder="Ej: Tecnología"
                                />
                            </div>
                            <div style={s.formGroup}>
                                <label style={s.label}>Descripción</label>
                                <textarea
                                    style={s.textarea}
                                    value={formData.descripcion}
                                    onChange={e => setFormData({ ...formData, descripcion: e.target.value })}
                                    placeholder="Descripción breve..."
                                />
                            </div>
                            <button type="submit" style={s.submitBtn} disabled={actionLoading}>
                                {actionLoading ? "Guardando..." : "Guardar"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
