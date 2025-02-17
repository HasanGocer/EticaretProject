// ES Module format
import express from "express";
import db from "../db.js"; // Veritabanı bağlantısı dosyanızın yolu

const router = express.Router();

router.post("/add", (req, res) => {
  const { name } = req.body;
  const sql = "INSERT INTO categorys (name) VALUES (?)";
  db.query(sql, [name], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({
      message: "Kategori başarıyla eklendi!",
      category: result,
    });
  });
});

router.get("/get", (req, res) => {
  const query = "SELECT * FROM categorys";
  db.query(query, (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Kategoriler alınamadı.", error: err.message });
    }
    res.status(200).json(results);
  });
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

  // Alt kategorileri sil
  const deleteSubcategoriesQuery =
    "DELETE FROM subcategorys WHERE category_id = ?";
  db.query(deleteSubcategoriesQuery, [id], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Alt kategoriler silinirken hata oluştu.",
        error: err.message,
      });
    }

    // Üst kategoriyi sil
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
