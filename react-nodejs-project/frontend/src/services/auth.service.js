import axios from "axios";

const API_URL = "https://shop.evpakademi.com/api/auth/"; // API'nin temel URL'si

const updateProfile = (userData) => {
  const userId = userData.id;
  const currentUser = JSON.parse(localStorage.getItem("user"));
  if (userData.firstName) currentUser.firstName = userData.firstName;
  if (userData.lastName) currentUser.lastName = userData.lastName;
  if (userData.email) currentUser.email = userData.email;
  if (userData.phone) currentUser.phone = userData.phone;
  if (userData.nationalId) currentUser.nationalId = userData.nationalId;
  if (userData.gender) currentUser.gender = userData.gender;
  if (userData.password) currentUser.password = userData.password;
  const token = currentUser?.token;

  if (!token) {
    console.error("Token mevcut değil!");
    return;
  }

  console.log("Gönderilen kullanıcı verisi:", currentUser); // Kullanıcı verilerini kontrol et

  return axios
    .put(`${API_URL}update/${userId}`, userData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      console.log("Güncelleme yanıtı:", response.data);
      SetLocalUser(userData);
      return response.data;
    })
    .catch((error) => {
      console.error(
        "Güncelleme hatası:",
        error.response?.data || error.message
      );
    });
};
const register = async (
  firstName,
  lastName,
  email,
  password,
  phone,
  nationalId,
  gender
) => {
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
    throw new Error(
      error.response?.data?.message || "Kayıt işlemi sırasında bir hata oluştu."
    );
  }
};
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
const logout = () => {
  localStorage.removeItem("user"); // LocalStorage'dan kullanıcı bilgisini sil
};
const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};
const SetLocalUser = (tempuser) => {
  const user = JSON.parse(localStorage.getItem("user"));
  user.user.firstName = tempuser.firstName;
  user.user.lastName = tempuser.lastName;
  user.user.email = tempuser.email;
  user.user.phone = tempuser.phone;
  user.user.nationalId = tempuser.nationalId;
  user.user.gender = tempuser.gender;
  user.user.id = tempuser.id;
  localStorage.setItem("user", JSON.stringify(user));
};

export default {
  updateProfile,
  register,
  login,
  logout,
  getCurrentUser,
};
