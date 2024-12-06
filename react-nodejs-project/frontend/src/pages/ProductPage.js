import React from 'react';
import './ProductPage.css';

const ProductPage = () => {
  const product = {
    name: "Sony DualSense Chroma Indigo Kablosuz PS5 Gamepad",
    price: "1.999,00 TL",
    stockCode: "PS719590088",
    stockQuantity: 20,
    discountRate: 10,
    description:
      "Sony DualSense Chroma Indigo, ergonomik tasarımı ve üstün performansı ile oyun deneyimini bir üst seviyeye çıkarır.",
    category_id: 1,
    trademark_id: 5,
    variants_id: [101, 102],
    additionalfeatures_id: [201, 202],
    image: "https://img-itopya.mncdn.com/cdn/1000/yeni-proje-14a6a9.jpg",
  };

  const discountedPrice = (
    parseFloat(product.price.replace('.', '').replace(',', '.')) *
    (1 - product.discountRate / 100)
  ).toFixed(2);

  return (
    <div className="product-page">
      <div className="product-card">
        <img
          className="product-image"
          src={product.image}
          alt={product.name}
        />
        <div className="product-details">
          <h1 className="product-title">{product.name}</h1>
          <p className="product-description">{product.description}</p>
          <p className="product-price">
            {product.discountRate > 0 ? (
              <>
                <span className="original-price">{product.price}</span>{" "}
                <span className="discounted-price">{discountedPrice} TL</span>
              </>
            ) : (
              <span>{product.price}</span>
            )}
          </p>
          <p className="product-stock">
            <strong>Stok Kodu:</strong> {product.stockCode} |{" "}
            <strong>Stok:</strong> {product.stockQuantity}
          </p>
          <button className="add-to-cart-button">Sepete Ekle</button>
        </div>
      </div>
      <div className="product-extra-info">
        <h2>Ürün Detayları</h2>
        <p><strong>Kategori ID:</strong> {product.category_id}</p>
        <p><strong>Marka ID:</strong> {product.trademark_id}</p>
        <p><strong>Varyantlar:</strong> {product.variants_id.join(", ")}</p>
        <p><strong>Ek Özellikler:</strong> {product.additionalfeatures_id.join(", ")}</p>
      </div>
    </div>
  );
};

export default ProductPage;
