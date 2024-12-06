import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './AddTrademark.css';  // CSS dosyasını burada dahil ediyoruz

function AddTrademark() {
  const [trademark, setTrademark] = useState('');
  const [message, setMessage] = useState('');
  const [trademarks, setTrademarks] = useState([]);

  // Trademark ekleme
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/add-trademark', { trademark });
      setMessage(response.data.message);
      fetchTrademarks(); // Refresh the trademarks list after adding a new one
    } catch (error) {
      setMessage('Bir hata oluştu.');
    }
  };

  // Trademarkları çekme
  const fetchTrademarks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/get-trademarks');
      setTrademarks(response.data);
    } catch (error) {
      console.error('Trademarkları alırken bir hata oluştu.', error);
    }
  };

  // Trademark silme
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5000/delete-trademark/${id}`);
      setMessage(response.data.message);
      fetchTrademarks(); // Refresh the trademarks list after deleting
    } catch (error) {
      setMessage('Trademark silinemedi.');
    }
  };

  useEffect(() => {
    fetchTrademarks();
  }, []);

  return (
    <div className="container">
      <h2 className="heading">Trademark Ekle</h2>
      <Link to="/admin">
        <button className="button">Ana Sayfaya Dön</button>
      </Link>

      <form className="form-wrapper" onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Trademark Adı:</label>
          <input 
            type="text" 
            value={trademark} 
            onChange={(e) => setTrademark(e.target.value)} 
            required 
            className="input-field"
          />
        </div>
        <button type="submit" className="button">Ekle</button>
      </form>

      {message && <p className="message">{message}</p>}

      <h3>Trademark Listesi</h3>
      <ul className="trademark-list">
        {trademarks.map((trademark) => (
          <li key={trademark.ID} className="trademark-item">
            <span>{trademark.UrunAdi}</span>
            <button className="delete-button" onClick={() => handleDelete(trademark.ID)}>Sil</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AddTrademark;
