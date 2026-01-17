import { useState, useEffect } from "react";
import { registerRequest, loginRequest } from "../api/auth.api";
import { getMeRequest } from "../api/user.api";
import { AuthContext } from "./AuthContext";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Refresca la información de la microempresa en el contexto
  const refreshMicroempresa = async () => {
    if (!user) return;
    const apiClient = (await import('../services/apiClient')).default;
    try {
      if (user.rol === 'adminmicroempresa') {
        const admRes = await apiClient.get(`/admins/${user.id_usuario}`);
        if (admRes.data && admRes.data.id_microempresa) {
          // Si la respuesta tiene microempresa anidada, úsala
          const empresa = admRes.data.microempresa ? admRes.data.microempresa : admRes.data;
          setUser(prev => ({ ...prev, has_microempresa: true, microempresa: empresa }));
        }
      }
      if (user.rol === 'vendedor') {
        const vendRes = await apiClient.get(`/vendedores/${user.id_usuario}`);
        if (vendRes.data && vendRes.data.id_microempresa) {
          const empresa = vendRes.data.microempresa ? vendRes.data.microempresa : vendRes.data;
          setUser(prev => ({ ...prev, has_microempresa: true, microempresa: empresa }));
        }
      }
    } catch {
      // No actualizar si falla
    }
  };


  const signup = async (user) => {
    try {
      const res = await registerRequest(user);
      // No autenticar ni setear usuario tras registro
      return res.data;
    } catch (error) {
      setErrors(error.response?.data || ["Error al registrar"]);
      return false;
    }
  };

  const signin = async (userCredentials) => {
    try {
      // POST /login espera { email, password }
      const loginRes = await loginRequest({
        email: userCredentials.email,
        password: userCredentials.password
      });
      const { access_token, token_type } = loginRes.data;
      // Guardar token en localStorage
      localStorage.setItem('access_token', access_token);
      // Configurar el header Authorization para futuras peticiones (sincrónico antes de /me)
      const apiClient = (await import('../services/apiClient')).default;
      apiClient.defaults.headers.common['Authorization'] = `${token_type} ${access_token}`;
      // Obtener datos del usuario autenticado
      const meRes = await getMeRequest();
      let userData = meRes.data;
      // Si es adminmicroempresa o vendedor, consultar si tiene microempresa asociada
      if (userData.rol === 'adminmicroempresa' || userData.rol === 'vendedor') {
        try {
          // Para adminmicroempresa
          if (userData.rol === 'adminmicroempresa') {
            const admRes = await apiClient.get(`/admins/${userData.id_usuario}`);
            if (admRes.data && admRes.data.id_microempresa) {
              // Recuperar la microempresa por el id
              const microempresaRes = await apiClient.get(`/microempresas/${admRes.data.id_microempresa}`);
              const empresa = microempresaRes.data;
              userData = { ...userData, has_microempresa: true, microempresa: empresa };
            } else {
              userData = { ...userData, has_microempresa: false, microempresa: null };
            }
          }
          // Para vendedor
          if (userData.rol === 'vendedor') {
            const vendRes = await apiClient.get(`/vendedores/${userData.id_usuario}`);
            if (vendRes.data && vendRes.data.id_microempresa) {
              // Recuperar la microempresa por el id
              const microempresaRes = await apiClient.get(`/microempresas/${vendRes.data.id_microempresa}`);
              const empresa = microempresaRes.data;
              userData = { ...userData, has_microempresa: true, microempresa: empresa };
              console.log('Usuario vendedor:', userData);
              console.log('Microempresa asociada:', empresa);
            } else {
              userData = { ...userData, has_microempresa: false, microempresa: null };
              console.log('Usuario vendedor sin microempresa:', userData);
            }
          }
        } catch {
          userData = { ...userData, has_microempresa: false };
        }
      }
      setUser(userData);
      setIsAuthenticated(true);
      return userData;
    } catch (error) {
      const errMsg = error.response?.data?.detail || error.response?.data || ["Error al iniciar sesión"];
      setErrors(Array.isArray(errMsg) ? errMsg : [errMsg]);
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  // Limpiar errores a los 5 segundos
  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => setErrors([]), 5000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  // Verificar sesión (Simulado para que no te saque al recargar por ahora)
  useEffect(() => {
    async function checkLogin() {
      // En modo real aquí va verifyTokenRequest()
      setLoading(false); 
    }
    checkLogin();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signup,
        signin,
        logout,
        loading,
        user,
        setUser, // <-- Exponer setUser para que useAuth() lo devuelva
        isAuthenticated,
        errors,
        refreshMicroempresa,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;