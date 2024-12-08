import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./EditCategory.css";

function EditCategory() {
  const [message, setMessage] = useState("");
  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [editingSubcategories, setEditingSubcategories] = useState({});

  // Kategorileri çek
  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:5000/get-categorys");
      setCategories(response.data);
    } catch (error) {
      console.error("Kategoriler çekilirken hata oluştu.", error);
    }
  };

  // Alt kategorileri çek ve düzenleme alanlarını başlat
  const fetchSubcategories = async (categoryId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/get-subcategorys?category_id=${categoryId}`
      );
      setSubcategories(response.data);

      const initialEditingSubcategories = {};
      response.data.forEach(sub => {
        initialEditingSubcategories[sub.id] = { name: sub.name };
      });
      setEditingSubcategories(initialEditingSubcategories);
    } catch (error) {
      console.error("Alt kategoriler çekilirken hata oluştu.", error);
    }
  };

  // Alt kategori güncelle
  const updateSubcategory = async (id) => {
    try {
      console.log("Updating subcategory with id:", id, "name:", editingSubcategories[id]?.name);

      const response = await axios.put(
        `http://localhost:5000/update-subcategory/${id}`,
        { name: editingSubcategories[id]?.name }
      );
      setMessage(response.data.message);
      fetchSubcategories(editingCategory.ID);
    } catch (error) {
      console.error("Alt kategori güncellenirken hata oluştu.", error);
    }
  };

  const updateCategory = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/update-category/${editingCategory.ID}`,
        { UrunAdi: editingCategory.UrunAdi }
      );
      setMessage(response.data.message || "Kategori başarıyla güncellendi.");
      closeEditCategoryModal();
      fetchCategories();
    } catch (error) {
      console.error("Kategori güncellenirken hata oluştu:", error);
      setMessage("Kategori güncellenirken bir hata oluştu.");
    }
  };
  
  const closeEditCategoryModal = () => {
    setEditingCategory(null);
  };

  const handleSubcategoryChange = (id, value) => {
    setEditingSubcategories((prev) => ({
      ...prev,
      [id]: { ...prev[id], name: value },
    }));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="container">
      <h2 className="heading">Kategori Düzenle</h2>
      <Link to="/admin">
        <button className="button">Ana Sayfaya Dön</button>
      </Link>

      {message && <p className="message">{message}</p>}

      <h3>Kategori Listesi</h3>
      <ul className="category-list">
        {categories.map((category) => (
          <li key={category.ID} className="category-item">
            <span>{category.UrunAdi}</span>
            <button
              className="edit-button"
              onClick={() => {
                setEditingCategory({ ...category });
                fetchSubcategories(category.ID);
              }}
            >
              Düzenle
            </button>
          </li>
        ))}
      </ul>

      {/* Düzenleme Modalı */}
      {editingCategory && (
        <div className="modal">
          <div className="modal-content">
            <h3>Kategori'yi Düzenle</h3>
            <input
              type="text"
              value={editingCategory.UrunAdi}
              onChange={(e) =>
                setEditingCategory({
                  ...editingCategory,
                  UrunAdi: e.target.value,
                })
              }
              className="input-field"
            />
            <div className="modal-actions">
            <button className="button" onClick={updateCategory}>
                Kaydet
              </button>
              <button
                className="button cancel-button"
                onClick={closeEditCategoryModal}
              >
                İptal
              </button>
            </div>
            <h4>Alt Kategoriler</h4>
            <ul className="subcategory-list">
              {subcategories.filter((sub) => sub.category_id === editingCategory.ID)
                .map((sub) => (
                <li key={sub.id} className="subcategory-item">
                  <input
                    type="text"
                    value={editingSubcategories[sub.id]?.name || sub.name}
                    onChange={(e) => handleSubcategoryChange(sub.id, e.target.value)}
                    className="input-field"
                  />
                  <button
                    className="button"
                    onClick={() => updateSubcategory(sub.id)}
                  >
                    Kaydet
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditCategory;
