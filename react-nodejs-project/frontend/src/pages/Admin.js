import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./Admin.css"; // CSS dosyasını burada dahil ediyoruz
import AddProduct from "./Adds/AddProduct";
import AddVariant from "./Adds/AddVariant";
import AddTrademark from "./Adds/AddTrademark";
import AddCategory from "./Adds/AddCategory";
import AddAdditionalFeature from "./Adds/AddAdditionalFeature";
import EditProduct from "./Edits/EditProduct";
import EditVariant from "./Edits/EditVariant";
import EditTrademark from "./Edits/EditTrademark";
import EditCategory from "./Edits/EditCategory";
import EditAdditionalFeature from "./Edits/EditAdditionalFeature";
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

const ListAdd = [
  { value: "/admin/addProduct", name: "Ürün Ekleme" },
  { value: "/admin/addVariant", name: "Varyant Ekleme" },
  { value: "/admin/addTrademark", name: "Marka Ekleme" },
  { value: "/admin/addCategory", name: "Kategori Ekleme" },
  { value: "/admin/addAdditionalFeature", name: "Ekstra Özellik Ekleme" },
];
const ListEdit = [
  { value: "/admin/editProduct", name: "Ürün Düzenleme" },
  { value: "/admin/editVariant", name: "Varyant Düzenleme" },
  { value: "/admin/editTrademark", name: "Marka Düzenleme" },
  { value: "/admin/editCategory", name: "Kategori Düzenleme" },
  { value: "/admin/editAdditionalFeature", name: "Ekstra Özellik Düzenleme" },
];

function Admin() {
  const [selectedPage, setSelectedPage] = useState("");
  const [selectedPanel, setSelectedPanel] = useState(""); // Açık panelin state'ini tutan değişken

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    // Eğer tıklanan panel genişlenmişse seçilen state'i değiştir
    setSelectedPanel(isExpanded ? panel : "");
    console.log(isExpanded ? panel : "");
  };

  const handleSelectChange = (event) => {
    const newPage = event.currentTarget.value;
    setSelectedPage(newPage);
    setSelectedPanel("");
  };

  return (
    <div className="admin-container">
      <div
        style={{
          display: "flex",
          gap: "10px",
          width: "100%",
        }}
      >
        <Accordion
          expanded={selectedPanel === "add"} // Bu durumda yalnızca `add` açık olur
          onChange={handleAccordionChange("add")}
          sx={{ width: "20%", height: "10%" }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="add-content"
            id="add-header"
          >
            <Typography>Ekleme Paneli</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {ListAdd.map((tempAdd) => (
              <List sx={{ width: "100%" }} key={tempAdd.value}>
                <Button
                  value={tempAdd.value}
                  onClick={handleSelectChange}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    minWidth: "100%",
                    maxWidth: "100%",
                    p: 1,
                    mb: 1,
                  }}
                >
                  <Typography>{tempAdd.name}</Typography>
                </Button>
              </List>
            ))}
          </AccordionDetails>
        </Accordion>

        <Accordion
          expanded={selectedPanel === "edit"} // Bu durumda yalnızca `edit` açık olur
          onChange={handleAccordionChange("edit")}
          sx={{ width: "20%", height: "10%" }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="edit-content"
            id="edit-header"
          >
            <Typography>Düzenleme Paneli</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {ListEdit.map((tempEdit) => (
              <List sx={{ width: "100%" }} key={tempEdit.value}>
                <Button
                  value={tempEdit.value}
                  onClick={handleSelectChange}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    minWidth: "100%",
                    maxWidth: "100%",
                    p: 1,
                    mb: 1,
                  }}
                >
                  <Typography>{tempEdit.name}</Typography>
                </Button>
              </List>
            ))}
          </AccordionDetails>
        </Accordion>
      </div>

      {selectedPage === "/admin/addProduct" && <AddProduct />}
      {selectedPage === "/admin/addVariant" && <AddVariant />}
      {selectedPage === "/admin/addTrademark" && <AddTrademark />}
      {selectedPage === "/admin/addCategory" && <AddCategory />}
      {selectedPage === "/admin/addAdditionalFeature" && (
        <AddAdditionalFeature />
      )}
      {selectedPage === "/admin/editProduct" && <EditProduct />}
      {selectedPage === "/admin/editVariant" && <EditVariant />}
      {selectedPage === "/admin/editTrademark" && <EditTrademark />}
      {selectedPage === "/admin/editCategory" && <EditCategory />}
      {selectedPage === "/admin/editAdditionalFeature" && (
        <EditAdditionalFeature />
      )}

      {/* Sayfa Yönlendirmeleri */}
      <Routes>
        {/* Ekleme Sayfaları */}
        <Route path="/admin/addProduct" element={<AddProduct />} />
        <Route path="/admin/addVariant" element={<AddVariant />} />
        <Route path="/admin/addTrademark" element={<AddTrademark />} />
        <Route path="/admin/addCategory" element={<AddCategory />} />
        <Route
          path="/admin/addAdditionalFeature"
          element={<AddAdditionalFeature />}
        />

        {/* Düzenleme Sayfaları */}
        <Route path="/admin/editProduct" element={<EditProduct />} />
        <Route path="/admin/editVariant" element={<EditVariant />} />
        <Route path="/admin/editTrademark" element={<EditTrademark />} />
        <Route path="/admin/editCategory" element={<EditCategory />} />
        <Route
          path="/admin/editAdditionalFeature"
          element={<EditAdditionalFeature />}
        />
      </Routes>
    </div>
  );
}

export default Admin;
