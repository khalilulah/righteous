import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwtDecode from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(null); // Role (e.g., teacher, parent)
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const loadAuthState = async () => {
    const token = await AsyncStorage.getItem("authToken");
    if (token) {
      const decoded = jwtDecode(token);
      setRole(decoded.role); // Extract and store role
      setIsAuthenticated(true);
    }
  };

  useEffect(() => {
    loadAuthState();
  }, []);

  const logout = async () => {
    await AsyncStorage.removeItem("authToken");
    setRole(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ role, isAuthenticated, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
