import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { StoreProvider } from "./context/StoreContext";
import { AdminAuthProvider } from "./context/AdminAuthContext";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import FindAPart from "./pages/FindAPart";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import About from "./pages/About";
import Admin from "./pages/Admin";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function Layout() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/find-a-part" element={<FindAPart />} />
        <Route path="/about" element={<About />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/admin" element={<Admin />} />
      <Route path="/admin/:section" element={<Admin />} />
      <Route path="/*" element={<Layout />} />
    </Routes>
  );
}

function NotFound() {
  return (
    <div className="pt-16 min-h-screen flex flex-col items-center justify-center text-center px-4" style={{ background: "#FFFCF4" }}>
      <p className="text-6xl mb-6">404</p>
      <h1 className="text-2xl font-extrabold mb-3" style={{ fontFamily: "var(--font-display)", color: "#151515" }}>Page not found</h1>
      <p className="text-sm mb-8" style={{ color: "#777777" }}>This page doesn't exist. Let's get you back on track.</p>
      <a href="/" className="px-8 py-3.5 rounded-xl text-sm font-semibold text-white" style={{ background: "#FF6115", fontFamily: "var(--font-display)" }}>
        Go Home
      </a>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <StoreProvider>
        <AdminAuthProvider>
          <CartProvider>
            <AppRoutes />
          </CartProvider>
        </AdminAuthProvider>
      </StoreProvider>
    </BrowserRouter>
  );
}
