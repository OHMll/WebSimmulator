import React, { useState, useEffect } from "react";
import { Cpu, House, BadgeInfo, Menu, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import Infopopup from "./Infopopup";

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
      <h1 className="text-center font-bold text-[18pt] md:text-base lg:text-[18pt]">
        Process <br className="hidden md:block" /> Scheduling
      </h1>
    ),
    mobileContent: "Process Scheduling",
  },
  {
    id: "home",
    path: "/",
    content: ({ isActive }) => (
      <House size="3.5rem" color={isActive ? "#112D4E" : "#8a8b96"} />
    ),
    mobileContent: "Home",
  },
  {
    id: "osOverview",
    path: "/overview",
    content: (
      <h1 className="text-center font-bold text-[18pt] md:text-base lg:text-[18pt]">
        Operating System <br className="hidden md:block" /> Overview
      </h1>
    ),
    mobileContent: "OS Overview",
  },
];

const Menubar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sliderStyle, setSliderStyle] = useState({});
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getActiveButton = () => {
    if (
      location.pathname === "/simulator" ||
      location.pathname === "/resultsim"
    )
      return "processScheduling";
    if (location.pathname === "/overview") return "osOverview";
    return "home";
  };

  const [activeButton, setActiveButton] = useState(getActiveButton());

  useEffect(() => {
    setActiveButton(getActiveButton());
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handlePopupClick = () => {
    setPopupVisible(true);
    setMobileMenuOpen(false);
  };

  const closePopup = () => {
    setPopupVisible(false);
  };

  const handleButtonClick = (buttonId, path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && isMobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const activeButtonEl = document.getElementById(activeButton);
    if (activeButtonEl && window.innerWidth >= 768) {
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

    <div className="w-full relative sticky top-0 z-50">
      {/* Desktop & Tablet Navigation */}
      <div className="hidden md:flex justify-between">
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
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden w-full">
        <div className="flex justify-between items-center p-4 bg-[#F9F7F7] shadow-md">
          <div className="flex items-center">
            <button
              onClick={() => handleButtonClick("home", "/")}
              className="flex items-center"
            >
              <Cpu size="2rem" />
              <h1 className="ml-2 font-medium">Let's Simz</h1>
            </button>
          </div>
          <div className="flex items-center">
            <button onClick={handlePopupClick} className="mr-4">
              <BadgeInfo size="1.8rem" />
            </button>
            <button onClick={toggleMobileMenu}>
              {isMobileMenuOpen ? <X size="1.8rem" /> : <Menu size="1.8rem" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="absolute w-full bg-white shadow-lg z-50 transition-all duration-300 ease-in-out">
            {[
              menuItems.find((item) => item.id === "home"),
              ...menuItems.filter((item) => item.id !== "home"),
            ].map(({ id, path, mobileContent }) => (
              <button
                key={id}
                className={`w-full p-4 text-left border-b border-gray-100 ${
                  activeButton === id
                    ? "bg-gray-100 text-[#112D4E] font-bold"
                    : "text-[#8a8b96]"
                }`}
                onClick={() => handleButtonClick(id, path)}
              >
                {mobileContent}
              </button>
            ))}
          </div>
        )}
      </div>

      {isPopupVisible && <Infopopup closePopup={closePopup} />}
    </div>
  );
};

export default Menubar;