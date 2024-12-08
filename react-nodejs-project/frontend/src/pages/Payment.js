import React, { useState } from "react";
import Cards from "react-credit-cards";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext"; // Sepet verilerini almak için import ettik.
import "react-credit-cards/es/styles-compiled.css";
import "./Payment.css";

function Payment() {
  const location = useLocation();
  const { discountedPrice } = location.state || { discountedPrice: 0 }; // İndirimli tutarı al
  const { cartItems } = useCart(); // Sepet verilerini çekiyoruz.

  // Sepet toplamını hesapla
  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const [cardInfo, setCardInfo] = useState({
    number: "",
    name: "",
    expiration: "",
    cvc: "",
  });

  const handleChange = (e) => {
    setCardInfo({ ...cardInfo, [e.target.name]: e.target.value });
  };

  const handlePayment = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/initiate-payment",
        {
          amount: discountedPrice || totalAmount, // İndirimli tutar veya sepet toplamını gönder
          ...cardInfo,
        }
      );

      if (response.data.success) {
        alert("Ödeme başarılı!");
      } else {
        alert("Ödeme başarısız.");
      }
    } catch (error) {
      alert("Bir hata oluştu.");
    }
  };

  return (
    <div className="payment-container">
      <div className="credit-card-preview">
        <Cards
          number={cardInfo.number}
          name={cardInfo.name}
          expiry={cardInfo.expiration}
          cvc={cardInfo.cvc}
          focused={"number"}
        />
      </div>

      <div className="payment-section">
        <input
          type="text"
          placeholder="Kart Numarası"
          name="number"
          value={cardInfo.number}
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="İsim"
          name="name"
          value={cardInfo.name}
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="Son Kullanma Tarihi (MM/YY)"
          name="expiration"
          value={cardInfo.expiration}
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="CVV"
          name="cvc"
          value={cardInfo.cvc}
          onChange={handleChange}
        />
        <button onClick={handlePayment} className="pay-btn">
          Ödeme Yap
        </button>
      </div>

      {/* Ödeme tutarını ekrana yazdır */}
      <p>
        Ödeme Tutarı:{" "}
        {discountedPrice > 0
          ? discountedPrice.toFixed(2)
          : totalAmount.toFixed(2)}{" "}
        TL
      </p>
    </div>
  );
}

export default Payment;
