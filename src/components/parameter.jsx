import React, { useState, useEffect } from "react";

// Component สำหรับ Input ที่มี label prefix และแสดง error
const InputField = ({
  label,
  inputId,
  validateInput,
  error,
  isRight,
  value,
  readOnly,
  noPlaceholder
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
  if (inputId == "timeQuantumRR" ){
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
  const [inputErrors, setInputErrors] = useState({
    startTime: "",
    burstTime: "",
    priority: "",
    timeQuantumRR: "",
    timeQuantumMLOF: "",
    first: "",
    second: "",
    third: "",
  });

  const validateInput = (e, inputId) => {
    const value = e.target.value;
    const isValid = !value || /^[0-9]*$/.test(value);
    e.target.setCustomValidity(isValid ? "" : "Please input only number");
    setInputErrors((prev) => ({
      ...prev,
      [inputId]: isValid ? "" : "Please input only number",
    }));
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
      <div className="pl-3 text-[20pt] font-bold border border-green-500">
        <h1>Parameter Setting</h1>
      </div>
      <div className="h-[100%] flex justify-around p-5 rounded-[1rem] bg-[#FFFFFF90] gap-x-4 overflow-hidden">
        {/* คอลัมน์ซ้าย */}
        <div className="border border-yellow-500 w-[45%]">
          <div className="border border-purple-700">
            <h1 className="text-[14pt] pb-3">Customize Parameter</h1>
          </div>
          <div className="h-[100%] flex justify-around">
            {/* Left Column: Always visible */}
            <div className="flex flex-col justify-around border border-pink-500 w-[50%] h-[85%]">
              <InputField
                label="Start Time"
                inputId="startTime"
                validateInput={validateInput}
                error={inputErrors.startTime}
              />
              <InputField
                label="Burst Time"
                inputId="burstTime"
                validateInput={validateInput}
                error={inputErrors.burstTime}
              />
              <InputField
                label="Priority"
                inputId="priority"
                validateInput={validateInput}
                error={inputErrors.priority}
              />
              <button className="border border-red-500 w-[40%] bg-[#55A972] hover:bg-[#3b7650] transition-all duration-300 ease-in-out transform h-[15%] rounded-md">
                Add Process
              </button>
            </div>
            {/* Right Column: Rendered based on selected algorithms */}
            <div
              className="flex flex-col justify-start gap-y-3 p-4 border border-pink-500 w-[60%] h-[85%] overflow-y-auto"
              style={{ scrollbarGutter: "stable" }}
            >
              {showRoundRobin && (
                <InputField
                  label="Time Quantum in RR"
                  inputId="timeQuantumRR"
                  validateInput={validateInput}
                  error={inputErrors.timeQuantumRR}
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
                    isRight
                  />
                  <InputField
                    label="2nd"
                    inputId="second"
                    validateInput={validateInput}
                    error={inputErrors.second}
                    isRight
                  />
                  <InputField
                    label="3rd"
                    inputId="third"
                    validateInput={validateInput}
                    error={inputErrors.third}
                    isRight
                  />
                </>
              )}
              {!(showRoundRobin || showMLQF) && <div className="h-full"></div>}
            </div>
          </div>
        </div>
        {/* คอลัมน์ขวาสุด (ว่างเปล่า) */}
        <div className="border border-yellow-500 w-[55%]"></div>
      </div>
    </div>
  );
}

export default Parameter;