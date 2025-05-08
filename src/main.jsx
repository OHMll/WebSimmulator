import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import Menubar from "./components/menubar";  // ตรวจสอบ path ว่าตรงกับโครงสร้างโปรเจคของคุณ
import Homepage from "./page/Home";
import Overview from "./page/Overview";
import Simulator from "./page/Simulator";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <div className="flex flex-col h-screen w-screen">
        {/* Menubar */}
        <div>
          <Menubar />
        </div>

        {/* เนื้อหา */}
        <div className="flex-1 overflow-hidden">
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/overview" element={<Overview />} />
            <Route path="/simulator" element={<Simulator />} />
          </Routes>
        </div>
      </div>
    </Router>
  </StrictMode>
);
