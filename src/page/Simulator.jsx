import { useState, useEffect } from "react";
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

  // โหลดการตั้งค่าจาก localStorage เมื่อ component ถูกโหลด
  useEffect(() => {
    const savedAlgorithms = localStorage.getItem("selectedAlgorithms");
    if (savedAlgorithms) {
      setSelectedAlgo(JSON.parse(savedAlgorithms));
    }
  }, []);

  const toggleSelection = (algo) => {
    setSelectedAlgo((prevSelected) => {
      const newSelection = prevSelected.includes(algo)
        ? prevSelected.filter((item) => item !== algo) // ถ้าเลือกแล้วให้เอาออก
        : [...prevSelected, algo]; // ถ้ายังไม่ได้เลือกให้เพิ่มเข้าไป

      // บันทึกค่าลงใน localStorage
      localStorage.setItem("selectedAlgorithms", JSON.stringify(newSelection));
      return newSelection;
    });
  };

  return (
    <div className="px-3 sm:px-5 pt-4 sm:pt-7 h-screen sm:h-[80vh] flex flex-col">
      <div className="mb-4 sm:mb-0 sm:h-[10%] flex items-center gap-2 sm:gap-4 p-1 sm:p-2">
        <h3 className="text-lg sm:text-xl md:text-2xl lg:text-[20pt] font-bold">
          Choose Schedule Algorithm
        </h3>
      </div>
      <div className="sm:h-[25%] flex items-center overflow-x-auto sm:overflow-visible">
        <div className="w-full flex flex-wrap justify-center gap-2 sm:gap-x-4 sm:gap-y-4 p-2 sm:p-4">
          {algorithms.map((algo) => (
            <button
              key={algo}
              onClick={() => toggleSelection(algo)}
              className={`px-3 sm:px-4 md:px-6 py-1 sm:py-2 rounded-full text-sm sm:text-base md:text-lg lg:text-[16pt] transition-all duration-300 ease-in-out transform whitespace-nowrap
              ${
                selectedAlgo.includes(algo)
                  ? "bg-blue-500 text-white ring-2 sm:ring-4 ring-white-700 shadow-lg"
                  : "bg-gray-100 text-black ring-0 scale-100 shadow-none"
              }
              hover:bg-gray-200 focus:outline-none`}
            >
              {algo}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 sm:h-[65%] mt-4 sm:mt-0 overflow-y-auto">
        <Parameter selectedAlgo={selectedAlgo} />
      </div>
    </div>
  );
}

export default Simulator;
