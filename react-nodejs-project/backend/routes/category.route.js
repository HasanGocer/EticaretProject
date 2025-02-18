// ES Module format
import express from "express";
import { db } from "../db.js";

const router = express.Router();

router.post("/add", async (req, res) => {
  const { name } = req.body;

  try {
    const [result] = await db.query("INSERT INTO categorys (name) VALUES (?)", [
      name,
    ]);
    res.status(200).json({
      message: "Özellik başarıyla eklendi!",
      category: result,
    });
  } catch (err) {
    console.error("Veritabanı hatası:", err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
});
router.get("/get", async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM categorys");
    res.status(200).json(results);
  } catch (err) {
    console.error("Kategori alma hatası:", err);
    res.status(500).json({ message: "Kategori alınamadı." });
  }
});
router.put("/update/:id", (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!id || !name) {
    return res.status(400).json({ message: "ID ve name gerekli." });
  }

  const query = "UPDATE categorys SET name = ? WHERE id = ?";
  db.query(query, [name, id], (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Bir hata oluştu.", error: err.message });
    }
    if (result.affectedRows > 0) {
      res.json({ message: "Kategori başarıyla güncellendi!" });
    } else {
      res.status(404).json({ message: "Kategori bulunamadı!" });
    }
  });
});
router.delete("/delete/:id", (req, res) => {
  const { id } = req.params;

  const deleteSubcategoriesQuery =
    "DELETE FROM subcategorys WHERE category_id = ?";
  db.query(deleteSubcategoriesQuery, [id], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Alt kategoriler silinirken hata oluştu.",
        error: err.message,
      });
    }

    const deleteCategoryQuery = "DELETE FROM categorys WHERE id = ?";
    db.query(deleteCategoryQuery, [id], (err, result) => {
      if (err) {
        return res.status(500).json({
          message: "Kategori silinirken hata oluştu.",
          error: err.message,
        });
      }
      res
        .status(200)
        .json({ message: "Kategori ve alt kategoriler başarıyla silindi." });
    });
  });
});

export default router;
