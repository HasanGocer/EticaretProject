import React, { useState, useRef } from "react";
import { useCart } from "../context/CartContext";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
} from "@mui/material";
import AddToCartNotification from "./AddToCartNotification"; // Bildirim bileşeni ekleniyor

const ProductCard = ({ product, handleMouseUpProduct }) => {
  const discountedPrice = product.discountRate
    ? product.price - (product.price * product.discountRate) / 100
    : product.price;
  const { addToCart } = useCart();

  const [showButton, setShowButton] = useState(false);

  // Bildirim bileşeni için referans oluştur
  const notificationRef = useRef();

  const handleAddToCart = () => {
    addToCart(product);
    if (notificationRef.current) {
      notificationRef.current(); // Bildirimi tetikleme
    }
  };

  return (
    <>
      <AddToCartNotification trigger={notificationRef} />{" "}
      {/* Bildirim bileşeni */}
      <Card
        onMouseEnter={() => setShowButton(true)}
        onMouseLeave={() => setShowButton(false)}
        onMouseUp={() => handleMouseUpProduct(product.id)}
        sx={{
          maxWidth: 210,
          minWidth: 210,
          maxHeight: 340,
          minHeight: 340,
          transition: "transform 0.3s ease-in-out",
          "&:hover": {
            transform: "scale(1.1)",
          },
          position: "relative",
        }}
      >
        <CardMedia
          component="img"
          sx={{
            maxWidth: 180,
            minWidth: 180,
            maxHeight: 180,
            minHeight: 180,
            margin: "auto",
            display: "block",
            objectFit: "contain",
          }}
          image={product.image_data}
          alt={product.name}
        />
        <CardContent>
          <Typography
            gutterBottom
            variant="h6"
            component="div"
            sx={{
              marginTop: 1,
              fontSize: "1rem",
              textAlign: "center",
              fontWeight: "bold",
              textTransform: "uppercase",
            }}
          >
            {product.name}
          </Typography>
          {product.discountRate && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                marginTop: 1,
                fontSize: "0.7rem",
                textDecoration: "line-through",
                color: "#d9534f",
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              {product.price} TL
            </Typography>
          )}
          <Typography
            variant="body1"
            sx={{
              fontSize: "1.3rem",
              color: "#28a745",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            {discountedPrice.toFixed(2)} TL
          </Typography>
        </CardContent>

        {/* Buton */}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleAddToCart}
          sx={{
            backgroundColor: "#ff9800",
            textTransform: "uppercase",
            fontFamily: `"Lato ", sans-serif`,
            position: "absolute",
            bottom: showButton ? 10 : "-100%", // Yukarıdan kaydırarak çıkış animasyonu yapıyoruz
            left: 0,
            transition: "bottom 0.3s ease-in-out",
            fontWeight: "bold",
            fontSize: "0.85rem",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)", // Gölgeli efekt
            "&:hover": {
              backgroundColor: "#fb8c00", // Hover durumunda biraz daha koyu turuncu
              boxShadow: "0 6px 8px rgba(0, 0, 0, 0.3)", // Hover'da daha yoğun gölge
              transform: "scale(1.05)", // Hover animasyonu
            },
          }}
        >
          Sepete ekle
        </Button>
      </Card>
    </>
  );
};

export default ProductCard;
