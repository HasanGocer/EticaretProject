import express from "express";
import { db } from "../db.js";

const router = express.Router();

router.post("/add", async (req, res) => {
  const { category_id, name } = req.body;

  if (!category_id || !name) {
    return res.status(400).json({ message: "Eksik bilgi gönderildi." });
  }

  try {
    const query = "INSERT INTO subcategories (category_id, name) VALUES (?, ?)";
    const [result] = await db.execute(query, [category_id, name]);

    res.status(201).json({
      message: "Alt kategori başarıyla eklendi.",
      subcategory: { id: result.insertId, category_id, name },
    });
  } catch (err) {
    console.error("Veritabanına veri eklenirken hata: ", err);
    res
      .status(500)
      .json({ message: "Alt kategori eklenirken bir hata oluştu." });
  }
});
router.get("/get/:category_id", async (req, res) => {
  const { category_id } = req.params;

  if (!category_id) {
    return res.status(400).json({ error: "category_id parametresi gerekli!" });
  }

  try {
    const [rows] = await db.execute(
      "SELECT * FROM subcategorys WHERE category_id = ?",
      [category_id]
    );
    res.json(rows);
  } catch (error) {
    console.error("Veritabanı hatası:", error);
    res.status(500).json({ error: "Veritabanı hatası" });
  }
});
router.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Eksik bilgi gönderildi." });
  }

  try {
    const query = "UPDATE subcategorys SET name = ? WHERE id = ?";
    const [result] = await db.execute(query, [name, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Alt kategori bulunamadı." });
    }

    res.status(200).json({ message: "Alt kategori başarıyla güncellendi." });
  } catch (error) {
    console.error("Alt kategori güncellenirken hata oluştu:", error);
    res.status(500).json({ message: "Sunucu tarafında hata oluştu." });
  }
});
router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const query = "DELETE FROM subcategorys WHERE id = ?";
    const [result] = await db.execute(query, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Alt kategori bulunamadı." });
    }

    res.status(200).json({ message: "Alt kategori başarıyla silindi!" });
  } catch (err) {
    console.error("Subcategory silinirken hata oluştu: ", err);
    res
      .status(500)
      .send({ message: "Subcategory silinirken bir hata oluştu." });
  }
});

export default router;
