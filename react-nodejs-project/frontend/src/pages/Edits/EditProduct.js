import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  Table,
  TableHead,
  TableRow,
  FormGroup,
  FormControlLabel,
  FormControl,
  Checkbox,
  Select,
  TableCell,
  MenuItem,
  TableBody,
  TableContainer,
  Paper,
  Alert,
  InputLabel,
} from "@mui/material";
import {
  getVariants,
  getTrademarks,
  getSubcategories,
  getCategories,
  getAdditionalFeatures,
  GetAllProducts,
  getProductVariant,
  getProductVariantDetails,
  updateProduct,
  getProductAdditionalFeature,
  getProductAdditionalFeatureDetails,
} from "../../Apis/api";
import {
  calculateDiscountedPrice,
  getCategoryName,
  getTrademarkName,
  getAdditionalFeatureNames,
  getSubcategoryName,
} from "../../components/ProductComps";

function EditProduct() {
  //#region fields
  const [categorys, setCategorys] = useState([]);
  const [subcategorys, setSubcategorys] = useState([]);
  const [trademarks, setTrademarks] = useState([]);
  const [variants, setVariants] = useState([]);
  const [additionalFeatures, setAdditionalFeatures] = useState([]);
  const [selectedVariants, setSelectedVariants] = useState([]);
  const [selectedAdditionalFeatures, setSelectedAdditionalFeatures] = useState(
    []
  );
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");
  const [editingProduct, setEditingProduct] = useState(null); // Düzenlenen kategori
  const [editingTime, setEditingTime] = useState(false); // Düzenlenen kategori

  //#endregion
  //#region fetchs
  const fetchProducts = async () => {
    try {
      const productsData = await GetAllProducts();
      setProducts(productsData);
    } catch (error) {
      console.error("Ürünleri alırken bir hata oluştu.", error);
    }
  };
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
  const fetchDropdownEditData = async (editingProduct) => {
    try {
      const subcategoryData = await getSubcategories(
        editingProduct.category_id
      );
      setSubcategorys(subcategoryData);
      const variantDetailsData = await getProductVariantDetails(
        editingProduct.id
      );
      setSelectedVariants(variantDetailsData);
      const additionalFeatureDetailsData =
        await getProductAdditionalFeatureDetails(editingProduct.id);
      setSelectedAdditionalFeatures(additionalFeatureDetailsData);

      const additionalFeatureData = await getProductAdditionalFeature(
        editingProduct.id
      );
      const variantData = await getProductVariant(editingProduct.id);

      setEditingProduct((prev) => ({
        ...prev,
        variants_id: variantData,
        additionalfeatures_id: additionalFeatureData,
      }));
    } catch (error) {
      console.error("Dropdown verilerini alırken hata oluştu.", error);
    }
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
    data.append(
      "additionalfeatures_id",
      JSON.stringify(editingProduct.additionalfeatures_id)
    );
    data.append("image_data", editingProduct.image_data);
    data.append("variant_details", JSON.stringify(selectedVariants));
    data.append(
      "additionalfeature_details",
      JSON.stringify(selectedAdditionalFeatures)
    );

    try {
      const responseData = await updateProduct(editingProduct.id, data);

      setEditingProduct(null);
      setEditingTime(false);
      setMessage(responseData.message);
      fetchProducts(); // Güncellenmiş ürün listesini yeniden al
    } catch (error) {
      console.error("Ürün güncelleme hatası:", error);
      setMessage("Ürün güncellenirken bir hata oluştu.");
    }
  };
  const handleCancelEdit = () => {
    setEditingProduct(null);
  };
  const HandleEditTime = (tempProduct) => {
    setEditingProduct(tempProduct);

    setEditingTime(true);
  };
  const handleVariantsCheckboxChange = (e, variantID) => {
    const { checked } = e.target;

    setEditingProduct((prev) => ({
      ...prev,
      variants_id: checked
        ? [...(prev.variants_id || []), variantID]
        : (prev.variants_id || []).filter((id) => id !== variantID),
    }));

    if (checked) {
      addVariantDetail(variantID); // Seçili bir varyant detayını otomatik ekle
    } else {
      removeVariantDetail(variantID); // Varyant kaldırıldığında detayları da sil
    }
  };
  const handleVariantDetailChange = (variantID, newDetail) => {
    setSelectedVariants((prevDetails) =>
      prevDetails.map((detail) =>
        detail.variant_id === variantID
          ? { ...detail, detail_name: newDetail }
          : detail
      )
    );
  };
  const handleVariantImageChange = (variantID, file) => {
    setSelectedVariants((prevDetails) =>
      prevDetails.map((detail) =>
        detail.variant_id === variantID
          ? { ...detail, image_data: URL.createObjectURL(file) }
          : detail
      )
    );
  };
  const addVariantDetail = (variantID) => {
    setSelectedVariants((prevDetails) => [
      ...prevDetails,
      { variant_id: variantID, detail_name: "", image_data: null },
    ]);
  };
  const removeVariantDetail = (variantID) => {
    setSelectedVariants((prevDetails) =>
      prevDetails.filter((detail) => detail.variant_id !== variantID)
    );
  };

  const handleAdditionalFeaturesCheckboxChange = (e, featureID) => {
    const { checked } = e.target;

    // 'editingProduct' ve 'selectedAdditionalFeatures' güncellemesi
    setEditingProduct((prev) => ({
      ...prev,
      additionalfeatures_id: checked
        ? [...prev.additionalfeatures_id, featureID]
        : prev.additionalfeatures_id.filter((id) => id !== featureID),
    }));

    setSelectedAdditionalFeatures((prev) => {
      if (checked) {
        // Yeni özellik ekleniyor
        return [
          ...prev,
          { additionalfeature_id: featureID, details: "" }, // Boş detayla ekle
        ];
      } else {
        // Özellik kaldırılıyor
        return prev.filter(
          (feature) => feature.additionalfeature_id !== featureID
        );
      }
    });
  };
  const handleAdditionalFeatureDetailsChange = (featureID, field, value) => {
    setSelectedAdditionalFeatures((prevDetails) =>
      prevDetails.map((detail) =>
        detail.additionalfeature_id === featureID
          ? { ...detail, [field]: value }
          : detail
      )
    );
  };
  const getFeatureDetailValue = (featureID) => {
    const featureDetail = selectedAdditionalFeatures.find(
      (detail) => detail.additionalfeature_id === featureID
    );
    return featureDetail ? featureDetail.details : "";
  };

  //#endregion

  useEffect(() => {
    fetchDropdownData();
    fetchProducts();
  }, []);
  useEffect(() => {
    if (editingTime && editingProduct) {
      fetchDropdownEditData(editingProduct);
    }
  }, [editingTime]);

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
      <Typography variant="h3" gutterBottom>
        Mevcut Ürünler
      </Typography>

      {message && (
        <Alert severity="info" sx={{ marginBottom: "20px" }}>
          {message}
        </Alert>
      )}

      <Box className="table-wrapper">
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
                    {getCategoryName(categorys, product.category_id)}
                  </TableCell>
                  <TableCell>
                    {getSubcategoryName(subcategorys, product.subcategory_id)}
                  </TableCell>
                  <TableCell>
                    {getTrademarkName(trademarks, product.trademark_id)}
                  </TableCell>
                  <TableCell>
                    {getVariantNames(selectedVariants, variants, product)}
                  </TableCell>
                  <TableCell>
                    {getAdditionalFeatureNames(
                      selectedAdditionalFeatures,
                      additionalFeatures,
                      product
                    )}
                  </TableCell>
                  <TableCell>
                    <img
                      src={product.image_data}
                      alt={product.name}
                      width="100"
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      className="edit-button"
                      variant="contained"
                      color="primary"
                      onClick={() => HandleEditTime({ ...product })}
                    >
                      Düzenle
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {editingProduct && (
        <Box className="modal" display="flex" justifyContent="center">
          <Box
            className="modal-content"
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            minWidth="70%"
            maxWidth="70%"
            margin="0 auto"
            overflow="auto" // This ensures scrolling if the content overflows
            maxHeight="80vh" // You can adjust the max height as needed
          >
            {/* Sol Panel */}
            <Box flex={1} display="flex" flexDirection="column" gap={2}>
              <TextField
                label="Ürün Adı"
                variant="outlined"
                value={editingProduct.name}
                onChange={(e) =>
                  setEditingProduct({ ...editingProduct, name: e.target.value })
                }
                fullWidth
                className="input-field"
              />

              <TextField
                label="Fiyat"
                variant="outlined"
                value={editingProduct.price}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    price: e.target.value,
                  })
                }
                fullWidth
                type="number"
                className="input-field"
              />

              <TextField
                label="Stok Kodu"
                variant="outlined"
                value={editingProduct.stockCode}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    stockCode: e.target.value,
                  })
                }
                fullWidth
                className="input-field"
              />

              <TextField
                label="Stok Miktarı"
                variant="outlined"
                value={editingProduct.stockQuantity}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    stockQuantity: e.target.value,
                  })
                }
                fullWidth
                type="number"
                className="input-field"
              />

              <TextField
                label="İndirim Oranı"
                variant="outlined"
                value={editingProduct.discountRate}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    discountRate: Math.min(
                      Math.max(Number(e.target.value), 0),
                      100
                    ),
                  })
                }
                fullWidth
                type="number"
                inputProps={{ min: 0, max: 100 }}
                className="input-field"
              />

              <Box>
                <InputLabel>Ürün Resmi</InputLabel>

                {/* Mevcut resmin önizlemesi */}
                {editingProduct.image_data ? (
                  <Box mb={2}>
                    <img
                      src={editingProduct.image_data}
                      alt="Ürün Resmi"
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "8px",
                        objectFit: "cover",
                      }}
                    />
                  </Box>
                ) : (
                  <Box mb={2}>
                    {/* Eğer mevcut bir resim yoksa, kullanıcıya bir metin gösterebilirsiniz */}
                    <Typography variant="body2" color="textSecondary">
                      Henüz bir resim eklenmedi.
                    </Typography>
                  </Box>
                )}

                {/* Resim seçme inputu */}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      image_data: e.target.files[0], // Seçilen resmi state'e kaydediyoruz
                    })
                  }
                  className="input-field"
                />
              </Box>

              <TextField
                label="Açıklama"
                variant="outlined"
                value={editingProduct.description}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    description: e.target.value,
                  })
                }
                fullWidth
                multiline
                rows={4}
                className="input-field"
              />
            </Box>

            {/* Sağ Panel */}
            <Box flex={1} display="flex" flexDirection="column" gap={2}>
              <FormControl fullWidth>
                <InputLabel>Kategori</InputLabel>
                <Select
                  value={editingProduct.category_id}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      category_id: e.target.value,
                    })
                  }
                  className="select-field"
                >
                  {categorys.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Alt Kategori</InputLabel>
                <Select
                  value={editingProduct.subcategory_id}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      subcategory_id: e.target.value,
                    })
                  }
                  className="select-field"
                >
                  <MenuItem value="">Alt Kategori Seçin</MenuItem>
                  {subcategorys.map((subcategory) => (
                    <MenuItem key={subcategory.id} value={subcategory.id}>
                      {subcategory.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Marka</InputLabel>
                <Select
                  value={editingProduct.trademark_id}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      trademark_id: e.target.value,
                    })
                  }
                  className="select-field"
                >
                  {trademarks.map((trademark) => (
                    <MenuItem key={trademark.id} value={trademark.id}>
                      {trademark.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormGroup>
                <Typography variant="subtitle1">Varyantlar:</Typography>
                {variants.map((variant) => (
                  <div key={variant.id}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          value={variant.id}
                          onChange={(e) =>
                            handleVariantsCheckboxChange(e, variant.id)
                          }
                          checked={
                            editingProduct?.variants_id?.includes(variant.id) ||
                            false
                          }
                        />
                      }
                      label={variant.name}
                    />
                    {editingProduct?.variants_id?.includes(variant.id) && (
                      <>
                        {selectedVariants
                          .filter((vars) => vars.variant_id === variant.id)
                          .map((vars, index) => (
                            <div key={index}>
                              {/* Varyant Ek Özelliği TextField */}
                              <TextField
                                label="Varyant Ek Özelliği"
                                variant="outlined"
                                value={vars.detail_name || ""}
                                onChange={(e) =>
                                  handleVariantDetailChange(
                                    variant.id,
                                    e.target.value
                                  )
                                }
                                fullWidth
                                className="input-field"
                              />

                              {/* Resim Ekleme ve Önizleme */}
                              <Box mt={2}>
                                <InputLabel>Varyant Resmi</InputLabel>
                                {vars.image_data ? (
                                  <Box mb={2}>
                                    <img
                                      src={vars.image_data}
                                      alt="Varyant Resmi"
                                      style={{
                                        width: "50px",
                                        height: "50px",
                                        borderRadius: "8px",
                                        objectFit: "cover",
                                      }}
                                    />
                                  </Box>
                                ) : (
                                  <Box mb={2}>
                                    <Typography
                                      variant="body2"
                                      color="textSecondary"
                                    >
                                      Henüz bir resim eklenmedi.
                                    </Typography>
                                  </Box>
                                )}
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) =>
                                    handleVariantImageChange(
                                      variant.id,
                                      e.target.files[0]
                                    )
                                  }
                                  className="input-field"
                                />
                              </Box>

                              {/* Remove Button */}
                              <Button
                                variant="outlined"
                                color="secondary"
                                onClick={() =>
                                  removeVariantDetail(variant.id, index)
                                }
                                style={{ marginTop: "10px" }}
                              >
                                Varyant Detayını Sil
                              </Button>
                            </div>
                          ))}

                        {/* Add New Variant Detail Button */}
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => addVariantDetail(variant.id)}
                          style={{ marginTop: "20px" }}
                        >
                          Yeni Varyant Detayı Ekle
                        </Button>
                      </>
                    )}
                  </div>
                ))}
              </FormGroup>

              <FormGroup>
                <Typography variant="subtitle1">Ekstra Özellikler:</Typography>
                {additionalFeatures.map((feature) => (
                  <div key={feature.id}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          value={feature.id}
                          onChange={(e) =>
                            handleAdditionalFeaturesCheckboxChange(
                              e,
                              feature.id
                            )
                          }
                          checked={
                            editingProduct?.additionalfeatures_id?.includes(
                              feature.id
                            ) || false
                          }
                        />
                      }
                      label={feature.name}
                    />
                    {editingProduct?.additionalfeatures_id?.includes(
                      feature.id
                    ) && (
                      <TextField
                        label="Ekstra Özellik Detayı"
                        variant="outlined"
                        value={getFeatureDetailValue(feature.id)} // Detayı almak için yeni fonksiyon
                        onChange={(e) =>
                          handleAdditionalFeatureDetailsChange(
                            feature.id,
                            "details",
                            e.target.value
                          )
                        }
                        fullWidth
                        className="input-field"
                      />
                    )}
                  </div>
                ))}
              </FormGroup>

              <Box
                className="modal-actions"
                display="flex"
                justifyContent="flex-end"
                gap={2}
                mt={2}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                >
                  Kaydet
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleCancelEdit}
                >
                  İptal
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}
export default EditProduct;
