import React, { useState, useEffect } from "react";
import "./App.css";
import NavBar from "./components/Main/NavBar";
import SideMenu from "./components/Main/SideMenu";
import MainChart from "./components/Main/MainChart";
import cryptoService from "./services/CryptoService";
import Registry from "./components/Auth/Registry"
import Login from "./components/Auth/Login"
import AboutUs from "./components/Main/AboutUs"
import CategoriesSummary from "./components/Main/CategoriesSummary"
import { BrowserRouter, Routes, Route} from "react-router-dom";
import Footer from "./components/Main/Footer";
import Box from "@mui/material/Box";
import AddPost from "./components/Main/AddPost";
function App() {
  const [currentQuotes, setCurrentQuotes] = useState([]);

  useEffect(() => {
    const subscription = (newQuotes) => {
      setCurrentQuotes(newQuotes);
    };

    const unsubscribe = cryptoService.subscribe(subscription);

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      
      <BrowserRouter>
        <NavBar currentQuotes={currentQuotes} />
        <Box sx={{ flexGrow: 1 }}>
        <Routes>
          <Route index element={<AboutUs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registry" element={<Registry />} />
          <Route path="/home" element={<MainChart />} />
          <Route path="/aboutUs" element={<AboutUs />} />
          <Route path="/mainChart" element={<MainChart />} />
          <Route path="/summary" element={<CategoriesSummary />} />
          <Route path="/addPost" element={<AddPost />} />
        </Routes>
        </Box>
      <Footer />
      </BrowserRouter>
    </Box>
  );
}

export default App;
