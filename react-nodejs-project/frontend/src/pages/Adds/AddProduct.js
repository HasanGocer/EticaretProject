import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  Grid,
  Alert,
  List,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  TextareaAutosize,
} from "@mui/material";
import {
  getVariants,
  getTrademarks,
  getSubcategories,
  getCategories,
  getAdditionalFeatures,
  addProduct,
} from "../../Apis/api";

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
  const [selectedvariantDetails, setSelectedVariantDetails] = useState({});
  const [
    selectedAdditionalFeatureDetails,
    setSelectedAdditionalFeatureDetails,
  ] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [selectedTrademark, setSelectedTrademark] = useState("");
  const [selectedVariants, setSelectedVariants] = useState([]);
  const [selectedAdditionalFeatures, setSelectedAdditionalFeatures] = useState(
    []
  );
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({}); // Hata mesajları

  //#endregion
  const fetchDropdownData = async () => {
    try {
      const categoryData = await getCategories();
      setCategorys(categoryData);

      const trademarkData = await getTrademarks();
      setTrademarks(trademarkData);

      const additionalFeatureData = await getAdditionalFeatures();
      setAdditionalFeatures(additionalFeatureData);

      const variantData = await getVariants();
      setVariants(variantData);
    } catch (error) {
      console.error("Dropdown verilerini alırken hata oluştu.", error);
    }
  };
  //#region  handles
  const handleSubmit = async (e) => {
    e.preventDefault();

    let formErrors = {};
    if (!name.trim()) formErrors.name = "Ürün adı gereklidir.";
    if (!price || isNaN(price) || price <= 0)
      formErrors.price = "Geçerli bir fiyat girin.";
    if (!stockCode.trim()) formErrors.stockCode = "Stok kodu gereklidir.";
    if (!stockQuantity || isNaN(stockQuantity) || stockQuantity < 0)
      formErrors.stockQuantity = "Geçerli bir stok miktarı girin.";
    if (discountRate < 0 || discountRate > 100)
      formErrors.discountRate = "İndirim oranı 0 ile 100 arasında olmalıdır.";
    if (!description.trim()) formErrors.description = "Açıklama gereklidir.";
    if (!selectedCategory)
      formErrors.selectedCategory = "Kategori seçilmelidir.";
    if (!selectedSubcategory)
      formErrors.selectedSubcategory = "Alt kategori seçilmelidir.";
    if (!selectedTrademark)
      formErrors.selectedTrademark = "Marka seçilmelidir.";
    if (!image_data) formErrors.image_data = "Resim eklenmelidir.";

    if (Object.keys(formErrors).length > 0) {
      setMessage(formErrors);
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
      formData.append("variantDetails", JSON.stringify(selectedvariantDetails));
      formData.append(
        "additionalFeatureDetails",
        JSON.stringify(selectedAdditionalFeatureDetails)
      );

      // API fonksiyonunu çağır
      const responseData = await addProduct(formData);

      clearForm();
      setMessage("ürün Başarıyla eklendi");
    } catch (error) {
      setMessage("ürün eklenemedi");
      console.error("Ürün ekleme/güncelleme hatası:", error);
      setErrors({ general: "Ürün eklenirken bir hata oluştu." });
    }
  };

  const handleVariantsCheckboxChange = (e) => {
    const variantId = Number(e.target.value);
    if (variantId && e.target.checked) {
      setSelectedVariants((prevSelectedVariants) => {
        return [...prevSelectedVariants, variantId];
      });
    } else if (variantId && !e.target.checked) {
      setSelectedVariants((prevSelectedVariants) =>
        prevSelectedVariants.filter((id) => id !== variantId)
      );
    }
  };
  const handleAdditionalFeaturesCheckboxChange = (e) => {
    const additionalFeaturesId = Number(e.target.value); // Tip dönüşümü
    if (e.target.checked) {
      setSelectedAdditionalFeatures((prevSelectedAdditionalFeatures) => {
        return [...prevSelectedAdditionalFeatures, additionalFeaturesId];
      });
    } else {
      setSelectedAdditionalFeatures((prevSelectedAdditionalFeatures) =>
        prevSelectedAdditionalFeatures.filter(
          (id) => id !== additionalFeaturesId
        )
      );

      // Ek özellik seçeneği kaldırıldığında, ilgili detayları da sil
      setSelectedAdditionalFeatureDetails((prev) => {
        const { [additionalFeaturesId]: removed, ...rest } = prev; // Seçilen özelliğin detaylarını sil
        return rest;
      });
    }
  };
  const handleVariantDetailsChange = (variantID, index, field, value) => {
    setSelectedVariantDetails((prev) => ({
      ...prev,
      [variantID]:
        prev[variantID]?.map((detail, i) =>
          i === index ? { ...detail, [field]: value } : detail
        ) || [],
    }));
  };
  const handleAdditionalFeatureDetailsChange = (featureID, field, value) => {
    setSelectedAdditionalFeatureDetails((prev) => ({
      ...prev,
      [featureID]: {
        ...prev[featureID],
        [field]: value,
      },
    }));
  };
  const removeVariantDetail = (variantID, detailIndex) => {
    setSelectedVariantDetails((prev) => {
      const updatedDetails = { ...prev };
      if (Array.isArray(updatedDetails[variantID])) {
        updatedDetails[variantID] = updatedDetails[variantID].filter(
          (_, index) => index !== detailIndex
        );
      }
      return updatedDetails;
    });
  };
  const addVariantDetail = (variantID) => {
    setSelectedVariantDetails((prev) => ({
      ...prev,
      [variantID]: prev[variantID]
        ? [...prev[variantID], { name: "", image_data: null }]
        : [{ name: "", image_data: null }],
    }));
  };

  const handleCategoryChange = (e) => {
    const fetchAndFilterSubcategories = async () => {
      try {
        const subcategoryData = await getSubcategories(selectedCategory);
        setSubcategorys(subcategoryData);
      } catch (error) {
        console.error(
          "Alt kategorileri çekme işlemi sırasında bir hata oluştu",
          error
        );
      }
    };

    const selectedCategoryID = e.target.value;
    setSelectedCategory(selectedCategory);
    setSelectedSubcategory(""); // Alt kategoriyi sıfırla

    if (selectedCategoryID) {
      fetchAndFilterSubcategories();
    } else {
      setSubcategorys([]); // Kategori seçilmezse alt kategoriyi temizle
    }
  };
  const handleSubcategoryChange = (e) => {
    setSelectedSubcategory(e.target.value);
  };

  //#endregion

  useEffect(() => {
    fetchDropdownData();
  }, []);

  useEffect(() => {
    const fetchAndFilterSubcategories = async () => {
      try {
        const subcategoryData = await getSubcategories(selectedCategory);
        setSubcategorys(subcategoryData);
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
    <Box
      sx={{
        maxWidth: "95%",
        margin: "40px auto",
        padding: "30px",
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Ürün Ekle
      </Typography>{" "}
      {message && (
        <Alert severity="info" sx={{ marginBottom: "20px" }}>
          {message}
        </Alert>
      )}
      <form onSubmit={handleSubmit}>
        <Grid
          item
          xs={12}
          sm={6}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <FormControl fullWidth sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="h6" align="center">
              Resim Yükle:
            </Typography>
            <Button variant="contained" component="label" sx={{ marginTop: 2 }}>
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
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" align="center">
              Seçilen Resim Önizlemesi:
            </Typography>
            <Box
              sx={{
                marginTop: 2,
                width: "100%",
                maxWidth: 400, // Maksimum genişlik sınırı ekledim
                height: 400,
                border: "1px solid #ccc",
                borderRadius: "8px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden",
              }}
            >
              <img
                src={URL.createObjectURL(image_data)}
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
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
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
                  <MenuItem key={trademark.id} value={trademark.id}>
                    {trademark.name}
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
            <Typography variant="h6">Varyantlar:</Typography>
            <List>
              {variants.map((variant) => (
                <div key={variant.id}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        value={variant.id}
                        onChange={(e) =>
                          handleVariantsCheckboxChange(e, variant.id)
                        }
                      />
                    }
                    label={variant.name}
                  />
                  {selectedVariants.includes(Number(variant.id)) && (
                    <div style={{ marginLeft: "20px", marginTop: "10px" }}>
                      <Typography variant="subtitle1">
                        {variant.name} İçin Detaylar:
                      </Typography>
                      {Array.isArray(selectedvariantDetails[variant.id]) &&
                        selectedvariantDetails[variant.id].map(
                          (detail, index) => (
                            <div
                              key={index}
                              style={{
                                marginTop: "10px",
                                display: "flex",
                                gap: "10px",
                                alignItems: "center",
                              }}
                            >
                              <TextField
                                label="Varyant Adı"
                                variant="outlined"
                                size="small"
                                value={detail.name}
                                onChange={(e) =>
                                  handleVariantDetailsChange(
                                    variant.id,
                                    index,
                                    "name",
                                    e.target.value
                                  )
                                }
                              />
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                  handleVariantDetailsChange(
                                    variant.id,
                                    index,
                                    "image_data",
                                    e.target.files[0]
                                  )
                                }
                                style={{ marginTop: "10px" }}
                              />
                              <Button
                                variant="contained"
                                color="secondary"
                                onClick={() =>
                                  removeVariantDetail(variant.id, index)
                                }
                              >
                                Sil
                              </Button>
                            </div>
                          )
                        )}

                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => addVariantDetail(variant.id)}
                        style={{ marginTop: "10px" }}
                      >
                        Alt Varyant Ekleyin
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </List>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Ekstra Özellikler:</Typography>
            <List>
              {additionalFeatures.map((feature) => (
                <div key={feature.id}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        value={feature.id}
                        onChange={(e) =>
                          handleAdditionalFeaturesCheckboxChange(e, feature.id)
                        }
                      />
                    }
                    label={feature.name}
                  />
                  {/* Özellik seçiliyse detay giriş alanını göster */}
                  {selectedAdditionalFeatures.includes(Number(feature.id)) && (
                    <div style={{ marginLeft: "20px", marginTop: "10px" }}>
                      <Typography variant="subtitle1">
                        {feature.name} İçin Detay:
                      </Typography>
                      <TextField
                        label="Detay"
                        variant="outlined"
                        size="small"
                        fullWidth
                        margin="normal"
                        required
                        onChange={(e) =>
                          handleAdditionalFeatureDetailsChange(
                            feature.id,
                            "details",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  )}
                </div>
              ))}
            </List>
          </Grid>

          <Grid item xs={12}>
            <Button type="submit" variant="contained" fullWidth>
              Ürünü Ekle
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
}
export default AddProduct;
