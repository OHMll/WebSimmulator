// src/components/Infopopup.jsx
import React from "react";

const Infopopup = ({ closePopup }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity duration-300 ease-in-out opacity-100 z-50">
      <div className="
        bg-white p-4 space-y-6 rounded-lg 
        w-full max-w-xs h-auto mx-2
        animate-bounceUp relative z-60
        md:p-6 md:space-y-[32px] md:w-[40%] md:h-[60%] md:max-w-none
      ">
        {/* ปุ่มกากบาทปิด popup */}
        <button
          onClick={closePopup}
          className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center text-gray-500 hover:text-red-500 text-xl font-bold rounded-full focus:outline-none z-70 md:top-4 md:right-4 md:w-8 md:h-8 md:text-2xl"
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold text-center md:text-[32pt] md:text-left">How to use??</h2>
        <div className="space-y-3 text-base md:space-y-[32px] md:text-xl">
          <p>Step 1 : User Choose an Algorithm</p>
          <p>Step 2 : Input Process Data or Generate process</p>
          <p>Step 3 : Click "Start Simulation" to see the result</p>
          <p>Step 4 : You can see the Gantt Chart and Process Information</p>
          <p>Step 5 : You can click on Magnifier to see more clearly</p>
          <p>Step 6 : You can adjust Time Quantum in MLFQ Algorithm</p>
        </div>
      </div>
    </div>
  );
};

export default Infopopup;
