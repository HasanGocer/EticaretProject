import mysql from "mysql2/promise"; // mysql2/promise modülünü dahil ettik
import dotenv from "dotenv";
import Sequelize from "sequelize";

dotenv.config();

// MySQL veritabanı bağlantısı
const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "evpakademidb",
  password: process.env.DB_PASSWORD || "8!a9nF80h",
  database: process.env.DB_NAME || "admin_evpakademi",
  port: process.env.DB_PORT || 3306,
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
