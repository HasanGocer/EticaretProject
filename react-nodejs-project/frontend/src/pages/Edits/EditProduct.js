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
import axios from "axios";

function EditProduct() {
  //#region fields
  const [categorys, setCategorys] = useState([]);
  const [subcategorys, setSubcategorys] = useState([]);
  const [trademarks, setTrademarks] = useState([]);
  const [variants, setVariants] = useState([]);
  const [additionalFeatures, setAdditionalFeatures] = useState([]);
  const [productAdditionalFeatureDetails, setProductAdditionalFeatureDetails] =
    useState([]);
  const [productVariantsDetails, setProductVariantsDetails] = useState([]);
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
      const response = await axios.get("http://localhost:5000/get-products");
      setProducts(response.data);
      const response3 = await axios.get(
        "http://localhost:5000/get-product-variant-details"
      );
      setProductVariantsDetails(response3.data);
      const response4 = await axios.get(
        "http://localhost:5000/get-product-additionalfeatures-details"
      );
      setProductAdditionalFeatureDetails(response4.data);
      console.log(response4.data);
      console.log(response.data);
      console.log(response3.data);
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
    const variantNames = productVariantsDetails
      .filter((variant) => variant.product_id === variantIds.id) // Filtreleme yapıyoruz
      .map((variant) => (
        <li key={variant.id}>
          {variant.variant_name} : {variant.detail_name}
          {variant.image_data ? (
            <img
              src={variant.image_data}
              alt="Varyant Resmi"
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "8px",
                objectFit: "cover",
              }}
            />
          ) : (
            <Typography variant="body2" color="textSecondary">
              Resim Eklenmemiş
            </Typography>
          )}
        </li>
      )); // JSX döndürüyoruz

    return variantNames.length > 0 ? variantNames : <li>Bilinmeyen Varyant</li>; // Eğer variant bulunmazsa, bir varsayılan mesaj döner
  };
  const getAdditionalFeatureNames = (featureIds) => {
    const featureNames = productAdditionalFeatureDetails
      .filter((feature) => feature.product_id === featureIds.id) // Filtreleme yapıyoruz
      .map((feature) => (
        <li key={feature.id}>
          {feature.additional_feature_name} : {feature.details}
        </li>
      )); // JSX döndürüyoruz

    return featureNames.length > 0 ? featureNames : <li>Bilinmeyen Özellik</li>; // Eğer özellik bulunmazsa, bir varsayılan mesaj döner
  };
  const getSubcategoryName = (subcategoryId) => {
    const subcategory = subcategorys.find(
      (subcat) => subcat.id === subcategoryId
    );
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
    data.append(
      "additionalfeatures_id",
      JSON.stringify(editingProduct.additionalfeatures_id)
    );
    data.append("image_data", editingProduct.image_data);

    // Add variant details if present
    if (editingProduct.variant_details) {
      data.append("variant_details", JSON.stringify(selectedVariants));
    }

    // Add additional feature details if present
    if (editingProduct.additionalfeature_details) {
      data.append(
        "additionalfeature_details",
        JSON.stringify(selectedAdditionalFeatures)
      );
    }

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
      fetchProducts(); // Re-fetch the product list to reflect the changes
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

    // Eğer checkbox işaretlendiyse, varyantı seçili hale getir.
    setEditingProduct((prev) => ({
      ...prev,
      variants_id: checked
        ? [...prev.variants_id, variantID] // Varyant ekle
        : prev.variants_id.filter((id) => id !== variantID), // Varyantı kaldır
    }));

    // Seçilen varyantları güncelle
    setSelectedVariants((prev) => {
      if (checked) {
        return [...prev, variantID];
      } else {
        return prev.filter((id) => id !== variantID);
      }
    });
  };
  const handleVariantDetailChange = (variantID, newDetail) => {
    setProductVariantsDetails((prevDetails) =>
      prevDetails.map((detail) =>
        detail.variant_id === variantID
          ? { ...detail, detail_name: newDetail }
          : detail
      )
    );
  };
  const handleVariantImageChange = (variantID, file) => {
    setProductVariantsDetails((prevDetails) =>
      prevDetails.map((detail) =>
        detail.variant_id === variantID
          ? { ...detail, image_data: URL.createObjectURL(file) } // Resmi base64 veya URL olarak kaydet
          : detail
      )
    );
  };
  const handleAdditionalFeaturesCheckboxChange = (e, featureID) => {
    const { checked } = e.target;

    setEditingProduct((prev) => ({
      ...prev,
      additionalfeatures_id: checked
        ? [...prev.additionalfeatures_id, featureID]
        : prev.additionalfeatures_id.filter((id) => id !== featureID),
    }));

    setSelectedAdditionalFeatures((prev) => {
      if (checked) {
        return [...prev, featureID];
      } else {
        return prev.filter((id) => id !== featureID);
      }
    });
  };
  const handleAdditionalFeatureDetailsChange = (featureID, field, value) => {
    setProductAdditionalFeatureDetails((prevDetails) =>
      prevDetails.map((detail) =>
        detail.additionalfeature_id === featureID
          ? { ...detail, [field]: value }
          : detail
      )
    );
  };

  const addVariantDetail = (variantID) => {
    setProductVariantsDetails((prevDetails) => [
      ...prevDetails,
      { variant_id: variantID, detail_name: "", image_data: null },
    ]);
  };
  const removeVariantDetail = (variantID, index) => {
    setProductVariantsDetails((prevDetails) =>
      prevDetails.filter((_, i) => i !== index || _.variant_id !== variantID)
    );
  };

  //#endregion

  useEffect(() => {
    fetchDropdownData();
    fetchProducts();
    fetchDropdownSubCategoryData();
  }, []);
  useEffect(() => {
    if (editingTime && editingProduct) {
      console.log("ek öz detay: ", productAdditionalFeatureDetails);
      const tempSelectedVariantIds = productVariantsDetails
        .filter((proVar) => proVar.product_id === editingProduct.id)
        .map(
          (proVar) =>
            variants.find((variant) => variant.UrunAdi === proVar.variant_name)
              ?.ID
        )
        .filter((id) => id);

      const tempSelectedFeatureIds = productAdditionalFeatureDetails
        .filter((proAdd) => proAdd.product_id === editingProduct.id)
        .map(
          (proAdd) =>
            additionalFeatures.find(
              (feature) => feature.UrunAdi === proAdd.additional_feature_name
            )?.ID
        )
        .filter((id) => id);

      setEditingProduct((prev) => ({
        ...prev,
        variants_id: tempSelectedVariantIds,
        additionalfeatures_id: tempSelectedFeatureIds,
      }));
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
                  <TableCell>{getCategoryName(product.category_id)}</TableCell>
                  <TableCell>
                    {getSubcategoryName(product.subcategory_id)}
                  </TableCell>
                  <TableCell>
                    {getTrademarkName(product.trademark_id)}
                  </TableCell>
                  <TableCell>{getVariantNames(product)}</TableCell>
                  <TableCell>{getAdditionalFeatureNames(product)}</TableCell>
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
                    <MenuItem key={category.ID} value={category.ID}>
                      {category.UrunAdi}
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
                  {subcategorys
                    .filter(
                      (subcategory) =>
                        subcategory.category_id === editingProduct.category_id
                    )
                    .map((subcategory) => (
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
                    <MenuItem key={trademark.ID} value={trademark.ID}>
                      {trademark.UrunAdi}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormGroup>
                <Typography variant="subtitle1">Varyantlar:</Typography>
                {variants.map((variant) => (
                  <div key={variant.ID}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          value={variant.ID}
                          onChange={(e) =>
                            handleVariantsCheckboxChange(e, variant.ID)
                          }
                          checked={
                            editingProduct?.variants_id?.includes(variant.ID) ||
                            false
                          }
                        />
                      }
                      label={variant.UrunAdi}
                    />
                    {editingProduct?.variants_id?.includes(variant.ID) && (
                      <>
                        {productVariantsDetails
                          .filter((vars) => vars.variant_id === variant.ID)
                          .map((vars, index) => (
                            <div key={vars.ID}>
                              {/* Varyant Ek Özelliği TextField */}
                              <TextField
                                label="Varyant Ek Özelliği"
                                variant="outlined"
                                value={vars.detail_name}
                                onChange={(e) =>
                                  handleVariantDetailChange(
                                    variant.ID,
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
                                      variant.ID,
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
                                  removeVariantDetail(variant.ID, index)
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
                          onClick={() => addVariantDetail(variant.ID)}
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
                  <div key={feature.ID}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          value={feature.ID}
                          onChange={(e) =>
                            handleAdditionalFeaturesCheckboxChange(
                              e,
                              feature.ID
                            )
                          }
                          checked={
                            editingProduct?.additionalfeatures_id?.includes(
                              feature.ID
                            ) || false
                          }
                        />
                      }
                      label={feature.UrunAdi}
                    />
                    {editingProduct?.additionalfeatures_id?.includes(
                      feature.ID
                    ) && (
                      <TextField
                        label="Ekstra Özellik Detayı"
                        variant="outlined"
                        value={productAdditionalFeatureDetails
                          .filter(
                            (details) =>
                              details.additionalfeature_id === feature.ID
                          )
                          .map((details) => details.details)
                          .join(", ")}
                        onChange={(e) =>
                          handleAdditionalFeatureDetailsChange(
                            feature.ID,
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
