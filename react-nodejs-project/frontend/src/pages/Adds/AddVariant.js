import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Button,
  Typography,
  TextField,
  Grid,
  List,
  ListItem,
  IconButton,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

// AddVariant Bileşeni
function AddVariant() {
  const [variant, setVariant] = useState("");
  const [message, setMessage] = useState("");
  const [variants, setVariants] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/add-variant", {
        variant,
      });
      setMessage(response.data.message);
      fetchVariants();
      setVariant("");
    } catch (error) {
      setMessage("Bir hata oluştu.");
    }
  };

  const fetchVariants = async () => {
    try {
      const response = await axios.get("http://localhost:5000/get-variants");
      setVariants(response.data);
    } catch (error) {
      console.error("Varyantları alırken bir hata oluştu.", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/delete-variant/${id}`
      );
      setMessage(response.data.message);
      fetchVariants();
    } catch (error) {
      setMessage("Varyant silinemedi.");
    }
  };

  useEffect(() => {
    fetchVariants();
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
      <Typography variant="h4" align="center" sx={{ marginBottom: "20px" }}>
        Varyant Ekle
      </Typography>

      {message && (
        <Alert severity="info" sx={{ marginBottom: "20px" }}>
          {message}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Varyant Adı"
              variant="outlined"
              fullWidth
              value={variant}
              onChange={(e) => setVariant(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ width: "100%" }}
            >
              Ekle
            </Button>
          </Grid>
        </Grid>
      </form>

      <Typography variant="h6" sx={{ marginTop: "20px" }}>
        Varyant Listesi
      </Typography>
      <List
        sx={{
          maxHeight: "300px",
          overflowY: "auto",
          border: "1px solid #ddd",
          borderRadius: "5px",
          padding: "10px",
        }}
      >
        {variants.map((variant) => (
          <ListItem
            key={variant.ID}
            sx={{
              justifyContent: "space-between",
              backgroundColor: "#f8f9fa",
              marginBottom: "8px",
              borderRadius: "5px",
            }}
          >
            <Typography>{variant.UrunAdi}</Typography>
            <IconButton
              onClick={() => handleDelete(variant.ID)}
              color="error"
              sx={{ padding: "8px" }}
            >
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default AddVariant;
