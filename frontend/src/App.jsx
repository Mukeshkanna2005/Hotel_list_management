import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import HotelListPage from "./pages/HotelListPage";
import HotelFormPage from "./pages/HotelFormPage";
import HotelDetailPage from "./pages/HotelDetailPage";
import "./App.css";

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HotelListPage />} />
          <Route path="/add" element={<HotelFormPage />} />
          <Route path="/edit/:id" element={<HotelFormPage />} />
          <Route path="/hotel/:id" element={<HotelDetailPage />} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
