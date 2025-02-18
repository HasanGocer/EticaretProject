import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { db } from "../db.js";

const router = express.Router();

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.post("/add", upload.single("image"), async (req, res) => {
  try {
    const {
      name,
      price,
      stockCode,
      stockQuantity,
      discountRate,
      description,
      category_id,
      trademark_id,
      subcategory_id,
    } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Resim dosyası gereklidir." });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    const productQuery = `
      INSERT INTO products 
      (image, name, price, stockCode, stockQuantity, discountRate, description, category_id, trademark_id, subcategory_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(productQuery, [
      imageUrl,
      name,
      price,
      stockCode,
      stockQuantity,
      discountRate,
      description,
      category_id,
      trademark_id,
      subcategory_id,
    ]);

    res
      .status(200)
      .json({ message: "Ürün başarıyla eklendi.", productId: result.insertId });
  } catch (err) {
    console.error("Ürün ekleme hatası:", err);
    res.status(500).json({ message: "Veritabanına ürün eklenemedi." });
  }
});
router.get("/get", async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM products");
    res.status(200).json(results);
  } catch (err) {
    console.error("Ürünleri alma hatası:", err);
    res.status(500).json({ message: "Ürünler alınamadı." });
  }
});
router.put("/update/:id", upload.single("image"), async (req, res) => {
  try {
    const {
      name,
      price,
      stockCode,
      stockQuantity,
      discountRate,
      description,
      category_id,
      trademark_id,
      subcategory_id,
    } = req.body;

    const productId = req.params.id;
    let imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    if (!name || !price || !stockCode || !stockQuantity) {
      return res.status(400).json({
        message: "Ürün adı, fiyat, stok kodu ve stok miktarı gereklidir.",
      });
    }

    let updateQuery = `
        UPDATE products
        SET name = ?, price = ?, stockCode = ?, stockQuantity = ?, discountRate = ?, description = ?, category_id = ?, trademark_id = ?, subcategory_id = ?
    `;

    const queryParams = [
      name,
      price,
      stockCode,
      stockQuantity,
      discountRate,
      description,
      category_id,
      trademark_id,
      subcategory_id,
    ];

    if (imageUrl) {
      updateQuery += ", image = ?";
      queryParams.push(imageUrl);
    }

    updateQuery += " WHERE id = ?";
    queryParams.push(productId);

    await db.query(updateQuery, queryParams);
    res.status(200).json({ message: "Ürün başarıyla güncellendi." });
  } catch (err) {
    console.error("Ürün güncelleme hatası:", err);
    res.status(500).json({ message: "Ürün güncellenemedi." });
  }
});
router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deleteQueries = [
      "DELETE FROM product_additionalfeatures_details WHERE product_id = ?",
      "DELETE FROM product_variant_details WHERE product_id = ?",
      "DELETE FROM product_additionalfeatures WHERE product_id = ?",
      "DELETE FROM product_variants WHERE product_id = ?",
      "DELETE FROM products WHERE id = ?",
    ];

    for (const query of deleteQueries) {
      await db.query(query, [id]);
    }

    res.status(200).json({ message: "Ürün başarıyla silindi." });
  } catch (err) {
    console.error("Ürün silme hatası:", err);
    res.status(500).json({ message: "Ürün silinemedi." });
  }
});

router.use("/uploads", express.static(uploadDir));

export default router;
