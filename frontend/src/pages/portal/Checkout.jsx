import React, { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import { crearVentaOnline, registrarPagoVenta } from "../../api/ventas.api";
import { useNavigate, useParams } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Swal from "sweetalert2";

// Iconos simples (puedes usar lucide-react si lo prefieres)
const IconCheck = () => <span className="text-green-500 font-bold">✓</span>;

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const { id_microempresa } = useParams(); 
  const navigate = useNavigate();

  // Estados del formulario del cliente
  const [cliente, setCliente] = useState({
    nombre: "",
    documento: "",
    telefono: "",
    email: ""
  });

  // Estados de control
  const [loading, setLoading] = useState(false);
  const [paso, setPaso] = useState(1); // 1: Datos, 2: Pago QR, 3: Finalizado
  const [ventaCreadaId, setVentaCreadaId] = useState(null);

  // Redirigir si el carrito está vacío (seguridad básica)
  useEffect(() => {
    if (cart.length === 0 && paso === 1) {
      Swal.fire({
        icon: 'info',
        title: 'Carrito vacío',
        text: 'Agrega productos antes de ir a caja.',
        confirmButtonColor: '#0A3A40'
      }).then(() => navigate(`/portal/${id_microempresa}`));
    }
  }, [cart, paso, navigate, id_microempresa]);

  const handleChange = (e) => {
    setCliente({ ...cliente, [e.target.name]: e.target.value });
  };

  // --- PASO 1: CREAR LA VENTA EN BASE DE DATOS ---
  const handleConfirmarPedido = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ID de empresa como entero
      const idEmpresaInt = parseInt(id_microempresa);

      // 1. Preparamos los datos tal como los pide el Backend
      const ventaPayload = {
        id_microempresa: idEmpresaInt,
        total: cartTotal,
        estado: "PENDIENTE_PAGO",
        tipo: "ONLINE",
        detalles: cart.map(item => ({
          id_producto: item.id_producto,
          cantidad: item.cantidad,
          precio_unitario: parseFloat(item.precio_venta),
          subtotal: item.cantidad * parseFloat(item.precio_venta)
        }))
      };

      // 2. Preparamos el cliente INYECTANDO EL ID DE MICROEMPRESA
      // (Esta es la corrección clave para evitar el error NULL)
      const clientePayload = {
        ...cliente,
        id_microempresa: idEmpresaInt,
        fecha_creacion: new Date().toISOString() // <--- AGREGAR ESTA LÍNEA
      };

      // 3. Llamada a la API con ambos objetos completos
      const res = await crearVentaOnline(ventaPayload, clientePayload);
      
      // ... resto del código (éxito, setVentaCreadaId, etc.) ...
      setVentaCreadaId(res.data.id_venta);
      setPaso(2);
      clearCart();
      
      Swal.fire({
        icon: 'success',
        title: 'Pedido Registrado',
        text: 'Por favor realiza el pago por QR para confirmar.',
        confirmButtonColor: '#0A3A40',
        timer: 2000
      });

    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudo registrar el pedido. Intenta nuevamente.", "error");
    } finally {
      setLoading(false);
    }
  };

  // --- PASO 2: REGISTRAR EL PAGO (SUBIDA DE COMPROBANTE) ---
  const handleConfirmarPago = async () => {
    setLoading(true);
    try {
      // NOTA: Aquí iría la lógica de subir imagen si el backend tuviera endpoint de upload.
      // Por ahora enviamos una URL simulada.
      const urlSimulada = "https://bucket-ejemplo.com/comprobante-simulado.jpg";
      
      await registrarPagoVenta(ventaCreadaId, "QR", urlSimulada);
      
      setPaso(3); // Finalizar
      generarPDF(); // Descargar comprobante automáticamente
      
      Swal.fire({
        icon: 'success',
        title: '¡Pago Enviado!',
        text: 'Hemos recibido tu comprobante. Un administrador lo validará pronto.',
        confirmButtonColor: '#0A3A40'
      });

    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudo registrar el pago.", "error");
    } finally {
      setLoading(false);
    }
  };

  // --- GENERACIÓN DE PDF (jspdf) ---
  const generarPDF = () => {
    const doc = new jsPDF();
    
    // Encabezado
    doc.setFontSize(18);
    doc.text("Comprobante de Pedido", 14, 20);
    
    doc.setFontSize(12);
    doc.text(`Código de Pedido: #${ventaCreadaId}`, 14, 30);
    doc.text(`Cliente: ${cliente.nombre}`, 14, 38);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 46);
    
    // Tabla de productos
    // (Necesitas 'jspdf-autotable' para esto, si no tienes cart, usa un texto simple)
    // Nota: Como 'cart' se limpió en el paso 2, idealmente deberíamos haber guardado una copia temporal.
    // Para simplificar, mostramos el total.
    
    doc.text(`Total a Pagar: Bs. ${cartTotal.toFixed(2)}`, 14, 60);
    doc.text("Estado: Pendiente de Validación", 14, 68);
    
    doc.save(`pedido_${ventaCreadaId}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        
        {/* Cabecera */}
        <div className="bg-[#0A3A40] p-6 text-white text-center">
          <h1 className="text-2xl font-bold">Finalizar Compra</h1>
          <p className="text-[#1D7373] text-sm mt-1">Completa tus datos para recibir tu pedido</p>
        </div>

        {/* Barra de Progreso */}
        <div className="flex justify-center items-center py-6 border-b border-gray-100">
          <div className={`flex items-center gap-2 ${paso >= 1 ? "text-[#0A3A40] font-bold" : "text-gray-400"}`}>
            <span className="w-8 h-8 rounded-full border-2 flex items-center justify-center border-current">1</span>
            <span>Datos</span>
          </div>
          <div className="w-10 h-0.5 bg-gray-200 mx-2"></div>
          <div className={`flex items-center gap-2 ${paso >= 2 ? "text-[#0A3A40] font-bold" : "text-gray-400"}`}>
            <span className="w-8 h-8 rounded-full border-2 flex items-center justify-center border-current">2</span>
            <span>Pago</span>
          </div>
          <div className="w-10 h-0.5 bg-gray-200 mx-2"></div>
          <div className={`flex items-center gap-2 ${paso >= 3 ? "text-[#0A3A40] font-bold" : "text-gray-400"}`}>
            <span className="w-8 h-8 rounded-full border-2 flex items-center justify-center border-current">3</span>
            <span>Fin</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-0">
          
          {/* COLUMNA IZQUIERDA: FORMULARIOS */}
          <div className="p-8">
            
            {/* --- PASO 1: DATOS --- */}
            {paso === 1 && (
                <form onSubmit={handleConfirmarPedido} className="space-y-5 animate-fade-in">
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                    <p className="text-sm text-yellow-700">
                        📝 <strong>Nota para la Demo:</strong> Si ingresas un DNI ya registrado, 
                        el sistema cargará tus datos automáticamente al procesar.
                    </p>
                    </div>

                    <h3 className="text-lg font-bold text-gray-800 mb-4">Datos del Cliente</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* CAMPO DNI PRIMERO */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">CI / NIT *</label>
                        <input 
                            name="documento" 
                            value={cliente.documento}
                            onChange={handleChange}
                            placeholder="Ej: 1234567" 
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D7373] outline-none font-bold" 
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Nombre Completo *</label>
                        <input 
                            name="nombre" 
                            value={cliente.nombre}
                            onChange={handleChange}
                            placeholder="Ej: Juan Perez" 
                            required 
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D7373] outline-none" 
                        />
                    </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Teléfono / Celular *</label>
                        <input 
                            name="telefono" 
                            value={cliente.telefono}
                            onChange={handleChange}
                            required 
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D7373] outline-none" 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Email (Opcional)</label>
                        <input 
                            name="email" 
                            type="email" 
                            value={cliente.email}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D7373] outline-none" 
                        />
                    </div>
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-[#0A3A40] hover:bg-[#062c30] text-white py-4 rounded-xl font-bold shadow-lg transition-all transform active:scale-95 mt-6 text-lg">
                    {loading ? "Procesando..." : "Confirmar Pedido"}
                    </button>
                </form>
                )}

            {/* --- PASO 2: PAGO QR --- */}
            {paso === 2 && (
              <div className="text-center space-y-6 animate-fade-in">
                <h3 className="text-lg font-bold text-gray-800">Escanea para Pagar</h3>
                
                <div className="bg-white p-4 border-2 border-dashed border-gray-300 rounded-xl inline-block">
                  {/* QR PLACEHOLDER (Pon una imagen real en public/qr.png) */}
                  <div className="w-48 h-48 bg-gray-100 flex items-center justify-center text-gray-400">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=PagoDemo" alt="QR" className="w-full h-full" />
                  </div>
                  <p className="mt-2 font-mono text-sm text-[#0A3A40] font-bold">Total: Bs. {cartTotal.toFixed(2)}</p>
                </div>

                <div className="text-left bg-blue-50 p-4 rounded-lg text-sm text-blue-800">
                  <p><strong>Banco:</strong> BCP</p>
                  <p><strong>Cuenta:</strong> 123-45678-00</p>
                  <p><strong>Titular:</strong> Empresa Demo S.R.L.</p>
                </div>
                
                <button onClick={handleConfirmarPago} disabled={loading} className="w-full bg-[#1D7373] hover:bg-[#155d5d] text-white py-3 rounded-lg font-bold shadow-lg transition-all mt-4">
                  {loading ? "Enviando..." : "Ya realicé el pago (Enviar Comprobante)"}
                </button>
              </div>
            )}

            {/* --- PASO 3: ÉXITO --- */}
            {paso === 3 && (
              <div className="text-center py-10 animate-fade-in">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600 text-4xl">
                  ✓
                </div>
                <h2 className="text-2xl font-bold text-[#0A3A40] mb-2">¡Pedido Exitoso!</h2>
                <p className="text-gray-600 mb-6">Tu código de seguimiento es: <strong>#{ventaCreadaId}</strong></p>
                
                <button onClick={() => navigate(`/portal/${id_microempresa}`)} className="text-[#1D7373] font-bold underline hover:text-[#0A3A40]">
                  Volver a la tienda
                </button>
              </div>
            )}
          </div>

          {/* COLUMNA DERECHA: RESUMEN DEL CARRITO */}
          <div className="bg-[#F8FAFC] p-8 border-l border-gray-100 hidden md:block">
            <h3 className="font-bold text-gray-800 mb-6 text-lg">Resumen de Compra</h3>
            
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {/* Si estamos en paso 2 o 3, el carrito se vació, así que mostramos un mensaje o nada */}
              {paso === 1 ? (
                cart.map((item) => (
                  <div key={item.id_producto} className="flex justify-between items-start text-sm">
                    <div className="flex gap-3">
                      <div className="w-12 h-12 bg-white rounded border border-gray-200 flex-shrink-0 overflow-hidden">
                         {item.imagen ? <img src={`http://localhost:8000${item.imagen}`} className="w-full h-full object-cover"/> : null}
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">{item.nombre}</p>
                        <p className="text-gray-500">Cant: {item.cantidad}</p>
                      </div>
                    </div>
                    <span className="font-semibold text-gray-800">
                      Bs. {(item.precio_venta * item.cantidad).toFixed(2)}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-400 py-10 italic">
                  Pedido en proceso...
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 mt-6 pt-6">
              <div className="flex justify-between text-xl font-bold text-[#0A3A40]">
                <span>Total a Pagar</span>
                <span>Bs. {cartTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}