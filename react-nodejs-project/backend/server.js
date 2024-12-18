const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const multer = require("multer");
const bodyParser = require("body-parser");
const path = require("path");
const authRoutes = require("./models/auth.routes");
const dbUser = require("./models");

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api/auth", authRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/static", express.static(path.join(__dirname, "public")));

// Multer storage tanımı önce yapılmalı
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Dosyaların kaydedileceği dizin
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Dosya ismini benzersiz hale getirme
  },
});

// Multer upload tanımını storage'dan sonra yapıyoruz
const upload = multer({ storage });

// MySQL bağlantısı
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123456789",
  database: "productDB",
});

db.connect((err) => {
  if (err) {
    console.error("MySQL bağlantı hatası:", err);
    return;
  }
  console.log("MySQL veritabanına bağlanıldı.");
});

dbUser.sequelize
  .authenticate()
  .then(() => {
    console.log("Veritabanına başarılı bir şekilde bağlanıldı.");
  })
  .catch((err) => {
    console.error("Bağlantı hatası:", err);
  });

app.post("/sayfa-kapandi", (req, res) => {
  console.log("Sayfa kapandı!");
  res.send("İşlem tamamlandı");
});

app.post("/initiate-payment", (req, res) => {
  const { amount, cardNumber, expiration, cvv } = req.body;

  db.query(
    "INSERT INTO transactions (amount, cardNumber) VALUES (?, ?)",
    [amount, cardNumber],
    (error, result) => {
      if (error) res.status(500).json({ success: false, message: error });
      else res.status(200).json({ success: true, data: result });
    }
  );
});
//#region order
app.post("/create-order", (req, res) => {
  console.log("İstek Gövdesi: ", req.body);

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

  db.query(
    query,
    [
      user_id,
      order_number,
      order_date,
      delivery_date,
      status,
      JSON.stringify(items),
    ],
    (err, result) => {
      if (err) {
        console.error("Veritabanı sorgu hatası: ", err);
        return res
          .status(500)
          .json({ message: "Sipariş oluşturulurken bir hata oluştu." });
      }

      console.log("Sipariş başarıyla oluşturuldu: ", result);
      res.status(200).json({
        message: "Sipariş başarıyla oluşturuldu",
        id: result.insertId,
      });
    }
  );
});
app.put("/update-order/:id", (req, res) => {
  console.log("İstek Gövdesi: ", req.body);

  const orderId = req.params.id;
  let { user_id, order_number, items, status, order_date, delivery_date } =
    req.body;

  // Tarih formatlarını JSON'a dönüştür
  const orderDetails = {
    order_date: new Date(order_date)
      .toISOString()
      .slice(0, 19)
      .replace("T", " "),
    delivery_date: new Date(delivery_date)
      .toISOString()
      .slice(0, 19)
      .replace("T", " "),
    items: JSON.stringify(items),
  };

  const query = `
    UPDATE orders 
    SET 
      user_id = ?, 
      order_number = ?, 
      status = ?, 
      items = ?, 
      order_date = ?, 
      delivery_date = ? 
    WHERE id = ?`;

  db.query(
    query,
    [
      user_id,
      order_number,
      status,
      orderDetails.items,
      orderDetails.order_date,
      orderDetails.delivery_date,
      orderId,
    ],
    (err, result) => {
      if (err) {
        console.error("Veritabanı sorgu hatası: ", err);
        return res
          .status(500)
          .json({ message: "Sipariş güncellenirken bir hata oluştu." });
      }

      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ message: "Belirtilen ID ile sipariş bulunamadı." });
      }

      console.log("Sipariş başarıyla güncellendi: ", result);
      res.status(200).json({ message: "Sipariş başarıyla güncellendi" });
    }
  );
});
app.get("/orders", (req, res) => {
  db.query("SELECT * FROM orders", (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Siparişler çekilirken bir hata oluştu." });
    }
    res.status(200).json(results);
  });
});
app.get("/orders/:userId", (req, res) => {
  const { userId } = req.params; // userId parametresini alıyoruz.

  db.query(
    "SELECT * FROM orders WHERE user_id = ?",
    [userId],
    (err, results) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Siparişler çekilirken bir hata oluştu." });
      }

      // Eğer sonuç boşsa, boş bir dizi döndür
      res.status(200).json(results || []);
    }
  );
});

