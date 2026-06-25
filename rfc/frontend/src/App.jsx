import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrdersPage from "./pages/OrdersPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import AdminOrders from "./pages/AdminOrders";
import PrivateRoute from "./components/PrivateRoute";
import CategoryPage from "./pages/CategoryPage";
import TrackOrder from "./pages/TrackOrder";
import Footer from "./components/Footer";
import FinanceDashboard from "./pages/FinanceDashboard";
import ProductDetails from "./pages/ProductDetails";
import { Toaster } from "react-hot-toast"; 
import Profile from "./pages/Profile";
import AdminMarketing from "./pages/AdminMarketing";

// FLOATING LIVE CHAT WIDGET REMAINING AS REQUESTED
import SupportChatWidget from "./components/SupportChatWidget";

function App() {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <div className={darkMode ? "bg-gray-900 text-white min-h-screen transition-all duration-300" : "bg-white text-gray-900 min-h-screen transition-all duration-300"}>
      <BrowserRouter>
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
        <Toaster position="top-center" reverseOrder={false} />
        
        <Routes>
          <Route path="/" element={<Home darkMode={darkMode} />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/category/:categoryName" element={<CategoryPage />} />
          <Route path="/orders" element={<PrivateRoute><OrdersPage /></PrivateRoute>} />
          <Route path="/admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
          <Route path="/admin-orders" element={<PrivateRoute><AdminOrders /></PrivateRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/track-order" element={<TrackOrder />} />
          <Route path="/admin-finance" element={<PrivateRoute><FinanceDashboard /></PrivateRoute>} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/admin-marketing" element={<PrivateRoute><AdminMarketing /></PrivateRoute>} />
        </Routes>
        
        {/* Support floating chat desk widget alive and running as requested */}
        <SupportChatWidget />
        
        <Footer darkMode={darkMode} />
      </BrowserRouter>
    </div>
  );
}

export default App;
