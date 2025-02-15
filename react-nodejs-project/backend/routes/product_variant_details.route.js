import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { db } from "../config/db.js";

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

router.get("/get/:product_variants", async (req, res) => {
  try {
    const { product_variants } = req.params;
    const [rows] = await db.query(
      "SELECT * FROM product_variant_details WHERE product_variants = ?",
      [product_variants]
    );
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Product variant detail not found" });
    }
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Database error", details: error.message });
  }
});
router.post("/add", upload.single("image"), async (req, res) => {
  try {
    const { product_variants, details } = req.body;
    if (!req.file) {
      return res.status(400).json({ message: "Resim dosyası gereklidir." });
    }
    const imageUrl = `/uploads/${req.file.filename}`;
    const [result] = await db.query(
      "INSERT INTO product_variant_details (product_variants, image_data, details) VALUES (?, ?, ?)",
      [product_variants, imageUrl, details]
    );
    res.status(201).json({
      id: result.insertId,
      product_variants,
      image_data: imageUrl,
      details,
    });
  } catch (error) {
    res.status(500).json({ error: "Database error", details: error.message });
  }
});
router.put("/update/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const { product_variants, details } = req.body;
    let sql =
      "UPDATE product_variant_details SET product_variants = ?, details = ? WHERE id = ?";
    let params = [product_variants, details, id];

    if (req.file) {
      const imageUrl = `/uploads/${req.file.filename}`;
      const [oldData] = await db.query(
        "SELECT image_data FROM product_variant_details WHERE id = ?",
        [id]
      );
      if (oldData.length > 0 && oldData[0].image_data) {
        const oldImagePath = path.join(process.cwd(), oldData[0].image_data);
        fs.unlink(oldImagePath, (err) => {
          if (err) console.error("Eski resim silinirken hata:", err);
        });
      }
      sql =
        "UPDATE product_variant_details SET product_variants = ?, image_data = ?, details = ? WHERE id = ?";
      params = [product_variants, imageUrl, details, id];
    }

    const [result] = await db.query(sql, params);
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Product variant detail not found" });
    }
    res.json({ message: "Product variant detail updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Database error", details: error.message });
  }
});
router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query(
      "SELECT image_data FROM product_variant_details WHERE id = ?",
      [id]
    );
    if (result.length === 0) {
      return res
        .status(404)
        .json({ message: "Product variant detail not found" });
    }
    const imagePath = result[0].image_data;
    const fullPath = path.join(process.cwd(), imagePath);
    fs.unlink(fullPath, async (err) => {
      if (err) {
        console.error("Resim silinirken hata:", err);
        return res.status(500).json({ message: "Resim silinemedi." });
      }
      await db.query("DELETE FROM product_variant_details WHERE id = ?", [id]);
      res
        .status(200)
        .json({ message: "Product variant detail deleted successfully" });
    });
  } catch (error) {
    res.status(500).json({ error: "Database error", details: error.message });
  }
});

router.use("/uploads", express.static(uploadDir));

export default router;
