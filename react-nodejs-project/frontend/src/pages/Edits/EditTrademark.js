import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./EditTrademark.css";

function EditTrademark() {
  const [message, setMessage] = useState("");
  const [trademarks, setTrademarks] = useState([]);
  const [editingTrademark, setEditingTrademark] = useState(null); // Düzenlenen trademark

  // Trademarkları çekme
  const fetchTrademarks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/get-trademarks");
      setTrademarks(response.data);
    } catch (error) {
      console.error("Trademarkları alırken bir hata oluştu.", error);
    }
  };

  // Trademark güncelleme
  const updateTrademark = async () => {
    try {
      console.log(editingTrademark.ID);
      const response = await axios.put(
        `http://localhost:5000/update-trademark/${editingTrademark.ID}`,
        { UrunAdi: editingTrademark.UrunAdi }
      );
      setMessage(response.data.message);
    } catch (error) {
      console.error("Trademark güncellerken bir hata oluştu.", error);
    }
    setEditingTrademark(null);
    fetchTrademarks();
  };

  // Modal kapatma
  const closeEditModal = () => {
    setEditingTrademark(null);
  };

  useEffect(() => {
    fetchTrademarks();
  }, []);

  return (
    <div className="container">
      <h2 className="heading">Trademark Düzenle</h2>

      {message && <p className="message">{message}</p>}

      <h3>Trademark Listesi</h3>
      <ul className="trademark-list">
        {trademarks.map((trademark) => (
          <li key={trademark.ID} className="trademark-item">
            <span>{trademark.UrunAdi}</span>
            <button
              className="edit-button"
              onClick={() => setEditingTrademark({ ...trademark })}
            >
              Düzenle
            </button>
          </li>
        ))}
      </ul>

      {/* Düzenleme Modalı */}
      {editingTrademark && (
        <div className="modal">
          <div className="modal-content">
            <h3>Trademark'ı Düzenle</h3>
            <input
              type="text"
              value={editingTrademark.UrunAdi}
              onChange={(e) =>
                setEditingTrademark({
                  ...editingTrademark,
                  UrunAdi: e.target.value,
                })
              }
              className="input-field"
            />
            <div className="modal-actions">
              <button className="button" onClick={updateTrademark}>
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

export default EditTrademark;
