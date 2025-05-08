import React, { useState, useEffect } from "react";
import Fcfs from"./FCFS";
import Hrrn from "./HRRN";
import mlfq from "./MLQF"; 
import Priority from "./Priority";
import RR from "./RR";
import Sjf from "./SJF";
import srtf from "./SRTF";
import { useNavigate } from 'react-router-dom';
import { avg } from "./AverageAlgo";

// Component สำหรับ Input ที่มี label prefix และแสดง error
const InputField = ({
  label,
  inputId,
  validateInput,
  error,
  isRight,
  value,
  readOnly,
  noPlaceholder,
}) => {
  // ปรับ padding และความกว้างตามประเภทของฟิลด์
  let inputPadding = isRight ? "pl-24" : "pl-32";
  let labelClass = isRight ? "w-48 whitespace-nowrap" : "";
  let inputWidth = isRight ? "w-[60%]" : "w-[70%]";

  // ปรับพิเศษสำหรับฟิลด์ Time Quantum in RR และ Level of Time Quantum in MLQF
  if (inputId === "timeQuantumMLOF") {
    labelClass = "w-60 whitespace-nowrap"; // เพิ่มความกว้างให้กับ label
    inputPadding = "pl-72"; // เพิ่ม padding ซ้ายให้มากขึ้น
    inputWidth = "w-[90%]"; // เพิ่มความกว้างให้กับ container
  }
  if (inputId == "timeQuantumRR") {
    labelClass = "w-60 whitespace-nowrap"; // เพิ่มความกว้างให้กับ label
    inputPadding = "pl-52"; // เพิ่ม padding ซ้ายให้มากขึ้น
    inputWidth = "w-[90%]"; // เพิ่มความกว้างให้กับ container
  }

  return (
    <div className={inputWidth}>
      <div className="relative">
        <span
          className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-[12pt] text-black pointer-events-none ${labelClass}`}
        >
          {label} :
        </span>
        <input
          type="text"
          placeholder={noPlaceholder ? "" : "e.g. 1,2,3"}
          pattern="^[0-9]{0,2}$"
          maxLength="2"
          value={value}
          readOnly={readOnly}
          onChange={(e) => validateInput(e, inputId)}
          onInput={(e) => validateInput(e, inputId)}
          className={`${inputPadding} pr-5 py-3 bg-[#3F72AF4D] rounded-md border-slate-300 text-[12pt] shadow-md placeholder-slate-400
            focus:outline-none focus:ring-2 focus:ring-[#3F72AF]
            invalid:border-[#FA494C] invalid:text-[#FA494C] invalid:bg-[#FFC9CA]
            focus:invalid:border-[#FA494C] focus:invalid:ring-[#FA494C]
            ${isRight ? "w-full" : "w-full"}`}
        />
      </div>
      {error && <p className="text-[#FA494C] text-xs mt-1">{error}</p>}
    </div>
  );
};

function Parameter({ selectedAlgo }) {
  const navigate = useNavigate();
  const [inputErrors, setInputErrors] = useState({
    startTime: "",
    burstTime: "",
    priority: "",
    timeQuantumRR: "",
    timeQuantumMLOF: "",
    first: "",
    second: "",
    third: "",
    numberOfProcess: "",
  });

  const [inputValues, setInputValues] = useState({
    startTime: "",
    burstTime: "",
    priority: "",
    timeQuantumRR: "",
    first: "",
    second: "",
    third: "",
    numberOfProcess: "3", // ค่าเริ่มต้น
  });

  const [processList, setProcessList] = useState([]);
  const [processIdCounter, setProcessIdCounter] = useState(1);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  // โหลดข้อมูลจาก localStorage เมื่อ component ถูกโหลด - ด้วย useEffect ที่ทำงานเพียงครั้งเดียว
  useEffect(() => {
    const loadDataFromLocalStorage = () => {
      try {
        const savedInputValues = localStorage.getItem("inputValues");
        const savedProcessList = localStorage.getItem("processList");
        const savedProcessIdCounter = localStorage.getItem("processIdCounter");

        if (savedInputValues) {
          setInputValues(JSON.parse(savedInputValues));
        }

        if (savedProcessList) {
          setProcessList(JSON.parse(savedProcessList));
        }

        if (savedProcessIdCounter) {
          setProcessIdCounter(parseInt(savedProcessIdCounter));
        }
        
        // Set flag that initial load is done
        setInitialLoadDone(true);
      } catch (error) {
        console.error("Error loading data from localStorage:", error);
      }
    };

    loadDataFromLocalStorage();
  }, []);

  // บันทึกข้อมูลลงใน localStorage ทุกครั้งที่มีการเปลี่ยนแปลง - แต่เฉพาะหลังจากที่โหลดข้อมูลเสร็จแล้ว
  useEffect(() => {
    if (initialLoadDone) {
      localStorage.setItem("inputValues", JSON.stringify(inputValues));
    }
  }, [inputValues, initialLoadDone]);

  useEffect(() => {
    if (initialLoadDone) {
      localStorage.setItem("processList", JSON.stringify(processList));
      localStorage.setItem("processIdCounter", processIdCounter.toString());
    }
  }, [processList, processIdCounter, initialLoadDone]);

  const validateInput = (e, inputId) => {
    const value = e.target.value;
    const isValid = !value || /^[0-9]*$/.test(value);
    e.target.setCustomValidity(isValid ? "" : "Please input only number");

    setInputErrors((prev) => ({
      ...prev,
      [inputId]: isValid ? "" : "Please input only number",
    }));

    setInputValues((prev) => ({
      ...prev,
      [inputId]: value,
    }));
  };

  const addProcess = () => {
    // ตรวจสอบว่ามีข้อมูลครบถ้วนหรือไม่
    if (
      !inputValues.startTime ||
      !inputValues.burstTime ||
      !inputValues.priority
    ) {
      alert("Please fill in all required fields");
      return;
    }

    // สร้าง process ใหม่
    const newProcess = {
      id: `00${processIdCounter}`,
      startTime: inputValues.startTime,
      burstTime: inputValues.burstTime,
      priority: inputValues.priority,
      timeQuantumRR: showRoundRobin ? inputValues.timeQuantumRR : "-",
      timeQuantumMLQF: showMLQF ? inputValues.second || "2" : "-",
    };

    // เพิ่ม process ใหม่เข้าไปใน list
    setProcessList([...processList, newProcess]);
    setProcessIdCounter(processIdCounter + 1);

    // ล้างค่า input fields
    setInputValues({
      ...inputValues,
      startTime: "",
      burstTime: "",
      priority: "",
    });
  };

  const removeProcess = (id) => {
    const updatedList = processList.filter((process) => process.id !== id);
    setProcessList(updatedList);
  };

  const resetProcessList = () => {
    setProcessList([]);
    setProcessIdCounter(1);
  };

  const generateRandomProcesses = () => {
    // ใช้ค่าจาก input field "Number of Process"
    const count = parseInt(inputValues.numberOfProcess) || 3; // ถ้าไม่ใช่ตัวเลขหรือเป็นค่าว่าง ใช้ค่าเริ่มต้นเป็น 3

    if (count <= 0 || count > 10) {
      alert("Please enter a valid number between 1 and 10");
      return;
    }

    const newProcesses = [];

    for (let i = 0; i < count; i++) {
      // สร้างค่า Time Quantum(RR) และ Time Quantum(MLQF) แบบสุ่ม
      const randomTimeQuantumRR = Math.floor(Math.random() * 10) + 1; // สุ่มค่าระหว่าง 1-10

      // สร้างค่า Time Quantum สำหรับ MLQF แต่ละ level
      const randomFirst = Math.floor(Math.random() * 5) + 1; // สุ่มค่า 1st level ระหว่าง 1-5
      const randomSecond = Math.floor(Math.random() * 5) + 1; // สุ่มค่า 2nd level ระหว่าง 1-5
      const randomThird = Math.floor(Math.random() * 5) + 1; // สุ่มค่า 3rd level ระหว่าง 1-5

      // สร้าง timeQuantumMLQF string แสดงค่าทั้ง 3 level
      const timeQuantumMLQF = showMLQF
        ? `${randomFirst},${randomSecond},${randomThird}`
        : "-";

      newProcesses.push({
        id: `00${processIdCounter + i}`,
        startTime: Math.floor(Math.random() * 10),
        burstTime: Math.floor(Math.random() * 10) + 1,
        priority: Math.floor(Math.random() * 10),
        timeQuantumRR: showRoundRobin ? randomTimeQuantumRR.toString() : "-",
        timeQuantumMLQF: timeQuantumMLQF,
      });
    }

    setProcessList([...processList, ...newProcesses]);
    setProcessIdCounter(processIdCounter + count);
  };

  const startSimulation = () => {
    if (processList.length === 0) {
      alert("Please add at least one process before starting simulation");
      return;
    }
    
    // Transform process list data to the format needed by algorithms
    const processData = processList.map((process) => [
      process.id,
      parseInt(process.startTime),
      parseInt(process.burstTime),
      parseInt(process.priority) // Include priority for algorithms that need it
    ]);
    
    console.log("Input to algorithms:", processData);
    
    try {
      let algorithm = "";
      const algorithmData = [];
      
      // Run selected algorithm(s)
      if (selectedAlgo.includes("First Come First Serve")) {
        algorithm = "FCFS";
        const [waitingTimes, turnaroundTimes, contextData] = Fcfs(processData);
        
        // ใช้ฟังก์ชั่น avg() จาก AverageAlgo.jsx เพื่อคำนวณค่าเฉลี่ย
        const avgWaitingTime = avg(waitingTimes);
        const avgTurnaroundTime = avg(turnaroundTimes);
        
        // Store FCFS results
        algorithmData.push({
          name: "FCFS",
          waitingTimes,
          turnaroundTimes,
          contextData,
          avgWaitingTime,
          avgTurnaroundTime
        });
        
        console.log("FCFS Results:", { waitingTimes, turnaroundTimes, contextData });
        console.log("AvgW: ", avgWaitingTime);
        console.log("AvgT: ", avgTurnaroundTime);
      }
      
      if (selectedAlgo.includes("Highest Response Ratio Next")) {
        algorithm = selectedAlgo.length > 1 ? algorithm + "+HRRN" : "HRRN";
        const [waitingTimes, turnaroundTimes, contextData] = Hrrn(processData);
        
        // ใช้ฟังก์ชั่น avg() จาก AverageAlgo.jsx
        const avgWaitingTime = avg(waitingTimes);
        const avgTurnaroundTime = avg(turnaroundTimes);
        
        // Store HRRN results
        algorithmData.push({
          name: "HRRN",
          waitingTimes,
          turnaroundTimes,
          contextData,
          avgWaitingTime,
          avgTurnaroundTime
        });
        
        console.log("HRRN Results:", { waitingTimes, turnaroundTimes, contextData });
        console.log("AvgW: ", avgWaitingTime);
        console.log("AvgT: ", avgTurnaroundTime);
      }
      
      if (selectedAlgo.includes("Priority")) {
        algorithm = selectedAlgo.length > 1 ? algorithm + "+Priority" : "Priority";
        const [waitingTimes, turnaroundTimes, contextData] = Priority(processData);
        
        // ใช้ฟังก์ชั่น avg() จาก AverageAlgo.jsx
        const avgWaitingTime = avg(waitingTimes);
        const avgTurnaroundTime = avg(turnaroundTimes);
        
        // Store Priority results
        algorithmData.push({
          name: "Priority",
          waitingTimes,
          turnaroundTimes,
          contextData,
          avgWaitingTime,
          avgTurnaroundTime
        });
        
        console.log("Priority Results:", { waitingTimes, turnaroundTimes, contextData });
        console.log("AvgW: ", avgWaitingTime);
        console.log("AvgT: ", avgTurnaroundTime);
      }
      
      if (selectedAlgo.includes("Round Robin")) {
        algorithm = selectedAlgo.length > 1 ? algorithm + "+RR" : "RR";
        
        // Get time quantum value for RR
        const timeQuantum = parseInt(inputValues.timeQuantumRR) || 3; // Default to 3 if not specified
        
        const [waitingTimes, turnaroundTimes, contextData] = RR(processData, timeQuantum);
        
        // ใช้ฟังก์ชั่น avg() จาก AverageAlgo.jsx
        const avgWaitingTime = avg(waitingTimes);
        const avgTurnaroundTime = avg(turnaroundTimes);
        
        // Store RR results
        algorithmData.push({
          name: "RR",
          waitingTimes,
          turnaroundTimes,
          contextData,
          avgWaitingTime,
          avgTurnaroundTime
        });
        
        console.log("RR Results:", { waitingTimes, turnaroundTimes, contextData });
        console.log("AvgW: ", avgWaitingTime);
        console.log("AvgT: ", avgTurnaroundTime);
      }
      
      if (selectedAlgo.includes("Shortest Job First")) {
        algorithm = selectedAlgo.length > 1 ? algorithm + "+SJF" : "SJF";
        
        const [waitingTimes, turnaroundTimes, contextData] = Sjf(processData);
        
        // ใช้ฟังก์ชั่น avg() จาก AverageAlgo.jsx
        const avgWaitingTime = avg(waitingTimes);
        const avgTurnaroundTime = avg(turnaroundTimes);
        
        // Store SJF results
        algorithmData.push({
          name: "SJF",
          waitingTimes,
          turnaroundTimes,
          contextData,
          avgWaitingTime,
          avgTurnaroundTime
        });
        
        console.log("SJF Results:", { waitingTimes, turnaroundTimes, contextData });
        console.log("AvgW: ", avgWaitingTime);
        console.log("AvgT: ", avgTurnaroundTime);
      }
      
      if (selectedAlgo.includes("Shortest Remaining Time First")) {
        algorithm = selectedAlgo.length > 1 ? algorithm + "+SRTF" : "SRTF";
        
        const [waitingTimes, turnaroundTimes, contextData] = srtf(processData);
        
        // ใช้ฟังก์ชั่น avg() จาก AverageAlgo.jsx
        const avgWaitingTime = avg(waitingTimes);
        const avgTurnaroundTime = avg(turnaroundTimes);
        
        // Store SRTF results
        algorithmData.push({
          name: "SRTF",
          waitingTimes,
          turnaroundTimes,
          contextData,
          avgWaitingTime,
          avgTurnaroundTime
        });
        
        console.log("SRTF Results:", { waitingTimes, turnaroundTimes, contextData });
        console.log("AvgW: ", avgWaitingTime);
        console.log("AvgT: ", avgTurnaroundTime);
      }
      
      if (selectedAlgo.includes("Multilevel Queue With Feedback")) {
        algorithm = selectedAlgo.length > 1 ? algorithm + "+MLQF" : "MLQF";
        
        // Get time quantum values for MLQF
        const t1 = parseInt(inputValues.first) || 5;  // Default to 5 if not specified
        const t2 = parseInt(inputValues.second) || 10; // Default to 10 if not specified
        const t3 = parseInt(inputValues.third) || 20;  // Default to 20 if not specified
        
        const [waitingTimes, turnaroundTimes, contextData] = mlfq(processData, t1, t2, t3);
        
        // ใช้ฟังก์ชั่น avg() จาก AverageAlgo.jsx
        const avgWaitingTime = avg(waitingTimes);
        const avgTurnaroundTime = avg(turnaroundTimes);
        
        // Store MLQF results
        algorithmData.push({
          name: "MLQF",
          waitingTimes,
          turnaroundTimes,
          contextData,
          avgWaitingTime,
          avgTurnaroundTime
        });
        
        console.log("MLQF Results:", { waitingTimes, turnaroundTimes, contextData });
        console.log("AvgW: ", avgWaitingTime);
        console.log("AvgT: ", avgTurnaroundTime);
      }
      
      // Get the last algorithm's results for backward compatibility
      const lastAlgo = algorithmData[algorithmData.length - 1];
      
      // Store results in localStorage
      localStorage.setItem("simulationResults", JSON.stringify({
        algorithm,
        waitingTimes: lastAlgo.waitingTimes,
        turnaroundTimes: lastAlgo.turnaroundTimes,
        contextData: lastAlgo.contextData,
        avgWaitingTime: lastAlgo.avgWaitingTime,
        avgTurnaroundTime: lastAlgo.avgTurnaroundTime,
        algorithmData // Store all algorithm data
      }));
      
      console.log(`Simulation completed!`);
      alert(`${algorithm} simulation completed! Check results in the Results page.`);
      
      // บันทึกข้อมูล process list ใหม่อีกครั้งก่อนไปหน้า results
      localStorage.setItem("processList", JSON.stringify(processList));
      
      // Navigate to results page
      navigate('/resultsim');
    } catch (error) {
      console.error("Error during simulation:", error);
      alert("An error occurred during simulation: " + error.message);
    }
  };
  
  

  // ตรวจสอบเงื่อนไขของอัลกอริทึมที่เลือก
  const showRoundRobin = selectedAlgo.includes("Round Robin");
  const showMLQF = selectedAlgo.includes("Multilevel Queue With Feedback");

  // useEffect นี้จะทำการเคลียร์ error ของทุก field ที่ไม่ได้แสดงอยู่
  useEffect(() => {
    setInputErrors((prev) => ({
      ...prev,
      timeQuantumRR: showRoundRobin ? prev.timeQuantumRR : "",
      timeQuantumMLOF: showMLQF ? prev.timeQuantumMLOF : "",
      first: showMLQF ? prev.first : "",
      second: showMLQF ? prev.second : "",
      third: showMLQF ? prev.third : "",
    }));
  }, [selectedAlgo, showRoundRobin, showMLQF]);

  return (
    <div className="w-[100%] h-[90%]">
      <div className="pl-3 text-[20pt] font-bold">
        <h1>Parameter Setting</h1>
      </div>
      <div className="h-[100%] flex justify-around p-5 rounded-[1rem] bg-[#FFFFFF90] gap-x-4 overflow-hidden">
        {/* คอลัมน์ซ้าย */}
        <div className="w-[45%]">
          <div>
            <h1 className="text-[14pt] pb-3">Customize Parameter</h1>
          </div>
          <div className="h-[100%] flex justify-around">
            {/* Left Column: Always visible */}
            <div className="flex flex-col justify-around w-[50%] h-[85%] border border-red-500">
              <InputField
                label="Start Time"
                inputId="startTime"
                validateInput={validateInput}
                error={inputErrors.startTime}
                value={inputValues.startTime}
              />
              <InputField
                label="Burst Time"
                inputId="burstTime"
                validateInput={validateInput}
                error={inputErrors.burstTime}
                value={inputValues.burstTime}
              />
              <InputField
                label="Priority"
                inputId="priority"
                validateInput={validateInput}
                error={inputErrors.priority}
                value={inputValues.priority}
              />
              <button
                className="w-[70%] bg-[#55A972] hover:bg-[#3b7650] transition-all duration-300 ease-in-out transform h-[15%] rounded-md text-white font-medium text-[16pt]"
                onClick={addProcess}
              >
                Add Process
              </button>
            </div>
            {/* Right Column: Rendered based on selected algorithms */}
            <div
              className="flex flex-col justify-start gap-y-3 p-4 w-[60%] h-[85%] overflow-y-auto"
              style={{ scrollbarGutter: "stable" }}
            >
              {showRoundRobin && (
                <InputField
                  label="Time Quantum in RR"
                  inputId="timeQuantumRR"
                  validateInput={validateInput}
                  error={inputErrors.timeQuantumRR}
                  value={inputValues.timeQuantumRR}
                  isRight
                />
              )}
              {showMLQF && (
                <>
                  <InputField
                    label="Level of Time Quantum in MLQF "
                    inputId="timeQuantumMLOF"
                    validateInput={validateInput}
                    error={inputErrors.timeQuantumMLOF}
                    readOnly
                    noPlaceholder
                    value="3"
                  />
                  <InputField
                    label="1st"
                    inputId="first"
                    validateInput={validateInput}
                    error={inputErrors.first}
                    value={inputValues.first}
                    isRight
                  />
                  <InputField
                    label="2nd"
                    inputId="second"
                    validateInput={validateInput}
                    error={inputErrors.second}
                    value={inputValues.second}
                    isRight
                  />
                  <InputField
                    label="3rd"
                    inputId="third"
                    validateInput={validateInput}
                    error={inputErrors.third}
                    value={inputValues.third}
                    isRight
                  />
                </>
              )}
              {!(showRoundRobin || showMLQF) && <div className="h-full"></div>}
            </div>
          </div>
        </div>
        {/* คอลัมน์ขวาสุด (Process List) */}
        <div className="w-[55%] flex flex-col">
          {/* Process List Header */}
          <div className="flex justify-between items-center mb-3">
            <h1 className="font text-[15pt]">Process List</h1>
            <button
              className="bg-[#8AB6D6] hover:bg-[#6494b5] px-4 py-1 rounded-md text-white text-[12pt]"
              onClick={resetProcessList}
            >
              reset
            </button>
          </div>

          {/* ส่วนการแสดงผลตาราง - ปรับ layout เป็น flex column ที่ชัดเจน */}
          <div className="flex flex-col h-[calc(100%-120px)]"> {/* กำหนดความสูงโดยการคำนวณเพื่อเหลือพื้นที่สำหรับ bottom controls */}
            {/* Header ของตาราง */}
            <div className="grid grid-cols-[20px_0.5fr_1fr_1fr_1fr_1fr_1fr] bg-[#8AB6D6] py-3 px-3 text-[12pt] font-bold text-center sticky top-0 z-10 rounded-t-md">
              <div></div>
              <div>Process ID</div>
              <div>Start Time</div>
              <div>Burst Time</div>
              <div>Priority</div>
              <div>Time Quantum(RR)</div>
              <div>Time Quantum(MLQF)</div>
            </div>

            {/* เนื้อหาของตาราง - ส่วนที่ scrollable */}
            <div className="flex-1 overflow-y-auto bg-[#D9E6F2] rounded-b-md shadow-md">
              {processList.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  No processes added yet
                </div>
              ) : (
                processList.map((process) => (
                  <div
                    key={process.id}
                    className="grid grid-cols-[20px_0.5fr_1fr_1fr_1fr_1fr_1fr] py-3 px-3 text-[11pt] text-center bg-white border-b border-gray-200"
                  >
                    <div className="flex justify-center items-center">
                      <button
                        onClick={() => removeProcess(process.id)}
                        className="text-gray-500 hover:text-red-500"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                    <div>{process.id}</div>
                    <div>{process.startTime}</div>
                    <div>{process.burstTime}</div>
                    <div>{process.priority}</div>
                    <div>{process.timeQuantumRR}</div>
                    <div>{process.timeQuantumMLQF}</div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* ส่วนล่างของ Process List - แยกออกมาจากส่วน scrollable ชัดเจน */}
          <div className="mt-4 pt-2 flex justify-between items-center">
            <div className="relative bg-[#D9E6F2] rounded-md py-2 px-4 flex items-center">
              <span className="text-[14pt] font-medium mr-2">
                Number of Generate Process:
              </span>
              <input
                type="text"
                id="numberOfProcess"
                value={inputValues.numberOfProcess}
                onChange={(e) => validateInput(e, "numberOfProcess")}
                className="w-12 py-1 px-2 bg-white rounded border border-gray-300 text-center text-[16pt]"
              />
            </div>

            <button
              className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 py-2 px-4 rounded-md text-white font-medium text-[14pt]"
              onClick={generateRandomProcesses}
            >
              Generate Process
            </button>

            <button
              className="bg-[#3F72AF] hover:bg-[#2d5682] py-2 px-4 rounded-md text-white font-medium text-[14pt]"
              onClick={startSimulation}
            >
              Start Simulation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Parameter;