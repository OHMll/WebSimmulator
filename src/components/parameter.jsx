import React, { useState, useEffect, useRef } from "react";
import Fcfs from "./FCFS";
import Hrrn from "./HRRN";
import mlfq from "./MLQF";
import Priority from "./Priority";
import RR from "./RR";
import Sjf from "./SJF";
import srtf from "./SRTF";
import { useNavigate } from "react-router-dom";
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
  // Responsive padding and width based on screen size - ปรับค่า padding ให้เพิ่มขึ้น
  let inputPadding = isRight
    ? "pl-14 sm:pl-20 md:pl-24 lg:pl-28"
    : "pl-20 sm:pl-24 md:pl-28 lg:pl-36";
  let labelClass = isRight
    ? "w-24 sm:w-32 md:w-40 lg:w-48 whitespace-nowrap"
    : "";
  let inputWidth = isRight ? "w-full sm:w-[60%]" : "w-full sm:w-[70%]";

  // คงคำว่า e.g. ไว้ในข้อความ placeholder
  let placeholder = noPlaceholder ? "" : "e.g. 1,2,3";

  // Special adjustments for specific fields
  if (inputId === "timeQuantumMLOF") {
    labelClass = "w-48 sm:w-56 md:w-64 lg:w-80 whitespace-nowrap"; // เพิ่มความกว้างของ label ให้มากขึ้น
    inputPadding = "pl-52 sm:pl-60 md:pl-72 lg:pl-86"; // เพิ่ม padding-left ของ input ให้มากขึ้น
    inputWidth = "w-full sm:w-[85%] md:w-[90%]";
  }
  if (inputId === "timeQuantumRR") {
    labelClass = "w-40 sm:w-48 md:w-52 lg:w-60 whitespace-nowrap";
    inputPadding = "pl-36 sm:pl-44 md:pl-48 lg:pl-56";
    inputWidth = "w-full sm:w-[80%] md:w-[90%]";
    placeholder = "e.g. 1,2,3";
  }

  return (
    <div className={`${inputWidth} mb-2 sm:mb-0`}>
      <div className="relative">
        <span
          className={`absolute left-1 sm:left-2 md:left-3 top-1/2 transform -translate-y-1/2 text-xs sm:text-sm md:text-base lg:text-[12pt] text-black pointer-events-none ${labelClass}`}
        >
          {label} :
        </span>
        <input
          type="text"
          placeholder={placeholder}
          pattern="^[0-9]*$"
          maxLength="2"
          value={value}
          readOnly={readOnly}
          onChange={(e) => validateInput(e, inputId)}
          onInput={(e) => validateInput(e, inputId)}
          className={`${inputPadding} pr-4 sm:pr-5 md:pr-6 py-2 sm:py-3 bg-[#3F72AF4D] rounded-md border-slate-300 text-xs sm:text-sm md:text-base lg:text-[12pt] shadow-md placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-[#3F72AF]
            invalid:border-[#FA494C] invalid:text-[#FA494C] invalid:bg-[#FFC9CA]
            focus:invalid:border-[#FA494C] focus:invalid:ring-[#FA494C]
            w-full`}
        />
      </div>
      {error && <p className="text-[#FA494C] text-xs mt-1">{error}</p>}
    </div>
  );
};

