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

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // Önce ilişkili verileri sil
    await connection.query(
      "DELETE FROM product_additionalfeatures WHERE additionalfeature_id = ?",
      [id]
    );
    await connection.query(
      "DELETE FROM product_additionalfeatures_details WHERE additionalfeature_id = ?",
      [id]
    );

    // Ana tabloyu sil
    const [result] = await connection.query(
      "DELETE FROM additionalfeatures WHERE id = ?",
      [id]
    );

    if (result.affectedRows > 0) {
      await connection.commit();
      res.json({ message: "Özellik ve ilişkili veriler başarıyla silindi." });
    } else {
      await connection.rollback();
      res.status(404).json({ message: "Özellik bulunamadı." });
    }
  } catch (err) {
    await connection.rollback();
    console.error("Özellik silme hatası:", err);
    res
      .status(500)
      .json({ message: "Özellik silinemedi.", error: err.message });
  } finally {
    connection.release();
  }
});

export default router;
