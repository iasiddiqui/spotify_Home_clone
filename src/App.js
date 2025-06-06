import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Callback from "./pages/Callback";
import Home from "./pages/Home";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/callback" element={<Callback />} />
      </Routes>
    </Router>
  );
}

export default App;
