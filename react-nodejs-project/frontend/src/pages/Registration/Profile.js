import React, { useState, useEffect } from "react";
import AuthService from "../../Api's/auth.service";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    nationalId: "",
    gender: "Male", // Varsayılan değer
    id: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (!AuthService.getCurrentUser()) {
      navigate("/login"); // Profil sayfasına yönlendir
    }
    const currentUser = AuthService.getCurrentUser();
    if (currentUser) {
      setUser({
        firstName: currentUser.user.firstName || "",
        lastName: currentUser.user.lastName || "",
        email: currentUser.user.email || "",
        phone: currentUser.user.phone || "",
        nationalId: currentUser.user.nationalId || "",
        gender: currentUser.user.gender || "Male",
        id: currentUser.user.id || "",
      });
    } else {
      setErrorMessage("Kullanıcı bilgilerine ulaşılamıyor.");
    }
  }, []);

  // TC Kimlik Numarası doğrulama fonksiyonu
  const isValidTCKN = (tckn) => {
    if (tckn.length !== 11 || isNaN(tckn)) {
      return false;
    }
    if (tckn[0] === "0") {
      return false;
    }
    const digits = tckn.split("").map(Number);
    const sum1 = digits.slice(0, 10).reduce((acc, digit, index) => {
      if (index % 2 === 0) {
        return acc + digit;
      }
      return acc;
    }, 0);
    const sum2 = digits.slice(1, 10).reduce((acc, digit, index) => {
      if (index % 2 === 0) {
        return acc + digit;
      }
      return acc;
    }, 0);
    const tenthDigit = (sum1 * 7 - sum2) % 10;
    const eleventhDigit = (sum1 + sum2 + tenthDigit) % 10;
    if (digits[9] !== tenthDigit || digits[10] !== eleventhDigit) {
      return false;
    }
    return true;
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!isValidTCKN(user.nationalId)) {
      setErrorMessage("Geçersiz TC Kimlik Numarası!");
      return;
    }

    AuthService.updateProfile(user)
      .then(() => {
        setSuccessMessage("Profil başarıyla güncellendi!");
        window.location.reload();
      })
      .catch((error) => {
        const message =
          error.message || "Güncelleme sırasında bir hata oluştu.";
        setErrorMessage(message);
      });
  };

  return (
    <div className="profile-container">
      {AuthService.getCurrentUser() && (
        <div className="profile-card">
          <h1 className="profile-title">Profilinizi Düzenleyin</h1>

          {errorMessage && <p className="error-message">{errorMessage}</p>}
          {successMessage && (
            <p className="success-message">{successMessage}</p>
          )}

          <form onSubmit={handleUpdate} className="profile-form">
            {/* Ad */}
            <div className="form-group">
              <label>Ad</label>
              <input
                type="text"
                value={user.firstName}
                onChange={(e) =>
                  setUser({ ...user, firstName: e.target.value })
                }
                placeholder="Ad"
                className="form-input"
              />
            </div>

            {/* Soyad */}
            <div className="form-group">
              <label>Soyad</label>
              <input
                type="text"
                value={user.lastName}
                onChange={(e) => setUser({ ...user, lastName: e.target.value })}
                placeholder="Soyad"
                className="form-input"
              />
            </div>

            {/* E-posta */}
            <div className="form-group">
              <label>E-posta</label>
              <input
                type="email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                placeholder="E-posta"
                className="form-input"
                readOnly
              />
            </div>

            {/* Telefon Numarası */}
            <div className="form-group">
              <label>Telefon Numarası (5xx xxx xxxx)</label>
              <input
                type="text"
                value={user.phone}
                onChange={(e) => {
                  // Sadece sayılar alınmalı ve 5 ile başlamalı
                  const value = e.target.value.replace(/\D/g, ""); // sadece rakamları al
                  if (value.startsWith("5") && value.length <= 10) {
                    setUser({ ...user, phone: value });
                  }
                }}
                placeholder="Telefon Numarası"
                className="form-input"
                maxLength={10}
              />
            </div>

            {/* TC Kimlik Numarası */}
            <div className="form-group">
              <label>TC Kimlik Numarası</label>
              <input
                type="text"
                value={user.nationalId}
                onChange={(e) => {
                  // Sadece sayılar alınmalı ve 5 ile başlamalı
                  const value = e.target.value.replace(/\D/g, ""); // sadece rakamları al
                  if (value.length <= 11) {
                    setUser({ ...user, nationalId: value });
                  }
                }}
                placeholder="TC Kimlik Numarası"
                className="form-input"
                maxLength={11}
              />
            </div>

            {/* Cinsiyet */}
            <div className="form-group">
              <label>Cinsiyet</label>
              <select
                value={user.gender}
                onChange={(e) => setUser({ ...user, gender: e.target.value })}
                className="form-input"
              >
                <option value="Male">Erkek</option>
                <option value="Female">Kadın</option>
                <option value="Other">Diğer</option>
              </select>
            </div>

            {/* Güncelleme Butonu */}
            <button type="submit" className="update-profile-button">
              Güncelle
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Profile;
