// src/components/Infopopup.jsx
import React from "react";

const Infopopup = ({ closePopup }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity duration-300 ease-in-out opacity-100 z-50">
      <div className="bg-white p-6 rounded-lg w-[40%] h-[40%] animate-bounceUp relative z-60">
        <h2 className="text-[32pt] font-bold">Info Popup</h2>
        <p>This is a small info popup window!</p>
        
        {/* ปุ่ม Close อยู่มุมขวาล่าง */}
        <button 
          onClick={closePopup} 
          className="absolute bottom-4 right-4 px-4 py-2 bg-red-500 text-white rounded transition-all duration-300 hover:bg-red-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Infopopup;
