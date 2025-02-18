import express from "express";
import { db } from "../db.js";

const router = express.Router();

router.post("/add", async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Varyant ismi gereklidir." });
  }

  try {
    const [result] = await db.query("INSERT INTO variants (name) VALUES (?)", [
      name,
    ]);
    res.status(200).json({
      message: "Varyant başarıyla eklendi.",
      variant: result,
    });
  } catch (error) {
    console.error("Varyant ekleme hatası:", error);
    res.status(500).json({
      message: "Veritabanına varyant eklenemedi.",
      error: error.message,
    });
  }
});
router.get("/get", async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM variants");
    res.status(200).json(results);
  } catch (error) {
    console.error("Varyantları alma hatası:", error);
    res
      .status(500)
      .json({ message: "Varyantlar alınamadı.", error: error.message });
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
      "UPDATE variants SET name = ? WHERE id = ?",
      [name, id]
    );

    if (result.affectedRows > 0) {
      res.json({ message: "Varyant başarıyla güncellendi!" });
    } else {
      res.status(404).json({ message: "Varyant bulunamadı!" });
    }
  } catch (error) {
    console.error("Varyant güncellenirken hata:", error.message);
    res.status(500).json({ message: "Bir hata oluştu.", error: error.message });
  }
});
router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query(
      "DELETE FROM product_variant_details WHERE product_variants IN (SELECT id FROM product_variants WHERE variant_id = ?)",
      [id]
    );
    await db.query("DELETE FROM product_variants WHERE variant_id = ?", [id]);
    const [result] = await db.query("DELETE FROM variants WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Varyant bulunamadı." });
    }
    res.json({ message: "Varyant ve ilişkili veriler başarıyla silindi." });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Veritabanı hatası", details: error.message });
  }
});

export default router;
