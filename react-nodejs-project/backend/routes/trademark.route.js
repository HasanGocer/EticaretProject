import express from "express";
import multer from "multer";
import { db } from "../db.js";
import path from "path";
import fs from "fs";

const router = express.Router();

// Uploads klasörünü proje kök dizinine taşıdık
const uploadDir = path.join(process.cwd(), "uploads");

// Uploads klasörü yoksa oluştur
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer konfigürasyonu
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.post("/add-hg", async (req, res) => {
  try {
    return res.status(400).json({ message: "Girdik" });
    const { name } = req.body;
    if (!req.file) {
      return res.status(400).json({ message: "Resim dosyası gereklidir." });
    }

    if (!name) {
      return res.status(400).json({ message: "Trademark adı gereklidir." });
    }
    const image_data = `/uploads/${req.file.filename}`;

    const [result] = await db.query(
      "INSERT INTO trademarks (name, image_data ) VALUES (?, ?)",
      [name, image_data]
    );
    res.status(200).json({
      message: "Özellik başarıyla eklendi!",
      trademark: result,
    });
  } catch (err) {
    console.error("Veritabanı hatası:", err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
});
router.get("/get", async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM trademarks");
    res.status(200).json(results);
  } catch (err) {
    console.error("Trademarkları alma hatası:", err);
    res.status(500).json({ message: "Trademarklar alınamadı." });
  }
});
router.put("/update/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!id || !name) {
      return res.status(400).json({ message: "ID ve isim gereklidir." });
    }

    let sql = "UPDATE trademarks SET name = ? WHERE id = ?";
    let params = [name, id];

    if (req.file) {
      const imageUrl = `/uploads/${req.file.filename}`;

      // Eski resmi sil
      const [oldData] = await db.query(
        "SELECT image_data FROM trademarks WHERE id = ?",
        [id]
      );
      if (oldData.length > 0) {
        const oldImagePath = path.join(process.cwd(), oldData[0].image_data);
        fs.unlink(oldImagePath, (err) => {
          if (err) console.error("Eski resim silinirken hata:", err);
        });
      }

      sql = "UPDATE trademarks SET name = ?, image_data = ? WHERE id = ?";
      params = [name, imageUrl, id];
    }

    const [result] = await db.query(sql, params);

    if (result.affectedRows > 0) {
      res.json({ message: "Trademark başarıyla güncellendi." });
    } else {
      res.status(404).json({ message: "Trademark bulunamadı." });
    }
  } catch (err) {
    console.error("Trademark güncelleme hatası:", err);
    res
      .status(500)
      .json({ message: "Güncelleme işlemi başarısız.", error: err.message });
  }
});
router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      "SELECT image_data FROM trademarks WHERE id = ?",
      [id]
    );
    if (result.length === 0) {
      return res.status(404).json({ message: "Trademark bulunamadı." });
    }

    const imagePath = result[0].image_data;
    const fullPath = path.join(process.cwd(), imagePath);

    // Resmi silme
    fs.unlink(fullPath, async (err) => {
      if (err) {
        console.error("Resim silinirken hata:", err);
        return res.status(500).json({ message: "Resim silinemedi." });
      }

      // Veritabanından silme işlemi
      await db.query("DELETE FROM trademarks WHERE id = ?", [id]);
      res.status(200).json({ message: "Trademark başarıyla silindi." });
    });
  } catch (err) {
    console.error("Trademark silme hatası:", err);
    res
      .status(500)
      .json({ message: "Trademark silinemedi.", error: err.message });
  }
});

router.use("/uploads", express.static(uploadDir));

export default router;
