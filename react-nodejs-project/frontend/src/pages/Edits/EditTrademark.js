import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  Alert,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  Paper,
} from "@mui/material";
import axios from "axios";

function EditTrademark() {
  const [message, setMessage] = useState("");
  const [trademarks, setTrademarks] = useState([]);
  const [editingTrademark, setEditingTrademark] = useState(null); // Düzenlenen trademark

  // Trademarkları çekme
  const fetchTrademarks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/get-trademarks");
      setTrademarks(response.data);
    } catch (error) {
      console.error("Trademarkları alırken bir hata oluştu.", error);
    }
  };

  // Trademark güncelleme
  const updateTrademark = async () => {
    try {
      console.log(editingTrademark.ID);
      const response = await axios.put(
        `http://localhost:5000/update-trademark/${editingTrademark.ID}`,
        { UrunAdi: editingTrademark.UrunAdi }
      );
      setMessage(response.data.message);
    } catch (error) {
      console.error("Trademark güncellerken bir hata oluştu.", error);
    }
    setEditingTrademark(null);
    fetchTrademarks();
  };

  // Modal kapatma
  const closeEditModal = () => {
    setEditingTrademark(null);
  };

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
      <Typography variant="h4" align="center" gutterBottom>
        Marka Düzenle
      </Typography>

      {message && (
        <Alert severity="info" sx={{ marginBottom: "20px" }}>
          {message}
        </Alert>
      )}

      <Typography variant="h5" gutterBottom>
        Marka Listesi
      </Typography>
      <Paper sx={{ padding: 2 }}>
        <List>
          {trademarks.map((trademark) => (
            <ListItem
              key={trademark.ID}
              secondaryAction={
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setEditingTrademark({ ...trademark })}
                >
                  Düzenle
                </Button>
              }
            >
              <ListItemText primary={trademark.UrunAdi} />
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Düzenleme Modalı */}
      {editingTrademark && (
        <Dialog open={!!editingTrademark} onClose={closeEditModal}>
          <DialogTitle>Trademark'ı Düzenle</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Ürün Adı"
              value={editingTrademark.UrunAdi}
              onChange={(e) =>
                setEditingTrademark({
                  ...editingTrademark,
                  UrunAdi: e.target.value,
                })
              }
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              color="success"
              onClick={updateTrademark}
            >
              Kaydet
            </Button>
            <Button variant="outlined" color="error" onClick={closeEditModal}>
              İptal
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}

export default EditTrademark;
