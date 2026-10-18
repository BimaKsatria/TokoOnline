
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const productRoutes = require("./routes/products");

app.use(cors());
app.use(express.json());

// Route utama
app.get("/", (req, res) => {
  res.json({
    message: "Backend Node.js + Express berhasil!",
  });
});

app.use("/api/auth", authRoutes);
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET belum diatur di .env");
}
// Route produk
app.use("/api/products", productRoutes);

// Koneksi MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log(`Server berjalan di http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error.message);
  });

