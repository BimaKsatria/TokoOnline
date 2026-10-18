import { useEffect, useState } from "react";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState({
    name: "",
    category: "Elektronik",
    price: "",
    stock: "",
  });

  const API_URL = "http://localhost:5000/api/products";

  // Mengambil produk dari MongoDB melalui backend
  const fetchProducts = async () => {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Gagal mengambil data produk.");
      }

      const data = await response.json();

      setProducts(data);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    const loadProducts = async () => {
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("Gagal mengambil data produk.");
        }

        const data = await response.json();

        if (active) {
          setProducts(data);
          setError("");
        }
      } catch (err) {
        if (active) {
          setError(err.message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      active = false;
    };
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Menambahkan produk ke database

  const addProduct = async (e) => {
    e.preventDefault();

    if (
      !form.name.trim() ||
      form.price === "" ||
      form.stock === "" ||
      Number(form.price) < 0 ||
      Number(form.stock) < 0
    ) {
      setError("Lengkapi data produk dengan benar.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const isEditing = Boolean(editingProduct);

      const response = await fetch(
        isEditing ? `${API_URL}/${editingProduct._id}` : API_URL,
        {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.name.trim(),
            category: form.category,
            price: Number(form.price),
            stock: Number(form.stock),
            description:
              editingProduct?.description || "Produk baru dari halaman admin.",
          }),
        },
      );

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Gagal menyimpan produk.");
      }

      setForm({
        name: "",
        category: "Elektronik",
        price: "",
        stock: "",
      });

      setEditingProduct(null);
      await fetchProducts();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (product) => {
    setEditingProduct(product);

    setForm({
      name: product.name || "",
      category: product.category || "Elektronik",
      price: String(product.price ?? ""),
      stock: String(product.stock ?? ""),
    });

    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const cancelEdit = () => {
    setEditingProduct(null);

    setForm({
      name: "",
      category: "Elektronik",
      price: "",
      stock: "",
    });

    setError("");
  };

  // Menghapus produk dari database
  const removeProduct = async (id) => {
    const confirmed = window.confirm("Yakin ingin menghapus produk ini?");

    if (!confirmed) return;

    try {
      setError("");

      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Gagal menghapus produk.");
      }

      await fetchProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="admin-page">
      <div className="admin-heading">
        <div>
          <p className="eyebrow">ADMIN</p>
          <h1>Manajemen Produk</h1>
        </div>
        <span>Admin Product CRUD</span>
      </div>

      {error && <p role="alert">{error}</p>}

      <div className="admin-layout">
        <form className="admin-form" onSubmit={addProduct}>
          <h2>FORM PRODUK</h2>

          <label htmlFor="name">Nama Produk</label>
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <label htmlFor="category">Kategori</label>
          <select
            id="category"
            name="category"
            value={form.category}
            onChange={handleChange}
          >
            <option>Elektronik</option>
            <option>Furnitur</option>
            <option>Handphone &amp; Gadget</option>
          </select>

          <label htmlFor="price">Harga Produk</label>
          <input
            id="price"
            name="price"
            type="number"
            min="0"
            value={form.price}
            onChange={handleChange}
            required
          />

          <label htmlFor="stock">Stok Produk</label>
          <input
            id="stock"
            name="stock"
            type="number"
            min="0"
            value={form.stock}
            onChange={handleChange}
            required
          />

          <button className="save-btn" type="submit" disabled={saving}>
            {saving
              ? "Menyimpan..."
              : editingProduct
                ? "Simpan Perubahan"
                : "Simpan Produk"}
          </button>

          {editingProduct && (
            <button
              className="delete-btn"
              type="button"
              onClick={cancelEdit}
              disabled={saving}
            >
              Batal Edit
            </button>
          )}
        </form>

        <div className="admin-table-wrap">
          <div className="table-head">
            <h2>DAFTAR PRODUK</h2>
            <span>{products.length} item</span>
          </div>

          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama Produk</th>
                  <th>Kategori</th>
                  <th>Harga</th>
                  <th>Stok</th>
                  <th>Aksi</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6">Memuat produk...</td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan="6">Belum ada produk.</td>
                  </tr>
                ) : (
                  products.map((product, index) => (
                    <tr key={product._id || product.id}>
                      <td>{index + 1}</td>
                      <td>{product.name}</td>
                      <td>{product.category}</td>
                      <td>
                        Rp
                        {Number(product.price || 0).toLocaleString("id-ID")}
                      </td>
                      <td>{product.stock ?? 0}</td>

                      <td>
                        <div className="admin-action-buttons">
                          <button
                            className="edit-btn"
                            type="button"
                            onClick={() => startEdit(product)}
                          >
                            Edit
                          </button>

                          <button
                            className="delete-btn"
                            type="button"
                            onClick={() =>
                              removeProduct(product._id || product.id)
                            }
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
