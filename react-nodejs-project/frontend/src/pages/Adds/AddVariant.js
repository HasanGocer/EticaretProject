import React, { useState, useEffect } from "react";
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
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { getVariants, deleteVariant, addVariant } from "../../Apis/api";

// AddVariant Bileşeni
function AddVariant() {
  const [variant, setVariant] = useState("");
  const [message, setMessage] = useState("");
  const [variants, setVariants] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const responseData = await addVariant(variant);
      setMessage(responseData.message);
      fetchVariants();
      setVariant(""); // Formu sıfırlama
    } catch (error) {
      setMessage("Bir hata oluştu.");
    }
  };

  const fetchVariants = async () => {
    try {
      const variantsData = await getVariants();
      console.log(variantsData);
      setVariants(variantsData);
    } catch (error) {
      console.error("Varyantları alırken bir hata oluştu.", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const responseData = await deleteVariant(id);
      setMessage(responseData.message);
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

      <Accordion sx={{ marginTop: "20px" }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography variant="h6">Varyant Listesi</Typography>
        </AccordionSummary>
        <AccordionDetails>
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
                <Typography>{variant.name}</Typography>
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
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}

export default AddVariant;
