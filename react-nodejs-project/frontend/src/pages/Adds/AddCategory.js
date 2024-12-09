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
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "./AddCategory.css"; // Dış CSS burada.

function AddCategory() {
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [message, setMessage] = useState("");
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubategories] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState({});

  // Fetch kategorileri
  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:5000/get-categorys");
      setCategories(response.data);
    } catch (error) {
      console.error("Kategoriler alınırken bir hata oluştu", error);
    }
  };

  // Alt Kategori çekme
  const fetchSubcategories = async (categoryId) => {
    try {
      const response = await axios.get(
        "http://localhost:5000/get-subcategorys"
      );
      setSubategories(response.data);
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
      const response = await axios.delete(
        `http://localhost:5000/delete-category/${id}`
      );
      console.log("Backend yanıtı:", response.data);
      setMessage(response.data.message);
      fetchCategories();
    } catch (error) {
      console.error("Silme işlemi sırasında hata:", error.response?.data);
      if (error.response && error.response.data?.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Kategori silinirken beklenmeyen bir hata oluştu.");
      }
    }
  };

  const handleDeleteSubcategory = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/delete-subcategory/${id}`);
      setMessage("Alt kategori silindi.");
      fetchSubcategories();
    } catch (error) {
      setMessage("Alt kategori silinemedi.");
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/add-category", {
        category,
      });
      setMessage(response.data.message);
      fetchCategories();
    } catch (error) {
      setMessage("Bir hata oluştu.");
    }
  };

  const handleSubcategorySubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/add-subcategory",
        {
          category_id: selectedCategory,
          name: subcategory,
        }
      );
      setMessage(response.data.message);
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
    <Box className="container">
      <Typography variant="h4" className="heading">
        Kategori ve Alt Kategori Yönetimi
      </Typography>

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
              <option key={cat.ID} value={cat.ID}>
                {cat.UrunAdi}
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

      {message && (
        <Typography
          variant="body1"
          color="error"
          align="center"
          className="message"
        >
          {message}
        </Typography>
      )}

      {/* Kategorileri Listele */}
      <Box>
        {categories.map((category) => (
          <Accordion
            key={category.ID}
            expanded={expandedCategories[category.ID] || false}
            onChange={() => toggleExpandCategory(category.ID)}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${category.ID}-content`}
            >
              <Typography>{category.UrunAdi}</Typography>
              <IconButton onClick={() => handleDeleteCategory(category.ID)}>
                <Typography color="error">Sil</Typography>
              </IconButton>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                {subcategories
                  .filter((sub) => sub.category_id === category.ID)
                  .map((subcategory) => (
                    <ListItem key={subcategory.id}>
                      <Typography>{subcategory.name}</Typography>
                      <IconButton
                        onClick={() => handleDeleteSubcategory(subcategory.id)}
                      >
                        <Typography color="error">Sil</Typography>
                      </IconButton>
                    </ListItem>
                  ))}
              </List>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Box>
  );
}

export default AddCategory;
