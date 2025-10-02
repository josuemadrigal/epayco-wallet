import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "../Screens/Dashboard";

const RoutesComponent: React.FC = () => (
  <Routes>
    <Route path="/" element={<Dashboard />} />
  </Routes>
);

export default RoutesComponent;
