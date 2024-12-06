import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './AddCategory.css';  // CSS dosyasını buraya ekliyoruz

function AddCategory() {
  const [category, setCategory] = useState('');
  const [message, setMessage] = useState('');
  const [categorys, setCategorys] = useState([]);

  // Category ekleme
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/add-category', { category });
      setMessage(response.data.message);
      fetchCategorys(); // Refresh the categorys list after adding a new one
    } catch (error) {
      setMessage('Bir hata oluştu.');
    }
  };

  // Categories çekme
  const fetchCategorys = async () => {
    try {
      const response = await axios.get('http://localhost:5000/get-categorys');
      setCategorys(response.data);
    } catch (error) {
      console.error('Categoryları alırken bir hata oluştu.', error);
    }
  };

  // Category silme
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5000/delete-category/${id}`);
      setMessage(response.data.message);
      fetchCategorys(); // Refresh the categorys list after deleting
    } catch (error) {
      setMessage('Category silinemedi.');
    }
  };

  useEffect(() => {
    fetchCategorys();
  }, []);

  return (
    <div className="container">
      <h2 className="heading">Category Ekle</h2>
      <Link to="/admin">
        <button className="button">Ana Sayfaya Dön</button>
      </Link>

      <form className="form-wrapper" onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Category Adı:</label>
          <input 
            type="text" 
            value={category} 
            onChange={(e) => setCategory(e.target.value)} 
            required 
            className="input-field"
          />
        </div>
        <button type="submit" className="button">Ekle</button>
      </form>

      {message && <p className="message">{message}</p>}

      <h3>Category Listesi</h3>
      <ul className="category-list">
        {categorys.map((category) => (
          <li key={category.ID} className="category-item">
            <span>{category.UrunAdi}</span>
            <button className="delete-button" onClick={() => handleDelete(category.ID)}>Sil</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AddCategory;
