import React, { useState, useEffect } from "react";
import { Cpu, House, BadgeInfo } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import Infopopup from "./Infopopup"; // นำเข้า Infopopup component

const MenuButton = ({ isActive, onClick, children }) => {
  const textColor = isActive ? "text-[#112D4E]" : "text-[#8a8b96]";
  return (
    <button
      onClick={onClick}
      className={`w-full h-full flex items-center justify-center ${textColor}`}
    >
      {children}
    </button>
  );
};

const menuItems = [
  {
    id: "processScheduling",
    path: "/simulator",
    content: (
      <h1 className="text-center font-bold text-[18pt]">
        Process <br /> Scheduling
      </h1>
    ),
  },
  {
    id: "home",
    path: "/",
    content: ({ isActive }) => (
      <House size="3.5rem" color={isActive ? "#112D4E" : "#8a8b96"} />
    ),
  },
  {
    id: "osOverview",
    path: "/overview",
    content: (
      <h1 className="text-center font-bold text-[18pt]">
        Operating System <br /> Overview
      </h1>
    ),
  },
];

const Menubar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sliderStyle, setSliderStyle] = useState({});
  const [isPopupVisible, setPopupVisible] = useState(false);

  const getActiveButton = () => {
    if (location.pathname === "/simulator" || location.pathname === "/resultsim") return "processScheduling";
    if (location.pathname === "/overview") return "osOverview";
    return "home"; // Default
  };

  const [activeButton, setActiveButton] = useState(getActiveButton());

  useEffect(() => {
    // เมื่อ pathname เปลี่ยนแปลง (เช่นการกด refresh หน้า)
    setActiveButton(getActiveButton());
  }, [location.pathname]);

  const handlePopupClick = () => {
    setPopupVisible(true);
  };

  const closePopup = () => {
    setPopupVisible(false);
  };

  const handleButtonClick = (buttonId, path) => {
    navigate(path);
  };

  useEffect(() => {
    const activeButtonEl = document.getElementById(activeButton);
    if (activeButtonEl) {
      const buttonRect = activeButtonEl.getBoundingClientRect();
      const parentRect = activeButtonEl.parentElement.getBoundingClientRect();
      const buttonCenter = buttonRect.left + buttonRect.width / 2;
      const parentLeft = parentRect.left;
      const lineWidth = 120;
      setSliderStyle({
        left: `${buttonCenter - parentLeft - lineWidth / 2}px`,
        width: `${lineWidth}px`,
        opacity: 1,
      });
    }
  }, [activeButton]);

  return (
    <div className="w-full ">
      <div className="flex justify-between">
        <button
          onClick={() => handleButtonClick("home", "/")}
          className="mt-3 w-[10%] flex flex-col items-center justify-center"
        >
          <Cpu size="3.5rem" />
          <h1 className="my-2">Let's Simz</h1>
        </button>

        <div className="drop-shadow-lg bg-[#F9F7F7] w-[80%] rounded-br-[1.5rem] rounded-bl-[1.5rem] flex justify-around">
          <div
            className="drop-shadow-md absolute bottom-0 h-1 bg-[#0f172a] transition-all duration-300 ease-in-out rounded-md"
            style={sliderStyle}
          />
          {menuItems.map(({ id, path, content }) => (
            <div key={id} id={id} className="h-full flex items-center">
              <MenuButton
                isActive={activeButton === id}
                onClick={() => handleButtonClick(id, path)}
              >
                {typeof content === "function"
                  ? content({ isActive: activeButton === id })
                  : content}
              </MenuButton>
            </div>
          ))}
        </div>

        <button
          onClick={handlePopupClick}
          className="w-[10%] flex flex-col items-center justify-center"
        >
          <BadgeInfo size="3.5rem" />
        </button>

        {isPopupVisible && <Infopopup closePopup={closePopup} />}
      </div>
    </div>
  );
};

export default Menubar;
