import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Button,
  Typography,
  TextField,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  TextareaAutosize,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import "./AddProduct.css"; // Özel stil dosyası

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
  const [selectedAdditionalFeatures, setSelectedAdditionalFeatures] = useState(
    []
  );
  const [productAdditionalFeatures, setProductAdditionalFeatures] = useState(
    []
  );
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
      const response1 = await axios.get(
        "http://localhost:5000/get-product-variants"
      );
      setProductVariants(response1.data);
      const response2 = await axios.get(
        "http://localhost:5000/get-product-additionalfeatures"
      );
      setProductAdditionalFeatures(response2.data);
    } catch (error) {
      console.error("Ürünleri alırken bir hata oluştu.", error);
    }
  };
  const fetchDropdownData = async () => {
    try {
      const categoryRes = await axios.get(
        "http://localhost:5000/get-categorys"
      );
      setCategorys(categoryRes.data);
      const subcategoryRes = await axios.get(
        "http://localhost:5000/get-subcategorys"
      );
      setSubcategorys(subcategoryRes.data);
      const trademarkRes = await axios.get(
        "http://localhost:5000/get-trademarks"
      );
      setTrademarks(trademarkRes.data);
      const additionalFeatureRes = await axios.get(
        "http://localhost:5000/get-additionalfeatures"
      );
      setAdditionalFeatures(additionalFeatureRes.data);
      const variantRes = await axios.get("http://localhost:5000/get-variants");
      setVariants(variantRes.data);
    } catch (error) {
      console.error("Dropdown verilerini alırken hata oluştu.", error);
    }
  };
  const fetchDropdownSubCategoryData = async () => {
    try {
      const subcategoryRes = await axios.get(
        "http://localhost:5000/get-subcategorys"
      );
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
    const trademark = trademarks.find(
      (trademark) => trademark.ID === trademarkId
    );
    return trademark ? trademark.UrunAdi : "Bilinmeyen Marka";
  };
  const getVariantNames = (variantIds) => {
    const variantNames = productVariants
      .filter((variant) => variant.product_id === variantIds.id) // Filtreleme yapıyoruz
      .map((variant) => <li key={variant.id}>{variant.variant_name}</li>); // JSX döndürüyoruz

    return variantNames.length > 0 ? variantNames : <li>Bilinmeyen Varyant</li>; // Eğer variant bulunmazsa, bir varsayılan mesaj döner
  };
  const getSubcategoryName = (subcategoryId) => {
    const subcategory = subcategorys.find(
      (subcat) => subcat.id === subcategoryId
    );
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
    if (!selectedCategory)
      formErrors.selectedCategory = "Kategori seçilmelidir.";
    if (!selectedSubcategory)
      formErrors.selectedSubcategory = "Alt kategori seçilmelidir.";
    if (!selectedTrademark)
      formErrors.selectedTrademark = "Marka seçilmelidir.";
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
      formData.append(
        "additionalfeatures_id",
        JSON.stringify(selectedAdditionalFeatures)
      );

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
        prevSelectedAdditionalFeatures.filter(
          (id) => id !== additionalFeaturesId
        )
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
      console.log("Silinen ürünün id'si:", productId);
      await axios.delete(`http://localhost:5000/delete-product/${productId}`);
      console.log("Silme işlemi başarılı");
      setMessage("Ürün başarıyla silindi.");
      fetchProducts();
    } catch (error) {
      console.error(
        "Ürün silme hatası:",
        error.response?.data || error.message
      );
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
        const response = await axios.get(
          "http://localhost:5000/get-subcategorys"
        );
        const allSubcategories = response.data;

        console.log("Tüm alt kategoriler: ", allSubcategories);
        console.log("Seçilen kategori ID: ", selectedCategory);

        // `selectedCategory` ve `subcategory.category_id` aynı tipte olduğundan emin olun
        const filteredSubcategories = allSubcategories.filter(
          (subcategory) =>
            String(subcategory.category_id) === String(selectedCategory)
        );

        console.log("Filtrelenmiş alt kategoriler: ", filteredSubcategories);

        setSubcategorys(filteredSubcategories);
      } catch (error) {
        console.error(
          "Alt kategorileri çekme işlemi sırasında bir hata oluştu",
          error
        );
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
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Ürün Ekle
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Ürün Adı"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={!!errors.name}
              helperText={errors.name}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Fiyat"
              type="number"
              fullWidth
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              error={!!errors.price}
              helperText={errors.price}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Stok Kodu"
              fullWidth
              value={stockCode}
              onChange={(e) => setStockCode(e.target.value)}
              error={!!errors.stockCode}
              helperText={errors.stockCode}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Stok Miktarı"
              type="number"
              fullWidth
              value={stockQuantity}
              onChange={(e) => setStockQuantity(e.target.value)}
              error={!!errors.stockQuantity}
              helperText={errors.stockQuantity}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="İndirim Oranı (0-100)"
              type="number"
              inputProps={{ min: 0, max: 100 }}
              fullWidth
              value={discountRate}
              onChange={(e) => setDiscountRate(e.target.value)}
              error={!!errors.discountRate}
              helperText={errors.discountRate}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Kategori</InputLabel>
              <Select value={selectedCategory} onChange={handleCategoryChange}>
                <MenuItem value="">Kategori Seçin</MenuItem>
                {categorys.map((category) => (
                  <MenuItem key={category.ID} value={category.ID}>
                    {category.UrunAdi}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth disabled={!selectedCategory}>
              <InputLabel>Alt Kategori</InputLabel>
              <Select
                value={selectedSubcategory}
                onChange={handleSubcategoryChange}
              >
                <MenuItem value="">Alt Kategori Seçin</MenuItem>
                {subcategorys.map((subcategory) => (
                  <MenuItem key={subcategory.id} value={subcategory.id}>
                    {subcategory.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Marka</InputLabel>
              <Select
                value={selectedTrademark}
                onChange={(e) => setSelectedTrademark(e.target.value)}
              >
                <MenuItem value="trademarkVal">Marka Seçin</MenuItem>
                {trademarks.map((trademark) => (
                  <MenuItem key={trademark.ID} value={trademark.ID}>
                    {trademark.UrunAdi}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <Typography variant="h6">Resim Yükle:</Typography>
              <Button
                variant="contained"
                component="label"
                sx={{ marginTop: 2 }}
              >
                Resim Seç
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => setImageFile(e.target.files[0])}
                />
              </Button>
              {errors.image_data && (
                <Typography color="error">{errors.image_data}</Typography>
              )}
            </FormControl>
          </Grid>
          {image_data && (
            <Grid item xs={12}>
              <Typography variant="h6">Seçilen Resim Önizlemesi:</Typography>
              <Box
                sx={{
                  marginTop: 2,
                  width: "100%", // Ekranın genişliğine uyum sağlamak için
                  height: 400, // Önizleme için yüksek bir kutu
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  overflow: "hidden",
                }}
              >
                <img
                  src={URL.createObjectURL(image_data)} // Seçilen dosyanın URL'sini oluştur
                  alt="Seçilen Resim"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                  }}
                />
              </Box>
            </Grid>
          )}

          <Grid item xs={12}>
            <Typography variant="h6">Varyantlar:</Typography>
            <List>
              {variants.map((variant) => (
                <FormControlLabel
                  key={variant.ID}
                  control={
                    <Checkbox
                      value={variant.ID}
                      onChange={handleVariantsCheckboxChange}
                    />
                  }
                  label={variant.UrunAdi}
                />
              ))}
            </List>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Ekstra Özellikler:</Typography>
            <List>
              {additionalFeatures.map((feature) => (
                <FormControlLabel
                  key={feature.ID}
                  control={
                    <Checkbox
                      value={feature.ID}
                      onChange={handleAdditionalFeaturesCheckboxChange}
                    />
                  }
                  label={feature.UrunAdi}
                />
              ))}
            </List>
          </Grid>
          <Grid item xs={12}>
            <TextareaAutosize
              minRows={4}
              placeholder="Açıklama"
              style={{ width: "100%" }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" fullWidth>
              Ürünü Ekle
            </Button>
          </Grid>
        </Grid>
      </form>
      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Mevcut Ürünler
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ürün Adı</TableCell>
              <TableCell>Fiyat</TableCell>
              <TableCell>Stok Kodu</TableCell>
              <TableCell>Stok Miktarı</TableCell>
              <TableCell>İndirim Oranı</TableCell>
              <TableCell>İndirimli Fiyat</TableCell>
              <TableCell>Açıklama</TableCell>
              <TableCell>Kategori</TableCell>
              <TableCell>Alt Kategori</TableCell>
              <TableCell>Marka</TableCell>
              <TableCell>Varyantlar</TableCell>
              <TableCell>Ekstra Özellikler</TableCell>
              <TableCell>Resim</TableCell>
              <TableCell>İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.price}₺</TableCell>
                <TableCell>{product.stockCode}</TableCell>
                <TableCell>{product.stockQuantity}</TableCell>
                <TableCell>{product.discountRate}%</TableCell>
                <TableCell>
                  {calculateDiscountedPrice(
                    product.price,
                    product.discountRate
                  )}
                  ₺
                </TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell>{getCategoryName(product.category_id)}</TableCell>
                <TableCell>
                  {getSubcategoryName(product.subcategory_id)}
                </TableCell>
                <TableCell>{getTrademarkName(product.trademark_id)}</TableCell>
                <TableCell>{getVariantNames(product)}</TableCell>
                <TableCell>{getAdditionalFeatureNames(product)}</TableCell>
                <TableCell>
                  <img
                    src={product.image_data}
                    alt={product.name}
                    style={{ width: 50 }}
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleDelete(product.id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
export default AddProduct;
