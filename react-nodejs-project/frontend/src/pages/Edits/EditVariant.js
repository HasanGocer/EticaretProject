import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./EditVariant.css";

function EditVariant() {
  const [message, setMessage] = useState("");
  const [variants, setVariants] = useState([]);
  const [editingVariant, setEditingVariant] = useState(null); // Düzenlenen varyant

  // Varyantları çekme
  const fetchVariants = async () => {
    try {
      const response = await axios.get("http://localhost:5000/get-variants");
      setVariants(response.data);
    } catch (error) {
      console.error("Varyantları alırken bir hata oluştu.", error);
    }
  };

  // Varyantı güncelleme
  const updateVariant = async () => {
    try {
      console.log(editingVariant);
      const response = await axios.put(
        `http://localhost:5000/update-variant/${editingVariant.ID}`,
        { UrunAdi: editingVariant.UrunAdi }
      );
      setMessage(response.data.message);
    } catch (error) {
      console.error("Varyant güncellerken bir hata oluştu.", error);
    }
    setEditingVariant(null);
    fetchVariants();
  };

  // Modal kapatma
  const closeEditModal = () => {
    setEditingVariant(null);
  };

  useEffect(() => {
    fetchVariants();
  }, []);

  return (
    <div className="container">
      <h2 className="heading">Varyant Düzenle</h2>
      <Link to="/admin">
        <button className="button">Ana Sayfaya Dön</button>
      </Link>

      {message && <p className="message">{message}</p>}

      <h3>Varyant Listesi</h3>
      <ul className="variant-list">
        {variants.map((variant) => (
          <li key={variant.ID} className="variant-item">
            <span>{variant.UrunAdi}</span>
            <button
              className="edit-button"
              onClick={() => setEditingVariant({ ...variant })}
            >
              Düzenle
            </button>
          </li>
        ))}
      </ul>

      {/* Düzenleme Modalı */}
      {editingVariant && (
        <div className="modal">
          <div className="modal-content">
            <h3>Varyantı Düzenle</h3>
            <input
              type="text"
              value={editingVariant.UrunAdi}
              onChange={(e) =>
                setEditingVariant({ ...editingVariant, UrunAdi: e.target.value })
              }
              className="input-field"
            />
            <div className="modal-actions">
              <button className="button" onClick={updateVariant}>
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

export default EditVariant;
