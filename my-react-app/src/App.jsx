import { useEffect } from "react";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import Home from "./components/Home";
import Header from "./Features/Header";
import Footer from "./Features/Footer";
import Notfound from "./components/Notfound";
import Cart from "./components/Cart";
import ProductList from "./components/ProductList";
import Productdetail from "./components/Productdetail";
import Checkout from "./components/Checkout";
import Login from "./components/login.jsx";
import Register from "./components/Register.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import Wishlist from "./components/Wishlist";
import Profile from "./components/Profile";
import Address from "./components/Address";
import Orders from "./components/Orders";
import ProductCompare from "./components/ProductCompare";
import AiAssistant from "./components/AiAssistant";
import GlobalToast from "./components/GlobalToast";

// Admin imports
import AdminRoute from "./components/admin/AdminRoute";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminProducts from "./components/admin/AdminProducts";
import AdminOrders from "./components/admin/AdminOrders";
import AdminUsers from "./components/admin/AdminUsers";
import AdminCategories from "./components/admin/AdminCategories";
import AdminCoupons from "./components/admin/AdminCoupons";
import AdminReviews from "./components/admin/AdminReviews";
import AdminBanners from "./components/admin/AdminBanners";
import AdminSettings from "./components/admin/AdminSettings";
import AdminSupport from "./components/admin/AdminSupport";

function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location.pathname]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("pvx_theme");
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = savedTheme || (prefersDark ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", initialTheme);
  }, []);

  const hideHeaderRoutes = ["/login", "/register"];
  const isAdminRoute = location.pathname.toLowerCase().startsWith("/admin");
  const shouldHideHeader = hideHeaderRoutes.includes(location.pathname.toLowerCase()) || isAdminRoute;

  return (
    <div className="app-container">
      {!shouldHideHeader && <Header />}
      <main className="main-content">
        <Routes>
          {/* Public & User Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/productlist" element={<ProductList />} />
          <Route path="/productdetail/:productId" element={<Productdetail />} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path="/address" element={<ProtectedRoute><Address /></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<Navigate to="/login" state={{ adminTab: true }} replace />} />
          <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="coupons" element={<AdminCoupons />} />
            <Route path="banners" element={<AdminBanners />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="support" element={<AdminSupport />} />
          </Route>

          <Route path="*" element={<Notfound />} />
        </Routes>
      </main>
      {!shouldHideHeader && <Footer />}

      {/* 🚀 GLOBAL INTELLIGENT EXPERIENCES */}
      {!shouldHideHeader && (
        <>
          <ProductCompare />
          <AiAssistant />
        </>
      )}

      {/* 🔔 GLOBAL TOAST NOTIFICATIONS */}
      <GlobalToast />
    </div>
  );
}

export default App;
