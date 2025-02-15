import express from "express";
import { db } from "../db.js"; // Veritabanı bağlantısını içe aktarıyoruz

const router = express.Router();

router.get("/get/:product_additionalfeatures", async (req, res) => {
  try {
    const { product_additionalfeatures } = req.params;
    const [rows] = await db.query(
      "SELECT * FROM product_additionalfeatures_details WHERE product_additionalfeatures = ?",
      [product_additionalfeatures]
    );
    if (rows.length === 0)
      return res.status(404).json({ error: "Kayıt bulunamadı." });
    res.json(rows[0]);
  } catch (error) {
    console.error("GET BY ID Error:", error);
    res.status(500).json({ error: "Veri getirilirken hata oluştu." });
  }
});
router.post("/add", async (req, res) => {
  try {
    const { product_additionalfeatures, details } = req.body;
    if (!product_additionalfeatures || !details) {
      return res.status(400).json({ error: "Tüm alanlar zorunludur." });
    }
    const [result] = await db.query(
      "INSERT INTO product_additionalfeatures_details (product_additionalfeatures, details) VALUES (?, ?)",
      [product_additionalfeatures, details]
    );
    res.status(201).json({ message: "Başarıyla eklendi", id: result.insertId });
  } catch (error) {
    console.error("POST Error:", error);
    res.status(500).json({ error: "Veri eklenirken hata oluştu." });
  }
});
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { product_additionalfeatures, details } = req.body;
    if (!product_additionalfeatures || !details) {
      return res.status(400).json({ error: "Tüm alanlar zorunludur." });
    }
    const [result] = await db.query(
      "UPDATE product_additionalfeatures_details SET product_additionalfeatures = ?, details = ? WHERE id = ?",
      [product_additionalfeatures, details, id]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Kayıt bulunamadı." });
    res.json({ message: "Başarıyla güncellendi" });
  } catch (error) {
    console.error("PUT Error:", error);
    res.status(500).json({ error: "Veri güncellenirken hata oluştu." });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query(
      "DELETE FROM product_additionalfeatures_details WHERE id = ?",
      [id]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Kayıt bulunamadı." });
    res.json({ message: "Başarıyla silindi" });
  } catch (error) {
    console.error("DELETE Error:", error);
    res.status(500).json({ error: "Veri silinirken hata oluştu." });
  }
});

export default router;
