import React, { useState } from "react";
import { Box, Backdrop, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { keyframes } from "@mui/system";

const AddToCartNotification = ({ trigger }) => {
  const [open, setOpen] = useState(false);

  const scaleUp = keyframes`
  0% {
    transform: scale(0);
    opacity: 0;
  }
  70% {
    transform: scale(1.1);
    opacity: 1;
  }
  100% {
    transform: scale(1);
  }
`;

  // Bildirim açma fonksiyonu
  const showNotification = () => {
    setOpen(true);
    setTimeout(() => {
      setOpen(false);
    }, 2000); // 2 saniye = 2000 milisaniye
  };

  // Bildirim tetikleme fonksiyonunu dışarıdan erişilebilir hale getir
  React.useEffect(() => {
    if (trigger) {
      trigger.current = showNotification;
    }
  }, [trigger]);

  return (
    <Backdrop
      open={open}
      sx={{
        color: "white",
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backdropFilter: "blur(10px)",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(255, 255, 255, 0)",
          padding: 2,
        }}
      >
        <CheckCircleIcon
          sx={{
            color: "#FFA500",
            fontSize: 50,
            animation: `${scaleUp} 1s ease-in-out forwards`,
          }}
        />
        <Typography
          variant="h6"
          sx={{
            color: "black",
            fontWeight: "bold",
            minWidth: "400px",
            maxWidth: "400px",
            textAlign: "center",
          }}
        >
          Ürün sepete eklendi!
        </Typography>
      </Box>
    </Backdrop>
  );
};

export default AddToCartNotification;
