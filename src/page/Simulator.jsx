import { useState } from "react";
import Parameter from "../components/parameter";

function Simulator() {
  const [selectedAlgo, setSelectedAlgo] = useState([]);

  const algorithms = [
    "First Come First Serve",
    "Highest Response Ratio Next",
    "Shortest Remaining Time First",
    "Multilevel Queue With Feedback",
    "Round Robin",
    "Shortest Job First",
    "Priority",
  ];

  const toggleSelection = (algo) => {
    setSelectedAlgo((prevSelected) =>
      prevSelected.includes(algo)
        ? prevSelected.filter((item) => item !== algo) // ถ้าเลือกแล้วให้เอาออก
        : [...prevSelected, algo] // ถ้ายังไม่ได้เลือกให้เพิ่มเข้าไป
    );
  };

  return (
    <div className="mx-2 sm:mx-3 md:mx-5 mt-4 md:mt-7 h-[80vh] border border-red-500 flex flex-col overflow-hidden">
      <div className="py-2 px-2 sm:px-4 flex items-center gap-2 border border-blue-500">
        <h3 className="text-lg sm:text-xl md:text-2xl lg:text-[20pt] font-bold">Choose Schedule Algorithm</h3>
      </div>
      
      <div className="border border-red-500 flex items-center overflow-x-auto md:overflow-visible py-2">
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 p-2 w-full">
          {algorithms.map((algo) => (
            <button
              key={algo}
              onClick={() => toggleSelection(algo)}
              className={`px-3 sm:px-4 md:px-6 py-1 sm:py-2 border rounded-full text-xs sm:text-sm md:text-base lg:text-lg xl:text-[16pt] transition-all duration-300 ease-in-out transform
              ${
                selectedAlgo.includes(algo)
                  ? "bg-blue-500 text-white ring-2 md:ring-4 ring-white-700 shadow-lg"
                  : "bg-gray-100 text-black ring-0 scale-100 shadow-none"
              }
              hover:bg-gray-200 focus:outline-none`}
            >
              {algo}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 border border-blue-500 overflow-auto">
        {/* ส่ง selectedAlgo เข้าไปใน Parameter */}
        <Parameter selectedAlgo={selectedAlgo} />
      </div>
    </div>
  );
}

export default Simulator;