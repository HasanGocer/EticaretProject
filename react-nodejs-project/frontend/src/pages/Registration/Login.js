import React, { useState, useEffect } from "react";
import AuthService from "../../Apis/auth.service";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    AuthService.login(email, password)
      .then(() => {
        navigate("/"); // Başarılı girişte yönlendirme
        window.location.reload();
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  };
  useEffect(() => {
    if (AuthService.getCurrentUser()) {
      navigate("/profile"); // Profil sayfasına yönlendir
    }
  }, []);

  return (
    <div className="login-container">
      {!AuthService.getCurrentUser() && (
        <div className="login-card">
          <h1 className="login-title">Tekrar Hoş Geldiniz!</h1>
          <p className="login-subtitle">
            Devam etmek için hesabınıza giriş yapın.
          </p>
          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <input
                type="email"
                placeholder="E-posta Adresi"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                placeholder="Şifre"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
              />
            </div>
            <button type="submit" className="login-button">
              Giriş Yap
            </button>
          </form>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <div className="login-footer">
            <p>
              Hesabınız yok mu?{" "}
              <a href="/register" className="register-link">
                Kayıt Ol
              </a>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
