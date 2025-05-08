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
      <img src={Elephant} alt="Elephant" />,
      <img src={Cat1} alt="Cat1" />,
      <img src={Cat2} alt="Cat2" />,
    ];

    const [currentIconIndex, setCurrentIconIndex] = useState(0);

    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentIconIndex((prevIndex) => (prevIndex + 1) % images.length); // วนลูปจากรูปสุดท้ายไปยังรูปแรก
      }, 7000); // เปลี่ยนไอคอนทุก 7 วินาที

      return () => clearInterval(interval); // ทำความสะอาดเมื่อ component ถูกลบ
    }, []);

    return (
      <div className="relative w-full h-full flex justify-center items-center overflow-hidden z-10">
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
              className={`w-3 h-3 mx-1 rounded-full cursor-pointer ${index === currentIconIndex ? "bg-blue-500" : "bg-gray-400"}`}
              onClick={() => setCurrentIconIndex(index)} // เมื่อคลิกจะเปลี่ยนไปที่ไอคอนที่ตรงกับตำแหน่ง
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="mt-5 pt-5 ml-5 mr-5 relative">
      <h1 className="text-[26pt] font-bold flex justify-center z-30">Welcome to Website For Process Scheduling</h1>

      <div className="mt-5 h-[50vh] flex justify-between items-center z-30">
        <div className="w-[50%] h-[100%] rounded-[1rem] bg-[#FFFFFF] flex flex-col p-8 justify-around">
          <p className="text-[24pt] transition ease-in-out delay-50 duration-500 hover:scale-105 hover:text-blue-500">
            Step 1 : Choose Process Schedule
          </p>
          <p className="text-[24pt] transition ease-in-out delay-50 duration-500 hover:scale-105 hover:text-blue-500">
            Step 2 : Setting Parameters
          </p>
          <p className="text-[24pt] transition ease-in-out delay-50 duration-500 hover:scale-105 hover:text-blue-500">
            Step 3 : Press Start Button to Simulate
          </p>
        </div>

        {/* ใส่ IconSlider ลงใน div นี้ */}
        <div className="w-[50%] h-[100%] relative z-10">
          <IconSlider />
        </div>
      </div>

      <div className="mt-10 h-[6vh] flex justify-center">
        <button
          onClick={() => handleButtonClick("processScheduling", "/simulator")}
          className="transition ease-in-out delay-170 bg-[#004BA5] hover:-translate-y-1 hover:scale-110 hover:bg-blue-700 duration-300 w-[15%] h-[100%] font-bold text-[15pt] rounded-md text-white z-20"
        >
          Try Now!
        </button>
      </div>
    </div>
  );
}

export default Home;
