import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#9c27b0",
    },
    success: {
      main: "#28a745",
    },
    warning: {
      main: "#ffc107",
    },
    error: {
      main: "#f44336",
    },
  },
  typography: {
    fontFamily: "'Roboto', sans-serif",
    button: {
      textTransform: "none",
    },
  },
});

export default theme;
