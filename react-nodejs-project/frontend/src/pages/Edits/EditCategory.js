import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./EditCategory.css";

function EditCategory() {
  const [message, setMessage] = useState("");
  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null); // Düzenlenen kategori

  // Kategorileri çekme
  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:5000/get-categorys");
      setCategories(response.data);
    } catch (error) {
      console.error("Kategorileri alırken bir hata oluştu.", error);
    }
  };

  // Kategori güncelleme
  const updateCategory = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/update-category/${editingCategory.ID}`,
        { UrunAdi: editingCategory.UrunAdi }
      );
      setMessage(response.data.message);
    } catch (error) {
      console.error("Kategori güncellerken bir hata oluştu.", error);
    }
    setEditingCategory(null);
    fetchCategories();
  };

  // Modal kapatma
  const closeEditModal = () => {
    setEditingCategory(null);
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
              onClick={() => setEditingCategory({ ...category })}
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
              <button className="button cancel-button" onClick={closeEditModal}>
                İptal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditCategory;
