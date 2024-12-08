import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './AddCategory.css'; // CSS dosyasını buraya ekliyoruz

function AddCategory() {
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [message, setMessage] = useState('');
  const [categorys, setCategorys] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState({});

  // Bir kategoriyi tıklandığında aç/kapat
  const toggleCategory = async (categoryId) => {
    setExpandedCategories((prevState) => {
      const isExpanded = prevState[categoryId];
      const newExpandedState = {
        ...prevState,
        [categoryId]: !isExpanded,
      };
  
      // Eğer kategori açılıyorsa alt kategorileri çek
      if (!isExpanded) {

        console.log(subcategories);
      }
  
      return newExpandedState;
    });
  };

  // Category ekleme
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/add-category', { category });
      setMessage(response.data.message);
      fetchCategories(); // Refresh the categories list after adding a new one
    } catch (error) {
      setMessage('Bir hata oluştu.');
    }
  };

  // Subcategory ekleme
  const handleSubcategorySubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/add-subcategory', { 
        category_id: selectedCategory, 
        name: subcategory 
      });
      setMessage(response.data.message);
      fetchSubcategories();
    } catch (error) {
      setMessage('Bir hata oluştu.');
    }
  };

  // Categories çekme
  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5000/get-categorys');
      setCategorys(response.data);
    } catch (error) {
      console.error('Kategoriler alınırken bir hata oluştu.', error);
    }
  };

  // Subcategories çekme
  const fetchSubcategories = async (categoryId) => {
    try {
      const response = await axios.get(`http://localhost:5000/get-subcategorys`);
      setSubcategories(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Alt kategoriler alınırken bir hata oluştu.', error);
    }
  };

  // Category silme
  const handleDeleteCategory = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5000/delete-category/${id}`);
      setMessage(response.data.message);
      fetchCategories(); // Refresh the categories list after deleting
    } catch (error) {
      setMessage('Kategori silinemedi.');
    }
  };

  // Subcategory silme
  const handleDeleteSubcategory = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5000/delete-subcategory/${id}`);
      setMessage(response.data.message);
      fetchSubcategories();
    } catch (error) {
      setMessage('Alt kategori silinemedi.');
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchSubcategories();
  }, []);

  return (
    <div className="container">
      <h2 className="heading">Kategori ve Alt Kategori Yönetimi</h2>
      <Link to="/admin">
        <button className="button">Ana Sayfaya Dön</button>
      </Link>

      {/* Kategori Ekleme Formu */}
      <form className="form-wrapper" onSubmit={handleCategorySubmit}>
        <div className="input-group">
          <label>Kategori Adı:</label>
          <input 
            type="text" 
            value={category} 
            onChange={(e) => setCategory(e.target.value)} 
            required 
            className="input-field"
          />
        </div>
        <button type="submit" className="button">Kategori Ekle</button>
      </form>

      {/* Alt Kategori Ekleme Formu */}
      <form className="form-wrapper" onSubmit={handleSubcategorySubmit}>
        <div className="input-group">
          <label>Kategori Seç:</label>
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)} 
            required 
            className="input-field"
          >
            <option value="" disabled>Bir kategori seçin</option>
            {categorys.map((cat) => (
              <option key={cat.ID} value={cat.ID}>{cat.UrunAdi}</option>
            ))}
          </select>
        </div>
        <div className="input-group">
          <label>Alt Kategori Adı:</label>
          <input 
            type="text" 
            value={subcategory} 
            onChange={(e) => setSubcategory(e.target.value)} 
            required 
            className="input-field"
          />
        </div>
        <button type="submit" className="button">Alt Kategori Ekle</button>
      </form>

      {message && <p className="message">{message}</p>}

      {/* Kategoriler ve Alt Kategoriler */}
      <h3>Kategori Listesi</h3>
      <ul className="category-list">
        {categorys.map((cat) => (
          <li key={cat.ID} className="category-item">
            {/* Açılır/Kapanır Mantığı */}
            <div 
              className="category-header" 
              onClick={() => toggleCategory(cat.ID)}
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              <span style={{ marginRight: '8px' }}>{expandedCategories[cat.ID] ? '-' : '+'}</span>
              <span>{cat.UrunAdi}</span>
            </div>
            <button 
              className="delete-button" 
              onClick={() => handleDeleteCategory(cat.ID)}
            >
              Sil
            </button>

            {/* Alt Kategoriler Açıldığında */}
            {expandedCategories[cat.ID]  && (
              <div className="expanded-content">
                {/* Alt kategoriler */}
                <ul className="subcategory-list">
                  {subcategories
                    .filter((sub) => sub.category_id === cat.ID)
                    .map((sub) => (
                      <li key={sub.id} className="subcategory-item">
                        <span>{sub.name}</span>
                        <button 
                          className="delete-button" 
                          onClick={() => handleDeleteSubcategory(sub.id)}
                        >
                          Sil
                        </button>
                      </li>
                    ))}
                </ul>
                
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AddCategory;
