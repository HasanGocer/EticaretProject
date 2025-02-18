import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../Apis/auth.service";
import { useCart } from "../context/CartContext";
import { GetAllProducts } from "../Apis/api";
import axios from "axios";
import {
  Box,
  Container,
  Button,
  AppBar,
  Toolbar,
  Typography,
  TextField,
  List,
  ListItem,
  ListItemText,
  useScrollTrigger,
  Slide,
  IconButton,
  Paper,
  Badge,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CloseIcon from "@mui/icons-material/Close";

const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isAcountOpen, setIsAcountOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [bannerVisible, setBannerVisible] = useState(true);
  const [navHidden, setNavHidden] = useState(false);

  const trigger = useScrollTrigger({ threshold: 150, disableHysteresis: true });
  const prevTrigger = useRef(trigger);

  const logo = "/AdAstraYazLogo.png";
  const { cartItems, updateCartItemQuantity, removeFromCart, cartTotal } =
    useCart();

  function HideOnScroll({ children, onHide }) {
    const trigger = useScrollTrigger({
      threshold: 150,
      disableHysteresis: true,
    });
    const prevTrigger = useRef(null);

    useEffect(() => {
      if (prevTrigger.current !== trigger) {
        onHide(trigger);
        prevTrigger.current = trigger;
      }
    }, [trigger, onHide]);

    return (
      <Slide in={!trigger} direction="down">
        {children}
      </Slide>
    );
  }

  const toggleCart = () => setIsOpen(!isOpen);
  const toggleAccountPanel = () => {
    setIsAcountOpen((prev) => !prev);
  };

  useEffect(() => {
    console.log("navHidden:", navHidden, "bannerVisible:", bannerVisible);
  }, [navHidden, bannerVisible]);

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    FetchProducts();
  }, []);
  const FetchProducts = async () => {
    const products = await GetAllProducts();
    setProducts(products);
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

  const handleAccount = () => {
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
    <Container>
      {bannerVisible && (
        <Box
          sx={{
            backgroundColor: "#ff6f00",
            color: "white",
            padding: "10px",
            textAlign: "center",
            position: "fixed",
            top: 0,
            width: "100%",
            zIndex: 1300,
          }}
        >
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            550 TL ÜZERİ ALIŞVERİŞLERİNİZİN KARGOSU ÜCRETSİZDİR.
          </Typography>
          <Button
            onClick={() => setBannerVisible(false)}
            sx={{
              position: "absolute",
              top: "5px",
              right: "10px",
              color: "white",
              minWidth: "30px",
            }}
          >
            <CloseIcon />
          </Button>
        </Box>
      )}

      <HideOnScroll onHide={setNavHidden}>
        <AppBar
          position="fixed"
          sx={{
            top: bannerVisible ? "40px" : "0px",
            backgroundColor: "#ff6f00",
            transition: "top 0.3s ease-in-out",
            zIndex: 1200,
          }}
        >
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: "white" }}
            >
              Mağazam
            </Typography>
            <Button sx={{ color: "white" }}>
              <ShoppingCartIcon />
            </Button>
          </Toolbar>
        </AppBar>
      </HideOnScroll>

      <AppBar
        position="fixed"
        sx={{
          top: navHidden
            ? bannerVisible
              ? "40px"
              : "0px"
            : bannerVisible
            ? "103px"
            : "63px", // HideOnScroll kaybolunca yukarı çık
          backgroundColor: "#ff6f00",
          transition: "top 0.18s ease-in-out",
          maxHeight: "10vh",
          zIndex: 1100,
        }}
      >
        <Toolbar>
          <Typography
            variant="h4"
            sx={{ marginBottom: "20px", textAlign: "center", width: "100%" }}
          >
            Hoşgeldiniz
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Alt Çubuk */}
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          width: "100%",
          backgroundColor: "#ff6f00",
          color: "white",
          textAlign: "center",
          padding: "10px 0",
        }}
      ></Box>

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
    </Container>
  );
};

export default Header;
