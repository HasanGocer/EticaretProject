import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../../Apis/auth.service";
import "./Order.css";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Grid,
  CircularProgress,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";

// Durumlar için simge döndüren fonksiyon
const getStatusIcon = (status) => {
  if (status === "Sipariş Alındı") return <HourglassTopIcon color="warning" />;
  if (status === "Kargoya Verildi")
    return <LocalShippingIcon color="primary" />;
  if (status === "Teslim Edildi") return <CheckCircleIcon color="success" />;
  return <HourglassTopIcon />;
};

const Order = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]); // Siparişleri çekmek için state
  const [loading, setLoading] = useState(true); // Yükleme işlemi için state
  const [error, setError] = useState(""); // Hata yönetimi için state

  // Sipariş çekme işlemi
  useEffect(() => {
    if (!AuthService.getCurrentUser()) {
      navigate("/login"); // Kullanıcı giriş yapmamışsa giriş sayfasına yönlendir
    } else {
      const fetchOrders = async () => {
        try {
          const response = await fetch(
            `http://localhost:5000/orders/${
              AuthService.getCurrentUser().user.id
            }`
          );
          if (!response.ok) {
            throw new Error("Siparişler çekilirken bir hata oluştu.");
          }

          const data = await response.json();

          console.log(AuthService.getCurrentUser());
          console.log("Veritabanından çekilen siparişler: ", data);

          const formattedOrders = data.map((order) => ({
            ...order,
            items:
              typeof order.items === "string"
                ? JSON.parse(order.items)
                : order.items,
          }));

          setOrders(formattedOrders);
          setLoading(false);
        } catch (error) {
          setError(error.message);
          setLoading(false);
        }
      };

      fetchOrders();
    }
  }, []);

  if (loading) {
    return (
      <Box textAlign="center" mt={4}>
        <CircularProgress />
        <Typography>Yükleniyor...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <div>
      {AuthService.getCurrentUser() && (
        <Box p={4} sx={{ fontFamily: "Roboto, sans-serif" }}>
          <Typography variant="h4" gutterBottom>
            Sipariş Listesi
          </Typography>

          {/* Sipariş Listesi */}
          <Grid container spacing={2}>
            {orders.length > 0 ? (
              orders.map((order) => (
                <Grid item xs={12} sm={6} md={4} key={order.id}>
                  <Card>
                    <CardContent>
                      <Typography>
                        <strong>Sipariş Numarası:</strong> {order.order_number}
                      </Typography>
                      <Typography>
                        <strong>Kullanıcı ID:</strong> {order.user_id}
                      </Typography>
                      <Typography>
                        <strong>Sipariş Tarihi:</strong>{" "}
                        {new Date(order.order_date).toLocaleString()}
                      </Typography>
                      <Typography>
                        <strong>Teslim Tarihi:</strong>{" "}
                        {new Date(order.delivery_date).toLocaleString()}
                      </Typography>
                      <Typography>
                        <strong>Durum:</strong> {order.status}
                      </Typography>
                      <Typography>
                        <strong>Ürünler:</strong>
                      </Typography>
                      {order.items.length > 0 ? (
                        order.items.map((item, index) => (
                          <Box key={index} mt={1} sx={{ paddingLeft: 1 }}>
                            <Typography>
                              - {item.name} | Adet: {item.quantity} | Fiyat:{" "}
                              {Number(item.price).toFixed(2)}₺
                            </Typography>
                          </Box>
                        ))
                      ) : (
                        <Typography>Ürün bulunmuyor.</Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Typography textAlign="center" mt={2}>
                  Sipariş bulunmamaktadır.
                </Typography>
              </Grid>
            )}
          </Grid>
        </Box>
      )}
    </div>
  );
};

export default Order;
