import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  IconButton,
  Collapse,
  Modal,
  Box,
  TextField,
  Button,
} from "@mui/material";
import { Edit, ExpandMore, ExpandLess, Delete } from "@mui/icons-material";

const EditOrder = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/orders")
      .then((response) => {
        setOrders(response.data);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(
          `Hata: ${
            err.response?.data?.message ||
            "Siparişler yüklenirken bir hata oluştu."
          }`
        );
        setIsLoading(false);
      });
  }, []);

  const toggleExpandOrder = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const handleEdit = (order) => {
    setFormData(order); // Formu mevcut siparişle doldur
    setProducts(order.items || []);
    console.log(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Eğer "order_date" alanı düzenleniyorsa ISO formatına dönüştür
    if (name === "order_date") {
      const isoDate = new Date(value).toISOString(); // Kullanıcı girdisini ISO formatına dönüştür
      setFormData({ ...formData, [name]: isoDate });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Gelen tarihleri formata çevir
  const formattedOrderDate = formData.order_date
    ? new Date(formData.order_date).toISOString().slice(0, 16)
    : "";

  const formattedDeliveryDate = formData.delivery_date
    ? new Date(formData.delivery_date).toISOString().slice(0, 16)
    : "";

  const handleProductChange = (index, e) => {
    const { name, value } = e.target;
    const updatedProducts = [...products];
    updatedProducts[index] = { ...updatedProducts[index], [name]: value };
    setProducts(updatedProducts);
  };

  const handleAddProduct = () => {
    setProducts([
      ...products,
      {
        id: Date.now(),
        name: "",
        price: "",
        quantity: "",
        discountRate: "",
        stockQuantity: "",
        description: "",
        image_data: "",
      },
    ]);
  };

  const handleDeleteProduct = (index) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const updatedOrder = { ...formData, items: products };
    axios
      .put(`http://localhost:5000/update-order/${formData.id}`, updatedOrder)
      .then((response) => {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === formData.id ? response.data : order
          )
        );
        handleCloseModal();
      })
      .catch((err) => {
        alert(
          `Hata: ${
            err.response?.data?.message ||
            "Sipariş güncellenirken bir hata oluştu."
          }`
        );
      });
  };

  if (isLoading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Paper style={{ padding: "16px", marginTop: "16px" }}>
      <Typography variant="h4" gutterBottom>
        Siparişler
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <b>ID</b>
              </TableCell>
              <TableCell>
                <b>Kullanıcı ID</b>
              </TableCell>
              <TableCell>
                <b>Sipariş Numarası</b>
              </TableCell>
              <TableCell>
                <b>Sipariş Tarihi</b>
              </TableCell>
              <TableCell>
                <b>Teslim Tarihi</b>
              </TableCell>
              <TableCell>
                <b>Durum</b>
              </TableCell>
              <TableCell>
                <b>Ürünler</b>
              </TableCell>
              <TableCell>
                <b>İşlemler</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <React.Fragment key={order.id}>
                <TableRow>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.user_id}</TableCell>
                  <TableCell>{order.order_number}</TableCell>
                  <TableCell>
                    {new Date(order.order_date).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {new Date(order.delivery_date).toLocaleString()}
                  </TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => toggleExpandOrder(order.id)}>
                      {expandedOrder === order.id ? (
                        <ExpandLess />
                      ) : (
                        <ExpandMore />
                      )}
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(order)}
                    >
                      <Edit />
                    </IconButton>
                  </TableCell>
                </TableRow>
                {expandedOrder === order.id && (
                  <TableRow>
                    <TableCell colSpan={8}>
                      <Collapse in={expandedOrder === order.id}>
                        <TableContainer>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>
                                  <b>ID</b>
                                </TableCell>
                                <TableCell>
                                  <b>Ürün Adı</b>
                                </TableCell>
                                <TableCell>
                                  <b>Fiyat</b>
                                </TableCell>
                                <TableCell>
                                  <b>Miktar</b>
                                </TableCell>
                                <TableCell>
                                  <b>İndirim Oranı</b>
                                </TableCell>
                                <TableCell>
                                  <b>Stok Miktarı</b>
                                </TableCell>
                                <TableCell>
                                  <b>Açıklama</b>
                                </TableCell>
                                <TableCell>
                                  <b>Resim</b>
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {order.items.map((item) => (
                                <TableRow key={item.id}>
                                  <TableCell>{item.id}</TableCell>
                                  <TableCell>{item.name}</TableCell>
                                  <TableCell>{item.price} ₺</TableCell>
                                  <TableCell>{item.quantity}</TableCell>
                                  <TableCell>{item.discountRate}%</TableCell>
                                  <TableCell>{item.stockQuantity}</TableCell>
                                  <TableCell>{item.description}</TableCell>
                                  <TableCell>
                                    <img
                                      src={item.image_data}
                                      alt={item.name}
                                      style={{ width: "50px", height: "50px" }}
                                    />
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Box
          style={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
            width: "80%",
            margin: "auto",
            marginTop: "5%",
          }}
        >
          <Typography variant="h6">Siparişi Düzenle</Typography>
          <form>
            <TextField
              fullWidth
              margin="normal"
              label="Kullanıcı ID"
              name="user_id"
              value={formData.user_id || ""}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Sipariş Numarası"
              name="order_number"
              value={formData.order_number || ""}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Sipariş Tarihi"
              name="order_date"
              type="datetime-local"
              value={formattedOrderDate}
              onChange={handleInputChange}
            />

            <TextField
              fullWidth
              margin="normal"
              label="Teslim Tarihi"
              name="delivery_date"
              type="datetime-local"
              value={formattedDeliveryDate}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Durum"
              name="status"
              value={formData.status || ""}
              onChange={handleInputChange}
            />
            <Box marginTop="16px">
              <Typography variant="h6" gutterBottom>
                Ürünler
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Ürün Adı</TableCell>
                      <TableCell>Fiyat</TableCell>
                      <TableCell>Miktar</TableCell>
                      <TableCell>İndirim Oranı</TableCell>
                      <TableCell>Stok Miktarı</TableCell>
                      <TableCell>Açıklama</TableCell>
                      <TableCell>İşlemler</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {products.map((product, index) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <TextField
                            name="name"
                            value={product.name || ""}
                            onChange={(e) => handleProductChange(index, e)}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            name="price"
                            value={product.price || ""}
                            onChange={(e) => handleProductChange(index, e)}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            name="quantity"
                            value={product.quantity || ""}
                            onChange={(e) => handleProductChange(index, e)}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            name="discountRate"
                            value={product.discountRate || ""}
                            onChange={(e) => handleProductChange(index, e)}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            name="stockQuantity"
                            value={product.stockQuantity || ""}
                            onChange={(e) => handleProductChange(index, e)}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            name="description"
                            value={product.description || ""}
                            onChange={(e) => handleProductChange(index, e)}
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton
                            color="error"
                            onClick={() => handleDeleteProduct(index)}
                          >
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleAddProduct}
                style={{ marginTop: "10px" }}
              >
                Ürün Ekle
              </Button>
            </Box>
            <Box display="flex" justifyContent="space-between" marginTop="16px">
              <Button
                variant="contained"
                color="secondary"
                onClick={handleCloseModal}
              >
                İptal
              </Button>
              <Button variant="contained" color="primary" onClick={handleSave}>
                Kaydet
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </Paper>
  );
};

export default EditOrder;
