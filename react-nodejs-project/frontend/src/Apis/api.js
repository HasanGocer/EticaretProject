import axios from "axios";

const API_URL = "https://shop.evpakademi.com/api"; // API'nin temel URL'si

//#region product
export const GetAllProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/product/get`);
    return response.data;
  } catch (error) {
    console.error("Ürünler alınamadı:", error);
    return null; // Hata durumunda null döndürüyoruz
  }
};
export const addProduct = async (productData) => {
  try {
    const response = await axios.post(`${API_URL}/product/add`, productData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || "Ürün eklenirken/güncellenirken bir hata oluştu."
    );
  }
};
export const updateProduct = async (id, productData) => {
  try {
    const response = await axios.put(
      `${API_URL}/product/update/${id}`,
      productData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || "Ürün güncellenirken bir hata oluştu.";
  }
};
export const deleteProduct = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/product/delete/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Ürün silinirken bir hata oluştu.";
  }
};
//#endregion
//#region product_variant
export const getProductVariant = async (product_id) => {
  try {
    const response = await axios.get(
      `${API_URL}/product_variant/get${product_id}`
    );
    return response.data;
  } catch (error) {
    throw (
      error.response?.data ||
      "Ürün varyant detaylarını alırken bir hata oluştu."
    );
  }
};
//#endregion
//#region product_variant_details
export const getProductVariantDetails = async (product_additionalfeatures) => {
  try {
    const response = await axios.get(
      `${API_URL}/product_variant_details/get${product_additionalfeatures}`
    );
    return response.data;
  } catch (error) {
    throw (
      error.response?.data ||
      "Ürün varyant detaylarını alırken bir hata oluştu."
    );
  }
};
//#endregion
//#region product_additionalfeature
export const getProductAdditionalFeature = async (product_id) => {
  try {
    const response = await axios.get(
      `${API_URL}/product_additionalfeatures_details/get${product_id}`
    );
    return response.data;
  } catch (error) {
    throw (
      error.response?.data ||
      "Ürün ek özellik detaylarını alırken bir hata oluştu."
    );
  }
};
//#endregion
//#region product_additionalfeature_details
export const getProductAdditionalFeatureDetails = async (product_variants) => {
  try {
    const response = await axios.get(
      `${API_URL}/product_additionalfeatures_details/get${product_variants}`
    );
    return response.data;
  } catch (error) {
    throw (
      error.response?.data ||
      "Ürün ek özellik detaylarını alırken bir hata oluştu."
    );
  }
};
//#endregion
//#region additionalFeature
export const getAdditionalFeatures = async () => {
  try {
    const response = await axios.get(`${API_URL}/additionalFeature/get`);
    return response.data; // API'den dönen veriyi direkt döndürüyoruz
  } catch (error) {
    throw error.response?.data || "Bir hata oluştu";
  }
};
export const addAdditionalFeature = async (name) => {
  try {
    const response = await axios.post(`${API_URL}/additionalFeature/add`, {
      name,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || "Bir hata oluştu";
  }
};
export const updateAdditionalFeature = async (id, name) => {
  try {
    const response = await axios.put(
      `${API_URL}/additionalFeature/update/${id}`,
      name
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || "Ek özellik güncellenirken bir hata oluştu.";
  }
};
export const deleteAdditionalFeature = async (id) => {
  try {
    const response = await axios.delete(
      `${API_URL}/additionalFeature/delete/${id}`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || "Silme işlemi başarısız";
  }
};
//#endregion
//#region category
export const getCategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/category/get`);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Kategoriler alınırken bir hata oluştu";
  }
};
export const addCategory = async (name) => {
  try {
    const response = await axios.post(`${API_URL}/category/add`, { name });
    return response.data;
  } catch (error) {
    throw error.response?.data || "Kategori eklenirken hata oluştu";
  }
};
export const updateCategoryHG = async (id, name) => {
  try {
    const response = await axios.put(`${API_URL}/category/update/${id}`, name);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Kategori güncellenirken bir hata oluştu.";
  }
};
export const deleteCategory = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/category/delete/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Kategori silinirken hata oluştu";
  }
};
//#endregion
//#region subcategory
export const getSubcategories = async (category_id) => {
  try {
    const response = await axios.get(
      `${API_URL}/subcategory/get/${category_id}`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || "Alt Kategoriler çekilirken hata oluştu";
  }
};
export const addSubcategory = async (category_id, name) => {
  try {
    const response = await axios.post(`${API_URL}/subcategory/add`, {
      category_id,
      name,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || "Alt kategori eklenirken bir hata oluştu";
  }
};
export const updateSubcategoryHG = async (id, name) => {
  try {
    const response = await axios.put(`${API_URL}/subcategory/update/${id}`, {
      name,
    });
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || "Alt kategori güncellenirken bir hata oluştu."
    );
  }
};
export const deleteSubcategory = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/subcategory/delete/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Alt kategori silinirken hata oluştu";
  }
};
//#endregion
//#region trademark
export const getTrademarks = async () => {
  try {
    const response = await axios.get(`${API_URL}/trademark/get`);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Trademarkları alırken bir hata oluştu.";
  }
};
export const addTrademarkHG = async (trademark, image) => {
  try {
    const formData = new FormData();
    formData.append("trademark", trademark);
    formData.append("image", image);

    const response = await axios.post(`${API_URL}/trademark/add`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || "Trademark eklenirken bir hata oluştu.";
  }
};
export const updateTrademarkHG = async (id, name, imageFile = null) => {
  try {
    let formData = new FormData();
    formData.append("name", name);

    if (imageFile) {
      formData.append("image", imageFile);
    }

    const response = await axios.put(
      `${API_URL}/trademark/update/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error.response?.data || "Marka güncellenirken bir hata oluştu.";
  }
};
export const deleteTrademark = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/trademark/delete/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Trademark silinirken bir hata oluştu.";
  }
};
//#endregion
//#region variant
export const getVariants = async () => {
  try {
    const response = await axios.get(`${API_URL}/variant/get`);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Varyantları alırken bir hata oluştu.";
  }
};
export const addVariant = async (variant) => {
  try {
    const response = await axios.post(`${API_URL}/variant/add`, {
      variant,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || "Varyant eklenirken bir hata oluştu.";
  }
};
export const updateVariantHG = async (id, name) => {
  try {
    const response = await axios.put(`${API_URL}/variant/update/${id}`, name);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Varyant güncellenirken bir hata oluştu.";
  }
};
export const deleteVariant = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/variant/delete/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Varyant silinirken bir hata oluştu.";
  }
};
//#endregion
