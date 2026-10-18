
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";

export default function Products() {
  const [searchParams] = useSearchParams();

  const initialCategory = searchParams.get("category") || "Semua";

  const [category, setCategory] = useState(initialCategory);
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const categories = [
    "Semua",
    "Elektronik",
    "Furnitur",
    "Handphone & Gadget",
  ];

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

  // Filter berdasarkan kategori dan pencarian
  const filtered = useMemo(() => {
    return products.filter((product) => {
      const productName = String(product.name || "").toLowerCase();
      const productCategory = product.category || "";

      const matchCategory =
        category === "Semua" || productCategory === category;

      const matchSearch = productName.includes(
        search.trim().toLowerCase()
      );

      return matchCategory && matchSearch;
    });
  }, [products, category, search]);

  return (
    <section className="product-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">TOKO ONLINE</p>
          <h1>Daftar Produk</h1>
          <p>Pilih produk yang ingin kamu lihat.</p>
        </div>

        <input
          className="page-search"
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari produk..."
        />
      </div>

      <div className="category-list product-filter">
        {categories.map((item) => (
          <button
            key={item}
            type="button"
            className={`category-pill ${
              category === item ? "active" : ""
            }`}
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
      </div>

      {loading && (
        <p className="result-count">Memuat produk...</p>
      )}

      {!loading && error && (
        <p role="alert">
          Gagal memuat produk: {error}
        </p>
      )}

      {!loading && !error && (
        <>
          <div className="result-count">
            {filtered.length} produk ditemukan
          </div>

          {filtered.length > 0 ? (
            <div className="product-grid">
              {filtered.map((product) => (
                <ProductCard
                  key={product._id || product.id}
                  product={product}
                />
              ))}
            </div>
          ) : (
            <div className="empty">
              Produk tidak ditemukan.
            </div>
          )}
        </>
      )}
    </section>
  );
}
