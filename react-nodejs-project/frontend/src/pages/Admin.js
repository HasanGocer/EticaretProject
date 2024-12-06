import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import './Admin.css';  // CSS dosyasını burada dahil ediyoruz
import AddProduct from './Adds/AddProduct';
import AddVariant from './Adds/AddVariant';
import AddTrademark from './Adds/AddTrademark';
import AddCategory from './Adds/AddCategory';
import AddAdditionalFeature from './Adds/AddAdditionalFeature';
import EditProduct from './Edits/EditProduct';
import EditVariant from './Edits/EditVariant';
import EditTrademark from './Edits/EditTrademark';
import EditCategory from './Edits/EditCategory';
import EditAdditionalFeature from './Edits/EditAdditionalFeature';

function Admin() {
  const navigate = useNavigate();
  const [selectedPage, setSelectedPage] = useState("");

  const handleSelectChange = (event) => {
    const newPage = event.target.value;
    setSelectedPage(newPage);
    if (newPage) {
      navigate(newPage); // Sayfaya yönlendir
    }
  };

  return (
    <div className="admin-container">
      <h1 className="header">Ürün Yönetimi</h1>

      {/* Sayfa Seçim Menüsü */}
      <div className="select-wrapper">
        <select 
          className="select-menu" 
          value={selectedPage} 
          onChange={handleSelectChange}
        >
            <option >seçenekler</option>
          <optgroup label="Ekleme">
            <option value="/admin/addProduct">Ürün Ekleme</option>
            <option value="/admin/addVariant">Varyant Ekleme</option>
            <option value="/admin/addTrademark">Marka Ekleme</option>
            <option value="/admin/addCategory">Kategori Ekleme</option>
            <option value="/admin/addAdditionalFeature">Ekstra Özellik Ekleme</option>
          </optgroup>
          <optgroup label="Düzenleme">
            <option value="/admin/editProduct">Ürün Düzenleme</option>
            <option value="/admin/editVariant">Varyant Düzenleme</option>
            <option value="/admin/editTrademark">Marka Düzenleme</option>
            <option value="/admin/editCategory">Kategori Düzenleme</option>
            <option value="/admin/editAdditionalFeature">Ekstra Özellik Düzenleme</option>
          </optgroup>
        </select>
      </div>

      {/* Sayfa Yönlendirmeleri */}
      <Routes>
        {/* Ekleme Sayfaları */}
        <Route path="/admin/addProduct" element={<AddProduct />} />
        <Route path="/admin/addVariant" element={<AddVariant />} />
        <Route path="/admin/addTrademark" element={<AddTrademark />} />
        <Route path="/admin/addCategory" element={<AddCategory />} />
        <Route path="/admin/addAdditionalFeature" element={<AddAdditionalFeature />} />

        {/* Düzenleme Sayfaları */}
        <Route path="/admin/editProduct" element={<EditProduct />} />
        <Route path="/admin/editVariant" element={<EditVariant />} />
        <Route path="/admin/editTrademark" element={<EditTrademark />} />
        <Route path="/admin/editCategory" element={<EditCategory />} />
        <Route path="/admin/editAdditionalFeature" element={<EditAdditionalFeature />} />
      </Routes>
    </div>
  );
}

export default Admin;
