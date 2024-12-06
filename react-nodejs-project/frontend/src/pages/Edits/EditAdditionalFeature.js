import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './EditAdditionalFeature.css';

function EditAdditionalFeature() {
  const [message, setMessage] = useState('');
  const [additionalfeatures, setAdditionalFeatures] = useState([]);
  const [editingFeature, setEditingFeature] = useState(null); // Editing feature

  // Fetch additional features
  const fetchAdditionalFeatures = async () => {
    try {
      const response = await axios.get('http://localhost:5000/get-additionalfeatures');
      setAdditionalFeatures(response.data);
    } catch (error) {
      console.error('Error fetching additional features.', error);
    }
  };

  // Update additional feature
  const updateFeature = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/update-additionalfeature/${editingFeature.ID}`,
        { UrunAdi: editingFeature.UrunAdi }
      );
      setMessage(response.data.message);
    } catch (error) {
      console.error('Error updating additional feature.', error);
    }
    setEditingFeature(null);
    fetchAdditionalFeatures();
  };

  // Close edit modal
  const closeEditModal = () => {
    setEditingFeature(null);
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

      {message && <p className="message">{message}</p>}

      <h3>Additional Feature Listesi</h3>
      <ul className="additional-feature-list">
        {additionalfeatures.map((feature) => (
          <li key={feature.ID} className="additional-feature-item">
            <span>{feature.UrunAdi}</span>
            <button
              className="edit-button"
              onClick={() => setEditingFeature({ ...feature })}
            >
              Düzenle
            </button>
          </li>
        ))}
      </ul>

      {/* Edit Modal */}
      {editingFeature && (
        <div className="modal">
          <div className="modal-content">
            <h3>Additional Feature Düzenle</h3>
            <input
              type="text"
              value={editingFeature.UrunAdi}
              onChange={(e) =>
                setEditingFeature({
                  ...editingFeature,
                  UrunAdi: e.target.value,
                })
              }
              className="input-field"
            />
            <div className="modal-actions">
              <button className="button" onClick={updateFeature}>
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

export default EditAdditionalFeature;
