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
  IconButton,
  Paper,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  addAdditionalFeature,
  getAdditionalFeatures,
  deleteAdditionalFeature,
} from "../../Apis/api";

function AddAdditionalFeature() {
  const [additionalfeature, setAdditionalfeature] = useState("");
  const [message, setMessage] = useState("");
  const [additionalfeatures, setAdditionalFeatures] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const responseData = await addAdditionalFeature(additionalfeature);
      setMessage(responseData.message);
      fetchAdditionalFeatures();
    } catch (error) {
      setMessage("Bir hata oluştu.", error);
    }
  };

  const fetchAdditionalFeatures = async () => {
    try {
      const additionalFeatures = await getAdditionalFeatures();
      console.log(additionalFeatures);
      setAdditionalFeatures(additionalFeatures);
    } catch (error) {
      setMessage("Bir hata oluştu.", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const responseData = await deleteAdditionalFeature(id);
      setMessage(responseData.message);
      fetchAdditionalFeatures();
    } catch (error) {
      setMessage("Bir hata oluştu.", error);
    }
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
        Ek Özellik Ekleme
      </Typography>
      {message && (
        <Alert severity="info" sx={{ marginBottom: "20px" }}>
          {message}
        </Alert>
      )}

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
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Ekle
          </Button>
        </form>
      </Paper>

      <Typography variant="h6" gutterBottom>
        Mevcut Additional Feature Listesi
      </Typography>

      <List>
        {additionalfeatures.map((feature) => (
          <ListItem
            key={feature.id}
            secondaryAction={
              <IconButton
                color="error"
                sx={{ padding: "8px" }}
                onClick={() => handleDelete(feature.id)}
              >
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemText primary={feature.name} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default AddAdditionalFeature;
