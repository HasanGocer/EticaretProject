import express from "express";
import { db } from "../db.js";

const router = express.Router();

router.post("/add", async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: "Gönderilen veri eksik!" });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO additionalfeatures (name) VALUES (?)",
      [name]
    );
    res.status(200).json({
      message: "Özellik başarıyla eklendi!",
      additionalfeature: result,
    });
  } catch (err) {
    console.error("Veritabanı hatası:", err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
});
router.get("/get", async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM additionalfeatures");
    res.status(200).json(results);
  } catch (err) {
    console.error("Ekstra özellikleri alma hatası:", err);
    res.status(500).json({ message: "Ekstra özellikler alınamadı." });
  }
});
router.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!id || !name) {
    return res.status(400).json({ message: "ID ve name gerekli." });
  }

  try {
    const [result] = await db.query(
      "UPDATE additionalfeatures SET name = ? WHERE id = ?",
      [name, id]
    );

    if (result.affectedRows > 0) {
      res.json({ message: "Özellik başarıyla güncellendi." });
    } else {
      res.status(404).json({ message: "Özellik bulunamadı." });
    }
  } catch (error) {
    console.error("Özellik güncellenirken hata:", error);
    res.status(500).json({ message: "Bir hata oluştu." });
  }
});
router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query(
      "DELETE FROM product_additionalfeatures_details WHERE product_additionalfeatures IN (SELECT id FROM product_additionalfeatures WHERE additionalfeature_id = ?)",
      [id]
    );
    await db.query(
      "DELETE FROM product_additionalfeatures WHERE additionalfeature_id = ?",
      [id]
    );
    const [result] = await db.query(
      "DELETE FROM additionalfeatures WHERE id = ?",
      [id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Özellik bulunamadı." });
    }
    res.json({ message: "Özellik ve ilişkili veriler başarıyla silindi." });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Veritabanı hatası", details: error.message });
  }
});

export default router;
