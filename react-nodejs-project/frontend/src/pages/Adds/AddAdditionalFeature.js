import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Button,
  Typography,
  TextField,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Paper,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import "./AddAdditionalFeature.css";

function AddAdditionalFeature() {
  const [additionalfeature, setAdditionalfeature] = useState("");
  const [message, setMessage] = useState("");
  const [additionalfeatures, setAdditionalFeatures] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/add-additionalFeature", // Doğru URL
        { additionalFeature: additionalfeature } // Gönderilen veri yapısı burada JSON objesi gibi olmalı
      );
      console.log(response.data);
      setMessage(response.data.message);
      fetchAdditionalFeatures();
    } catch (error) {
      console.error("Backend'den dönen hata: ", error.response?.data);
      setMessage("Bir hata oluştu.");
    }
  };

  const fetchAdditionalFeatures = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/get-additionalfeatures"
      );
      setAdditionalFeatures(response.data);
    } catch (error) {
      console.error("Bir hata oluştu:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/delete-additionalfeature/${id}`
      );
      setMessage(response.data.message);
      fetchAdditionalFeatures();
    } catch (error) {
      setMessage("Silme işlemi başarısız.");
    }
  };

  useEffect(() => {
    fetchAdditionalFeatures();
  }, []);

  return (
    <Box className="container" p={3}>
      <Typography variant="h4" align="center" gutterBottom>
        Additional Feature Yönetimi
      </Typography>

      <Button
        variant="contained"
        color="primary"
        component={Link}
        to="/admin"
        sx={{ mb: 3 }}
      >
        Ana Sayfaya Dön
      </Button>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Additional Feature Adı"
            variant="outlined"
            fullWidth
            value={additionalfeature}
            onChange={(e) => setAdditionalfeature(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          <Button type="submit" variant="contained" color="secondary" fullWidth>
            Ekle
          </Button>
        </form>
      </Paper>

      {message && (
        <Typography color="error" align="center" gutterBottom>
          {message}
        </Typography>
      )}

      <Typography variant="h6" gutterBottom>
        Mevcut Additional Feature Listesi
      </Typography>

      <List>
        {additionalfeatures.map((feature) => (
          <ListItem
            key={feature.ID}
            secondaryAction={
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => handleDelete(feature.ID)}
              >
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemText primary={feature.UrunAdi} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default AddAdditionalFeature;
