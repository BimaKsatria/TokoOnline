
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";

const categories = [
  "Elektronik",
  "Furnitur",
  "Handphone & Gadget",
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Gagal mengambil data produk");
        }
        return response.json();
      })
      .then((data) => {
        setProducts(data);
        setError("");
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <>
      {/* HERO SECTION */}
      <section className="hero-grid">
        <div className="hero-card hero-card-image">
          <div className="hero-image-slides">
            <div className="hero-image-slide hero-image-1"></div>
            <div className="hero-image-slide hero-image-2"></div>
            <div className="hero-image-slide hero-image-3"></div>
          </div>

          <div className="hero-image-overlay"></div>
        </div>

        <div className="hero-card hero-card-light">
          <div className="hero-slides">
            <div className="hero-slide slide-1"></div>
            <div className="hero-slide slide-2"></div>
            <div className="hero-slide slide-3"></div>
          </div>

          <div className="hero-overlay"></div>

          <div className="hero-content">
            <span className="hero-label">Promo</span>
            <h1>
              Belanja Mudah
              <br />
              di Toko Online
            </h1>
            <p>
              Temukan produk pilihan dengan harga terjangkau.
            </p>
            <Link to="/produk" className="primary-btn">
              Lihat Produk
            </Link>
          </div>
        </div>
      </section>

      {/* CATEGORY SECTION */}
      <section className="category-section">
        <div className="section-title-row">
          <h2>Kategori</h2>
          <Link to="/produk">Lihat semua</Link>
        </div>

        <div className="category-list">
          {categories.map((category) => (
            <Link
              key={category}
              to={`/produk?category=${encodeURIComponent(category)}`}
              className="category-pill"
            >
              {category}
            </Link>
          ))}
        </div>
      </section>

      {/* PRODUCT SECTION */}
      <section className="product-section">
        <div className="section-title-row">
          <h2>Produk Terbaru</h2>
          <Link to="/produk">Lihat semua</Link>
        </div>

        {loading && <p>Memuat produk...</p>}

        {!loading && error && (
          <p role="alert">
            {error}. Pastikan backend berjalan dan API bisa diakses.
          </p>
        )}

        {!loading && !error && products.length === 0 && (
          <p>Belum ada produk tersedia.</p>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="product-grid">
            {products.slice(0, 8).map((product) => (
              <ProductCard
                key={product._id || product.id}
                product={product}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
