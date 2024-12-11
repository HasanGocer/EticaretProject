import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Alert,
  TextField,
  Modal,
  List,
  ListItem,
  ListItemText,
  Paper,
} from "@mui/material";
import axios from "axios";

function EditVariant() {
  const [message, setMessage] = useState("");
  const [variants, setVariants] = useState([]);
  const [editingVariant, setEditingVariant] = useState(null); // Düzenlenen varyant

  // Varyantları çekme
  const fetchVariants = async () => {
    try {
      const response = await axios.get("http://localhost:5000/get-variants");
      setVariants(response.data);
    } catch (error) {
      console.error("Varyantları alırken bir hata oluştu.", error);
    }
  };

  // Varyantı güncelleme
  const updateVariant = async () => {
    try {
      console.log(editingVariant);
      const response = await axios.put(
        `http://localhost:5000/update-variant/${editingVariant.ID}`,
        { UrunAdi: editingVariant.UrunAdi }
      );
      setMessage(response.data.message);
    } catch (error) {
      console.error("Varyant güncellerken bir hata oluştu.", error);
    }
    setEditingVariant(null);
    fetchVariants();
  };

  // Modal kapatma
  const closeEditModal = () => {
    setEditingVariant(null);
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
      <Typography variant="h4" align="center" gutterBottom>
        Varyant Düzenle
      </Typography>

      {message && (
        <Alert severity="info" sx={{ marginBottom: "20px" }}>
          {message}
        </Alert>
      )}

      <Typography variant="h5" gutterBottom>
        Varyant Listesi
      </Typography>
      <List className="variant-list">
        {variants.map((variant) => (
          <Paper key={variant.ID} className="variant-item">
            <ListItem>
              <ListItemText primary={variant.UrunAdi} />
              <Box>
                <Button
                  variant="contained"
                  color="primary"
                  className="edit-button"
                  onClick={() => setEditingVariant({ ...variant })}
                >
                  Düzenle
                </Button>
              </Box>
            </ListItem>
          </Paper>
        ))}
      </List>

      {/* Düzenleme Modalı */}
      <Modal open={!!editingVariant} onClose={closeEditModal} className="modal">
        <Box className="modal-content">
          <Typography variant="h6" className="modal-title">
            Varyantı Düzenle
          </Typography>
          <TextField
            fullWidth
            label="Ürün Adı"
            value={editingVariant?.UrunAdi || ""}
            onChange={(e) =>
              setEditingVariant({
                ...editingVariant,
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
              onClick={updateVariant}
            >
              Kaydet
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              className="button cancel-button"
              onClick={closeEditModal}
            >
              İptal
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
export default EditVariant;
