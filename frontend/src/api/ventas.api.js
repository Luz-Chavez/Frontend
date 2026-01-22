import axios from "axios";

// Ajusta el puerto si tu backend corre en otro (ej: 8000 o 3000)
const API_URL = "http://localhost:8000";

const ventasApi = axios.create({
  baseURL: API_URL,
});

// Interceptor para inyectar el Token automáticamente en cada petición
ventasApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ==========================================
// 🛒 LÓGICA PARA EL CLIENTE (PORTAL)
// ==========================================

/**
 * Registra una nueva venta online.
 * El backend espera un JSON con la estructura:
 * {
 * "venta": { ...datos de venta... },
 * "cliente": { ...datos del cliente... }
 * }
 * Referencia: ventas/router.py -> /ventas/checkout
 */
export const crearVentaOnline = async (datosVenta, datosCliente) => {
  // Aseguramos que los números sean números y no strings
  const payload = {
    venta: {
      ...datosVenta,
      detalles: datosVenta.detalles.map(d => ({
        ...d,
        precio_unitario: parseFloat(d.precio_unitario),
        subtotal: parseFloat(d.subtotal)
      }))
    },
    cliente: datosCliente
  };
  return await ventasApi.post("/ventas/ventas/checkout", payload);
};

/**
 * Registra el pago de una venta.
 * IMPORTANTE: El backend espera "comprobante_url" como texto.
 * Como no hay endpoint de subida de archivos en 'ventas', aquí simulamos
 * o enviamos la URL si ya la tenemos.
 * Referencia: ventas/router.py -> /ventas/{id_venta}/pago
 */
export const registrarPagoVenta = async (idVenta, metodo, comprobanteUrl) => {
  const payload = {
    metodo: metodo,
    comprobante_url: comprobanteUrl,
    estado: "PENDIENTE", // Estado inicial del pago
    fecha: new Date().toISOString()
  };
  return await ventasApi.post(`/ventas/ventas/${idVenta}/pago`, payload);
};

// ==========================================
// 👔 LÓGICA PARA EL ADMINISTRADOR (DASHBOARD)
// ==========================================

/**
 * Obtiene el historial de ventas de la empresa.
 * Soporta filtros opcionales (fecha, estado, tipo).
 * Referencia: ventas/router.py -> /microempresas/{id}/ventas
 */
export const getVentasPorEmpresa = async (idMicroempresa, filtros = {}) => {
  let url = `/ventas/microempresas/${idMicroempresa}/ventas?`;
  
  if (filtros.fecha_inicio) url += `&fecha_inicio=${filtros.fecha_inicio}`;
  if (filtros.fecha_fin) url += `&fecha_fin=${filtros.fecha_fin}`;
  if (filtros.estado) url += `&estado=${filtros.estado}`;
  if (filtros.tipo) url += `&tipo=${filtros.tipo}`;

  return await ventasApi.get(url);
};

/**
 * Valida un pago y la venta (Descuenta stock en backend).
 * Referencia: ventas/router.py -> /ventas/{id}/pago/validar
 */
export const validarPagoVenta = async (idVenta) => {
  return await ventasApi.put(`/ventas/ventas/${idVenta}/pago/validar`);
};

/**
 * Rechaza un pago y cancela la venta.
 * Referencia: ventas/router.py -> /ventas/{id}/pago/rechazar
 */
export const rechazarPagoVenta = async (idVenta) => {
  return await ventasApi.put(`/ventas/ventas/${idVenta}/pago/rechazar`);
};

/**
 * Obtiene los detalles (productos) de una venta específica.
 * Referencia: ventas/router.py -> /{id_venta}/detalles
 */
export const getDetallesVenta = async (idVenta) => {
  return await ventasApi.get(`/ventas/${idVenta}/detalles`);
};