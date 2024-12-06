import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext'; 
import './Product.css'; // CSS dosyasını import ediyoruz.

const Product = () => {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [trademarks, setTrademarks] = useState([]);
  const [productVariants, setProductVariants] = useState([]);
  const [productAdditionalFeatures, setProductAdditionalFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { addToCart } = useCart(); // Context'ten addToCart fonksiyonunu alıyoruz.

  const fetchData = async () => {
    try {
      const productResponse = await axios.get('http://localhost:5000/get-products');
      const categoryResponse = await axios.get('http://localhost:5000/get-categorys');
      const trademarkResponse = await axios.get('http://localhost:5000/get-trademarks');
      const variantResponse = await axios.get('http://localhost:5000/get-product-variants');
      const featureResponse = await axios.get('http://localhost:5000/get-product-additionalfeatures');

      setProducts(productResponse.data);
      setCategories(categoryResponse.data);
      setTrademarks(trademarkResponse.data);
      setProductVariants(variantResponse.data);
      setProductAdditionalFeatures(featureResponse.data);
    } catch (error) {
      console.error("Veriler alınırken bir hata oluştu:", error);
      setError('Veriler alınırken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div>{error}</div>;

  const product = products.find(prod => prod.id === parseInt(id));

  if (!product) return <div>Ürün bulunamadı!</div>;

  const discountedPrice = product.discountRate
    ? product.price - (product.price * product.discountRate) / 100
    : product.price;

  return (
    <div className="product-container">
      <div className="product-wrapper">
        <img
          src={product.image_data || 'default-image.jpg'}
          alt={product.name || 'Ürün Görseli'}
          className="product-image"
        />

        <div className="product-details">
          <h1 className="product-name">{product.name}</h1>
          {product.discountRate > 0 && <p className="discount-price">{product.price} TL</p>}
          <p className="product-price">{discountedPrice.toFixed(2)} TL</p>
          <p className="product-stock">Stok: {product.stockQuantity} adet</p>
          <p className="product-description">{product.description}</p>

          <div className="product-info">
            <p className="product-attribute">
              Kategori: {categories.find((cat) => cat.ID === product.category_id)?.UrunAdi || "Bilinmiyor"}
            </p>
            <p className="product-attribute">
              Marka: {trademarks.find((trade) => trade.ID === product.trademark_id)?.UrunAdi || "Bilinmiyor"}
            </p>

            <p className="product-attribute">
              Varyantlar: 
              <ul>
                {productVariants
                  .filter((provar) => provar.product_id === product.id)
                  .map((provar) => (
                    <li key={provar.variant_id}>{provar.variant_name}</li>
                  ))}
              </ul>
            </p>

            <p className="product-attribute">
              Ekstra Özellikler:
              <ul>
                {productAdditionalFeatures
                  .filter((proadd) => proadd.product_id === product.id)
                  .map((proadd) => (
                    <li key={proadd.feature_id}>{proadd.additional_feature}</li>
                  ))}
              </ul>
            </p>
          </div>

          <button className="add-to-cart-button" onClick={() => addToCart(product)}>
            Sepete Ekle
          </button>
        </div>
      </div>
    </div>
  );
};

export default Product;
