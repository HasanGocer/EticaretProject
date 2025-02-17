import "dotenv/config"; // .env dosyasından çevresel değişkenleri yükle
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import routes from "./routes/index.route.js";
import { fileURLToPath } from "url"; // fileURLToPath importu
import { dirname } from "path";
import path from "path"; // path importu

const app = express();
const port = 5000;

// CORS ayarları
app.use(
  cors({
    origin: "https://shop.evpakademi.com", // Frontend'in tam URL'si
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true, // Eğer gerekirse
  })
);

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Dosya yükleme ayarları
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));

app.use("/api", routes);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
