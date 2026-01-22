import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getVentasPorEmpresa, validarPagoVenta, rechazarPagoVenta } from "../../api/ventas.api";
import Swal from "sweetalert2";

export default function Ventas() {
  const { user } = useAuth();
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState("TODOS"); 

  // --- LÓGICA ROBUSTA PARA ENCONTRAR EL ID ---
  // Buscamos el ID en varias ubicaciones posibles según tu backend
  const idMicroempresa = 
    user?.microempresa?.id_microempresa ||       // Caso común
    user?.admin_microempresa?.id_microempresa || // Caso alternativo
    user?.id_microempresa;                       // Caso directo

  useEffect(() => {
    // Debug: Ver qué usuario tenemos
    console.log("Usuario logueado:", user);
    console.log("ID Empresa detectado:", idMicroempresa);

    if (idMicroempresa) {
      cargarVentas();
    } else {
      console.warn("No se encontró ID de microempresa, deteniendo carga.");
      setLoading(false); // Detenemos el loading si no hay ID
    }
  }, [idMicroempresa, filtroEstado]);

  const cargarVentas = async () => {
    setLoading(true);
    try {
      const filtros = {};
      if (filtroEstado !== "TODOS") filtros.estado = filtroEstado;

      // Llamada a la API
      console.log(`Cargando ventas para empresa ${idMicroempresa}...`);
      const res = await getVentasPorEmpresa(idMicroempresa, filtros);
      console.log("Ventas recibidas:", res.data);

      const ventasOrdenadas = res.data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
      setVentas(ventasOrdenadas);
    } catch (error) {
      console.error("Error cargando ventas:", error);
      // No mostrar alerta intrusiva si es solo que no hay ventas aún
    } finally {
      setLoading(false);
    }
  };

  const handleValidar = async (venta) => {
    const result = await Swal.fire({
      title: '¿Validar Pago y Entrega?',
      text: `Se descontará el stock de la venta #${venta.id_venta} y se marcará como PAGADA.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#10B981',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, validar'
    });

    if (result.isConfirmed) {
      try {
        await validarPagoVenta(venta.id_venta);
        Swal.fire('¡Validado!', 'Stock actualizado correctamente.', 'success');
        cargarVentas(); 
      } catch (error) {
        console.error(error);
        Swal.fire('Error', 'No se pudo validar la venta.', 'error');
      }
    }
  };

  const handleRechazar = async (idVenta) => {
    /* ... (Misma lógica de rechazo anterior) ... */
     const result = await Swal.fire({
      title: '¿Rechazar Venta?',
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Sí, rechazar'
    });
    if (result.isConfirmed) {
        await rechazarPagoVenta(idVenta);
        cargarVentas();
    }
  };

  const getBadgeColor = (estado) => {
    switch (estado) {
      case "PAGADA": return "bg-green-100 text-green-800 border-green-200";
      case "PENDIENTE_PAGO": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "CANCELADA": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // --- RENDERIZADO ---
  if (!idMicroempresa) {
    return (
        <div className="p-8 text-center text-gray-500">
            <h2 className="text-xl font-bold text-red-500">Error de Configuración</h2>
            <p>No se detectó una microempresa asociada a tu usuario.</p>
            <pre className="mt-4 text-xs bg-gray-100 p-2 text-left inline-block">
                {JSON.stringify(user, null, 2)}
            </pre>
        </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Ventas</h1>
        
        {/* Filtros */}
        <div className="flex bg-gray-100 p-1 rounded-lg">
          {["TODOS", "PENDIENTE_PAGO", "PAGADA"].map((filtro) => (
            <button
              key={filtro}
              onClick={() => setFiltroEstado(filtro)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                filtroEstado === filtro 
                  ? "bg-white text-blue-600 shadow-sm" 
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {filtro === "PENDIENTE_PAGO" ? "Pendientes" : filtro.charAt(0) + filtro.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-700 uppercase font-bold text-xs">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Fecha</th>
                <th className="p-4">Total</th>
                <th className="p-4 text-center">Estado</th>
                <th className="p-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="p-8 text-center">Cargando...</td></tr>
              ) : ventas.length === 0 ? (
                <tr><td colSpan="5" className="p-8 text-center text-gray-400">No se encontraron ventas.</td></tr>
              ) : (
                ventas.map((venta) => (
                  <tr key={venta.id_venta} className="hover:bg-gray-50 border-b">
                    <td className="p-4 font-bold">#{venta.id_venta}</td>
                    <td className="p-4">{new Date(venta.fecha).toLocaleDateString()}</td>
                    <td className="p-4 font-bold">Bs. {parseFloat(venta.total).toFixed(2)}</td>
                    <td className="p-4 text-center">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${getBadgeColor(venta.estado)}`}>
                            {venta.estado}
                        </span>
                    </td>
                    <td className="p-4 text-center">
                      {venta.estado === "PENDIENTE_PAGO" && (
                        <button onClick={() => handleValidar(venta)} className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">
                           Validar Pago
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
        </table>
      </div>
    </div>
  );
}