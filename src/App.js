import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import QRGenerator from "./pages/QRGenerator";
import Datatable from "./pages/Datatable";
import Login from "./pages/Login";

function App() {
  const location = useLocation();

  return (
    <div className="App">
      {location.pathname != "/" && <Header />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/qr-generator" element={<QRGenerator />} />
        <Route path="/datatable" element={<Datatable />} />
      </Routes>
    </div>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
