import React, { useState, useEffect } from "react";
import axios from "axios";
import './AddProduct.css'; // Özel stil dosyası

function AddProduct() {
  //#region fields
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stockCode, setStockCode] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [discountRate, setDiscountRate] = useState("");
  const [description, setDescription] = useState("");
  const [image_data, setImageFile] = useState(null); // Resim dosyası
  const [categorys, setCategorys] = useState([]);
  const [subcategorys, setSubcategorys] = useState([]);
  const [trademarks, setTrademarks] = useState([]);
  const [variants, setVariants] = useState([]);
  const [additionalFeatures, setAdditionalFeatures] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [selectedTrademark, setSelectedTrademark] = useState("");
  const [selectedVariants, setSelectedVariants] = useState([]);
  const [selectedAdditionalFeatures, setSelectedAdditionalFeatures] = useState([]);
  const [productAdditionalFeatures, setProductAdditionalFeatures] = useState([]);
  const [productVariants, setProductVariants] = useState([]);
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({}); // Hata mesajları

  //#endregion
  //#region fetchs
  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/get-products");
      setProducts(response.data);
      const response1 = await axios.get("http://localhost:5000/get-product-variants");
      setProductVariants(response1.data);
      const response2 = await axios.get("http://localhost:5000/get-product-additionalfeatures");
      setProductAdditionalFeatures(response2.data);
    } catch (error) {
      console.error("Ürünleri alırken bir hata oluştu.", error);
    }
  };
  const fetchDropdownData = async () => {
    try {
      const categoryRes = await axios.get("http://localhost:5000/get-categorys");
      setCategorys(categoryRes.data);
      const subcategoryRes = await axios.get("http://localhost:5000/get-subcategorys");
      setSubcategorys(subcategoryRes.data);
      const trademarkRes = await axios.get("http://localhost:5000/get-trademarks");
      setTrademarks(trademarkRes.data);
      const additionalFeatureRes = await axios.get("http://localhost:5000/get-additionalfeatures");
      setAdditionalFeatures(additionalFeatureRes.data);
      const variantRes = await axios.get("http://localhost:5000/get-variants");
      setVariants(variantRes.data);
    } catch (error) {
      console.error("Dropdown verilerini alırken hata oluştu.", error);
    }
  };
  const fetchDropdownSubCategoryData = async () => {
    try {
      const subcategoryRes = await axios.get("http://localhost:5000/get-subcategorys");
      setSubcategorys(subcategoryRes.data);
    } catch (error) {
      console.error("Dropdown verilerini alırken hata oluştu.", error);
    }
  };
  //#endregion
//#region tables comps
const calculateDiscountedPrice = (price, discountRate) => {
  return price - (price * discountRate) / 100;
};
const getCategoryName = (categoryId) => {
  const category = categorys.find((cat) => cat.ID === categoryId);
  return category ? category.UrunAdi : "Bilinmeyen Kategori";
};
const getTrademarkName = (trademarkId) => {
  const trademark = trademarks.find((trademark) => trademark.ID === trademarkId);
  return trademark ? trademark.UrunAdi : "Bilinmeyen Marka";
};
const getVariantNames = (variantIds) => {
  const variantNames = productVariants
    .filter((variant) => variant.product_id === variantIds.id) // Filtreleme yapıyoruz
    .map((variant) => <li key={variant.id}>{variant.variant_name}</li>); // JSX döndürüyoruz

  return variantNames.length > 0 ? variantNames : <li>Bilinmeyen Varyant</li>; // Eğer variant bulunmazsa, bir varsayılan mesaj döner
};
const getSubcategoryName = (subcategoryId) => {
  console.log(subcategorys);
  const subcategory = subcategorys.find((subcat) => subcat.id === subcategoryId);
  return subcategory ? subcategory.name : "Bilinmeyen Alt Kategori";
};
const getAdditionalFeatureNames = (featureIds) => {
  const featureNames = productAdditionalFeatures
    .filter((feature) => feature.product_id === featureIds.id) // Filtreleme yapıyoruz
    .map((feature) => <li key={feature.id}>{feature.additional_feature}</li>); // JSX döndürüyoruz

  return featureNames.length > 0 ? featureNames : <li>Bilinmeyen Özellik</li>; // Eğer özellik bulunmazsa, bir varsayılan mesaj döner
};


//#endregion

