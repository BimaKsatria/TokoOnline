
import { Link } from "react-router-dom";

const rupiah = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

export default function ProductCard({ product }) {
  return (
    <Link
      to={`/products/${product._id}`}
      className="product-card"
    >
      <div className="product-image">
        <span>{product.category}</span>
      </div>

      <div className="product-info">
        <h3>{product.name}</h3>

        <p className="price">{rupiah(product.price)}</p>

        <small>Stok: {product.stock ?? 0}</small>
      </div>
    </Link>
  );
}
