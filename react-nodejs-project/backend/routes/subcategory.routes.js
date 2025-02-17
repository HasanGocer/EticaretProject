import express from "express";
import { db } from "../db.js";

const router = express.Router();

router.post("/add", async (req, res) => {
  const { category_id, name } = req.body;

  if (!category_id || !name) {
    return res.status(400).json({ message: "Eksik bilgi gönderildi." });
  }

  try {
    const query = "INSERT INTO subcategorys (category_id, name) VALUES (?, ?)";
    const [result] = await db.execute(query, [category_id, name]);
    res
      .status(201)
      .json({
        message: "Alt kategori başarıyla eklendi.",
        subcategory: result,
      });
  } catch (err) {
    console.error("Veritabanına veri eklenirken hata: ", err);
    res
      .status(500)
      .json({ message: "Veritabanına veri eklenirken hata oluştu." });
  }
});
router.get("/get", async (req, res) => {
  try {
    const query = "SELECT * FROM subcategorys";
    const [results] = await db.query(query);
    res.status(200).json(results);
  } catch (err) {
    console.error("Alt kategoriler çekilirken hata oluştu:", err);
    res.status(500).send("Bir hata oluştu.");
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
