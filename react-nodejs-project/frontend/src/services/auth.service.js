import axios from "axios";


const API_URL = "http://localhost:5000/api/auth/"; // API'nin temel URL'si

/**
 * Kullanıcı kaydı için API isteği
 * @param {string} firstName - Kullanıcı adı
 * @param {string} lastName - Soyadı
 * @param {string} email - Email adresi
 * @param {string} password - Şifre
 * @param {string} phone - GSM
 * @param {string} nationalId - TC kimlik numarası
 * @param {string} gender - Cinsiyet
 * @returns {Promise} - API yanıtını döner
 */

const updateProfile = (userData) => {
  const userId = userData.id;
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const token = currentUser?.token;

  if (!token) {
    console.error("Token mevcut değil!");
    return;
  }

  console.log("Gönderilen kullanıcı verisi:", userData); // Kullanıcı verilerini kontrol et

  return axios
    .put(`${API_URL}update/${userId}`, userData, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    })
    .then((response) => {
      console.log("Güncelleme yanıtı:", response.data);
      SetLocalUser(userData);
      return response.data;
    })
    .catch((error) => {
      console.error("Güncelleme hatası:", error.response?.data || error.message);
    });
};





const register = async (firstName, lastName, email, password, phone, nationalId, gender) => {
  try {
    const response = await axios.post(`${API_URL}register`, {
      firstName,
      lastName,
      email,
      password,
      phone,
      nationalId,
      gender,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Kayıt işlemi sırasında bir hata oluştu.");
  }
};

/**
 * Kullanıcı girişi için API isteği
 * @param {string} email - Email adresi
 * @param {string} password - Şifre
 * @returns {Promise} - Giriş işlemi sonucu kullanıcı bilgisi
 */
const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}login`, { email, password });
    if (response.data?.token) {
      localStorage.setItem("user", JSON.stringify(response.data));
    }
    return response.data;
  } catch (error) {
    console.error("Login error details:", error);
    throw new Error(error.response?.data?.message || "Login failed.");
  }
};

/**
 * Kullanıcı çıkışı
 * @returns {void}
 */
const logout = () => {
  localStorage.removeItem("user"); // LocalStorage'dan kullanıcı bilgisini sil
};

/**
 * Şu anki kullanıcıyı al
 * @returns {Object|null} - Kullanıcı bilgisi veya null
 */
const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};
const SetLocalUser=(tempuser)=>{
  const user = JSON.parse(localStorage.getItem("user")) ;
  console.log(tempuser);
  user.user.firstName= tempuser.firstName ;
  user.user.lastName= tempuser.lastName ;
  user.user.email= tempuser.email ;
  user.user.phone= tempuser.phone ;
  user.user.nationalId= tempuser.nationalId ;
  user.user.gender= tempuser.gender ;
  user.user.id= tempuser.id ;
  localStorage.setItem("user", JSON.stringify(user));
}



export default {
  updateProfile,
  register,
  login,
  logout,
  getCurrentUser,
};
