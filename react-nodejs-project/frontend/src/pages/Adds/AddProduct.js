import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Grid,
  Alert,
  List,
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
  const [allSubcategories, setAllSubcategories] = useState([]);
  const [trademarks, setTrademarks] = useState([]);
  const [variants, setVariants] = useState([]);
  const [variantsDetails, setVariantsDetails] = useState([]);
  const [additionalFeatures, setAdditionalFeatures] = useState([]);
  const [additionalFeatureDetails, setAdditionalFeatureDetails] = useState({});
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
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({}); // Hata mesajları

  //#endregion
  //#region fetchs
  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/get-products");
      setProducts(response.data);
      const response3 = await axios.get(
        "http://localhost:5000/get-product-variant-details"
      );
      setVariantsDetails(response3.data);
      const response4 = await axios.get(
        "http://localhost:5000/get-product-additionalfeatures-details"
      );
      setAdditionalFeatureDetails(response4.data);
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
      setAllSubcategories(subcategoryRes.data); // Tüm alt kategorileri kaydet
      setSubcategorys([]); // Başlangıçta alt kategori listesi boş olmalı

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
  const getSubcategoryName = (subcategoryId) => {
    const subcategory = allSubcategories.find(
      (subcat) => subcat.id === subcategoryId
    );
    return subcategory ? subcategory.name : "Bilinmeyen Alt Kategori";
  };
  //#endregion
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
      for (let pair of formData.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }
      const endpoint = "http://localhost:5000/add-product";
      const response = await axios.post(endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200) {
        clearForm();
        fetchProducts();
      } else {
        throw new Error("Beklenmeyen bir hata oluştu.");
      }
    } catch (error) {
      console.error("Ürün ekleme/güncelleme hatası:", error.response || error);
      setErrors({ general: "Ürün eklenirken bir hata oluştu." });
    }
  };

  const handleVariantsCheckboxChange = (e) => {
    const variantId = Number(e.target.value);
    if (variantId && e.target.checked) {
      setSelectedVariants((prevSelectedVariants) => {
        console.log("Eklenen variantId: ", variantId);
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
        console.log("Eklenen ekstra özellik ID: ", additionalFeaturesId);
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
    const selectedCategoryID = e.target.value;
    setSelectedCategory(selectedCategoryID);
    setSelectedSubcategory(""); // Alt kategoriyi sıfırla

    // Seçilen kategoriye göre alt kategorileri filtrele
    if (selectedCategoryID) {
      const filteredSubcategories = allSubcategories.filter(
        (subcategory) => subcategory.categoryID === selectedCategoryID
      );
      setSubcategorys(filteredSubcategories);
    } else {
      setSubcategorys([]); // Kategori seçilmezse alt kategoriyi temizle
    }
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
                <div key={variant.ID}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        value={variant.ID}
                        onChange={(e) =>
                          handleVariantsCheckboxChange(e, variant.ID)
                        }
                      />
                    }
                    label={variant.UrunAdi}
                  />
                  {selectedVariants.includes(Number(variant.ID)) && (
                    <div style={{ marginLeft: "20px", marginTop: "10px" }}>
                      <Typography variant="subtitle1">
                        {variant.UrunAdi} İçin Detaylar:
                      </Typography>
                      {Array.isArray(selectedvariantDetails[variant.ID]) &&
                        selectedvariantDetails[variant.ID].map(
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
                                    variant.ID,
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
                                    variant.ID,
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
                                  removeVariantDetail(variant.ID, index)
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
                        onClick={() => addVariantDetail(variant.ID)}
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
                <div key={feature.ID}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        value={feature.ID}
                        onChange={(e) =>
                          handleAdditionalFeaturesCheckboxChange(e, feature.ID)
                        }
                      />
                    }
                    label={feature.UrunAdi}
                  />
                  {/* Özellik seçiliyse detay giriş alanını göster */}
                  {selectedAdditionalFeatures.includes(Number(feature.ID)) && (
                    <div style={{ marginLeft: "20px", marginTop: "10px" }}>
                      <Typography variant="subtitle1">
                        {feature.UrunAdi} İçin Detay:
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
                            feature.ID,
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
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <h3>Ürün Listesi</h3>
        </AccordionSummary>
        <AccordionDetails>
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
                    <TableCell>
                      {getCategoryName(product.category_id)}
                    </TableCell>
                    <TableCell>
                      {getSubcategoryName(product.subcategory_id)}
                    </TableCell>
                    <TableCell>
                      {getTrademarkName(product.trademark_id)}
                    </TableCell>
                    <TableCell>
                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography>Varyantlar</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <div>
                            {/* Variants grouped by variant_name */}
                            {Object.entries(
                              variantsDetails.reduce((acc, variant) => {
                                if (variant.product_id === product.id) {
                                  acc[variant.variant_name] =
                                    acc[variant.variant_name] || [];
                                  acc[variant.variant_name].push(variant);
                                }
                                return acc;
                              }, {})
                            ).map(([variantName, variants]) => (
                              <div key={variantName}>
                                <h3>Varyant Adı: {variantName}</h3>
                                {variants.map((variant) => (
                                  <div key={variant.id}>
                                    <p>
                                      Varyant Özellikleri: {variant.detail_name}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            ))}
                          </div>
                        </AccordionDetails>
                      </Accordion>
                    </TableCell>
                    <TableCell>
                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography>Ekstra Özellikler</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <div>
                            {/* Display additional features details */}
                            {Array.isArray(additionalFeatureDetails) &&
                              additionalFeatureDetails
                                .filter(
                                  (feature) => feature.product_id === product.id
                                )
                                .map((feature) => (
                                  <div key={feature.id}>
                                    <p>
                                      Ek Özellik:
                                      {feature.additional_feature_name}
                                    </p>
                                    <p>Detaylar: {feature.details}</p>
                                  </div>
                                ))}
                          </div>
                        </AccordionDetails>
                      </Accordion>
                    </TableCell>
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
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}
export default AddProduct;
