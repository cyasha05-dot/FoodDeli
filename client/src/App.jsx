import React, { useState } from "react";
import Navbar from "./Component/Navbar/Navbar";
import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home/Home";
import Cart from "./Pages/Cart/Cart";
import PlaceOrder from "./Pages/PlaceOrder/PlaceOrder.jsx";
import Footer from "./component/Footer/Footer.jsx";
import LoginPopup from "./component/LoginPopup/LoginPopup.jsx";
import ProtectedRoute from "./component/ProtectedRoute.jsx";
import Dashboard from "./Pages/Admin/Dashboard";
import AddFood from "./Pages/Admin/AddFood";
import FoodList from "./Pages/Admin/FoodList";
import Orders from "./Pages/Admin/Orders";
import AdminRoute from "./component/AdminRoute";
import AdminLayout from "../src/Layout/AdminLayout.jsx";
import OrderSuccess from "./Pages//OrderSuccess/OrderSucces.jsx";

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState(null);

  return (
    <>
      {showLogin && (
        <LoginPopup setShowLogin={setShowLogin} setUser={setUser} />
      )}
      <div className="app-layout">
        <Navbar setShowLogin={setShowLogin} user={user} setUser={setUser} />
        <div className="app-content">
          {/* pass setShowLogin here */}

          <Routes>
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="add-food" element={<AddFood />} />
              <Route path="foods" element={<FoodList />} />
            </Route>
            <Route path="orders" element={<Orders />} />

            <Route path="/" element={<Home />} />

            <Route path="/order-success" element={<OrderSuccess />} />

            {/* 🔒 Protected */}
            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              }
            />

            <Route
              path="/placeorder"
              element={
                <ProtectedRoute>
                  <PlaceOrder />
                </ProtectedRoute>
              }
            />

            <Route
              path="/placeorder"
              element={
                <ProtectedRoute>
                  <PlaceOrder />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default App;
