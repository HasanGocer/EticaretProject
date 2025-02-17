// db.js
import mysql from "mysql2";

const db = mysql.createConnection({
  host: "localhost", // veya kullanılan veritabanı sunucusu
  user: "shopAdminDB",
  password: "#tY050fs3", // veritabanı şifrenizi buraya yazın
  database: "admin_shopEvipy", // veritabanı ismini buraya yazın
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to the database");
});

export default db;
