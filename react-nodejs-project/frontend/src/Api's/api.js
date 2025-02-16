import axios from "axios";

const API_URL = "https://shop.evpakademi.com/api"; // API'nin temel URL'si

export const GetAllProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/product/get`);
    return response.data;
  } catch (error) {
    console.error("Ürünler alınamadı:", error);
    return null; // Hata durumunda null döndürüyoruz
  }
};
