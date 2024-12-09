import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AddTrademark.css";
import { Link } from "react-router-dom";
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

function AddTrademark() {
  const [trademark, setTrademark] = useState("");
  const [message, setMessage] = useState("");
  const [trademarks, setTrademarks] = useState([]);

  // Yeni trademark ekleme
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/add-trademark", {
        trademark,
      });
      setMessage(response.data.message);
      fetchTrademarks();
    } catch (error) {
      setMessage("Bir hata oluştu.");
    }
  };

  // Trademark listesini çek
  const fetchTrademarks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/get-trademarks");
      setTrademarks(response.data);
    } catch (error) {
      console.error("Trademarkları alırken bir hata oluştu.", error);
    }
  };

  // Trademark silme işlemi
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/delete-trademark/${id}`
      );
      setMessage(response.data.message);
      fetchTrademarks();
    } catch (error) {
      setMessage("Silme işlemi başarısız.");
    }
  };

  // Sayfa yüklenirken marka listesini çek
  useEffect(() => {
    fetchTrademarks();
  }, []);

  return (
    <Box
      sx={{
        maxWidth: "800px",
        margin: "40px auto",
        p: 3,
        bgcolor: "white",
        borderRadius: "8px",
        boxShadow: 3,
      }}
    >
      {/* Sayfa Başlığı */}
      <Typography variant="h4" align="center" gutterBottom>
        Trademark Yönetimi
      </Typography>

      {/* Yeni Trademark Ekleme Formu */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 3 }}
      >
        <TextField
          label="Yeni Trademark"
          variant="outlined"
          value={trademark}
          onChange={(e) => setTrademark(e.target.value)}
          required
        />
        <Button variant="contained" color="success" type="submit">
          Ekle
        </Button>
      </Box>

      {message && (
        <Typography variant="body1" align="center" color="error" gutterBottom>
          {message}
        </Typography>
      )}

      {/* Trademark Listeleme Alanı */}
      <Typography variant="h6" gutterBottom>
        Trademark Listesi
      </Typography>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="trademark-content"
          id="trademark-header"
        >
          <Typography>Tüm Trademark'ları Görüntüle</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List sx={{ width: "100%" }}>
            {trademarks.map((trademark) => (
              <ListItem
                key={trademark.ID}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  p: 1,
                  mb: 1,
                }}
              >
                <Typography>{trademark.UrunAdi}</Typography>
                <IconButton
                  color="error"
                  onClick={() => handleDelete(trademark.ID)}
                  aria-label="Sil"
                >
                  🗑️
                </IconButton>
              </ListItem>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}

export default AddTrademark;
