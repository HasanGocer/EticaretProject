// db.js
import mysql from "mysql2";

const db = mysql.createConnection({
  host: "localhost", // veya kullanılan veritabanı sunucusu
  user: "evpakademidb",
  password: "8!a9nF80h", // veritabanı şifrenizi buraya yazın
  database: "admin_evpakademi", // veritabanı ismini buraya yazın
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to the database");
});

export default db;
