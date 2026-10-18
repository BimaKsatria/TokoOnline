
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Product = require("../models/product");

// Mengambil semua produk
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mengambil detail satu produk berdasarkan ID MongoDB
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "ID produk tidak valid.",
      });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        message: "Produk tidak ditemukan.",
      });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Menambahkan produk baru
router.post("/", async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Menghapus produk berdasarkan ID MongoDB
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "ID produk tidak valid.",
      });
    }

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        message: "Produk tidak ditemukan.",
      });
    }

    res.json({
      message: "Produk berhasil dihapus.",
      product,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


 // Memperbarui produk berdasarkan ID
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "ID produk tidak valid.",
      });
    }

    const product = await Product.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product) {
      return res.status(404).json({
        message: "Produk tidak ditemukan.",
      });
    }

    res.json({
      message: "Produk berhasil diperbarui.",
      product,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


module.exports = router;
