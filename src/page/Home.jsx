"use client";

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Elephant from "../img/elephants-nature.jpg";
import Cat1 from "../img/little-cat-sitting-grass.jpg";
import Cat2 from "../img/pets-beautiful-house-animal-gray.jpg";

function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeButton, setActiveButton] = useState("home");

  // ตรวจจับ URL และอัปเดต activeButton
  useEffect(() => {
    if (location.pathname === "/simulator") {
      setActiveButton("processScheduling");
    } else {
      setActiveButton("home"); // Reset เมื่อ refresh หรือเปลี่ยนไปหน้าอื่น
    }
  }, [location.pathname]);

  // ฟังก์ชันเปลี่ยนหน้า
  const handleButtonClick = (buttonId, path) => {
    setActiveButton(buttonId);
    navigate(path);
  };

  // ส่วนของ IconSlider
  const IconSlider = () => {
    const images = [
      <img
        key="elephant"
        src={Elephant || "/placeholder.svg"}
        alt="Elephant"
        className="w-full h-full object-cover rounded-lg"
      />,
      <img
        key="cat1"
        src={Cat1 || "/placeholder.svg"}
        alt="Cat1"
        className="w-full h-full object-cover rounded-lg"
      />,
      <img
        key="cat2"
        src={Cat2 || "/placeholder.svg"}
        alt="Cat2"
        className="w-full h-full object-cover rounded-lg"
      />,
    ];

    const [currentIconIndex, setCurrentIconIndex] = useState(0);

    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentIconIndex((prevIndex) => (prevIndex + 1) % images.length); // วนลูปจากรูปสุดท้ายไปยังรูปแรก
      }, 7000); // เปลี่ยนไอคอนทุก 7 วินาที

      return () => clearInterval(interval); // ทำความสะอาดเมื่อ component ถูกลบ
    }, []);

    return (
      <div className="relative w-full h-full flex justify-center items-center overflow-hidden z-10 rounded-lg">
        {/* เลื่อนภาพจากซ้ายไปขวา */}
        <div
          className="absolute w-full h-full flex transition-transform duration-1000"
          style={{
            transform: `translateX(-${currentIconIndex * 100}%)`, // เลื่อนภาพไปทางขวาตามลำดับ
            transition: "transform 1s ease-in-out", // การเลื่อนภาพที่ดูนุ่มนวล
          }}
        >
          {images.map((image, index) => (
            <div key={index} className="flex-shrink-0 w-full h-full">
              {image}
            </div>
          ))}
        </div>

        {/* วงกลมแสดงตำแหน่งไอคอนที่กำลังแสดง */}
        <div className="absolute bottom-2 flex justify-center w-full z-20">
          {images.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 md:w-3 md:h-3 mx-1 rounded-full cursor-pointer ${
                index === currentIconIndex ? "bg-blue-500" : "bg-gray-400"
              }`}
              onClick={() => setCurrentIconIndex(index)} // เมื่อคลิกจะเปลี่ยนไปที่ไอคอนที่ตรงกับตำแหน่ง
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto mt-2 md:mt-5 pt-2 md:pt-5 px-4 md:px-5 lg:px-8 relative max-w-7xl">
      <h1 className="text-xl md:text-2xl lg:text-[26pt] font-bold text-center z-30 mb-4 md:mb-6">
        Welcome to Website For Process Scheduling
      </h1>

      {/* ส่วนหลักของเนื้อหา - ปรับตัวตามขนาดหน้าจอ */}
      <div className="mt-4 md:mt-5 flex flex-col-reverse lg:flex-row lg:justify-between lg:items-stretch z-30 gap-6">
        {/* Steps Box - เต็มความกว้างบนมือถือ แต่ 50% บนจอใหญ่ */}
        <div className="w-full lg:w-[48%] h-auto rounded-[1rem] bg-[#FFFFFF] shadow-md flex flex-col p-4 md:p-6 lg:p-8 justify-center">         
          <div className="space-y-4 md:space-y-6 lg:space-y-8">
            <p className="text-base md:text-lg lg:text-xl py-2 md:py-3 transition ease-in-out delay-50 duration-500 hover:scale-105 hover:text-blue-500 flex items-center">
              <span>Step 1 : Choose Process Schedule</span>
            </p>
            <p className="text-base md:text-lg lg:text-xl py-2 md:py-3 transition ease-in-out delay-50 duration-500 hover:scale-105 hover:text-blue-500 flex items-center">
              <span>Step 2 : Setting Parameters</span>
            </p>
            <p className="text-base md:text-lg lg:text-xl py-2 md:py-3 transition ease-in-out delay-50 duration-500 hover:scale-105 hover:text-blue-500 flex items-center">              
              <span>Step 3 : Press Start Button to Simulate</span>
            </p>
          </div>
        </div>

        {/* Image Slider - เต็มความกว้างบนมือถือ แต่ 50% บนจอใหญ่ */}
        <div className="w-full lg:w-[48%] h-[30vh] md:h-[40vh] lg:h-[50vh] relative z-10 mb-4 lg:mb-0">
          <IconSlider />
        </div>
      </div>

      {/* ปุ่ม Try Now! - ปรับขนาดตามหน้าจอ */}
      <div className="my-6 md:my-10 flex justify-center">
        <button
          onClick={() => handleButtonClick("processScheduling", "/simulator")}
          className="transition ease-in-out delay-170 bg-[#004BA5] hover:-translate-y-1 hover:scale-110 hover:bg-blue-700 duration-300 w-[80%] sm:w-[60%] md:w-[40%] lg:w-[20%] py-3 md:py-4 font-bold text-base md:text-lg lg:text-xl rounded-md text-white z-20 shadow-lg"
        >
          Try Now!
        </button>
      </div>
    </div>
  );
}

export default Home;