import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Sale.css';

const Sale = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);

  // API'den ürün çekme
  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/get-products');
      const fetchedProducts = response.data;

      if (fetchedProducts.length < 20) {
        const remainingProducts = [...fetchedProducts];
        const missingProducts = 20 - fetchedProducts.length;
        for (let i = 0; i < missingProducts; i++) {
          remainingProducts.push(fetchedProducts[i % fetchedProducts.length]);
        }
        setProducts(remainingProducts);
      } else {
        setProducts(fetchedProducts);
      }
    } catch (error) {
      console.error('Ürünler alınırken bir hata oluştu:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);


  const handleMouseUpProduct = (productId) => {
    if (!isDraggingHit) {
      navigate(`/product/${productId}`);
    }
  };

  // Sürükleme işlemi
  const productsRef = useRef(null);
  const isDragging = useRef(false);
  const [isDraggingHit, setIsDraggingHit] = useState(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  
  const handleMouseDown = (e) => {
    e.preventDefault();
    isDragging.current = true;
    startX.current = e.pageX - productsRef.current.offsetLeft;
    scrollLeft.current = productsRef.current.scrollLeft;
    document.body.style.userSelect = 'none'; // Fare ile seçimi engelle
    productsRef.current.style.scrollBehavior = 'auto'; // Kaydırma hızını doğrudan kontrol et
  };

  const handleMouseLeave = () => {
    setIsDraggingHit(false);
    isDragging.current = false;
    document.body.style.userSelect = 'auto';
    productsRef.current.style.scrollBehavior = 'smooth'; // Doğal kaydırma efekti için etkinleştir
  };

  const handleMouseUp = () => {
    setIsDraggingHit(false);
    isDragging.current = false;
    document.body.style.userSelect = 'auto';
    productsRef.current.style.scrollBehavior = 'smooth';
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    setIsDraggingHit(true);
    const x = e.pageX - productsRef.current.offsetLeft;
    const distanceMoved = x - startX.current;
    productsRef.current.scrollLeft = scrollLeft.current - distanceMoved; // Kaydırmayı doğrudan uygula
  };
  

  return (
    <div className="container">
      <h1 className="title">Satış Ekranı</h1>
      <div
        className="products-container"
        ref={productsRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {products.map((product) => {
          const discountedPrice = product.discountRate
            ? product.price - (product.price * product.discountRate) / 100
            : product.price;

          return (
            <div
              key={product.id}
              className="product-link"
              onMouseUp={() => handleMouseUpProduct(product.id)}
            >
              <div className="product-card">
                <img
                  src={product.image_data}
                  alt={product.name}
                  className="product-image"
                />
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  {product.discountRate && (
                    <p className="product-price discounted">{product.price} TL</p>
                  )}
                  <p className="product-price">{discountedPrice.toFixed(2)} TL</p>
                  <button className="add-to-cart-button">Sepete Ekle</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sale;
