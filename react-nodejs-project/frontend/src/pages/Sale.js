import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Box, Hidden } from "@mui/material";
import ProductCard from "../components/ProductCard";
import { GetAllProducts } from "../Api's/api";
import "./Sale.css";

const Sale = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);

  // API'den ürün çekme
  const fetchProducts = async () => {
    try {
      const response = await GetAllProducts();
      const fetchedProducts = response;
      console.log(fetchedProducts);
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
      console.error("Ürünler alınırken bir hata oluştu:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleMouseUpProduct = (productId) => {
    if (!isDraggingHit) {
      navigate(`/product/${productId}`);
      window.location.reload();
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
    document.body.style.userSelect = "none"; // Fare ile seçimi engelle
    productsRef.current.style.scrollBehavior = "auto"; // Kaydırma hızını doğrudan kontrol et
  };

  const handleMouseLeave = () => {
    setIsDraggingHit(false);
    isDragging.current = false;
    document.body.style.userSelect = "auto";
    productsRef.current.style.scrollBehavior = "smooth"; // Doğal kaydırma efekti için etkinleştir
  };

  const handleMouseUp = () => {
    setIsDraggingHit(false);
    isDragging.current = false;
    document.body.style.userSelect = "auto";
    productsRef.current.style.scrollBehavior = "smooth";
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
      <h3 className="title">En çok satan ürünlerimiz</h3>
      <div
        className="products-container"
        ref={productsRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <Box
          display="flex"
          justifyContent="flex-start"
          alignItems="flex-start"
          flexWrap="nowrap"
          sx={{
            gap: "40px",
            padding: "40px",
          }}
        >
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              handleMouseUpProduct={handleMouseUpProduct}
            />
          ))}
        </Box>
      </div>
    </div>
  );
};

export default Sale;
