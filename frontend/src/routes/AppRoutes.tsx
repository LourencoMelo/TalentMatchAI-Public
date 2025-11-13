import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Overview from "../pages/Overview";
import Homepage from "../pages/Homepage";

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/overview" element={<Overview />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
