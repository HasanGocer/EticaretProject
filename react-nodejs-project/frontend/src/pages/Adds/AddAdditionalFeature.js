import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './AddAdditionalFeature.css';

function AddAdditionalFeature() {
  const [additionalfeature, setAdditionalfeature] = useState('');
  const [message, setMessage] = useState('');
  const [additionalfeatures, setAdditionalFeatures] = useState([]);

  // Additional Feature ekleme
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/add-additionalfeature', { additionalfeature });
      setMessage(response.data.message);
      fetchAdditionalFeatures(); // Refresh the list after adding a new one
    } catch (error) {
      setMessage('Bir hata oluştu.');
    }
  };

  // Additional Features çekme
  const fetchAdditionalFeatures = async () => {
    try {
      const response = await axios.get('http://localhost:5000/get-additionalfeatures');
      setAdditionalFeatures(response.data);
    } catch (error) {
      console.error('Additional features alınırken bir hata oluştu.', error);
    }
  };

  // Additional Feature silme
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5000/delete-additionalfeature/${id}`);
      setMessage(response.data.message);
      fetchAdditionalFeatures(); // Refresh the list after deleting
    } catch (error) {
      setMessage('Additional Feature silinemedi.');
    }
  };

  useEffect(() => {
    fetchAdditionalFeatures();
  }, []);

  return (
    <div className="container">
      <h2 className="heading">Additional Feature Ekle</h2>
      <Link to="/admin">
        <button className="button">Ana Sayfaya Dön</button>
      </Link>

      <form className="form-wrapper" onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Additional Feature Adı:</label>
          <input 
            type="text" 
            value={additionalfeature} 
            onChange={(e) => setAdditionalfeature(e.target.value)} 
            required 
            className="input-field"
          />
        </div>
        <button type="submit" className="button">Ekle</button>
      </form>

      {message && <p className="message">{message}</p>}

      <h3>Additional Feature Listesi</h3>
      <ul className="additional-feature-list">
        {additionalfeatures.map((feature) => (
          <li key={feature.ID} className="additional-feature-item">
            <span>{feature.UrunAdi}</span>
            <button className="delete-button" onClick={() => handleDelete(feature.ID)}>Sil</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AddAdditionalFeature;
