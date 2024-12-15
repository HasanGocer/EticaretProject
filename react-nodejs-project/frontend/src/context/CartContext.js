import React, { createContext, useState, useContext, useEffect } from "react";

// CartContext oluşturuyoruz
const CartContext = createContext();

// Hook kullanımı
export const useCart = () => {
  return useContext(CartContext);
};

// CartProvider Component'i
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // LocalStorage'dan sepeti yükle
  useEffect(() => {
    const savedCart = localStorage.getItem("cartItems");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // LocalStorage'a sepeti kaydet
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // Sepete ürün ekleme
  const addToCart = (product) => {
    if (!product || !product.id) {
      console.error("Geçersiz ürün verisi:", product);
      return;
    }

    const existingItem = cartItems.find((item) => item.id === product.id);

    if (existingItem) {
      if (existingItem.quantity < product.stockQuantity) {
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        );
      } else {
        console.error("Stok miktarı aşıldı.");
      }
    } else {
      if (product.stockQuantity > 0) {
        const newProduct = {
          id: product.id,
          name: product.name,
          price: product.price,
          image_data: product.image_data || null,
          discountRate: product.discountRate || 0,
          stockQuantity: product.stockQuantity,
          description: product.description || "Açıklama yok.",
          quantity: 1,
        };
        setCartItems((prevItems) => [...prevItems, newProduct]);
      } else {
        console.error("Stokta ürün yok.");
      }
    }
  };

  // Sepet öğesi miktarını güncelle
  const updateCartItemQuantity = (productId, quantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId
          ? {
              ...item,
              quantity: Math.min(quantity, item.stockQuantity), // Stok sınırına dikkat
            }
          : item
      )
    );
  };

  // Sepetten ürün çıkar
  const removeFromCart = (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== productId)
    );
  };

  // Sepeti temizle
  const clearCart = () => {
    setCartItems([]);
  };

  // Sepet için ek bir kontrol veya işlem yapmak isteyenler için bu fonksiyonu döndürüyoruz
  const cartTotal = () => {
    return cartItems
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems, // Sepet öğeleri
        setCartItems, // Sepet üzerinde doğrudan işlem yapılabilmesi için
        addToCart, // Sepete ürün ekle
        removeFromCart, // Sepetten ürün çıkar
        clearCart, // Sepeti temizle
        updateCartItemQuantity, // Sepet öğesi miktarını güncelle
        cartTotal, // Sepetin toplam maliyetini döndüren hesaplama fonksiyonu
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
