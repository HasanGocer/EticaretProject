// auth.routes.js
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../auth.db.js"; // Veritabanı bağlantısını içe aktarma
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();
const secretKey = process.env.SECRET_KEY;

if (!secretKey) {
  throw new Error("SECRET_KEY ortam değişkeni eksik!");
}

// Kullanıcı kaydı
router.post("/register", async (req, res) => {
  const { firstName, lastName, email, password, phone, nationalId, gender } =
    req.body;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !password ||
    !phone ||
    !nationalId ||
    !gender
  ) {
    return res.status(400).json({ message: "Tüm alanlar doldurulmalıdır." });
  }

  try {
    // Şifre hashleme
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `INSERT INTO users (firstName, lastName, email, password, phone, nationalId, gender) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    db.query(
      query,
      [firstName, lastName, email, hashedPassword, phone, nationalId, gender],
      (err, result) => {
        if (err) {
          console.error("Error creating user:", err);
          return res.status(500).json({ message: "Bir hata oluştu." });
        }
        res
          .status(201)
          .json({ message: "Kayıt başarılı", userId: result.insertId });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Sunucu hatası." });
  }
});
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  const query = "SELECT * FROM users WHERE email = ?";
  db.query(query, [email], async (err, results) => {
    if (err) {
      console.error("Login error:", err);
      return res.status(500).json({ message: "Sunucu hatası." });
    }

    if (results.length === 0) {
      return res
        .status(400)
        .json({ message: "Bu email ile bir kullanıcı bulunamadı." });
    }

    const user = results[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Şifre yanlış." });
    }

    // JWT Token oluşturuluyor
    const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: "24h" });

    res.status(200).json({ token, user });
  });
});
router.put("/update/:id", (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, phone, nationalId, gender } = req.body;

  const query = `UPDATE users SET firstName=?, lastName=?, email=?, phone=?, nationalId=?, gender=? WHERE id=?`;
  db.query(
    query,
    [firstName, lastName, email, phone, nationalId, gender, id],
    (err, result) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ message: "Sunucu hatası, güncelleme yapılamadı." });
      }

      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ message: "Kullanıcı bulunamadı veya değişiklik yapılmadı." });
      }

      res.status(200).json({ message: "Başarılı bir şekilde güncellendi." });
    }
  );
});

// Tüm kullanıcıları getir
router.get("/users", (req, res) => {
  const query =
    "SELECT id, firstName, lastName, email, phone, nationalId, gender, createdAt, updatedAt FROM users";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Kullanıcıları getirirken hata oluştu:", err);
      return res.status(500).json({ message: "Sunucu hatası." });
    }
    res.status(200).json(results);
  });
});

export default router;
