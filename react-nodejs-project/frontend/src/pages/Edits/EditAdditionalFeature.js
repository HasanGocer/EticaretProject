import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  Alert,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Paper,
} from "@mui/material";
import axios from "axios";
import { getAdditionalFeatures, updateAdditionalFeature } from ".../Api's/api";

function EditAdditionalFeature() {
  const [message, setMessage] = useState("");
  const [additionalfeatures, setAdditionalFeatures] = useState([]);
  const [editingFeature, setEditingFeature] = useState(null); // Editing feature

  // Fetch additional features
  const fetchAdditionalFeatures = async () => {
    try {
      const additionalFeatures = await getAdditionalFeatures();
      setAdditionalFeatures(additionalFeatures);
    } catch (error) {
      console.error("Error fetching additional features.", error);
    }
  };

  // Update additional feature
  const updateFeature = async () => {
    try {
      const responseData = await updateAdditionalFeature(editingFeature.ID, {
        name: editingFeature.name,
      });

      setMessage(responseData.message);
    } catch (error) {
      console.error("Error updating additional feature.", error);
    }

    setEditingFeature(null);
    fetchAdditionalFeatures();
  };

  // Close edit modal
  const closeEditModal = () => {
    setEditingFeature(null);
  };

  useEffect(() => {
    fetchAdditionalFeatures();
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
        Ek Özellikleri Düzenle
      </Typography>
      {message && (
        <Alert severity="info" sx={{ marginBottom: "20px" }}>
          {message}
        </Alert>
      )}

      <Typography variant="h5" gutterBottom>
        Ek Özellikleri Listesi
      </Typography>
      <Paper elevation={3}>
        <List>
          {additionalfeatures.map((feature) => (
            <ListItem
              key={feature.ID}
              secondaryAction={
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => setEditingFeature({ ...feature })}
                >
                  Düzenle
                </Button>
              }
            >
              <ListItemText primary={feature.name} />
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Edit Modal */}
      {editingFeature && (
        <Dialog open={!!editingFeature} onClose={closeEditModal}>
          <DialogTitle>Additional Feature Düzenle</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              margin="normal"
              label="Ürün Adı"
              value={editingFeature.name}
              onChange={(e) =>
                setEditingFeature({
                  ...editingFeature,
                  name: e.target.value,
                })
              }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={updateFeature} variant="contained" color="primary">
              Kaydet
            </Button>
            <Button onClick={closeEditModal} variant="contained" color="error">
              İptal
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}

export default EditAdditionalFeature;
