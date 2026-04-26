import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser, logout } from "./application/store/authSlice.ts";
import authService from "./infrastructure/repositories/authService.ts";
import type { RootState } from "./application/store";
import Layout from "./ui/components/Layout.tsx";
import Home from "./ui/pages/Home.tsx";
import Store from "./ui/pages/Store.tsx";
import PaymentStatus from "./ui/pages/PaymentStatus.tsx";
import Login from "./ui/pages/Login.tsx";
import Register from "./ui/pages/Register.tsx";
import AdminAddProduct from "./ui/pages/AdminAddProduct.tsx";
import DeveloperSettings from "./ui/pages/DeveloperSettings.tsx";
import ApiDocs from "./ui/pages/ApiDocs.tsx";
import ServiceLocationPage from "./ui/pages/ServiceLocationPage.tsx";
import ProtectedRoute from "./ui/components/ProtectedRoute.tsx";

const App: React.FC = () => {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const initAuth = async () => {
      if (token && !user) {
        try {
          const userData = await authService.getMe();
          dispatch(setUser(userData));
        } catch {
          console.error("Session expired");
          dispatch(logout());
        }
      }
    };
    initAuth();
  }, [token, user, dispatch]);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="store" element={<Store />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="services/:slug" element={<ServiceLocationPage />} />

        {/* Protected Customer Routes */}
        <Route element={<ProtectedRoute allowedRoles={["customer"]} />}>
          <Route path="payment/:status" element={<PaymentStatus />} />
          <Route path="developer" element={<DeveloperSettings />} />
          <Route path="docs/api" element={<ApiDocs />} />
        </Route>

        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="admin/products/add" element={<AdminAddProduct />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