//#endregion
//#region additionalfeature
app.post("/add-additionalFeature", (req, res) => {
  console.log("Backend'e gelen JSON: ", req.body);

  const { additionalFeature } = req.body;

  if (!additionalFeature) {
    return res.status(400).send({ message: "Gönderilen veri eksik!" });
  }

  const sql = "INSERT INTO additionalFeatures (UrunAdi) VALUES (?)";
  db.query(sql, [additionalFeature], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ message: "Sunucu hatası" });
    }

    res.status(200).send({ message: "Fiyat başarıyla kaydedildi!" });
  });
});
app.get("/get-additionalfeatures", (req, res) => {
  const query = "SELECT * FROM additionalfeatures";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Ekstra özellikleri alma hatası:", err);
      return res.status(500).json({ message: "Ekstra özellikler alınamadı." });
    }
    res.status(200).json(results);
  });
});
app.put("/update-additionalfeature/:id", async (req, res) => {
  const { id } = req.params; // URL'den gelen ID
  const { UrunAdi } = req.body; // İstek gövdesinden gelen yeni ad

  if (!id || !UrunAdi) {
    return res.status(400).json({ message: "ID ve UrunAdi gerekli." });
  }

  try {
    const result = await db.query(
      "UPDATE additionalfeatures SET UrunAdi = ? WHERE ID = ?",
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
app.delete("/delete-additionalFeature/:id", (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM additionalFeatures WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Ürün silme hatası:", err);
      return res.status(500).json({ message: "Ürün silinemedi." });
    }
    res.status(200).json({ message: "Ürün başarıyla silindi." });
  });
});
//#endregion
//#region product
app.post("/add-product", upload.single("image_data"), (req, res) => {
  const {
    name,
    price,
    stockCode,
    stockQuantity,
    discountRate,
    description,
    category_id,
    trademark_id,
    subcategory_id,
    variants_id, // Variant ID'leri
    additionalfeatures_id, // Ekstra Özellikler ID'leri
    variantDetails, // Varyant detayları
    additionalFeatureDetails, // Ekstra özellik detayları
  } = req.body;

  const imageUrl =
    req.protocol + "://" + req.get("host") + "/uploads/" + req.file.filename;

  // Gerekli alanların kontrolü
  if (!name || !price || !stockCode || !stockQuantity || !imageUrl) {
    return res.status(400).json({
      message: "Ürün adı, fiyat, stok kodu, stok miktarı ve resim gereklidir.",
    });
  }

  const productQuery = `
    INSERT INTO products 
    (image_data, name, price, stockCode, stockQuantity, discountRate, description, category_id, trademark_id, subcategory_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    productQuery,
    [
      imageUrl,
      name,
      price,
      stockCode,
      stockQuantity,
      discountRate,
      description,
      category_id,
      trademark_id,
      subcategory_id,
    ],
    (err, result) => {
      if (err) {
        console.error("Ürün ekleme hatası:", err);
        return res
          .status(500)
          .json({ message: "Veritabanına ürün eklenemedi." });
      }

      const productId = result.insertId;

      if (variants_id) {
        const variantIds = JSON.parse(variants_id);
        if (variantIds.length > 0) {
          variantIds.forEach((variantId) => {
            const queryVariants =
              "INSERT INTO product_variants (product_id, variant_id) VALUES (?, ?)";
            db.query(queryVariants, [productId, variantId], (err) => {
              if (err) console.error("Varyant ekleme hatası:", err);
            });
          });
        }
      }
      if (additionalfeatures_id) {
        const additionalIds = JSON.parse(additionalfeatures_id);
        additionalIds.forEach((featureId) => {
          const queryFeatures =
            "INSERT INTO product_additionalfeatures (product_id, additionalfeature_id) VALUES (?, ?)";
          db.query(queryFeatures, [productId, featureId], (err) => {
            if (err) console.error("Ekstra özellik ekleme hatası:", err);
          });
        });
      }
      if (variantDetails) {
        const detailsList = Object.entries(JSON.parse(variantDetails)); // Get entries to loop over
        detailsList.forEach(([variantId, detailsArray]) => {
          detailsArray.forEach((detail) => {
            const imageData =
              detail.image_data && Object.keys(detail.image_data).length > 0
                ? detail.image_data
                : null; // Check if image_data exists

            if (!variantId) {
              console.error("Geçerli bir variant_id bulunamadı!");
              return; // Skip if variant_id is missing
            }

            // Insert variant details with proper association
            const queryVariantDetails =
              "INSERT INTO product_variant_details (product_id, variant_id, image_data, name) VALUES (?, ?, ?, ?)";
            db.query(
              queryVariantDetails,
              [productId, variantId, imageData, detail.name],
              (err) => {
                if (err) console.error("Varyant detayları eklenemedi:", err);
              }
            );
          });
        });
      }
      if (additionalFeatureDetails) {
        const featureDetailsList = Object.entries(
          JSON.parse(additionalFeatureDetails)
        ); // Get entries to loop over
        featureDetailsList.forEach(([featureId, featureDetail]) => {
          const { details } = featureDetail;

          if (!featureId || !details) {
            console.error("Geçerli ekstra özellik detayları bulunamadı!");
            return; // Skip if feature_id or details are missing
          }

          // Insert additional feature details with proper association
          const queryFeatureDetails =
            "INSERT INTO product_additionalfeatures_details (product_id, additionalfeature_id, details) VALUES (?, ?, ?)";
          db.query(
            queryFeatureDetails,
            [productId, featureId, details],
            (err) => {
              if (err)
                console.error("Ekstra özellik detayları eklenemedi:", err);
            }
          );
        });
      }

      res.status(200).json({ message: "Ürün başarıyla eklendi." });
    }
  );
});
app.get("/get-products", (req, res) => {
  const query = "SELECT * FROM products";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Ürünleri alma hatası:", err);
      return res.status(500).json({ message: "Ürünler alınamadı." });
    }
    res.status(200).json(results);
  });
});
app.get("/get-product-additionalfeatures", (req, res) => {
  const query = `
    SELECT 
      p.id AS product_id, 
      p.name AS product_name, 
      af.UrunAdi AS additional_feature,
      pad.details AS additional_feature_details
    FROM products p
    LEFT JOIN product_additionalfeatures paf ON p.id = paf.product_id
    LEFT JOIN additionalfeatures af ON paf.additionalfeature_id = af.id
    LEFT JOIN product_additionalfeatures_details pad 
      ON p.id = pad.product_id AND paf.additionalfeature_id = pad.additionalfeature_id;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Ekstra özellikleri alma hatası:", err);
      return res.status(500).json({ message: "Ekstra özellikler alınamadı." });
    }

    res.status(200).json(results);
  });
});
app.get("/get-product-variants", (req, res) => {
  const query = `
    SELECT 
      p.id AS product_id, 
      p.name AS product_name, 
      v.UrunAdi AS variant_name, 
      pvd.image_data AS variant_image, 
      pvd.name AS variant_detail_name
    FROM products p
    LEFT JOIN product_variants pv ON p.id = pv.product_id
    LEFT JOIN variants v ON pv.variant_id = v.id
    LEFT JOIN product_variant_details pvd 
      ON pv.product_id = pvd.product_id AND pv.variant_id = pvd.variant_id;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Varyantları alma hatası:", err);
      return res.status(500).json({ message: "Varyantlar alınamadı." });
    }

    res.status(200).json(results);
  });
});
app.get("/get-product-variant-details", (req, res) => {
  const query = `
    SELECT 
      pvd.id AS id,
      pvd.product_id,
      pvd.variant_id,
      v.UrunAdi AS variant_name,
      pvd.image_data,
      pvd.name AS detail_name
    FROM product_variant_details pvd
    LEFT JOIN variants v ON pvd.variant_id = v.id;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Varyant detaylarını alma hatası:", err);
      return res.status(500).json({ message: "Varyant detayları alınamadı." });
    }

    res.status(200).json(results);
  });
});
app.get("/get-product-additionalfeatures-details", (req, res) => {
  const query = `
    SELECT 
      pad.id AS id,
      pad.product_id,
      pad.additionalfeature_id,
      af.UrunAdi AS additional_feature_name,
      pad.details
    FROM product_additionalfeatures_details pad
    LEFT JOIN additionalfeatures af ON pad.additionalfeature_id = af.id;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Ekstra özellik detaylarını alma hatası:", err);
      return res
        .status(500)
        .json({ message: "Ekstra özellik detayları alınamadı." });
    }

    res.status(200).json(results);
  });
});
app.put("/update-product/:id", upload.single("image_data"), (req, res) => {
  const {
    name,
    price,
    stockCode,
    stockQuantity,
    discountRate,
    description,
    category_id,
    trademark_id,
    subcategory_id,
    variants_id,
    additionalfeatures_id,
    variant_details, // New variant details
    additionalfeature_details, // New extra feature details
  } = req.body;

  const productId = req.params.id;

  // Handle image URL
  let imageUrl = null;
  if (req.file) {
    imageUrl =
      req.protocol + "://" + req.get("host") + "/uploads/" + req.file.filename;
  }

  // Validate required fields
  if (!name || !price || !stockCode || !stockQuantity) {
    return res.status(400).json({
      message: "Ürün adı, fiyat, stok kodu ve stok miktarı gereklidir.",
    });
  }

  // Update product query
  const updateProductQuery = `
    UPDATE products
    SET name = ?, price = ?, stockCode = ?, stockQuantity = ?, discountRate = ?, description = ?, category_id = ?, trademark_id = ?, subcategory_id = ? 
    ${imageUrl ? ", image_data = ?" : ""}
    WHERE id = ?
  `;

  const queryParams = [
    name,
    price,
    stockCode,
    stockQuantity,
    discountRate,
    description,
    category_id,
    trademark_id,
    subcategory_id,
  ];

  if (imageUrl) queryParams.push(imageUrl);
  queryParams.push(productId);

  // Execute product update
  db.query(updateProductQuery, queryParams, (err) => {
    if (err) {
      console.error("Ürün güncelleme hatası:", err);
      return res.status(500).json({ message: "Ürün güncellenemedi." });
    }

    // Handle variants and variant details
    if (variants_id) {
      const variantIds = JSON.parse(variants_id);

      // Delete old variants and related details
      db.query(
        "DELETE FROM product_variant_details WHERE product_id = ?",
        [productId],
        (err) => {
          if (err) {
            console.error("Varyant detayları silme hatası:", err);
            if (!res.headersSent) {
              return res
                .status(500)
                .json({ message: "Varyant detayları güncellenemedi." });
            }
          }

          db.query(
            "DELETE FROM product_variants WHERE product_id = ?",
            [productId],
            (err) => {
              if (err) {
                console.error("Varyant silme hatası:", err);
                if (!res.headersSent) {
                  return res
                    .status(500)
                    .json({ message: "Varyantlar güncellenemedi." });
                }
              }

              // Now insert new variants, checking for duplicates
              const insertVariantPromises = variantIds.map((variantId) => {
                return new Promise((resolve, reject) => {
                  db.query(
                    "SELECT COUNT(*) as count FROM product_variants WHERE product_id = ? AND variant_id = ?",
                    [productId, variantId],
                    (err, result) => {
                      if (err) {
                        console.error("Varyant kontrol hatası:", err);
                        return reject(err);
                      }

                      // Skip if the variant already exists
                      if (result[0].count > 0) {
                        console.log(`Varyant ${variantId} zaten mevcut.`);
                        return resolve();
                      } else {
                        // Add new variant
                        db.query(
                          "INSERT INTO product_variants (product_id, variant_id) VALUES (?, ?)",
                          [productId, variantId],
                          (err) => {
                            if (err) {
                              console.error("Varyant ekleme hatası:", err);
                              return reject(err);
                            } else {
                              resolve();
                            }
                          }
                        );
                      }
                    }
                  );
                });
              });

              Promise.all(insertVariantPromises)
                .then(() => {
                  console.log("Varyantlar başarıyla güncellendi.");

                  // After adding new variants, handle the variant details
                  if (variant_details) {
                    const variantDetails = JSON.parse(variant_details);

                    const insertDetailsPromises = variantDetails.map(
                      (detail) => {
                        return new Promise((resolve, reject) => {
                          console.log(detail);
                          let imageUrl = null;
                          if (req.files && req.files[detail.image_data]) {
                            imageUrl =
                              req.protocol +
                              "://" +
                              req.get("host") +
                              "/uploads/" +
                              req.files[detail.image_data].filename;
                          }

                          db.query(
                            "INSERT INTO product_variant_details (product_id, variant_id, image_data, name) VALUES (?, ?, ?, ?)",
                            [
                              productId,
                              detail.variant_id,
                              imageUrl, // imageUrl boş olabilir
                              detail.detail_name,
                            ],
                            (err) => {
                              if (err) {
                                console.error(
                                  "Varyant detayları ekleme hatası:",
                                  err
                                );
                                return reject(err);
                              } else {
                                resolve();
                              }
                            }
                          );
                        });
                      }
                    );

                    // Insert variant details
                    Promise.all(insertDetailsPromises)
                      .then(() => {
                        console.log("Varyant detayları başarıyla güncellendi.");
                        if (!res.headersSent) {
                          res
                            .status(200)
                            .json({ message: "Ürün başarıyla güncellendi." });
                        }
                      })
                      .catch((err) => {
                        console.error("Varyant detayları ekleme hatası:", err);
                        if (!res.headersSent) {
                          res.status(500).json({
                            message: "Varyant detayları güncellenemedi.",
                          });
                        }
                      });
                  }
                })
                .catch((err) => {
                  console.error("Varyantlar güncellenemedi:", err);
                  if (!res.headersSent) {
                    res
                      .status(500)
                      .json({ message: "Varyantlar güncellenemedi." });
                  }
                });
            }
          );
        }
      );
    }

    // Handle additional features
    if (additionalfeatures_id) {
      const additionalFeatureIds = JSON.parse(additionalfeatures_id);

      db.query(
        "DELETE FROM product_additionalfeatures_details WHERE product_id = ?",
        [productId],
        (err) => {
          if (err) {
            console.error("Ekstra özellik detayları silme hatası:", err);
            return res
              .status(500)
              .json({ message: "Ekstra özellik detayları silinemedi." });
          }

          db.query(
            "DELETE FROM product_additionalfeatures WHERE product_id = ?",
            [productId],
            (err) => {
              if (err) {
                console.error("Ekstra özellik silme hatası:", err);
                return res
                  .status(500)
                  .json({ message: "Ekstra özellikler silinemedi." });
              }

              const insertFeaturePromises = additionalFeatureIds.map(
                (featureId) => {
                  return new Promise((resolve, reject) => {
                    db.query(
                      "INSERT INTO product_additionalfeatures (product_id, additionalfeature_id) VALUES (?, ?)",
                      [productId, featureId],
                      (err) => {
                        if (err) {
                          console.error("Ekstra özellik ekleme hatası:", err);
                          reject(err);
                        } else {
                          resolve();
                        }
                      }
                    );
                  });
                }
              );

              Promise.all(insertFeaturePromises)
                .then(() => {
                  console.log("Ekstra özellikler başarıyla güncellendi.");

                  if (additionalfeature_details) {
                    const featureDetails = JSON.parse(
                      additionalfeature_details
                    );

                    const insertDetailsPromises = featureDetails.map(
                      (detail) => {
                        return new Promise((resolve, reject) => {
                          db.query(
                            "INSERT INTO product_additionalfeatures_details (product_id, additionalfeature_id, details) VALUES (?, ?, ?)",
                            [
                              productId,
                              detail.additionalfeature_id,
                              detail.details,
                            ],
                            (err) => {
                              if (err) {
                                console.error(
                                  "Ekstra özellik detayları ekleme hatası:",
                                  err
                                );
                                reject(err);
                              } else {
                                resolve();
                              }
                            }
                          );
                        });
                      }
                    );

                    Promise.all(insertDetailsPromises)
                      .then(() =>
                        res
                          .status(200)
                          .json({ message: "Ürün başarıyla güncellendi." })
                      )
                      .catch(() =>
                        res.status(500).json({
                          message: "Ekstra özellik detayları güncellenemedi.",
                        })
                      );
                  }
                })
                .catch(() =>
                  res
                    .status(500)
                    .json({ message: "Ekstra özellikler güncellenemedi." })
                );
            }
          );
        }
      );
    }
  });
});

app.delete("/delete-product/:id", (req, res) => {
  const { id } = req.params;

  // 1. Öncelikle product_additionalfeatures_details'tan kayıtları sil
  db.query(
    "DELETE FROM product_additionalfeatures_details WHERE product_id = ?",
    [id],
    (err) => {
      if (err) {
        console.error("Ekstra özellik detayları silinirken hata:", err);
        return res
          .status(500)
          .json({ message: "Ekstra özellik detayları silinemedi." });
      }

      // 2. product_variant_details'tan kayıtları sil
      db.query(
        "DELETE FROM product_variant_details WHERE product_id = ?",
        [id],
        (err) => {
          if (err) {
            console.error("Varyant detayları silinirken hata:", err);
            return res
              .status(500)
              .json({ message: "Varyant detayları silinemedi." });
          }

          // 3. product_additionalfeatures'tan kayıtları sil
          db.query(
            "DELETE FROM product_additionalfeatures WHERE product_id = ?",
            [id],
            (err) => {
              if (err) {
                console.error("Ekstra özellikler silinirken hata:", err);
                return res
                  .status(500)
                  .json({ message: "Ekstra özellikler silinemedi." });
              }

              // 4. product_variants tablosundan kayıtları sil
              db.query(
                "DELETE FROM product_variants WHERE product_id = ?",
                [id],
                (err) => {
                  if (err) {
                    console.error("Varyantlar silinirken hata:", err);
                    return res
                      .status(500)
                      .json({ message: "Varyantlar silinemedi." });
                  }

                  // 5. Son olarak products tablosundan ürünü sil
                  db.query("DELETE FROM products WHERE id = ?", [id], (err) => {
                    if (err) {
                      console.error("Ürün silme hatası:", err);
                      return res
                        .status(500)
                        .json({ message: "Ürün silinemedi." });
                    }

                    res
                      .status(200)
                      .json({ message: "Ürün başarıyla silindi." });
                  });
                }
              );
            }
          );
        }
      );
    }
  );
});
//#endregion
//#region variant
app.post("/add-variant", (req, res) => {
  const { variant } = req.body;

  if (!variant) {
    return res.status(400).json({ message: "varyant gereklidir." });
  }

  const query = "INSERT INTO variants (UrunAdi) VALUES (?)";
  db.query(query, [variant], (err, result) => {
    if (err) {
      console.error("Ürün ekleme hatası:", err);
      return res.status(500).json({ message: "Veritabanına ürün eklenemedi." });
    }
    res
      .status(200)
      .json({ message: "Ürün başarıyla eklendi.", productId: result.insertId });
  });
});
app.get("/get-variants", (req, res) => {
  const query = "SELECT * FROM variants";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Varyantları alma hatası:", err);
      return res.status(500).json({ message: "Varyantlar alınamadı." });
    }
    res.status(200).json(results);
  });
});
app.put("/update-variant/:id", async (req, res) => {
  const { id } = req.params;
  const { UrunAdi } = req.body;

  if (!id || !UrunAdi) {
    return res.status(400).json({ message: "ID ve UrunAdi gerekli." });
  }

  try {
    const result = await db.query(
      "UPDATE variants SET UrunAdi = ? WHERE ID = ?",
      [UrunAdi, id]
    );

    if (result.affectedRows > 0) {
      res.json({ message: "Varyant başarıyla güncellendi!" });
    } else {
      res.status(404).json({ message: "Varyant bulunamadı!" });
    }
  } catch (error) {
    console.error("Varyant güncellenirken hata:", error.message);
    res.status(500).json({ message: "Bir hata oluştu.", error: error.message });
  }
});

app.delete("/delete-variant/:id", (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM variants WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Ürün silme hatası:", err);
      return res.status(500).json({ message: "Ürün silinemedi." });
    }
    res.status(200).json({ message: "Ürün başarıyla silindi." });
  });
});
//#endregion
//#region category
app.post("/add-category", (req, res) => {
  const { category } = req.body;
  const sql = "INSERT INTO categorys (UrunAdi) VALUES (?)";
  db.query(sql, [category], (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send("Fiyat başarıyla kaydedildi!");
    }
  });
});
app.get("/get-categorys", (req, res) => {
  const query = "SELECT * FROM categorys";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Kategorileri alma hatası:", err);
      return res.status(500).json({ message: "Kategoriler alınamadı." });
    }
    res.status(200).json(results);
  });
});
app.put("/update-category/:id", async (req, res) => {
  const { id } = req.params; // URL'den gelen ID
  const { UrunAdi } = req.body; // İstek gövdesinden gelen yeni ad

  if (!id || !UrunAdi) {
    return res.status(400).json({ message: "ID ve UrunAdi gerekli." });
  }

  try {
    const result = await db.query(
      "UPDATE categorys SET UrunAdi = ? WHERE ID = ?",
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
app.delete("/delete-category/:id", (req, res) => {
  const { id } = req.params;

  // Alt kategorileri sil
  const deleteSubcategoriesQuery =
    "DELETE FROM subcategorys WHERE category_id = ?";

  db.query(deleteSubcategoriesQuery, [id], (err, result) => {
    if (err) {
      console.error("Alt kategoriler silinirken hata:", err);
      return res
        .status(500)
        .json({ message: "Alt kategoriler silinirken hata oluştu." });
    }

    console.log(`Silinen alt kategorilerin sayısı: ${result.affectedRows}`);

    // Üst kategoriyi sil
    const deleteCategoryQuery = "DELETE FROM categorys WHERE id = ?";
    db.query(deleteCategoryQuery, [id], (err, result) => {
      if (err) {
        console.error("Kategori silinirken hata:", err);
        return res
          .status(500)
          .json({ message: "Kategori silinirken hata oluştu." });
      }

      console.log("Üst kategori başarıyla silindi.");
      res
        .status(200)
        .json({ message: "Kategori ve alt kategoriler başarıyla silindi." });
    });
  });
});

//#endregion
//#region subcategory
app.post("/add-subcategory", (req, res) => {
  const { category_id, name } = req.body;

  // Eksik veri kontrolü
  if (!category_id || !name) {
    return res.status(400).json({ message: "Eksik bilgi gönderildi." });
  }

  // SQL sorgusunu çalıştır
  const query = "INSERT INTO subcategorys (category_id, name) VALUES (?, ?)";

  db.execute(query, [category_id, name], (err, result) => {
    if (err) {
      console.error("Veritabanına veri eklenirken hata: ", err);
      return res
        .status(500)
        .json({ message: "Veritabanına veri eklenirken hata oluştu." });
    }

    res.status(201).json({ message: "Alt kategori başarıyla eklendi." });
  });
});
app.get("/get-subcategorys", (req, res) => {
  const query = "SELECT * FROM subcategorys";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Alt kategoriler çekilirken bir hata oluştu:", err);
      res.status(500).send("Bir hata oluştu.");
    } else {
      res.status(200).json(results);
    }
  });
});
app.put("/update-subcategory/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  console.log("Updating subcategory with id:", id, "and name:", name);

  try {
    db.query(
      "UPDATE subcategorys SET name = ? WHERE id = ?",
      [name, id],
      (error, results) => {
        if (error) {
          console.error("Alt kategori güncellenirken bir hata oluştu:", error);
          return res
            .status(500)
            .json({ message: "Sunucu tarafında hata oluştu." });
        }

        if (results.affectedRows === 0) {
          console.log(
            "Alt kategori bulunamadı veya zaten güncellenmiş olabilir."
          );
          return res.status(404).json({ message: "Alt kategori bulunamadı." });
        }

        console.log("Alt kategori güncelleme başarılı:", results);
        res
          .status(200)
          .json({ message: "Alt kategori başarıyla güncellendi." });
      }
    );
  } catch (error) {
    console.error("İstek sırasında hata:", error);
    res
      .status(500)
      .json({ message: "Sunucu tarafında beklenmeyen bir hata oluştu." });
  }
});
app.delete("/delete-subcategory/:id", (req, res) => {
  const { id } = req.params; // URL parametresinden id alıyoruz

  const query = "DELETE FROM subcategorys WHERE id = ?";

  db.execute(query, [id], (err, result) => {
    if (err) {
      console.error("Subcategory silinirken hata oluştu: ", err);
      return res
        .status(500)
        .send({ message: "Subcategory silinirken bir hata oluştu." });
    }

    if (result.affectedRows === 0) {
      return res.status(404).send({ message: "Subcategory bulunamadı." });
    }

    res.status(200).send({ message: "Subcategory başarıyla silindi!" });
  });
});
//#endregion
//#region trademark
app.post("/add-trademark", upload.single("image"), (req, res) => {
  const { trademark } = req.body;
  const imageFile = req.file;

  if (!imageFile) {
    return res.status(400).json({ message: "Resim dosyası gereklidir." });
  }

  const imageUrl = `/uploads/${imageFile.filename}`; // Yüklenen resmin yolu

  const sql = "INSERT INTO trademarks (UrunAdi, image_data) VALUES (?, ?)";
  db.query(sql, [trademark, imageUrl], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    } else {
      res.status(200).send({ message: "Trademark başarıyla kaydedildi!" });
    }
  });
});
app.get("/get-trademarks", (req, res) => {
  const query = "SELECT * FROM trademarks";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Trademarkları alma hatası:", err);
      return res.status(500).json({ message: "Trademarklar alınamadı." });
    }
    res.status(200).json(results);
  });
});
app.put("/update-trademark/:id", (req, res) => {
  const { id } = req.params;
  const { UrunAdi } = req.body;

  if (!id || !UrunAdi) {
    return res.status(400).json({ message: "ID ve UrunAdi gerekli." });
  }

  const query = "UPDATE trademarks SET UrunAdi = ? WHERE ID = ?";
  db.query(query, [UrunAdi, id], (err, result) => {
    if (err) {
      console.error("Trademark güncellenirken hata:", err);
      return res
        .status(500)
        .json({ message: "Bir hata oluştu.", error: err.message });
    }

    if (result.affectedRows > 0) {
      return res.json({ message: "Trademark başarıyla güncellendi." });
    } else {
      return res.status(404).json({ message: "Trademark bulunamadı." });
    }
  });
});
app.delete("/delete-trademark/:id", (req, res) => {
  const { id } = req.params;

  const query = "SELECT image_data FROM trademarks WHERE ID = ?";
  db.query(query, [id], (err, result) => {
    if (err || result.length === 0) {
      console.error("Trademark bulunamadı:", err);
      return res.status(404).json({ message: "Trademark bulunamadı." });
    }

    const imagePath = result[0].image_data;
    // Dosyayı silme (eğer dosya varsa)
    const fs = require("fs");
    const fullPath = path.join(__dirname, imagePath);

    fs.unlink(fullPath, (err) => {
      if (err) {
        console.error("Resim silinirken hata:", err);
        return res.status(500).json({ message: "Resim silinemedi." });
      }

      // Veritabanından silme işlemi
      const deleteQuery = "DELETE FROM trademarks WHERE ID = ?";
      db.query(deleteQuery, [id], (err, result) => {
        if (err) {
          console.error("Ürün silme hatası:", err);
          return res.status(500).json({ message: "Ürün silinemedi." });
        }
        res.status(200).json({ message: "Ürün başarıyla silindi." });
      });
    });
  });
});
//#endregion

app.listen(port, () => {
  console.log(`Server ${port} portunda çalışıyor.`);
});