function Parameter({ selectedAlgo, setSelectedAlgo }) {
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
  const rrQuantumRef = useRef(null);
  const mlqfQuantumRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // State for mobile view management
  const [showRightColumn, setShowRightColumn] = useState(false);

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

  useEffect(() => {
    // sync rrQuantumRef และ mlqfQuantumRef กับ processList ที่โหลดมา
    if (processList.length > 0) {
      rrQuantumRef.current = processList[0].timeQuantumRR;
      mlqfQuantumRef.current = processList[0].timeQuantumMLQF;
    }
  }, [processList]);

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

  const formatProcessId = (id) => {
    // แปลง id เป็นตัวเลข
    const numId = parseInt(id);
    // ถ้าเป็นเลขหลักเดียว เพิ่ม 00
    if (numId < 10) {
      return `00${numId}`;
    }
    // ถ้าเป็นเลขสองหลักขึ้นไป เพิ่ม 0
    return `0${numId}`;
  };

  const addProcess = () => {
    // ตรวจสอบว่ามีข้อมูลครบถ้วนหรือไม่ โดยเช็คเฉพาะฟิลด์ที่จำเป็น
    if (!inputValues.startTime || !inputValues.burstTime) {
      alert("Please fill in all required fields");
      return;
    }

    // ถ้าเลือก Priority แต่ไม่ได้กรอกค่า Priority
    if (showPriority && !inputValues.priority) {
      alert("Please fill in priority value");
      return;
    }

    // สร้าง process ใหม่
    const newProcess = {
      id: formatProcessId(processIdCounter),
      startTime: inputValues.startTime,
      burstTime: inputValues.burstTime,
      priority: showPriority ? inputValues.priority : "-",
      timeQuantumRR: showRoundRobin ? inputValues.timeQuantumRR : "-",
      timeQuantumMLQF: showMLQF
        ? `${inputValues.first || "1"},${inputValues.second || "2"},${
            inputValues.third || "3"
          }`
        : "-",
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

    // Return to main inputs on mobile after adding
    setShowRightColumn(false);
  };

  const removeProcess = (id) => {
    const updatedList = processList.filter((process) => process.id !== id);
    setProcessList(updatedList);

    // ถ้าลบจนหมด ให้รีเซ็ต processIdCounter
    if (updatedList.length === 0) {
      setProcessIdCounter(1);
    }
  };

  const resetProcessList = () => {
    setProcessList([]);
    setProcessIdCounter(1);
    setInputValues({
      ...inputValues,
      startTime: "",
      burstTime: "",
      priority: "",
    });
    setSelectedAlgo([]); // reset algorithm ที่เลือกด้วย
    rrQuantumRef.current = null;
    mlqfQuantumRef.current = null;
  };

  const generateRandomProcesses = () => {
    if (isGenerating) return;
    setIsGenerating(true);
    const count = parseInt(inputValues.numberOfProcess) || 3;
    if (count <= 0) {
      //ใส่เท่าไหร่ก็ได้
      alert("Please enter a valid number");
      setIsGenerating(false);
      return;
    }
    let startId = processList.length === 0 ? 1 : processIdCounter;

    const rawBurstTimes = [];
    for (let i = 0; i < count; i++) {
      rawBurstTimes.push(Math.floor(Math.random() * (200 - 5 + 1)) + 5);
    }

    const averageBurstTime =
      rawBurstTimes.reduce((sum, bt) => sum + bt, 0) / rawBurstTimes.length;

    // ถ้ามี processList อยู่แล้ว ให้ใช้ Time Quantum เดิม
    if (processList.length > 0) {
      rrQuantumRef.current = processList[0].timeQuantumRR;
      mlqfQuantumRef.current = processList[0].timeQuantumMLQF;
    } else {
      // ถ้าไม่มี process ให้สุ่มใหม่
      rrQuantumRef.current = Math.floor(averageBurstTime / 4);
      const randomFirst = Math.floor(Math.random() * 11) + 1;
      const randomSecond = randomFirst * 2;
      const randomThird = randomFirst * 4;
      mlqfQuantumRef.current = `${randomFirst},${randomSecond},${randomThird}`;
    }

    const newProcesses = [];
    for (let i = 0; i < count; i++) {
      newProcesses.push({
        id: formatProcessId(startId + i),
        startTime: Math.floor(Math.random() * 51),
        burstTime: rawBurstTimes[i],
        priority: showPriority ? Math.floor(Math.random() * 50) + 1 : "-", // เพิ่มเงื่อนไขการ generate priority
        timeQuantumRR: showRoundRobin ? rrQuantumRef.current.toString() : "-",
        timeQuantumMLQF: showMLQF ? mlqfQuantumRef.current : "-",
      });
    }

    setProcessList([...processList, ...newProcesses]);
    setProcessIdCounter(startId + count);
    setIsGenerating(false);
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
      parseInt(process.priority), // Include priority for algorithms that need it
    ]);

    console.log("Input to algorithms:", processData);

    try {
      let algorithm = "";
      const algorithmData = [];

      // Run selected algorithm(s)
      if (selectedAlgo.includes("First-Come First-Serve")) {
        console.log(Fcfs(processData));
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
          avgTurnaroundTime,
        });

        console.log("FCFS Results:", {
          waitingTimes,
          turnaroundTimes,
          contextData,
        });
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
          avgTurnaroundTime,
        });

        console.log("HRRN Results:", {
          waitingTimes,
          turnaroundTimes,
          contextData,
        });
        console.log("AvgW: ", avgWaitingTime);
        console.log("AvgT: ", avgTurnaroundTime);
      }

      if (selectedAlgo.includes("Priority")) {
        algorithm =
          selectedAlgo.length > 1 ? algorithm + "+Priority" : "Priority";
        const [waitingTimes, turnaroundTimes, contextData] =
          Priority(processData);

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
          avgTurnaroundTime,
        });

        console.log("Priority Results:", {
          waitingTimes,
          turnaroundTimes,
          contextData,
        });
        console.log("AvgW: ", avgWaitingTime);
        console.log("AvgT: ", avgTurnaroundTime);
      }

      if (selectedAlgo.includes("Round Robin")) {
        algorithm = selectedAlgo.length > 1 ? algorithm + "+RR" : "RR";
        // ดึง time quantum จาก processList ตัวแรกที่มีอยู่จริง
        let timeQuantum = null;
        if (processList.length > 0) {
          timeQuantum = parseInt(processList[0].timeQuantumRR);
        }
        if (!timeQuantum) {
          alert("กรุณา Generate Process หรือกรอก Time Quantum ให้ถูกต้องก่อน");
          return;
        }
        const [waitingTimes, turnaroundTimes, contextData] = RR(
          processData,
          timeQuantum
        );

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
          avgTurnaroundTime,
        });

        console.log("RR Results:", {
          waitingTimes,
          turnaroundTimes,
          contextData,
        });
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
          avgTurnaroundTime,
        });

        console.log("SJF Results:", {
          waitingTimes,
          turnaroundTimes,
          contextData,
        });
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
          avgTurnaroundTime,
        });

        console.log("SRTF Results:", {
          waitingTimes,
          turnaroundTimes,
          contextData,
        });
        console.log("AvgW: ", avgWaitingTime);
        console.log("AvgT: ", avgTurnaroundTime);
      }

      if (selectedAlgo.includes("Multilevel Queue With Feedback")) {
        algorithm = selectedAlgo.length > 1 ? algorithm + "+MLQF" : "MLQF";

        // ดึง time quantum MLQF จาก processList ตัวแรกที่มีอยู่จริง
        let mlqfQuantum = null;
        if (processList.length > 0) {
          mlqfQuantum = processList[0].timeQuantumMLQF;
        }
        if (!mlqfQuantum) {
          alert(
            "กรุณา Generate Process หรือกรอก Time Quantum MLQF ให้ถูกต้องก่อน"
          );
          return;
        }
        // แยกค่า MLQF เป็น t1, t2, t3
        const [t1, t2, t3] = mlqfQuantum.split(",").map(Number);
        if (!t1 || !t2 || !t3) {
          alert("Time Quantum MLQF ไม่ถูกต้อง กรุณาตรวจสอบข้อมูล");
          return;
        }
        const [waitingTimes, turnaroundTimes, contextData] = mlfq(
          processData,
          t1,
          t2,
          t3
        );

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
          avgTurnaroundTime,
        });

        console.log("MLQF Results:", {
          waitingTimes,
          turnaroundTimes,
          contextData,
        });
        console.log("AvgW: ", avgWaitingTime);
        console.log("AvgT: ", avgTurnaroundTime);
      }

      // Get the last algorithm's results for backward compatibility
      const lastAlgo = algorithmData[algorithmData.length - 1];

      // Store results in localStorage
      localStorage.setItem(
        "simulationResults",
        JSON.stringify({
          algorithm,
          waitingTimes: lastAlgo.waitingTimes,
          turnaroundTimes: lastAlgo.turnaroundTimes,
          contextData: lastAlgo.contextData,
          avgWaitingTime: lastAlgo.avgWaitingTime,
          avgTurnaroundTime: lastAlgo.avgTurnaroundTime,
          algorithmData, // Store all algorithm data
        })
      );

      console.log(`Simulation completed!`);
      // บันทึกข้อมูล process list ใหม่อีกครั้งก่อนไปหน้า results
      localStorage.setItem("processList", JSON.stringify(processList));

      // Navigate to results page
      navigate("/resultsim");
    } catch (error) {
      console.error("Error during simulation:", error);
      alert("An error occurred during simulation: " + error.message);
    }
  };

  // ตรวจสอบเงื่อนไขของอัลกอริทึมที่เลือก
  const showPriority = selectedAlgo.includes("Priority");
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

  // Function to toggle between main inputs and advanced settings on mobile
  const toggleRightColumn = () => {
    setShowRightColumn(!showRightColumn);
  };

  return (
    <div className="w-full h-[90%]">
      <div className="pl-3 pb-3 text-base sm:text-lg md:text-xl lg:text-[20pt] font-bold">
        <h1>Parameter Setting</h1>
      </div>

      {/* Main content container */}
      <div className="h-[95%] flex flex-col lg:flex-row justify-around p-2 sm:p-3 md:p-4 lg:p-5 rounded-lg bg-[#FFFFFF90] gap-2 sm:gap-3 md:gap-4 overflow-y-auto lg:overflow-hidden">
        {/* Left column (Parameter settings) */}
        <div className="w-full lg:w-[45%] mb-4 lg:mb-0">
          <div>
            <h1 className="text-sm sm:text-base md:text-lg lg:text-[14pt] pb-2 sm:pb-3">
              Customize parameters
            </h1>

            {/* Mobile view toggle button - Changed text from "Advanced Settings" to "Time Quantum Setting" */}
            {(showRoundRobin || showMLQF) && (
              <button
                className="lg:hidden mb-2 bg-blue-500 text-white px-3 py-1 rounded-md text-sm"
                onClick={toggleRightColumn}
              >
                {showRightColumn
                  ? "← Back to Basic Settings"
                  : "Time Quantum Setting →"}
              </button>
            )}
          </div>

          <div className="flex flex-col lg:flex-row justify-around">
            {/* Left Column inputs - hidden on mobile when showing right column */}
            <div
              className={`flex flex-col justify-around gap-2 w-full lg:w-[50%] ${
                showRightColumn ? "hidden lg:flex" : ""
              }`}
            >
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
              {showPriority && (
                <InputField
                  label="Priority"
                  inputId="priority"
                  validateInput={validateInput}
                  error={inputErrors.priority}
                  value={inputValues.priority}
                />
              )}
              <button
                className="w-full lg:w-[70%] bg-[#55A972] hover:bg-[#3b7650] transition-all duration-300 ease-in-out transform py-2 rounded-md text-white font-medium text-sm sm:text-base md:text-lg lg:text-[16pt]"
                onClick={addProcess}
              >
                Add Process
              </button>
            </div>

            {/* Right Column - shown on mobile only when toggled, always visible on desktop */}
            <div
              className={`flex flex-col justify-start gap-y-2 sm:gap-y-3 py-1 px-1 sm:p-2 w-full lg:w-[60%] ${
                showRightColumn || (!showRoundRobin && !showMLQF)
                  ? ""
                  : "hidden lg:flex"
              }`}
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
                  <div className="text-sm sm:text-base md:text-lg lg:text-[13pt] font-medium">
                    Level of Time Quantum in MLQF : 3
                  </div>
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

        {/* Right column (Process List) */}
        <div className="w-full lg:w-[55%] flex flex-col">
          {/* Process List Header */}
          <div className="flex justify-between items-center mb-2 sm:mb-3">
            <h1 className="font-medium text-sm sm:text-base md:text-lg lg:text-[15pt]">
              Process lists
            </h1>
            <button
              className="bg-[#8AB6D6] hover:bg-[#6494b5] px-2 sm:px-4 py-1 rounded-md text-white text-xs sm:text-sm md:text-base lg:text-[12pt]"
              onClick={resetProcessList}
            >
              reset
            </button>
          </div>

          {/* Table container with responsive design */}
          <div className="flex flex-col h-[calc(100%-150px)] sm:h-[calc(100%-120px)]">
            {/* Table header */}
            <div className="grid grid-cols-[20px_0.5fr_1fr_1fr_1fr_1fr_1fr] bg-[#8AB6D6] py-2 px-2 text-xs sm:text-sm md:text-base lg:text-[12pt] font-bold text-center sticky top-0 z-10 rounded-t-md overflow-x-auto">
              <div></div>
              <div>Process ID</div>
              <div>Start Time</div>
              <div>Burst Time</div>
              <div>Priority</div>
              <div>Time Quantum(RR)</div>
              <div>Time Quantum(MLQF)</div>
            </div>

            {/* Table content */}
            <div className="flex-1 overflow-y-auto overflow-x-auto bg-[#D9E6F2] rounded-b-md shadow-md">
              {processList.length === 0 ? (
                <div className="text-center py-4 text-gray-500 text-sm sm:text-base">
                  No processes added yet
                </div>
              ) : (
                processList.map((process) => (
                  <div
                    key={process.id}
                    className="grid grid-cols-[20px_0.5fr_1fr_1fr_1fr_1fr_1fr] py-2 px-2 text-xs sm:text-sm md:text-base lg:text-[11pt] text-center bg-white border-b border-gray-200"
                  >
                    <div className="flex justify-center items-center">
                      <button
                        onClick={() => removeProcess(process.id)}
                        className="text-gray-500 hover:text-red-500"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 sm:h-5 sm:w-5"
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

          {/* Bottom controls */}
          <div className="mt-3 pt-2 flex flex-col sm:flex-row justify-between items-center gap-2">
            <div className="relative bg-[#D9E6F2] rounded-md py-1 sm:py-2 px-2 sm:px-4 flex items-center w-full sm:w-auto">
              <span className="text-xs sm:text-sm md:text-base lg:text-[14pt] font-medium mr-1 sm:mr-2 whitespace-nowrap">
                Number of Generate Process:
              </span>
              <input
                type="text"
                id="numberOfProcess"
                value={inputValues.numberOfProcess}
                onChange={(e) => validateInput(e, "numberOfProcess")}
                className="w-8 sm:w-12 py-1 px-1 sm:px-2 bg-white rounded border border-gray-300 text-center text-xs sm:text-sm md:text-base lg:text-[12pt]"
              />
            </div>

            <div className="flex flex-wrap gap-2 justify-center sm:justify-end w-full sm:w-auto">
              <button
                className="bg-[#3F72AF] py-1 sm:py-2 px-2 sm:px-4 rounded-md text-white font-medium text-xs sm:text-sm md:text-base lg:text-[14pt] whitespace-nowrap"
                onClick={generateRandomProcesses}
              >
                Generate Process
              </button>

              <button
                className="bg-[#3F72AF] hover:bg-[#2d5682] py-1 sm:py-2 px-2 sm:px-4 rounded-md text-white font-medium text-xs sm:text-sm md:text-base lg:text-[14pt] whitespace-nowrap"
                onClick={startSimulation}
              >
                Start Simulation
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Parameter;