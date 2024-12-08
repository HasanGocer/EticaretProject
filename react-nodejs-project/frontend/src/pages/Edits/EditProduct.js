import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import './EditProduct.css'; // Özel stil dosyası

function EditProduct() {
  //#region fields
  const [categorys, setCategorys] = useState([]);
  const [subcategorys, setSubcategorys] = useState([]);
  const [trademarks, setTrademarks] = useState([]);
  const [variants, setVariants] = useState([]);
  const [additionalFeatures, setAdditionalFeatures] = useState([]);
  const [productAdditionalFeatures, setProductAdditionalFeatures] = useState([]);
  const [productVariants, setProductVariants] = useState([]);
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");
  const [editingProduct, setEditingProduct] = useState(null); // Düzenlenen kategori
  const [editingTime, setEditingTime] = useState(false); // Düzenlenen kategori

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
const getAdditionalFeatureNames = (featureIds) => {
  const featureNames = productAdditionalFeatures
    .filter((feature) => feature.product_id === featureIds.id) // Filtreleme yapıyoruz
    .map((feature) => <li key={feature.id}>{feature.additional_feature}</li>); // JSX döndürüyoruz

  return featureNames.length > 0 ? featureNames : <li>Bilinmeyen Özellik</li>; // Eğer özellik bulunmazsa, bir varsayılan mesaj döner
};
const getSubcategoryName = (subcategoryId) => {
  const subcategory = subcategorys.find((subcat) => subcat.id === subcategoryId);
  return subcategory ? subcategory.name : "Bilinmeyen Alt Kategori";
};
//#endregion
//#region  handles
const handleSubmit = async (e) => {
  e.preventDefault();

  const data = new FormData();
  data.append("name", editingProduct.name);
  data.append("price", editingProduct.price);
  data.append("stockCode", editingProduct.stockCode);
  data.append("stockQuantity", editingProduct.stockQuantity);
  data.append("discountRate", editingProduct.discountRate);
  data.append("description", editingProduct.description);
  data.append("category_id", editingProduct.category_id);
  data.append("subcategory_id", editingProduct.subcategory_id);
  data.append("trademark_id", editingProduct.trademark_id);
  data.append("variants_id", JSON.stringify(editingProduct.variants_id));
  data.append("additionalfeatures_id", JSON.stringify(editingProduct.additionalfeatures_id));
  data.append("image_data", editingProduct.image_data);

  try {
    const response = await axios.put(
      `http://localhost:5000/update-product/${editingProduct.id}`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    setEditingProduct(null);
    setEditingTime(false);
    setMessage(response.data.message);
    fetchProducts();
  } catch (error) {
    console.error("Ürün güncelleme hatası:", error);
    setMessage("Ürün güncellenirken bir hata oluştu.");
  }
};
  const handleCancelEdit = () => {
  setEditingProduct(null);
  };
  const HandleEditTime= (tempProduct)=>{
    setEditingProduct(tempProduct)
    setEditingTime(true);
  }
  const handleVariantsCheckboxChange = (e) => {
    const variantId = parseInt(e.target.value); // ID'yi tam sayıya çevir
    if (e.target.checked) {
      // Checkbox işaretlendiyse ID'yi ekle
      setEditingProduct((prev) => ({
        ...prev,
        variants_id: [...(prev.variants_id || []), variantId],
      }));
    } else {
      // Checkbox işareti kaldırıldıysa ID'yi çıkar
      setEditingProduct((prev) => ({
        ...prev,
        variants_id: prev.variants_id.filter((id) => id !== variantId),
      }));
    }
  };
  const handleAdditionalFeaturesCheckboxChange = (e) => {
    const additionalFeaturesId = parseInt(e.target.value); // ID'yi tam sayıya çevir
    if (e.target.checked) {
      // Checkbox işaretlendiyse ID'yi ekle
      setEditingProduct((prev) => ({
        ...prev,
        additionalfeatures_id: [...(prev.additionalfeatures_id || []), additionalFeaturesId],
      }));
    } else {
      // Checkbox işareti kaldırıldıysa ID'yi çıkar
      setEditingProduct((prev) => ({
        ...prev,
        additionalfeatures_id: prev.additionalfeatures_id.filter(
          (id) => id !== additionalFeaturesId
        ),
      }));
    }
  };
  //#endregion

  useEffect(() => {
    fetchDropdownData();
    fetchProducts();
    fetchDropdownSubCategoryData();
  }, []);
  useEffect(() => {
    if (editingTime && editingProduct) {
      const tempSelectedVariantIds = productVariants
        .filter((proVar) => proVar.product_id === editingProduct.id)
        .map((proVar) => variants.find((variant) => variant.UrunAdi === proVar.variant_name)?.ID)
        .filter((id) => id); // Geçerli ID'leri al
  
      const tempSelectedFeatureIds = productAdditionalFeatures
        .filter((proAdd) => proAdd.product_id === editingProduct.id)
        .map((proAdd) => additionalFeatures.find((feature) => feature.UrunAdi === proAdd.additional_feature)?.ID)
        .filter((id) => id); // Geçerli ID'leri al
  
      setEditingProduct((prev) => ({
        ...prev,
        variants_id: tempSelectedVariantIds,
        additionalfeatures_id: tempSelectedFeatureIds,
      }));
    }
  }, [editingTime]);

  return (
    <div className="container">
      <h2>{"Ürün Ekle"}</h2>
      <h3>Mevcut Ürünler</h3>
      <Link to="/admin">
        <button className="button">Ana Sayfaya Dön</button>
      </Link>
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
                  <button className="edit-button"
                  onClick={() => HandleEditTime({ ...product })}
                  >Düzenle</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        {editingProduct && (
        <div className="modal">
          <div className="modal-content">
            <h3>Ürün'lei Düzenle</h3>

            <div>
              <input
                type="text"
                value={editingProduct.name}
                onChange={(e) => setEditingProduct({  ...editingProduct, name: e.target.value })}
                className="input-field"
              />
            </div>

            <div>
              <input
                type="number"
                value={editingProduct.price}
                onChange={(e) => setEditingProduct({  ...editingProduct, price: e.target.value })}
                className="input-field"
              />
            </div>

            <div>
              <input
                type="text"
                value={editingProduct.stockCode}
                onChange={(e) => setEditingProduct({  ...editingProduct, stockCode: e.target.value })}
                className="input-field"
              />
            </div>

            <div>
              <input
                type="number"
                value={editingProduct.stockQuantity}
                onChange={(e) => setEditingProduct({  ...editingProduct, stockQuantity: e.target.value })}
                className="input-field"
              />
            </div>

            <div>
              <input
                type="number"
                min="0"
                max="100"
                value={editingProduct.discountRate}
                onChange={(e) => setEditingProduct({  ...editingProduct, discountRate: Math.min(Math.max(Number(e.target.value), 0), 100), })}
                className="input-field"
              />
            </div>

            <div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setEditingProduct({  ...editingProduct, image_data: e.target.files[0] })}
                className="input-field"
              />
            </div>

            <div>
              <label>Kategori:</label>
              <select
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    category_id: e.target.value,
                  })
                }
                value={editingProduct.category_id}
              >
                {categorys.map((category) => (
                  <option key={category.ID} value={category.ID}>
                    {category.UrunAdi}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <select
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    subcategory_id: e.target.value,
                  })
                }
                value={editingProduct.subcategory_id}
              >
                <option value="">Alt Kategori Seçin</option>
                {subcategorys
                  .filter((subcategory) => subcategory.category_id === editingProduct.category_id)
                  .map((subcategory) => (
                    <option key={subcategory.id} value={subcategory.id}>
                      {subcategory.name}
                    </option>
                  ))}
              </select>
            </div>


            <div>
              <label>Marka:</label>
              <select
                onChange={(e) => setEditingProduct({  ...editingProduct, trademark_id: e.target.value })}
                value={editingProduct.trademark_id}
              >
                {trademarks.map((trademark) => (
                  <option key={trademark.ID} value={trademark.ID}>
                    {trademark.UrunAdi}
                  </option>
                ))}
              </select>
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
                      checked={editingProduct?.variants_id?.includes(variant.ID)}
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
                      checked={editingProduct?.additionalfeatures_id?.includes(feature.ID)}
                    />
                    {feature.UrunAdi}
                  </label>
                ))}
              </div>
            </div>

            <div>
                <input
                  type="text"
                  value={editingProduct.description}
                onChange={(e) => setEditingProduct({  ...editingProduct, description: e.target.value })}
                  className="input-field"
                />
              </div>

            <div className="modal-actions">
              <button className="button" onClick={handleSubmit}>
                Kaydet
              </button>
              <button className="button cancel-button" onClick={handleCancelEdit}>
                İptal
              </button>
            </div>
          </div>
        </div>)}
      </div>
    </div>
  );
}
export default EditProduct;