import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import AdminProducts from "./pages/AdminProducts";

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/produk" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/admin/produk" element={<AdminProducts />} />
        </Routes>
      </main>
      <footer className="footer">
        <span>Toko Online</span>
        <span>© 2026 Bima Ksatria Wicaksono</span>
      </footer>
    </div>
  );
}