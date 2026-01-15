import { useState, useEffect } from "react";
import { registerRequest, loginRequest } from "../api/auth.api";
import { getMeRequest } from "../api/user.api";
import { AuthContext } from "./AuthContext";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);


  const signup = async (user) => {
    try {
      const res = await registerRequest(user);
      setUser(res.data);
      setIsAuthenticated(true);
    } catch (error) {
      setErrors(error.response?.data || ["Error al registrar"]);
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
      // Si es adminmicroempresa, consultar si tiene microempresa asociada
      if (userData.rol === 'adminmicroempresa') {
        try {
          const admRes = await apiClient.get(`/admins/${userData.id_usuario}`);
          // Si la respuesta es 200 y tiene microempresa, agregar has_microempresa=true
          if (admRes.data && admRes.data.id_microempresa) {
            userData = { ...userData, has_microempresa: true, microempresa: admRes.data };
          } else {
            userData = { ...userData, has_microempresa: false };
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
        isAuthenticated,
        errors,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;