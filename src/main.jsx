import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import "./index.css";
import Menubar from "./components/menubar";  // ตรวจสอบ path ว่าตรงกับโครงสร้างโปรเจคของคุณ
import Homepage from "./page/Home";
import Overview from "./page/Overview";
import Simulator from "./page/Simulator";
import ResultSim from "./page/Resultsim"; // สมมติไฟล์อยู่ใน /page เหมือนหน้าอื่น


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <Menubar /> {/* แสดงเมนูบาร์ในทุกหน้า */}
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/overview" element={<Overview />} />
        <Route path="/simulator" element={<Simulator />} />
        <Route path="/resultsim" element={<ResultSim />} />
      </Routes>
    </Router>
  </StrictMode>
);
