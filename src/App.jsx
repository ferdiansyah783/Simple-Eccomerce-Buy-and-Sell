import { useContext } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import { AuthContext, AuthProvider } from "./middleware/AuthContext";
import LoginPage from "./pages/Authentication/Login";
import RegisterPage from "./pages/Authentication/Register";
import ProductManagement from "./pages/Dashboard/ProductManagement";
import PaymentPage from "./pages/Payment/Payment";
import Store from "./pages/Store/Store";
import ProtectedRoute from "./middleware/ProtectedRoute";

function App() {
  const location = useLocation();

  return (
    <>
      <Routes key={location.pathname} location={location}>
        <Route path="/" element={<ProtectedRoute element={<Store />} />} />
        <Route
          path="/dashboard"
          element={<ProtectedRoute admin={true} element={<ProductManagement />} />}
        />
        <Route
          path="/payment"
          element={<ProtectedRoute element={<PaymentPage />} />}
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </>
  );
}

export default () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);
