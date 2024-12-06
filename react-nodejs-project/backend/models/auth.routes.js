// auth.routes.js
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../models"); // Importing the models
const User = db.User;  // Accessing the 'User' model correctly

require('dotenv').config();
const router = express.Router();
const secretKey = process.env.SECRET_KEY;

if (!secretKey) {
  throw new Error("SECRET_KEY ortam değişkeni eksik!");
}

// Kullanıcı kaydı
router.post("/register", async (req, res) => {
  const { firstName, lastName, email, password, phone, nationalId, gender } = req.body;

  if (!firstName || !lastName || !email || !password || !phone || !nationalId || !gender) {
    return res.status(400).send({ message: "Tüm alanlar doldurulmalıdır." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      nationalId,
      gender,
    });

    res.status(201).send({ message: "Kayıt başarılı", user: newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send({ message: "Bir hata oluştu." });
  }
});

// Kullanıcı girişi
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) {
    return res.status(400).send({ message: "Bu email ile bir kullanıcı bulunamadı." });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).send({ message: "Şifre yanlış." });
  }

  // Token oluşturuluyor
  const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: "24h" });
  res.status(200).send({ token, user });
});


// Profil bilgisi
router.put('/update/:id', async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, phone, nationalId, gender } = req.body;

  console.log(`Güncelleme isteği alındı, id: ${id}, yeni bilgiler: ${firstName}, ${lastName}, ${email}`);

  try {
    const updatedUser = await User.update({
      firstName,
      lastName,
      email,
      phone,
      nationalId,
      gender
    }, {
      where: { id: id }
    });

    console.log("Güncellenen kullanıcı sayısı:", updatedUser[0]);

    // Güncellenen satır sayısını kontrol et
    if (updatedUser[0] === 0) {
      return res.status(404).json({ message: "Veritabanında güncelleme yapılmadı, kontrol edin." });
    }

    res.status(200).json({ message: "Başarılı bir şekilde güncellendi." });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Sunucu hatası, güncelleme yapılamadı." });
  }
});


// Tüm kullanıcıları getir
router.get("/users", async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    console.error("Kullanıcıları getirirken hata oluştu:", error);
    res.status(500).json({ message: "Sunucu hatası." });
  }
});




module.exports = router;
