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
    <div className="mr-5 ml-5 mt-7 h-[80vh] border border-red-500">
      <div className="h-[10%] flex items-center gap-4 border border-blue-500 p-2">
        <h3 className="text-[20pt] font font-bold">Choose Schedule Algorithm</h3>
      </div>
      <div className="h-[25%] border border-red-500 flex items-center">
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-4 p-4">
          {algorithms.map((algo) => (
            <button
              key={algo}
              onClick={() => toggleSelection(algo)}
              className={`px-6 py-2 border rounded-[5rem] text-[16pt] transition-all duration-300 ease-in-out transform
              ${
                selectedAlgo.includes(algo)
                  ? "bg-blue-500 text-white ring-4 ring-white-700 shadow-lg"
                  : "bg-gray-100 text-black ring-0 scale-100 shadow-none"
              }
              hover:bg-gray-200 focus:outline-none`}
            >
              {algo}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[65%] border border-blue-500">
        {/* ส่ง selectedAlgo เข้าไปใน Parameter */}
        <Parameter selectedAlgo={selectedAlgo} />
      </div>
    </div>
  );
}

export default Simulator;