import express from "express";
import { db } from "../db.js"; // Veritabanı bağlantısını içe aktar

const router = express.Router();

router.get("/get/:product_id", async (req, res) => {
  const { product_id } = req.params;
  try {
    const [rows] = await db.query(
      "SELECT * FROM product_variants WHERE product_id = ?",
      [product_id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Kayıt bulunamadı" });
    }
    res.json(rows);
  } catch (error) {
    console.error("Veriyi alırken hata:", error);
    res.status(500).json({ error: "Veriyi alırken hata oluştu" });
  }
});
router.post("/add", async (req, res) => {
  const { product_id, variant_id } = req.body;

  if (!product_id || !variant_id) {
    return res
      .status(400)
      .json({ error: "product_id ve variant_id gereklidir" });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO product_variants (product_id, variant_id) VALUES (?, ?)",
      [product_id, variant_id]
    );
    res
      .status(201)
      .json({ message: "Ürün varyantı eklendi", id: result.insertId });
  } catch (error) {
    console.error("Veri eklerken hata:", error);
    res.status(500).json({ error: "Veri eklenirken hata oluştu" });
  }
});
router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query(
      "DELETE FROM product_variants WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Silinecek kayıt bulunamadı" });
    }

    res.json({ message: "Ürün varyantı silindi" });
  } catch (error) {
    console.error("Veri silinirken hata:", error);
    res.status(500).json({ error: "Veri silinirken hata oluştu" });
  }
});

export default router;
