import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import QRGenerator from "./pages/QRGenerator";
import Datatable from "./pages/Datatable";

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/qr-generator" element={<QRGenerator />} />
          <Route path="/datatable" element={<Datatable />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
