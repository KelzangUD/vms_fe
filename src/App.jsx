import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./layouts/Header";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import { Box } from "@mui/material";

function App() {
  const location = useLocation();
  return (
    <Box sx={{backgroundColor: "#fafafa", minHeight: "100vh"}}>
      {
        location.pathname !== "/login" && <Header />
      }
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Box>
  )
}

export default App
