import express from "express";
import { db } from "../db.js";

const router = express.Router();

router.post("/add", async (req, res) => {
  try {
    let { user_id, order_number, items, status, order_date, delivery_date } =
      req.body;

    // Tarih formatlarını MySQL'in kabul ettiği formata dönüştür
    order_date = new Date(order_date)
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    delivery_date = new Date(delivery_date)
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    const query = `INSERT INTO orders (user_id, order_number, order_date, delivery_date, status, items) VALUES (?, ?, ?, ?, ?, ?)`;
    const [result] = await db.execute(query, [
      user_id,
      order_number,
      order_date,
      delivery_date,
      status,
      JSON.stringify(items),
    ]);

    res
      .status(200)
      .json({ message: "Sipariş başarıyla oluşturuldu", order: result });
  } catch (err) {
    console.error("Veritabanı sorgu hatası: ", err);
    res
      .status(500)
      .json({ message: "Sipariş oluşturulurken bir hata oluştu." });
  }
});
router.put("/update/:id", async (req, res) => {
  try {
    console.log("İstek Gövdesi: ", req.body);
    const orderId = req.params.id;
    let { user_id, order_number, items, status, order_date, delivery_date } =
      req.body;

    // Tarih formatlarını MySQL uyumlu hale getir
    order_date = new Date(order_date)
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    delivery_date = new Date(delivery_date)
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    const query = `UPDATE orders SET user_id = ?, order_number = ?, status = ?, items = ?, order_date = ?, delivery_date = ? WHERE id = ?`;
    const [result] = await db.execute(query, [
      user_id,
      order_number,
      status,
      JSON.stringify(items),
      order_date,
      delivery_date,
      orderId,
    ]);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Belirtilen ID ile sipariş bulunamadı." });
    }

    console.log("Sipariş başarıyla güncellendi: ", result);
    res.status(200).json({ message: "Sipariş başarıyla güncellendi" });
  } catch (err) {
    console.error("Veritabanı sorgu hatası: ", err);
    res
      .status(500)
      .json({ message: "Sipariş güncellenirken bir hata oluştu." });
  }
});
router.get("/get", async (req, res) => {
  try {
    const [results] = await db.execute("SELECT * FROM orders");
    res.status(200).json(results);
  } catch (err) {
    console.error("Veritabanı sorgu hatası: ", err);
    res.status(500).json({ message: "Siparişler çekilirken bir hata oluştu." });
  }
});
router.get("/get/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const [results] = await db.execute(
      "SELECT * FROM orders WHERE user_id = ?",
      [userId]
    );
    res.status(200).json(results || []);
  } catch (err) {
    console.error("Veritabanı sorgu hatası: ", err);
    res.status(500).json({ message: "Siparişler çekilirken bir hata oluştu." });
  }
});

export default router;
