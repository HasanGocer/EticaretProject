import React, { createContext, useState, useContext } from "react";

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    if (!product || !product.id) {
      console.error("Geçersiz ürün verisi:", product);
      return;
    }

    const existingItem = cartItems.find((item) => item.id === product.id);

    if (existingItem) {
      // Eğer ürün zaten sepette varsa miktarı artır
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      // Yeni ürün ekle
      const newProduct = {
        id: product.id,
        name: product.name,
        price: product.price,
        image_data: product.image_data || null,
        discountRate: product.discountRate || 0,
        stockCode: product.stockCode || "N/A",
        description: product.description || "Açıklama yok.",
        quantity: 1, // Varsayılan olarak 1 adet
      };
      setCartItems((prevItems) => [...prevItems, newProduct]);
    }
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== productId)
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
