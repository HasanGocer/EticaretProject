import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";
import { useCart } from "../context/CartContext";
import "./Header.css";

const Header = ({ bannerVisible, closeBanner }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { cartItems, updateCartItemQuantity, removeFromCart } = useCart();

  const toggleCart = () => setIsOpen(!isOpen);

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const handleLogout = () => {
    AuthService.logout();
    setUser(null);
    navigate("/login");
  };

  const calculateTotalPrice = () =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const calculateDiscountedPrice = () =>
    cartItems.reduce(
      (total, item) =>
        total + item.price * item.quantity * (1 - item.discountRate / 100),
      0
    );

  const handleQuantityChange = (itemId, change) => {
    const item = cartItems.find((item) => item.id === itemId);
    if (item) {
      const newQuantity = item.quantity + change;
      if (newQuantity < 1) {
        removeFromCart(itemId); // Remove item if quantity is 0
      } else if (newQuantity <= item.stock) {
        updateCartItemQuantity(itemId, newQuantity); // Update item quantity
      }
    }
  };

  return (
    <>
      {bannerVisible && (
        <div className="banner">
          <p className="banner-text">
            550 TL ÜZERİ ALIŞVERİŞLERİNİZİN KARGOSU ÜCRETSİZDİR.
          </p>
          <button onClick={closeBanner} className="banner-close-button">
            X
          </button>
        </div>
      )}

      <header className={`header ${bannerVisible ? "with-banner" : ""}`}>
        <div className="header-container">
          <div className="logo">
            <a href="/">🌟 TuruncuShop</a>
          </div>
          <nav className="nav">
            <ul className="nav-list">
              <li><a href="/">Anasayfa</a></li>
              <li><a href="/products">Ürünler</a></li>
              <li><a href="/about">Hakkımızda</a></li>
              <li><a href="/contact">İletişim</a></li>
            </ul>
          </nav>
          <div className="auth">
            {user ? (
              <>
                <span className="username">
                  Hoşgeldin, {user.user.firstName} {user.user.lastName}
                </span>
                <button onClick={handleLogout}>Çıkış Yap</button>
              </>
            ) : (
              <>
                <button onClick={() => navigate("/login")}>Giriş Yap</button>
                <button onClick={() => navigate("/register")}>Kayıt Ol</button>
              </>
            )}
          </div>
          <button className="cart-toggle-btn" onClick={toggleCart}>
            {isOpen ? 'Sepeti Kapat' : 'Sepeti Aç'}
          </button>
        </div>
      </header>

      {/* Sepet Overlay (Dış Kısım Siyahlaşması) */}
      {isOpen && <div className="cart-overlay" onClick={toggleCart}></div>}

      <div className={`cart-container ${isOpen ? "open" : ""}`}>
        {isOpen && (
          <div className="cart-content">
            <h2>Sepet</h2>
            {cartItems.length === 0 ? (
              <p>Sepetiniz boş.</p>
            ) : (
              <ul>
                {cartItems.map((item) => (
                  <li key={item.id}>
                    <div className="cart-item">
                      <img src={item.image_data} alt={item.name} className="cart-item-image" />
                      <div>
                        <strong>{item.name}</strong> <br />
                        <span>Fiyat: {item.price} TL</span> <br />
                        <span>İndirim: %{item.discountRate}</span> <br />
                        <span>Adet: </span>
                        <button onClick={() => handleQuantityChange(item.id, -1)}>-</button>
                        {item.quantity}
                        <button onClick={() => handleQuantityChange(item.id, 1)}>+</button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {cartItems.length > 0 && (
              <div className="cart-summary">
                <p>
                  <strong>Toplam Fiyat:</strong>{" "}
                  <span className="old-price">{calculateTotalPrice().toFixed(2)} TL</span>
                </p>
                <p>
                  <strong>İndirim Sonrası Fiyat:</strong> {calculateDiscountedPrice().toFixed(2)} TL
                </p>
                <button onClick={() => navigate("/checkout")} className="checkout-button">
                  Ödeme Yap
                </button>
                <button onClick={toggleCart} className="continue-shopping-button">
                  Alışverişe Devam Et
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Header;
