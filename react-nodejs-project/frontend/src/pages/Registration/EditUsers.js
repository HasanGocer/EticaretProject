import React, { useState, useEffect } from "react";
import AuthService from "../../services/auth.service";
import { Link } from "react-router-dom";
import "./EditUsers.css";

const EditUsers = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/auth/users", {
          headers: {
            Authorization: `Bearer ${AuthService.getCurrentUser()?.token}`,
          },
        });
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Kullanıcıları getirirken hata oluştu:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleEditClick = (user) => {
    setEditingUser(user);
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingUser({ ...editingUser, [name]: value });
  };

  const handleSaveClick = async () => {
    try {
      await AuthService.updateProfile(editingUser);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === editingUser.id ? { ...editingUser } : user
        )
      );
      setEditingUser(null);
      setMessage("Kullanıcı başarıyla güncellendi.");
    } catch (error) {
      console.error("Güncelleme hatası:", error);
      setMessage("Kullanıcı güncellenirken bir hata oluştu.");
    }
  };

  return (
    <div className="container">
              <h1>Kullanıcı Yönetimi</h1>
      <Link to="/admin">
        <button className="button">Ana Sayfaya Dön</button>
      </Link>
      <h2>Kullanıcılar</h2>
      {message && <div className="message">{message}</div>}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Ad</th>
              <th>Soyad</th>
              <th>Email</th>
              <th>Telefon</th>
              <th>TCKN</th>
              <th>Cinsiyet</th>
              <th>Oluşturulma</th>
              <th>Güncelleme</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.nationalId}</td>
                <td>{user.gender}</td>
                <td>{user.createdAt}</td>
                <td>{user.updatedAt}</td>
                <td>
                  <button onClick={() => handleEditClick(user)} className="edit-button">
                    Düzenle
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingUser && (
  <div className="modal">
    <div className="modal-content">
      <h3>Kullanıcıyı Düzenle</h3>
      <div>
        <label>Ad:</label>
        <input
          type="text"
          name="firstName"
          value={editingUser.firstName || ""}
          onChange={handleInputChange}
          placeholder="Ad"
        />
      </div>

      <div>
        <label>Soyad:</label>
        <input
          type="text"
          name="lastName"
          value={editingUser.lastName || ""}
          onChange={handleInputChange}
          placeholder="Soyad"
        />
      </div>

      <div>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={editingUser.email || ""}
          onChange={handleInputChange}
          placeholder="E-posta"
          readOnly
        />
      </div>

      <div>
        <label>Telefon:</label>
        <input
          type="text"
          name="phone"
          value={editingUser.phone || ""}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, ''); // Only allow digits
            if (value.startsWith('5') && value.length <= 10) {
              handleInputChange(e);  // Calls the handleInputChange for phone updates
            }
          }}
          placeholder="Telefon Numarası"
          maxLength={10}
        />
      </div>

      <div>
        <label>TCKN:</label>
        <input
          type="text"
          name="nationalId"
          value={editingUser.nationalId || ""}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, ''); // Only allow digits
            if (value.length <= 11) {
              handleInputChange(e);  // Calls the handleInputChange for nationalId updates
            }
          }}
          placeholder="T.C. Kimlik Numarası"
          maxLength={11}
        />
      </div>

      <div className="form-group">
        <label>Cinsiyet:</label>
        <select
          name="gender"
          value={editingUser.gender || ""}
          onChange={handleInputChange}
          className="form-input"
        >
          <option value="Male">Erkek</option>
          <option value="Female">Kadın</option>
          <option value="Other">Diğer</option>
        </select>
      </div>

      <div className="modal-actions">
        <button onClick={handleSaveClick} className="button">
          Kaydet
        </button>
        <button onClick={handleCancelEdit} className="button cancel-button">
          İptal
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default EditUsers;
