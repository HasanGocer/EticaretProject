const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require("multer");
const bodyParser = require("body-parser");
const path = require('path');
const authRoutes = require("./models/auth.routes");
const dbUser = require("./models");

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api/auth", authRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/static', express.static(path.join(__dirname, 'public')));

// Multer storage tanımı önce yapılmalı
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Dosyaların kaydedileceği dizin
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Dosya ismini benzersiz hale getirme
  }
});

// Multer upload tanımını storage'dan sonra yapıyoruz
const upload = multer({ storage });

// MySQL bağlantısı
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456789',
  database: 'productDB'
});

db.connect((err) => {
  if (err) {
    console.error('MySQL bağlantı hatası:', err);
    return;
  }
  console.log('MySQL veritabanına bağlanıldı.');
});

dbUser.sequelize.authenticate()
  .then(() => {
    console.log("Veritabanına başarılı bir şekilde bağlanıldı.");
  })
  .catch((err) => {
    console.error("Bağlantı hatası:", err);
  });

  app.post('/sayfa-kapandi', (req, res) => {
    console.log('Sayfa kapandı!');
    res.send('İşlem tamamlandı');
  });

//#region  add
app.post("/add-product", upload.single('image_data'), (req, res) => {
  const {
    name,
    price,
    stockCode,
    stockQuantity,
    discountRate,
    description,
    category_id,
    trademark_id,
    variants_id,
    additionalfeatures_id,
  } = req.body;

  // Resim URL'sini oluşturun
  const imageUrl = req.protocol + '://' + req.get('host') + '/uploads/' + req.file.filename;

  // Gerekli alanların kontrolü
  if (!name || !price || !stockCode || !stockQuantity || !imageUrl) {
    return res
      .status(400)
      .json({ message: "Ürün adı, fiyat, stok kodu, stok miktarı ve resim gereklidir." });
  }

  // Veritabanına ürünü ekle
  const productQuery = `
    INSERT INTO products (image_data, name, price, stockCode, stockQuantity, discountRate, description, category_id, trademark_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    productQuery,
    [imageUrl, name, price, stockCode, stockQuantity, discountRate, description, category_id, trademark_id],
    (err, result) => {
      if (err) {
        console.error("Ürün ekleme hatası:", err);
        return res.status(500).json({ message: "Veritabanına ürün eklenemedi." });
      }

      const productId = result.insertId;

      // Varyantları ekle
      if (variants_id) {
        const variantIds = JSON.parse(variants_id);
        variantIds.forEach((variantId) => {
          const queryVariants = "INSERT INTO product_variants (product_id, variant_id) VALUES (?, ?)";
          db.query(queryVariants, [productId, variantId], (err) => {
            if (err) console.error("Varyant ekleme hatası:", err);
          });
        });
      }

      // Ekstra özellikleri ekle
      if (additionalfeatures_id) {
        const additionalFeatureIds = JSON.parse(additionalfeatures_id);
        additionalFeatureIds.forEach((featureId) => {
          const queryFeatures = "INSERT INTO product_additionalfeatures (product_id, additionalfeature_id) VALUES (?, ?)";
          db.query(queryFeatures, [productId, featureId], (err) => {
            if (err) console.error("Ekstra özellik ekleme hatası:", err);
          });
        });
      }

      res.status(200).json({ message: "Ürün başarıyla eklendi." });
    }
  );
});


app.post('/add-variant', (req, res) => {
  const { variant } = req.body;

  if (!variant) {
    return res.status(400).json({ message: 'varyant gereklidir.' });
  }

  const query = 'INSERT INTO variants (UrunAdi) VALUES (?)';
  db.query(query, [variant], (err, result) => {
    if (err) {
      console.error('Ürün ekleme hatası:', err);
      return res.status(500).json({ message: 'Veritabanına ürün eklenemedi.' });
    }
    res.status(200).json({ message: 'Ürün başarıyla eklendi.', productId: result.insertId });
  });
});
app.post('/add-category', (req, res) => {
  const { category } = req.body;
  const sql = 'INSERT INTO categorys (UrunAdi) VALUES (?)';
  db.query(sql, [category], (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send('Fiyat başarıyla kaydedildi!');
    }
  });
});
app.post('/add-additionalFeature', (req, res) => {
  const { additionalFeature } = req.body;
  const sql = 'INSERT INTO additionalFeatures (UrunAdi) VALUES (?)';
  db.query(sql, [additionalFeature], (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send('Fiyat başarıyla kaydedildi!');
    }
  });
});
app.post('/add-variant', (req, res) => {
  const { variant } = req.body;
  const sql = 'INSERT INTO variants (UrunAdi) VALUES (?)';
  db.query(sql, [variant], (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send('Fiyat başarıyla kaydedildi!');
    }
  });
});
app.post('/add-trademark', (req, res) => {
  const { trademark } = req.body;
  const sql = 'INSERT INTO trademarks (UrunAdi) VALUES (?)';
  db.query(sql, [trademark], (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send('Fiyat başarıyla kaydedildi!');
    }
  });
});
//#endregion

//#region get
app.get('/get-products', (req, res) => {
  const query = 'SELECT * FROM products';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Ürünleri alma hatası:', err);
      return res.status(500).json({ message: 'Ürünler alınamadı.' });
    }
    res.status(200).json(results);
  });
});
app.get('/get-product-additionalfeatures', (req, res) => {
  const query = `
    SELECT p.id AS product_id, p.name AS product_name, af.UrunAdi AS additional_feature
    FROM products p
    LEFT JOIN product_additionalfeatures paf ON p.id = paf.product_id
    LEFT JOIN additionalfeatures af ON paf.additionalfeature_id = af.id;
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Ekstra özellikleri alma hatası:', err);
      return res.status(500).json({ message: 'Ekstra özellikler alınamadı.' });
    }
    res.status(200).json(results);
  });
});

