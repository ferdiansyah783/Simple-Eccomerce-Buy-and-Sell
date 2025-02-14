import React, { createContext, useState, useEffect } from "react";

// Create Context for authentication
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    token: null,
    user: null,
  });

  // Check if the user is authenticated (check JWT token in localStorage)
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      setAuthState({
        token: token,
        user: JSON.parse(localStorage.getItem("user")), // Assuming user info is saved in localStorage
      });
    }
  }, []);

  const login = (user, token) => {
    localStorage.setItem("auth_token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setAuthState({
      token,
      user,
    });
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    setAuthState({
      token: null,
      user: null,
    });
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
