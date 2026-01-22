import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingCart, Trash2, User, PlusCircle } from 'lucide-react';

const PortalVentas = () => {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [cliente, setCliente] = useState({ nombre: '', telefono: '' });
  const [loading, setLoading] = useState(false);
  const [ventaGenerada, setVentaGenerada] = useState(null);

  const ID_MICROEMPRESA = 1; // Ajusta este ID según tu base de datos

  // 1. Cargar productos
  useEffect(() => {
    // Usamos el endpoint público que definimos anteriormente
    axios.get(`http://localhost:8000/productos/portal/${ID_MICROEMPRESA}/listado`)
      .then(res => setProductos(res.data))
      .catch(err => console.error("Error cargando productos", err));
  }, []);

  // --- LÓGICA DEL CARRITO (REQUISITOS 1 y 2) ---
  const agregarAlCarrito = (producto, cantidadAgregar) => {
    setCarrito(prev => {
      const existe = prev.find(item => item.id_producto === producto.id_producto);
      if (existe) {
        return prev.map(item => 
          item.id_producto === producto.id_producto 
            ? { ...item, cantidad: item.cantidad + cantidadAgregar } 
            : item
        );
      } else {
        return [...prev, { ...producto, cantidad: cantidadAgregar }];
      }
    });
  };

  const eliminarDelCarrito = (id_producto) => {
    setCarrito(prev => prev.filter(item => item.id_producto !== id_producto));
  };

  const calcularTotal = () => carrito.reduce((acc, item) => acc + (item.precio_venta * item.cantidad), 0);

  // --- PROCESAR VENTA (REQUISITO 3) ---
  const procesarVenta = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Estructura exacta para tu endpoint /ventas/checkout
    // Requiere: "venta" (Schema VentaCreate) y "cliente" (dict)
    const payload = {
      venta: {
        id_microempresa: ID_MICROEMPRESA,
        total: calcularTotal(), // Backend lo recalcula, pero el schema lo pide
        estado: "PENDIENTE_PAGO",
        tipo: "ONLINE",
        detalles: carrito.map(p => ({
          id_producto: p.id_producto,
          cantidad: p.cantidad,
          precio_unitario: p.precio_venta,
          subtotal: p.cantidad * p.precio_venta
        }))
      },
      cliente: {
        nombre: cliente.nombre,
        telefono: cliente.telefono
        // Agrega email u otros campos si tu modelo Cliente los requiere obligatorios
      }
    };

    try {
      const res = await axios.post('http://localhost:8000/ventas/ventas/checkout', payload);
      setVentaGenerada(res.data);
      setCarrito([]); // Limpiar carrito
      alert(`✅ Venta ${res.data.id_venta} creada correctamente. Estado: PENDIENTE DE PAGO`);
    } catch (error) {
      console.error(error);
      alert("❌ Error al procesar la venta. Revisa la consola.");
    } finally {
      setLoading(false);
    }
  };

  // --- SIMULACIÓN DE PAGO (PARA COMPLETAR EL FLUJO) ---
  const simularValidacionAdmin = async () => {
    if (!ventaGenerada) return;
    try {
      // Llamamos al endpoint que descuenta stock
      await axios.put(`http://localhost:8000/ventas/ventas/${ventaGenerada.id_venta}/pago/validar`);
      alert("✅ Pago Validado por Admin. ¡STOCK DESCONTADO!");
      setVentaGenerada(null); // Reset
    } catch (error) {
      alert("Error validando pago");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* IZQUIERDA: PRODUCTOS */}
      <div className="w-2/3 p-6 overflow-y-auto">
        <h1 className="text-3xl font-bold text-teal-800 mb-6">Portal Sistoys 🧸</h1>
        <div className="grid grid-cols-3 gap-6">
          {productos.map(prod => (
            <div key={prod.id_producto} className="bg-white rounded-xl shadow p-4 border border-gray-200">
              <div className="h-32 bg-gray-100 rounded mb-4 flex items-center justify-center text-gray-400">
                 {prod.imagen ? <img src={`http://localhost:8000${prod.imagen}`} className="h-full object-contain"/> : "IMG"}
              </div>
              <h3 className="font-bold text-lg">{prod.nombre}</h3>
              <p className="text-teal-600 font-bold text-xl">${prod.precio_venta}</p>
              
              {/* BOTONES DE PRUEBA (REQUISITO 1) */}
              <div className="mt-4 flex flex-col gap-2">
                <button onClick={() => agregarAlCarrito(prod, 2)} className="bg-blue-100 text-blue-700 py-1 px-3 rounded hover:bg-blue-200 text-sm font-semibold">
                  + Agregar 2 u.
                </button>
                <button onClick={() => agregarAlCarrito(prod, 3)} className="bg-purple-100 text-purple-700 py-1 px-3 rounded hover:bg-purple-200 text-sm font-semibold">
                  + Agregar 3 u.
                </button>
                <button onClick={() => agregarAlCarrito(prod, 4)} className="bg-orange-100 text-orange-700 py-1 px-3 rounded hover:bg-orange-200 text-sm font-semibold">
                  + Agregar 4 u.
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DERECHA: CARRITO Y CHECKOUT */}
      <div className="w-1/3 bg-white border-l p-6 flex flex-col shadow-2xl">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-800">
          <ShoppingCart /> Tu Pedido
        </h2>

        {/* LISTA CARRITO */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-3">
          {carrito.length === 0 && <p className="text-gray-400 text-center mt-10">Carrito vacío</p>}
          {carrito.map(item => (
            <div key={item.id_producto} className="flex justify-between items-center bg-gray-50 p-3 rounded border border-gray-100">
              <div>
                <p className="font-bold text-gray-700">{item.nombre}</p>
                <p className="text-sm text-gray-500">{item.cantidad} x ${item.precio_venta}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold">${item.cantidad * item.precio_venta}</span>
                {/* BOTÓN ELIMINAR (REQUISITO 2) */}
                <button onClick={() => eliminarDelCarrito(item.id_producto)} className="text-red-500 hover:bg-red-100 p-2 rounded-full transition">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-2xl font-bold text-right mb-6 border-t pt-4">
          Total: ${calcularTotal()}
        </div>

        {/* FORMULARIO CLIENTE */}
        {!ventaGenerada ? (
          <form onSubmit={procesarVenta} className="bg-blue-50 p-4 rounded-lg space-y-3">
            <h3 className="font-bold text-blue-800 flex items-center gap-2"><User size={18}/> Cliente</h3>
            <input 
              required 
              placeholder="Nombre" 
              className="w-full p-2 border rounded"
              value={cliente.nombre} 
              onChange={e => setCliente({...cliente, nombre: e.target.value})}
            />
            <input 
              required 
              placeholder="Teléfono (Para buscar o crear)" 
              className="w-full p-2 border rounded"
              value={cliente.telefono} 
              onChange={e => setCliente({...cliente, telefono: e.target.value})}
            />
            <button disabled={loading || carrito.length === 0} className="w-full bg-teal-600 text-white py-3 rounded font-bold hover:bg-teal-700 disabled:opacity-50">
              {loading ? "Procesando..." : "Confirmar Compra"}
            </button>
          </form>
        ) : (
          <div className="bg-green-50 p-4 rounded-lg border border-green-200 text-center">
            <p className="text-green-800 font-bold mb-2">¡Pedido realizado!</p>
            <p className="text-sm text-gray-600 mb-4">Tu pedido está pendiente de pago. Simula la validación del admin para descontar stock.</p>
            <button onClick={simularValidacionAdmin} className="w-full bg-green-600 text-white py-2 rounded font-bold hover:bg-green-700">
              👮 Simular Validación Admin
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PortalVentas;