import apiClient from "./axios";

// SEGURO: Solo verifica si existe un cliente con ese documento
// Retorna: { existe: boolean, id_cliente: number | null }
export const verificarClientePorDocumento = (idMicroempresa, documento) => {
    return apiClient.get(`/clientes/microempresa/${idMicroempresa}/verificar-documento/${documento}`);
};

// Obtener datos del cliente por ID (después de verificar que existe)
export const obtenerClientePorId = (idCliente) => {
    return apiClient.get(`/clientes/obtener/${idCliente}`);
};

// Listar clientes de una microempresa
export const getClientesPorMicroempresa = (idMicroempresa) => {
    return apiClient.get(`/clientes/microempresa/${idMicroempresa}`);
};
