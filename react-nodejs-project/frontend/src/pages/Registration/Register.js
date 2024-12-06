import React, { useState,useEffect } from "react";
import AuthService from "../../services/auth.service";
import "./Register.css";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [gender, setGender] = useState("Male");
  const [errorMessage, setErrorMessage] = useState("");

  const validateTCKN = (tckn) => {
    if (!/^\d{11}$/.test(tckn)) return false; // 11 haneli ve rakamlardan oluşmalı
    if (tckn[0] === "0") return false; // İlk basamak sıfır olamaz

    const digits = tckn.split("").map(Number); // Basamakları diziye çevir
    const oddSum = digits[0] + digits[2] + digits[4] + digits[6] + digits[8];
    const evenSum = digits[1] + digits[3] + digits[5] + digits[7];

    const check10 = (7 * oddSum - evenSum) % 10;
    const check11 = (digits.slice(0, 10).reduce((a, b) => a + b, 0)) % 10;

    return check10 === digits[9] && check11 === digits[10];
  };

  const handleRegister = (e) => {
    e.preventDefault();

    if (!validateTCKN(nationalId)) {
      setErrorMessage("Geçersiz T.C. Kimlik Numarası.");
      return;
    }

    AuthService.register(firstName, lastName, email, password, phone, nationalId, gender)
      .then(() => {
        alert("Kayıt başarılı!");
        window.location.href = "/";
        window.location.reload();
      })
      .catch((error) => {
        const message = error.response?.data?.message || "Bir hata oluştu.";
        setErrorMessage(message);
      });
  };
  
  useEffect(() => {
    if (AuthService.getCurrentUser()) {
        window.location.href = "/profile";
    }
  }, []);

  return (
    <div className="register-container">
   {!AuthService.getCurrentUser() && (
  <div className="register-card">
    <h1 className="register-title">Hesap Oluşturun</h1>
    <p className="register-subtitle">Bize katılın ve alışverişe hemen başlayın!</p>

    {errorMessage && <p className="error-message">{errorMessage}</p>}

    <form onSubmit={handleRegister} className="register-form">
      {/* Ad */}
      <div className="form-group">
        <label>Ad</label>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="Ad"
          className="form-input"
        />
      </div>

      {/* Soyad */}
      <div className="form-group">
        <label>Soyad</label>
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Soyad"
          className="form-input"
        />
      </div>

      {/* E-posta */}
      <div className="form-group">
        <label>E-posta</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-posta"
          className="form-input"
        />
      </div>

      {/* Telefon Numarası */}
      <div className="form-group">
        <label>Telefon Numarası (5xx xxx xxxx)</label>
        <input
          type="text"
          value={phone}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, ''); // Only allow digits
            if (value.startsWith('5') && value.length <= 10) {
              setPhone(value);
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
          value={nationalId}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, ''); // Only allow digits
            if (value.length <= 11) {
              setNationalId(value);
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
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="form-input"
        >
          <option value="Male">Erkek</option>
          <option value="Female">Kadın</option>
          <option value="Other">Diğer</option>
        </select>
      </div>

      {/* Kayıt Ol Butonu */}
      <button type="submit" className="register-button">
        Kayıt Ol
      </button>
    </form>

    <div className="register-footer">
      <p>
        Zaten hesabınız var mı? <a href="/login" className="login-link">Giriş Yap</a>
      </p>
    </div>
  </div>
)}

    </div>
  );
};

export default Register;