app.get('/get-product-variants', (req, res) => {
  const query = `
    SELECT p.id AS product_id, p.name AS product_name, v.UrunAdi AS variant_name
    FROM products p
    LEFT JOIN product_variants pv ON p.id = pv.product_id
    LEFT JOIN variants v ON pv.variant_id = v.id;
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Varyantları alma hatası:', err);
      return res.status(500).json({ message: 'Varyantlar alınamadı.' });
    }
    res.status(200).json(results);
  });
});


// Kategorileri, markaları, özellikleri ve varyantları almak için API endpoint'leri
app.get('/get-variants', (req, res) => {
  const query = 'SELECT * FROM variants';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Varyantları alma hatası:', err);
      return res.status(500).json({ message: 'Varyantlar alınamadı.' });
    }
    res.status(200).json(results);
  });
});


// Kategorileri, markaları, özellikleri ve varyantları almak için API endpoint'leri
app.get('/get-variants', (req, res) => {
  const query = 'SELECT * FROM variants';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Varyantları alma hatası:', err);
      return res.status(500).json({ message: 'Varyantlar alınamadı.' });
    }
    res.status(200).json(results);
  });
});

app.get('/get-trademarks', (req, res) => {
  const query = 'SELECT * FROM trademarks';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Trademarkları alma hatası:', err);
      return res.status(500).json({ message: 'Trademarklar alınamadı.' });
    }
    res.status(200).json(results);
  });
});

app.get('/get-categorys', (req, res) => {
  const query = 'SELECT * FROM categorys';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Kategorileri alma hatası:', err);
      return res.status(500).json({ message: 'Kategoriler alınamadı.' });
    }
    res.status(200).json(results);
  });
});

app.get('/get-additionalfeatures', (req, res) => {
  const query = 'SELECT * FROM additionalfeatures';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Ekstra özellikleri alma hatası:', err);
      return res.status(500).json({ message: 'Ekstra özellikler alınamadı.' });
    }
    res.status(200).json(results);
  });
});
//#endregion

//#region update
app.put("/update-product/:id", upload.single('image_data'), (req, res) => {
  const {
    name,
    price,
    stockCode,
    stockQuantity,
    discountRate,
    description,
    category_id,
    trademark_id,
    variants_id,
    additionalfeatures_id,
  } = req.body;

  const productId = req.params.id;

  // Resim URL'sini oluştur
  let imageUrl = null;
  if (req.file) {
    imageUrl = req.protocol + '://' + req.get('host') + '/uploads/' + req.file.filename;
  }

  // Gerekli alanların kontrolü
  if (!name || !price || !stockCode || !stockQuantity) {
    return res
      .status(400)
      .json({ message: "Ürün adı, fiyat, stok kodu ve stok miktarı gereklidir." });
  }

  // Ürünü güncelleme sorgusu
  const updateProductQuery = `
    UPDATE products
    SET name = ?, price = ?, stockCode = ?, stockQuantity = ?, discountRate = ?, description = ?, category_id = ?, trademark_id = ?
    ${imageUrl ? ", image_data = ?" : ""}
    WHERE id = ?
  `;

  const queryParams = [
    name, price, stockCode, stockQuantity, discountRate, description, category_id, trademark_id,
  ];

  if (imageUrl) queryParams.push(imageUrl);
  queryParams.push(productId);

  db.query(updateProductQuery, queryParams, (err) => {
    if (err) {
      console.error("Ürün güncelleme hatası:", err);
      return res.status(500).json({ message: "Ürün güncellenemedi." });
    }

    // Varyantları güncelleme
    if (variants_id) {
      const variantIds = JSON.parse(variants_id);

      // Önce mevcut varyantları sil
      db.query("DELETE FROM product_variants WHERE product_id = ?", [productId], (err) => {
        if (err) console.error("Varyant silme hatası:", err);

        // Yeni varyantları ekle
        variantIds.forEach((variantId) => {
          const queryVariants = "INSERT INTO product_variants (product_id, variant_id) VALUES (?, ?)";
          db.query(queryVariants, [productId, variantId], (err) => {
            if (err) console.error("Varyant ekleme hatası:", err);
          });
        });
      });
    }

    // Ekstra özellikleri güncelleme
    if (additionalfeatures_id) {
      const additionalFeatureIds = JSON.parse(additionalfeatures_id);

      // Önce mevcut özellikleri sil
      db.query("DELETE FROM product_additionalfeatures WHERE product_id = ?", [productId], (err) => {
        if (err) console.error("Ekstra özellik silme hatası:", err);

        // Yeni özellikleri ekle
        additionalFeatureIds.forEach((featureId) => {
          const queryFeatures = "INSERT INTO product_additionalfeatures (product_id, additionalfeature_id) VALUES (?, ?)";
          db.query(queryFeatures, [productId, featureId], (err) => {
            if (err) console.error("Ekstra özellik ekleme hatası:", err);
          });
        });
      });
    }

    res.status(200).json({ message: "Ürün başarıyla güncellendi." });
  });
});


app.put('/update-additionalfeature/:id', async (req, res) => {
  const { id } = req.params; // URL'den gelen ID
  const { UrunAdi } = req.body; // İstek gövdesinden gelen yeni ad

  if (!id || !UrunAdi) {
    return res.status(400).json({ message: "ID ve UrunAdi gerekli." });
  }

  try {
    const result = await db.query(
      'UPDATE additionalfeatures SET UrunAdi = ? WHERE ID = ?',
      [UrunAdi, id]
    );

    if (result.affectedRows > 0) {
      res.json({ message: "additionalfeature başarıyla güncellendi." });
    } else {
      res.status(404).json({ message: "additionalfeature bulunamadı." });
    }
  } catch (error) {
    console.error("additionalfeature güncellenirken hata:", error.message);
    res.status(500).json({ message: "Bir hata oluştu.", error: error.message });
  }
});
app.put('/update-trademark/:id', async (req, res) => {
  const { id } = req.params; // URL'den gelen ID
  const { UrunAdi } = req.body; // İstek gövdesinden gelen yeni ad

  if (!id || !UrunAdi) {
    return res.status(400).json({ message: "ID ve UrunAdi gerekli." });
  }

  try {
    const result = await db.query(
      'UPDATE trademarks SET UrunAdi = ? WHERE ID = ?',
      [UrunAdi, id]
    );

    if (result.affectedRows > 0) {
      res.json({ message: "Trademark başarıyla güncellendi." });
    } else {
      res.status(404).json({ message: "Trademark bulunamadı." });
    }
  } catch (error) {
    console.error("Trademark güncellenirken hata:", error.message);
    res.status(500).json({ message: "Bir hata oluştu.", error: error.message });
  }
});

app.put("/update-category/:id", async (req, res) => {
  const { id } = req.params; // URL'den gelen ID
  const { UrunAdi } = req.body; // İstek gövdesinden gelen yeni ad

  if (!id || !UrunAdi) {
    return res.status(400).json({ message: "ID ve UrunAdi gerekli." });
  }

  try {
    const result = await db.query(
      'UPDATE categorys SET UrunAdi = ? WHERE ID = ?',
      [UrunAdi, id]
    );

    if (result.affectedRows > 0) {
      res.json({ message: "Kategori başarıyla güncellendi!" });
    } else {
      res.status(404).json({ message: "Kategori bulunamadı!" });
    }
  } catch (error) {
    console.error("Kategori güncellenirken hata:", error.message);
    res.status(500).json({ message: "Bir hata oluştu.", error: error.message });
  }
});




//#endregion

//#region  delete
app.delete('/delete-product/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM products WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Ürün silme hatası:', err);
      return res.status(500).json({ message: 'Ürün silinemedi.' });
    }
    res.status(200).json({ message: 'Ürün başarıyla silindi.' });
  });
});
app.delete('/delete-variant/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM variants WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Ürün silme hatası:', err);
      return res.status(500).json({ message: 'Ürün silinemedi.' });
    }
    res.status(200).json({ message: 'Ürün başarıyla silindi.' });
  });
});
app.delete('/delete-category/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM categorys WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Ürün silme hatası:', err);
      return res.status(500).json({ message: 'Ürün silinemedi.' });
    }
    res.status(200).json({ message: 'Ürün başarıyla silindi.' });
  });
});
app.delete('/delete-additionalFeature/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM additionalFeatures WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Ürün silme hatası:', err);
      return res.status(500).json({ message: 'Ürün silinemedi.' });
    }
    res.status(200).json({ message: 'Ürün başarıyla silindi.' });
  });
});
app.delete('/delete-trademark/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM trademarks WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Ürün silme hatası:', err);
      return res.status(500).json({ message: 'Ürün silinemedi.' });
    }
    res.status(200).json({ message: 'Ürün başarıyla silindi.' });
  });
});
//#endregion

app.listen(port, () => {
  console.log(`Server ${port} portunda çalışıyor.`);
});
