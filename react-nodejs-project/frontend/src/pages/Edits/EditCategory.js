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
import {
  getCategories,
  getSubcategories,
  updateCategoryHG,
  updateSubcategoryHG,
} from "../../Apis/api";
function EditCategory() {
  const [message, setMessage] = useState("");
  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingSubcategories, setEditingSubcategories] = useState({});

  const fetchCategories = async () => {
    try {
      const categories = await getCategories();
      setCategories(categories);
    } catch (error) {
      console.error("Kategoriler çekilirken hata oluştu.", error);
    }
  };
  const fetchSubcategories = async (categoryId) => {
    try {
      const subcategories = await getSubcategories(categoryId);
      setEditingSubcategories(subcategories);
    } catch (error) {
      console.error("Alt kategoriler çekilirken hata oluştu.", error);
    }
  };
  const updateSubcategory = async (id) => {
    try {
      const responseData = await updateSubcategoryHG(
        id,
        editingSubcategories[id]?.name
      );

      setMessage(responseData.message);
      fetchSubcategories(editingCategory.id);
    } catch (error) {
      console.error("Alt kategori güncellenirken hata oluştu.", error);
    }
  };
  const updateCategory = async () => {
    try {
      const responseData = await updateCategoryHG(editingCategory.ID, {
        name: editingCategory.name,
      });

      setMessage(responseData.message || "Kategori başarıyla güncellendi.");
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
          <ListItem key={category.id} className="category-item">
            <ListItemText primary={category.name} />
            <Button
              variant="contained"
              color="primary"
              className="edit-button"
              onClick={() => {
                setEditingCategory({ ...category });
                fetchSubcategories(category.id);
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
              value={editingCategory.name}
              onChange={(e) =>
                setEditingCategory({
                  ...editingCategory,
                  name: e.target.value,
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
              {editingSubcategories.map((sub) => (
                <ListItem key={sub.id} className="subcategory-item">
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={sub.name}
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
