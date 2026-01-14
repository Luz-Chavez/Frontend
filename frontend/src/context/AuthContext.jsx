import { createContext, useState, useContext, useEffect } from "react";
import { registerRequest, loginRequest, verifyTokenRequest } from "../api/auth.api";

// 1. Crear el contexto
export const AuthContext = createContext();

// 2. Hook personalizado
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};

// 3. Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- MOCK: SIMULACIÓN DE LOGIN (Para pruebas sin Backend) ---
  const mockLogin = (email) => {
    let role = 'admin_microempresa';
    let has_microempresa = true;

    // Reglas "Mágicas" para probar flujos
    if (email.includes('superadmin')) {
      role = 'superadmin';
    } else if (email.includes('vendedor')) {
      role = 'vendedor';
    } else if (email.includes('sinempresa')) {
      has_microempresa = false;
    }

    return {
      _id: '12345',
      username: 'Usuario Test',
      email: email,
      role: role,
      has_microempresa: has_microempresa
    };
  };
  // -------------------------------------------------------------

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
      // ⚠️ MODO PRUEBA: Usamos mockLogin en vez de la API real
      // const res = await loginRequest(userCredentials);
      
      console.log("Simulando login para:", userCredentials.email);
      const mockUser = mockLogin(userCredentials.email);

      setUser(mockUser);
      setIsAuthenticated(true);
      
      // Retornamos el usuario para que el Login sepa a dónde redirigir
      return mockUser; 

    } catch (error) {
        setErrors(["Error al iniciar sesión"]);
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