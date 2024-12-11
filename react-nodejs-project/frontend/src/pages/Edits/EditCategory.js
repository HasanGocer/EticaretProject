import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  Alert,
  List,
  ListItem,
  ListItemText,
  Modal,
} from "@mui/material";
import axios from "axios";

function EditCategory() {
  const [message, setMessage] = useState("");
  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [editingSubcategories, setEditingSubcategories] = useState({});

  // Kategorileri çek
  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:5000/get-categorys");
      setCategories(response.data);
    } catch (error) {
      console.error("Kategoriler çekilirken hata oluştu.", error);
    }
  };

  // Alt kategorileri çek ve düzenleme alanlarını başlat
  const fetchSubcategories = async (categoryId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/get-subcategorys?category_id=${categoryId}`
      );
      setSubcategories(response.data);

      const initialEditingSubcategories = {};
      response.data.forEach((sub) => {
        initialEditingSubcategories[sub.id] = { name: sub.name };
      });
      setEditingSubcategories(initialEditingSubcategories);
    } catch (error) {
      console.error("Alt kategoriler çekilirken hata oluştu.", error);
    }
  };

  // Alt kategori güncelle
  const updateSubcategory = async (id) => {
    try {
      console.log(
        "Updating subcategory with id:",
        id,
        "name:",
        editingSubcategories[id]?.name
      );

      const response = await axios.put(
        `http://localhost:5000/update-subcategory/${id}`,
        { name: editingSubcategories[id]?.name }
      );
      setMessage(response.data.message);
      fetchSubcategories(editingCategory.ID);
    } catch (error) {
      console.error("Alt kategori güncellenirken hata oluştu.", error);
    }
  };

  const updateCategory = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/update-category/${editingCategory.ID}`,
        { UrunAdi: editingCategory.UrunAdi }
      );
      setMessage(response.data.message || "Kategori başarıyla güncellendi.");
      closeEditCategoryModal();
      fetchCategories();
    } catch (error) {
      console.error("Kategori güncellenirken hata oluştu:", error);
      setMessage("Kategori güncellenirken bir hata oluştu.");
    }
  };

  const closeEditCategoryModal = () => {
    setEditingCategory(null);
  };

  const handleSubcategoryChange = (id, value) => {
    setEditingSubcategories((prev) => ({
      ...prev,
      [id]: { ...prev[id], name: value },
    }));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <Box
      sx={{
        maxWidth: "800px",
        margin: "40px auto",
        padding: "30px",
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Typography variant="h4" className="heading">
        Kategori Düzenle
      </Typography>

      {message && (
        <Alert severity="info" sx={{ marginBottom: "20px" }}>
          {message}
        </Alert>
      )}

      <Typography variant="h5">Kategori Listesi</Typography>
      <List className="category-list">
        {categories.map((category) => (
          <ListItem key={category.ID} className="category-item">
            <ListItemText primary={category.UrunAdi} />
            <Button
              variant="contained"
              color="primary"
              className="edit-button"
              onClick={() => {
                setEditingCategory({ ...category });
                fetchSubcategories(category.ID);
              }}
            >
              Düzenle
            </Button>
          </ListItem>
        ))}
      </List>

      {/* Düzenleme Modalı */}
      {editingCategory && (
        <Modal open={Boolean(editingCategory)} onClose={closeEditCategoryModal}>
          <Box className="modal-content">
            <Typography variant="h6">Kategori'yi Düzenle</Typography>
            <TextField
              fullWidth
              variant="outlined"
              margin="normal"
              value={editingCategory.UrunAdi}
              onChange={(e) =>
                setEditingCategory({
                  ...editingCategory,
                  UrunAdi: e.target.value,
                })
              }
              className="input-field"
            />
            <Box className="modal-actions">
              <Button
                variant="contained"
                color="success"
                className="button"
                onClick={updateCategory}
              >
                Kaydet
              </Button>
              <Button
                variant="contained"
                color="error"
                className="cancel-button"
                onClick={closeEditCategoryModal}
              >
                İptal
              </Button>
            </Box>
            <Typography variant="subtitle1" gutterBottom>
              Alt Kategoriler
            </Typography>
            <List className="subcategory-list">
              {subcategories
                .filter((sub) => sub.category_id === editingCategory.ID)
                .map((sub) => (
                  <ListItem key={sub.id} className="subcategory-item">
                    <TextField
                      fullWidth
                      variant="outlined"
                      value={editingSubcategories[sub.id]?.name || sub.name}
                      onChange={(e) =>
                        handleSubcategoryChange(sub.id, e.target.value)
                      }
                      className="input-field"
                    />
                    <Button
                      variant="contained"
                      color="success"
                      className="button"
                      onClick={() => updateSubcategory(sub.id)}
                    >
                      Kaydet
                    </Button>
                  </ListItem>
                ))}
            </List>
          </Box>
        </Modal>
      )}
    </Box>
  );
}

export default EditCategory;
