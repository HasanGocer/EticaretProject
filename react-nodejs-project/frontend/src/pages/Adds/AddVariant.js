import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './AddVariant.css';  // CSS dosyasını burada dahil ediyoruz

function AddVariant() {
  const [variant, setVariant] = useState('');
  const [message, setMessage] = useState('');
  const [variants, setVariants] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/add-variant', { variant });
      setMessage(response.data.message);
      fetchVariants();
    } catch (error) {
      setMessage('Bir hata oluştu.');
    }
  };

  const fetchVariants = async () => {
    try {
      const response = await axios.get('http://localhost:5000/get-variants');
      setVariants(response.data);
    } catch (error) {
      console.error('Varyantları alırken bir hata oluştu.', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5000/delete-variant/${id}`);
      setMessage(response.data.message);
      fetchVariants();
    } catch (error) {
      setMessage('Varyant silinemedi.');
    }
  };

  useEffect(() => {
    fetchVariants();
  }, []);

  return (
    <div className="container">
      <h2 className="heading">Varyant Ekle</h2>
      <Link to="/admin">
        <button className="button">Ana Sayfaya Dön</button>
      </Link>

      <form className="form-wrapper" onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Varyant Adı:</label>
          <input 
            type="text" 
            value={variant} 
            onChange={(e) => setVariant(e.target.value)} 
            required 
            className="input-field"
          />
        </div>
        <button type="submit" className="button">Ekle</button>
      </form>

      {message && <p className="message">{message}</p>}

      <h3>Varyant Listesi</h3>
      <ul className="variant-list">
        {variants.map((variant) => (
          <li key={variant.ID} className="variant-item">
            <span>{variant.UrunAdi}</span>
            <button className="delete-button" onClick={() => handleDelete(variant.ID)}>Sil</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AddVariant;