//#region  handles
const handleSubmit = async (e) => {
  e.preventDefault();

  let formErrors = {};
  if (!name) formErrors.name = "Ürün adı gereklidir.";
  if (!price) formErrors.price = "Fiyat gereklidir.";
  if (!stockCode) formErrors.stockCode = "Stok kodu gereklidir.";
  if (!stockQuantity) formErrors.stockQuantity = "Stok miktarı gereklidir.";
  if (discountRate < 0 || discountRate > 100)
    formErrors.discountRate = "İndirim oranı 0 ile 100 arasında olmalıdır.";
  if (!description) formErrors.description = "Açıklama gereklidir.";
  if (!selectedCategory) formErrors.selectedCategory = "Kategori seçilmelidir.";
  if (!selectedSubcategory) formErrors.selectedSubcategory = "Alt kategori seçilmelidir.";
  if (!selectedTrademark) formErrors.selectedTrademark = "Marka seçilmelidir.";
  if (!image_data) formErrors.image_data = "Resim eklenmelidir.";
  if (image_data && !image_data.type.startsWith("image/")) {
    formErrors.image_data = "Yalnızca resim dosyaları kabul edilir.";
  }

  if (Object.keys(formErrors).length > 0) {
    setErrors(formErrors);
    return;
  }

  try {
    const formData = new FormData();
    formData.append("image_data", image_data);
    formData.append("name", name);
    formData.append("price", price);
    formData.append("stockCode", stockCode);
    formData.append("stockQuantity", stockQuantity);
    formData.append("discountRate", discountRate);
    formData.append("description", description);
    formData.append("category_id", selectedCategory);
    formData.append("trademark_id", selectedTrademark);
    formData.append("subcategory_id", selectedSubcategory);
    formData.append("variants_id", JSON.stringify(selectedVariants));
    formData.append("additionalfeatures_id", JSON.stringify(selectedAdditionalFeatures));

    // Debug Log
    console.log("Sending Data:", {
      name,
      price,
      stockCode,
      stockQuantity,
      discountRate,
      description,
      selectedCategory,
      selectedTrademark,
      selectedSubcategory,
      selectedVariants,
      selectedAdditionalFeatures,
    });

    const endpoint = "http://localhost:5000/add-product";

    const response = await axios.post(endpoint, formData);
    console.log("Response:", response);

    if (response.status === 200) {
      clearForm();
      fetchProducts();
    } else {
      throw new Error("Beklenmeyen bir hata oluştu");
    }
  } catch (error) {
    console.error("Ürün ekleme/güncelleme hatası:", error.response || error);
    setMessage("Ürün eklenirken bir hata oluştu.");
  }
};


const handleVariantsCheckboxChange = (e) => {
  const variantId = e.target.value; // Artık sadece ID'yi alıyor
  if (e.target.checked) {
    // Checkbox işaretlendiyse id'yi ekle
    setSelectedVariants((prevSelectedVariants) => [
      ...prevSelectedVariants,
      variantId,
    ]);
  } else {
    // Checkbox işaretinden kaldırıldıysa id'yi çıkar
    setSelectedVariants((prevSelectedVariants) =>
      prevSelectedVariants.filter((id) => id !== variantId)
    );
  }
};

const handleAdditionalFeaturesCheckboxChange = (e) => {
  const additionalFeaturesId = e.target.value; // Artık sadece ID'yi alıyor
  if (e.target.checked) {
    // Checkbox işaretlendiyse id'yi ekle
    setSelectedAdditionalFeatures((prevSelectedAdditionalFeatures) => [
      ...prevSelectedAdditionalFeatures,
      additionalFeaturesId,
    ]);
  } else {
    // Checkbox işaretinden kaldırıldıysa id'yi çıkar
    setSelectedAdditionalFeatures((prevSelectedAdditionalFeatures) =>
      prevSelectedAdditionalFeatures.filter((id) => id !== additionalFeaturesId)
    );
  }
};
const handleCategoryChange = (e) => {
  setSelectedCategory(e.target.value);
  setSelectedSubcategory(""); // Seçilen kategori değiştiğinde alt kategori sıfırlanır
};

