import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "./theme";

import AddProduct from './pages/Adds/AddProduct';
import AddVariant from './pages/Adds/AddVariant';
import AddTrademark from './pages/Adds/AddTrademark';
import AddCategory from './pages/Adds/AddCategory';
import AddAdditionalFeature from './pages/Adds/AddAdditionalFeature';
import EditProduct from './pages/Edits/EditProduct';
import EditVariant from './pages/Edits/EditVariant';
import EditTrademark from './pages/Edits/EditTrademark';
import EditCategory from './pages/Edits/EditCategory';
import EditAdditionalFeature from './pages/Edits/EditAdditionalFeature';
import Sale from './pages/Sale';
import Order from './pages/Orders/Order';
import Payment from './pages/Payment';
import Admin from './pages/Admin';
import NotFound from './pages/NotFoundP';
import ProductDetail from './pages/Product';
import ProductPage from './pages/ProductPage';
import Header from './pages/Header';
import Login from './pages/Registration/Login';
import Register from './pages/Registration/Register';
import Profile from './pages/Registration/Profile';
import EditUsers from './pages/Registration/EditUsers';
import EditOrder from './pages/Orders/EditOrder';
import { CartProvider } from "./context/CartContext";

function App() {
  const [bannerVisible, setBannerVisible] = useState(true); // Notification durumu
  const [sidebarOpen, setSidebarOpen] = useState(false); // Sidebar kontrolü

  const closeBanner = () => {
    setBannerVisible(false); // Notification banner'ı kapat
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CartProvider>
          <div>
            {!window.location.pathname.startsWith('/admin') && (
              <div>
                <Header
                  sidebarOpen={sidebarOpen}
                  toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                  bannerVisible={bannerVisible}
                  closeBanner={closeBanner}
                />
              </div>
            )}
            
            <Routes>
              <Route path="/" element={<Sale />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/EditProduct" element={<EditProduct />} />
              <Route path="/admin/EditVariant" element={<EditVariant />} />
              <Route path="/admin/EditTrademark" element={<EditTrademark />} />
              <Route path="/admin/EditCategory" element={<EditCategory />} />
              <Route path="/admin/EditAdditionalFeature" element={<EditAdditionalFeature />} />
              <Route path="/admin/AddProduct" element={<AddProduct />} />
              <Route path="/admin/AddVariant" element={<AddVariant />} />
              <Route path="/admin/AddTrademark" element={<AddTrademark />} />
              <Route path="/admin/addCategory" element={<AddCategory />} />
              <Route path="/admin/AddAdditionalFeature" element={<AddAdditionalFeature />} />
              <Route path="/admin/EditUsers" element={<EditUsers />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/ProductPage" element={<ProductPage />} />
              <Route path="/Login" element={<Login />} />
              <Route path="/Register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/Payment" element={<Payment />} />
              <Route path="/order" element={<Order />} />
              <Route path="/admin/EditOrder" element={<EditOrder />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;
