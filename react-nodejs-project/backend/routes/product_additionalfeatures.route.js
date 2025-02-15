import express from "express";
import { db } from "../db.js"; // Veritabanı bağlantısı

const router = express.Router();

router.post("/add", async (req, res) => {
  try {
    const { product_id, additionalfeature_id } = req.body;

    if (!product_id || !additionalfeature_id) {
      return res.status(400).json({ message: "Eksik veri girdiniz!" });
    }

    const [result] = await db.execute(
      "INSERT INTO product_additionalfeatures (product_id, additionalfeature_id) VALUES (?, ?)",
      [product_id, additionalfeature_id]
    );

    res.status(201).json({
      message: "Özellik başarıyla eklendi.",
      product_additionalfeatures: result,
    });
  } catch (error) {
    console.error("Hata:", error);
    res.status(500).json({ message: "Sunucu hatası" });
  }
});
router.get("/get/:product_id", async (req, res) => {
  try {
    const { product_id } = req.params;

    const [rows] = await db.execute(
      "SELECT * FROM product_additionalfeatures WHERE product_id = ?",
      [product_id]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Bu product_id için özellik bulunamadı." });
    }

    res.status(200).json(rows);
  } catch (error) {
    console.error("Hata:", error);
    res.status(500).json({ message: "Sunucu hatası" });
  }
});
router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.execute(
      "DELETE FROM product_additionalfeatures WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Silinecek kayıt bulunamadı." });
    }

    res.status(200).json({ message: "Başarıyla silindi." });
  } catch (error) {
    console.error("Hata:", error);
    res.status(500).json({ message: "Sunucu hatası" });
  }
});

export default router;
