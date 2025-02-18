import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  Accordion,
  Alert,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  getCategories,
  addCategory,
  deleteCategory,
  getSubcategories,
  deleteSubcategory,
  addSubcategory,
} from ".../Api's/api";

function AddCategory() {
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [message, setMessage] = useState("");
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubategories] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState({});

  const fetchCategories = async () => {
    try {
      const categoriesData = await getCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error("Kategoriler alınırken bir hata oluştu", error);
    }
  };
  const fetchSubcategories = async (categoryId) => {
    try {
      const subcategoriesData = await getSubcategories(categoryId);
      setSubategories(subcategoriesData);
    } catch (error) {
      console.error("Alt Kategoriler çekilirken hata oluştu", error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchSubcategories();
  }, []);

  const handleDeleteCategory = async (id) => {
    try {
      const responseData = await deleteCategory(id);
      setMessage(responseData.message);
      fetchCategories();
    } catch (error) {
      console.error("Silme işlemi sırasında hata:", error);
      if (error?.message) {
        setMessage(error);
      } else {
        setMessage("Kategori silinirken beklenmeyen bir hata oluştu.");
      }
    }
  };
  const handleDeleteSubcategory = async (id) => {
    try {
      await deleteSubcategory(id);
      setMessage("Alt kategori silindi.");
      fetchSubcategories();
    } catch (error) {
      setMessage("Alt kategori silinemedi.");
    }
  };
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      const responseData = await addCategory(category);
      setMessage(responseData.message);
      fetchCategories();
    } catch (error) {
      setMessage("Bir hata oluştu.");
    }
  };
  const handleSubcategorySubmit = async (e) => {
    e.preventDefault();
    try {
      const responseData = await addSubcategory(selectedCategory, subcategory);
      setMessage(responseData.message);
      fetchSubcategories();
    } catch (error) {
      setMessage("Alt kategori eklenirken bir hata oluştu.");
    }
  };

  const toggleExpandCategory = (categoryId) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

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
        Kategori ve Alt Kategori Ekleme
      </Typography>

      {message && (
        <Alert severity="info" sx={{ marginBottom: "20px" }}>
          {message}
        </Alert>
      )}

      {/* Yeni Kategori Formu */}
      <Box className="form-wrapper">
        <form onSubmit={handleCategorySubmit}>
          <TextField
            label="Kategori Adı"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="input-field"
          />
          <Button type="submit" variant="contained" className="button">
            Kategori Ekle
          </Button>
        </form>
      </Box>

      {/* Yeni Alt Kategori Formu */}
      <Box className="form-wrapper">
        <form onSubmit={handleSubcategorySubmit}>
          <TextField
            select
            label="Kategori Seç"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="input-field"
            SelectProps={{
              native: true,
            }}
          >
            <option value="">Bir kategori seçin</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </TextField>
          <TextField
            label="Alt Kategori Adı"
            value={subcategory}
            onChange={(e) => setSubcategory(e.target.value)}
            required
            className="input-field"
          />
          <Button type="submit" variant="contained" className="button">
            Alt Kategori Ekle
          </Button>
        </form>
      </Box>

      {/* Kategorileri Listele */}
      <Box>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="categories-panel-content"
          >
            <Typography>Kategoriler</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {categories.map((category) => (
              <Accordion
                key={category.id}
                expanded={expandedCategories[category.id] || false}
                onChange={() => toggleExpandCategory(category.id)}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`panel${category.id}-content`}
                >
                  <Typography>{category.name}</Typography>
                  <IconButton
                    onClick={() => handleDeleteCategory(category.id)}
                    color="error"
                    sx={{ padding: "8px" }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </AccordionSummary>
                <AccordionDetails>
                  <List>
                    {subcategories
                      .filter((sub) => sub.category_id === category.id)
                      .map((subcategory) => (
                        <ListItem key={subcategory.id}>
                          <Typography>{subcategory.name}</Typography>
                          <IconButton
                            onClick={() =>
                              handleDeleteSubcategory(subcategory.id)
                            }
                            color="error"
                            sx={{ padding: "8px" }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </ListItem>
                      ))}
                  </List>
                </AccordionDetails>
              </Accordion>
            ))}
          </AccordionDetails>
        </Accordion>
      </Box>
    </Box>
  );
}

export default AddCategory;
