
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const rupiah = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

export default function ProductDetail() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `http://localhost:5000/api/products/${encodeURIComponent(id)}`
        );

        if (response.status === 404) {
          setProduct(null);
          return;
        }

        if (!response.ok) {
          throw new Error("Gagal mengambil detail produk.");
        }

        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <div className="empty">Memuat detail produk...</div>;
  }

  if (error) {
    return (
      <div className="empty detail-not-found">
        <h2>Gagal memuat produk</h2>
        <p>{error}</p>
        <Link to="/produk" className="primary-btn">
          Kembali ke Produk
        </Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="empty detail-not-found">
        <h2>Produk tidak ditemukan</h2>
        <Link to="/produk" className="primary-btn">
          Kembali ke Produk
        </Link>
      </div>
    );
  }

  return (
    <section className="detail-page">
      <Link to="/produk" className="back-link">
        ← Kembali ke Daftar Produk
      </Link>

      <div className="detail-card">
        <div className="detail-image">
          <span>{product.category}</span>
        </div>

        <div className="detail-content">
          <p className="eyebrow">{product.category}</p>
          <h1>{product.name}</h1>

          <p className="detail-price">{rupiah(product.price)}</p>

          <p className="detail-stock">
            Stok tersedia: {product.stock ?? 0}
          </p>

          <hr />

          <h3>Deskripsi Produk</h3>
          <p className="description">
            {product.description || "Belum ada deskripsi produk."}
          </p>

          <Link to="/produk" className="checkout-btn">
            Kembali Belanja
          </Link>
        </div>
      </div>
    </section>
  );
}
