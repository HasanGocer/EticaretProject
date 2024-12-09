import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";
import { useCart } from "../context/CartContext";
import { FaShoppingCart } from "react-icons/fa";
import axios from "axios";
import "./Header.css";
import {
  Box,
  Button,
  Typography,
  TextField,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Paper,
  Badge,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const Header = ({ bannerVisible, closeBanner }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isAcountOpen, setIsAcountOpen] = useState(false);
  const { cartItems, updateCartItemQuantity, removeFromCart, cartTotal } =
    useCart();

  const toggleCart = () => setIsOpen(!isOpen);
  const toggleAccountPanel = () => {
    setIsAcountOpen((prev) => !prev);
  };
  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    fetchProducts();
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/get-products");
      setProducts(response.data);
    } catch (error) {
      console.error("Ürünler alınamadı:", error);
    }
  };
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Eğer arama çubuğu boşsa, filtrelemeyi sıfırla
    if (value.trim() === "") {
      setFilteredProducts([]);
    } else {
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(value.toLowerCase())
      );

      // Filtrelenmiş sonuçları yalnızca arama değeri doğrultusunda güncelle
      setFilteredProducts(filtered);
    }
  };
  const handleLogout = () => {
    AuthService.logout();
    setUser(null);
    navigate("/");
    window.location.reload();
  };
  const handleProfile = () => {
    navigate("/Profile");
    window.location.reload();
  };
  const handleOrder = () => {
    navigate("/Order");
    window.location.reload();
  };

  const handleScroll = () => {
    setScrollPosition(window.scrollY);
  };

  const handleAcount = () => {
    if (AuthService.getCurrentUser()) {
      toggleAccountPanel();
      setUser(AuthService.getCurrentUser());
      console.log(user);
    } else {
      navigate("/login");
      window.location.reload();
    }
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
        removeFromCart(itemId); // Adet 0'ın altına düşerse ürünü kaldır
      } else {
        // Adet stok sınırlarını aşmıyorsa güncelle
        updateCartItemQuantity(
          itemId,
          Math.min(newQuantity, item.stockQuantity)
        ); // `item.stock` yerine `item.stockQuantity` kullanılıyor
      }
    }
  };

  return (
    <>
      {bannerVisible && (
        <div
          className="banner"
          style={{
            opacity: Math.max(1 - scrollPosition / 200, 0), // Sayfa kaydırıldıkça azal
          }}
        >
          <p className="banner-text">
            550 TL ÜZERİ ALIŞVERİŞLERİNİZİN KARGOSU ÜCRETSİZDİR.
          </p>
          <button onClick={closeBanner} className="banner-close-button">
            X
          </button>
        </div>
      )}
      <header className="fixedHeader">
        <div className="logo">
          <a href="/">🌟 TuruncuShop</a>
        </div>
        <Box
          sx={{
            padding: 4,
            minWidth: "600px",
            maxWidth: "600px",
            margin: "auto",
            position: "relative",
          }}
        >
          <Typography variant="h5" component="h1" gutterBottom></Typography>
          <TextField
            fullWidth
            label="Ürün adı ara..."
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchChange} // Kullanıcının yazdığı değer tetikler
            sx={{ marginBottom: 3 }}
          />
          {/* Liste yalnızca bir şey yazıldığında açılır */}
          {searchTerm.trim() && (
            <Paper
              elevation={3}
              sx={{
                padding: 2,
                gap: 10,
                position: "absolute",
                zIndex: "20000",
              }}
            >
              <List>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <ListItem
                      key={product.id}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: 2,
                        padding: 3,
                        height: "15px",
                        minWidth: "500px",
                        maxWidth: "500px",
                      }}
                    >
                      <img
                        src={product.image_data}
                        alt={product.name}
                        style={{
                          width: "50px",
                          height: "50px",
                          borderRadius: "5px",
                          marginRight: "15px",
                        }}
                      />
                      <ListItemText primary={product.name} />
                    </ListItem>
                  ))
                ) : (
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ minWidth: "500px", maxWidth: "500px" }}
                  >
                    Eşleşen ürün bulunamadı.
                  </Typography>
                )}
              </List>
            </Paper>
          )}
        </Box>
        <Button
          variant="contained"
          onClick={toggleCart}
          sx={{
            position: "absolute",
            top: "30%",
            right: "10px",
            height: "50px",
            width: "150px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between", // Sol ve sağ öğeleri birbirinden ayırmak için
            background: "white",
            border: "1px solid #ccc",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            "&:hover": {
              backgroundColor: "#ffd54f",
            },
          }}
        >
          {/* Sol taraftaki simge */}
          <Badge
            badgeContent={cartItems.length}
            color="error"
            sx={{
              left: 0,
              ".MuiBadge-dot": {
                backgroundColor: "red",
              },
            }}
          >
            <ShoppingCartIcon
              sx={{
                color: "#ff6f00",
                fontSize: "20px",
              }}
            />
          </Badge>

          {/* Sağ tarafta fiyat */}
          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: "bold",
              color: "#333",
            }}
          >
            {cartTotal()} TL
          </Typography>
        </Button>
        <Button
          variant="contained"
          onClick={() => handleAcount()}
          sx={{
            position: "absolute",
            top: "30%",
            right: "170px",
            height: "50px",
            width: "150px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "white",
            border: "1px solid #ccc",
            fontSize: "12px",
            fontWeight: "bold",
            color: "#333",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            "&:hover": {
              backgroundColor: "#ffd54f",
            },
          }}
        >
          {/* Koşullu render işlemi */}
          {AuthService.getCurrentUser() ? "HESABIM" : "GİRİŞ/KAYIT"}
        </Button>
      </header>

      <header
        className={`header ${
          bannerVisible ? "header-visible" : "header-hidden"
        }`}
        style={{
          transform: bannerVisible ? "translateY(0)" : "-100px", // Yukarı kaydırıyoruz
          transition: "transform 0.3s ease-out",
        }}
      >
        <div className="header-container">
          <nav className="nav">
            <ul className="nav-list">
              <li>
                <a href="/">Anasayfa</a>
              </li>
              <li>
                <a href="/products">Ürünler</a>
              </li>
              <li>
                <a href="/about">Hakkımızda</a>
              </li>
              <li>
                <a href="/contact">İletişim</a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {isAcountOpen && (
        <>
          {/* Arka plan kutusu */}
          <Box
            onClick={toggleAccountPanel}
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 1200,
            }}
          />
        </>
      )}

      <Box
        sx={{
          position: "fixed",
          top: 0,
          right: 0,
          width: "400px",
          height: "100%",
          bgcolor: "background.paper",
          boxShadow: 3,
          p: 2,
          transform: isAcountOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s ease-in-out",
          zIndex: 1300,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between", // İçeriği üst ve alt kısmına yerleştirir
        }}
      >
        <div>
          <Typography variant="h5" gutterBottom sx={{ textAlign: "center" }}>
            Hesap Bilgileri
          </Typography>
          <Typography variant="body1" sx={{ textAlign: "center", mt: 1 }}>
            Hoşgeldiniz{" "}
            {AuthService.getCurrentUser()?.user.firstName +
              " " +
              AuthService.getCurrentUser()?.user.lastName || "Bilgi yok"}
          </Typography>
          <Button
            variant="contained"
            onClick={() => handleProfile()}
            sx={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#FFA500", // Turuncu rengin hex kodu
              "&:hover": {
                backgroundColor: "#FF8C00",
              },
            }} // Alt tarafta biraz boşluk bırakabilirsiniz
          >
            Profilim
          </Button>
          <Button
            variant="contained"
            onClick={() => handleOrder()}
            sx={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#FFA500", // Turuncu rengin hex kodu
              "&:hover": {
                backgroundColor: "#FF8C00",
              },
            }} // Alt tarafta biraz boşluk bırakabilirsiniz
          >
            Siparişlerim
          </Button>
          <Button
            variant="contained"
            onClick={() => handleLogout()}
            sx={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#FFA500", // Turuncu rengin hex kodu
              "&:hover": {
                backgroundColor: "#FF8C00",
              },
            }} // Alt tarafta biraz boşluk bırakabilirsiniz
          >
            Çıkış Yap
          </Button>
        </div>

        <Button
          variant="contained"
          onClick={toggleAccountPanel}
          sx={{
            mb: 2,
            backgroundColor: "#FFA500", // Turuncu rengin hex kodu
            "&:hover": {
              backgroundColor: "#FF8C00",
            },
          }} // Alt tarafta biraz boşluk bırakabilirsiniz
        >
          Kapat
        </Button>
      </Box>

      {isOpen && (
        <Box
          onClick={toggleCart}
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1200,
          }}
        />
      )}

      <Box
        sx={{
          position: "fixed",
          top: 0,
          right: 0,
          width: "400px",
          height: "100%",
          bgcolor: "background.paper",
          boxShadow: 3,
          p: 2,
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s ease-in-out",
          zIndex: 1300,
        }}
      >
        <Typography variant="h5" gutterBottom>
          Sepet
        </Typography>

        {cartItems.length === 0 ? (
          <Typography variant="body1">Sepetiniz boş.</Typography>
        ) : (
          <List>
            {cartItems.map((item) => (
              <ListItem
                key={item.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  mb: 2,
                }}
              >
                <img
                  src={item.image_data}
                  alt={item.name}
                  style={{
                    width: "50px",
                    height: "50px",
                    objectFit: "cover",
                    borderRadius: "4px",
                  }}
                />
                <Box>
                  <Typography variant="subtitle1">
                    <strong>{item.name}</strong>
                  </Typography>
                  <Typography variant="body2">
                    Fiyat: {item.price} TL
                  </Typography>
                  <Typography variant="body2">
                    İndirim: %{item.discountRate}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleQuantityChange(item.id, -1)}
                    >
                      -
                    </Button>
                    <Typography variant="body2" sx={{ mx: 1 }}>
                      {item.quantity}
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleQuantityChange(item.id, 1)}
                    >
                      +
                    </Button>
                  </Box>
                </Box>
                <IconButton edge="end" onClick={() => removeFromCart(item.id)}>
                  <DeleteIcon />
                </IconButton>
              </ListItem>
            ))}
          </List>
        )}

        {cartItems.length > 0 && (
          <Paper
            elevation={2}
            sx={{
              position: "absolute",
              bottom: 16,
              left: 16,
              right: 16,
              p: 2,
            }}
          >
            <Typography variant="body1">
              <strong>Toplam Fiyat:</strong>{" "}
              <span style={{ textDecoration: "line-through", color: "#888" }}>
                {calculateTotalPrice().toFixed(2)} TL
              </span>
            </Typography>
            <Typography variant="body1">
              <strong>İndirim Sonrası Fiyat:</strong>{" "}
              {calculateDiscountedPrice().toFixed(2)} TL
            </Typography>
            <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={() => navigate("/Payment")}
              >
                Ödeme Yap
              </Button>
              <Button
                variant="outlined"
                color="primary"
                fullWidth
                onClick={toggleCart}
              >
                Alışverişe Devam Et
              </Button>
            </Box>
          </Paper>
        )}
      </Box>
    </>
  );
};

export default Header;
