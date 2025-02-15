import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Typography,
  TextField,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

function AddTrademark() {
  const [trademark, setTrademark] = useState("");
  const [message, setMessage] = useState("");
  const [trademarks, setTrademarks] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Yeni trademark ekleme
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Resmi base64 olarak encode edip gönderiyoruz
      const formData = new FormData();
      formData.append("trademark", trademark);
      formData.append("image", imageFile);

      const response = await axios.post(
        "http://localhost:5000/add-trademark",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMessage(response.data.message);
      setTrademark(""); // Formu sıfırlama
      setImageFile(null); // Formu sıfırlama
      setPreviewUrl(null); // Formu sıfırlama
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
      console.log(response.data);
    } catch (error) {
      console.error("Trademarkları alırken bir hata oluştu.", error);
    }
  };

  // Resim dosyasını önizlemek için
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
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
        padding: "30px",
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Sayfa Başlığı */}
      <Typography variant="h4" align="center" gutterBottom>
        Marka Ekle
      </Typography>

      {/* Yeni Trademark Ekleme Formu */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 3 }}
      >
        {message && (
          <Alert severity="info" sx={{ marginBottom: "20px" }}>
            {message}
          </Alert>
        )}
        <TextField
          label="Yeni Trademark"
          variant="outlined"
          value={trademark}
          onChange={(e) => setTrademark(e.target.value)}
          required
        />

        {/* Dosya yükleme */}
        <input type="file" accept="image/*" onChange={handleImageChange} />

        {/* Resim önizlemesi */}
        {previewUrl && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <img
              src={previewUrl}
              alt="Preview"
              style={{ width: "100px", height: "100px", objectFit: "cover" }}
            />
          </Box>
        )}

        <Button variant="contained" color="primary" type="submit">
          Ekle
        </Button>
      </Box>

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
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <img
                    src={trademark.image_data}
                    alt={trademark.UrunAdi}
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                    }}
                  />
                  <Typography>{trademark.UrunAdi}</Typography>
                </Box>
                <IconButton
                  onClick={() => handleDelete(trademark.ID)}
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
    </Box>
  );
}

export default AddTrademark;