const handleSubcategoryChange = (e) => {
  setSelectedSubcategory(e.target.value);
};

  const handleDelete = async (productId) => {
    try {
      await axios.delete(`http://localhost:5000/delete-product/${productId}`);
      setMessage("Ürün başarıyla silindi.");
      fetchProducts();
    } catch (error) {
      console.error("Ürün silme hatası:", error);
      setMessage("Ürün silinirken bir hata oluştu.");
    }
  };

  //#endregion

  useEffect(() => {
    fetchDropdownData();
    fetchDropdownSubCategoryData();
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchAndFilterSubcategories = async () => {
      try {
        const response = await axios.get("http://localhost:5000/get-subcategorys");
        const allSubcategories = response.data;
  
        console.log("Tüm alt kategoriler: ", allSubcategories);
        console.log("Seçilen kategori ID: ", selectedCategory);
  
        // `selectedCategory` ve `subcategory.category_id` aynı tipte olduğundan emin olun
        const filteredSubcategories = allSubcategories.filter(
          (subcategory) => String(subcategory.category_id) === String(selectedCategory)
        );
  
        console.log("Filtrelenmiş alt kategoriler: ", filteredSubcategories);
  
        setSubcategorys(filteredSubcategories);
      } catch (error) {
        console.error("Alt kategorileri çekme işlemi sırasında bir hata oluştu", error);
      }
    };
  
    if (selectedCategory) {
      fetchAndFilterSubcategories();
    }
  }, [selectedCategory]);
  

  const clearForm = () => {
    setName("");
    setPrice("");
    setStockCode("");
    setStockQuantity("");
    setDiscountRate("");
    setDescription("");
    setImageFile(null);
    setSelectedCategory("");
    setSelectedTrademark("");
    setSelectedVariants([]);
    setSelectedAdditionalFeatures([]);
    setErrors({});
  };


  return (
    <div className="container">
      <h2>{"Ürün Ekle"}</h2>
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <label>Ürün Adı:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
          {errors.name && <span className="error">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label>Fiyat:</label>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
          {errors.price && <span className="error">{errors.price}</span>}
        </div>

        <div className="form-group">
          <label>Stok Kodu:</label>
          <input type="text" value={stockCode} onChange={(e) => setStockCode(e.target.value)} />
          {errors.stockCode && <span className="error">{errors.stockCode}</span>}
        </div>

        <div className="form-group">
          <label>Stok Miktarı:</label>
          <input type="number" value={stockQuantity} onChange={(e) => setStockQuantity(e.target.value)} />
          {errors.stockQuantity && <span className="error">{errors.stockQuantity}</span>}
        </div>

        <div className="form-group">
          <label>İndirim Oranı (0-100):</label>
          <input type="number" min="0" max="100" value={discountRate} onChange={(e) => setDiscountRate(e.target.value)} />
          {errors.discountRate && <span className="error">{errors.discountRate}</span>}
        </div>

        <div className="form-right">
          <div className="form-group">
            <label>Resim</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
            />
            {errors.image_data && <div className="error">{errors.image_data}</div>}
          </div>
        </div>

        <div className="form-group">
          <label>Kategori:</label>
          <select
            onChange={handleCategoryChange}
            value={selectedCategory}
          >
            <option value="">Kategori Seçin</option>
            {categorys.map((category) => (
              <option key={category.ID} value={category.ID}>
                {category.UrunAdi}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Alt Kategori:</label>
          <select
            onChange={handleSubcategoryChange}
            value={selectedSubcategory}
            disabled={!selectedCategory} // Eğer kategori seçilmezse alt kategori devre dışı
          >
            <option value="">Alt Kategori Seçin</option>
            {subcategorys.map((subcategory) => (
              <option key={subcategory.id} value={subcategory.id}>
                {subcategory.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Marka:</label>
          <select onChange={(e) => setSelectedTrademark(e.target.value)} value={selectedTrademark}>
            <option value="trademarkVal">Marka Seçin</option>
            {trademarks.map((trademark) => (
              <option key={trademark.ID} value={trademark.ID}>
                {trademark.UrunAdi}
              </option>
            ))}
          </select>
          {errors.selectedTrademark && <span className="error">{errors.selectedTrademark}</span>}
        </div>

        <div className="form-group">
          <label>Varyantlar:</label>
          <div className="checkbox-group">
            {variants.map((variant) => (
              <label key={variant.ID}>
                <input
                  type="checkbox"
                  value={variant.ID} // Doğrudan ID kullanılıyor
                  onChange={handleVariantsCheckboxChange}
                />
                {variant.UrunAdi}
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Ekstra Özellikler:</label>
          <div className="checkbox-group">
            {additionalFeatures.map((feature) => (
              <label key={feature.ID}>
                <input
                  type="checkbox"
                  value={feature.ID} // Doğrudan ID kullanılıyor
                  onChange={handleAdditionalFeaturesCheckboxChange}
                />
                {feature.UrunAdi}
              </label>
            ))}
          </div>
        </div>
        
        <div className="form-full">
          <label className="centered-label">Açıklama:</label>
          <textarea 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
          />
          {errors.description && <span className="error">{errors.description}</span>}
        </div>


        <button type="submit" className="btn-submit">
          {"Ürünü Ekle"}
        </button>

        {message && <p className="message">{message}</p>}
      </form>
      <h3>Mevcut Ürünler</h3>
  <div className="table-wrapper">
  <table>
  <thead>
    <tr>
      <th>Ürün Adı</th>
      <th>Fiyat</th>
      <th>Stok Kodu</th>
      <th>Stok Miktarı</th>
      <th>İndirim Oranı</th>
      <th>İndirimli Fiyat</th>
      <th>Açıklama</th>
      <th>Kategori</th>
      <th>Alt Kategori</th> {/* Yeni sütun */}
      <th>Marka</th>
      <th>Varyantlar</th>
      <th>Ekstra Özellikler</th>
      <th>Resim</th>
      <th>İşlemler</th>
    </tr>
  </thead>
  <tbody>
    {products.map((product) => (
      <tr key={product.id}>
        <td>{product.name}</td>
        <td>{product.price}₺</td>
        <td>{product.stockCode}</td>
        <td>{product.stockQuantity}</td>
        <td>{product.discountRate}%</td>
        <td>{calculateDiscountedPrice(product.price, product.discountRate)}₺</td>
        <td>{product.description}</td>
        <td>{getCategoryName(product.category_id)}</td>
        <td>{getSubcategoryName(product.subcategory_id)}</td> {/* Yeni hücre */}
        <td>{getTrademarkName(product.trademark_id)}</td>
        <td>{getVariantNames(product)}</td>
        <td>{getAdditionalFeatureNames(product)}</td>
        <td>
          <img src={product.image_data} alt={product.name} />
        </td>
        <td>
          <button onClick={() => handleDelete(product.id)} className="btn-delete">
            Sil
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>

  </div>
    </div>
  );
}
export default AddProduct;