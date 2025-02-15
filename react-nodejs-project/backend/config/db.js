import mysql from "mysql2/promise"; // mysql2/promise modülünü dahil ettik
import dotenv from "dotenv";
import Sequelize from "sequelize";

dotenv.config();

// MySQL veritabanı bağlantısı
const db = mysql.createPool({
  host: "localhost",
  user: "shopAdminDB",
  password: "9tn9&E98w",
  database: "admin_shopEvipy",
  port: 3306,
});

// Veritabanı bağlantısını kontrol etme (isteğe bağlı)
db.getConnection()
  .then((connection) => {
    console.log("Veritabanına başarıyla bağlanıldı.");
    connection.release(); // Bağlantıyı serbest bırakıyoruz
  })
  .catch((err) => {
    console.error("Veritabanı bağlantı hatası:", err);
  });

export { db };
