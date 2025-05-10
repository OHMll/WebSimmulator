import React from "react";

function Modal({ isOpen, title, content, onClose, color }) {
  if (!isOpen) return null;

  const lines = content.trim().split("\n");

  const isSubheading = (line) => {
    const trimmed = line.trim();
    return trimmed.startsWith("**");
  };

  const cleanSubheading = (line) => {
    let cleanedLine = line.trim();
    cleanedLine = cleanedLine.replace(/^#*\s*/g, "").replace(/^\*\*\s*/g, "");
    return cleanedLine;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className="relative bg-gray-100 text-black p-6 rounded-lg w-11/12 max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col justify-between"
        style={{ borderColor: color }}
      >
        {/* ปุ่มปิด */}
        <button
          onClick={onClose}
          className="sticky top-0 right-0 ml-auto z-10 text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm"
        >
          ×
        </button>

        {/* หัวข้อหลัก */}
        <div className="mb-2">
          <h2 className="text-2xl font-bold">{title}</h2>
        </div>

        {/* เนื้อหา */}
        <pre className="whitespace-pre-wrap text-sm text-gray-900 font-mono flex-1">
          {lines.map((line, index) => (
            <span
              key={index}
              className={
                isSubheading(line)
                  ? "block text-blue-700 font-semibold mt-2"
                  : "block"
              }
            >
              {isSubheading(line) ? cleanSubheading(line) : line}
            </span>
          ))}
        </pre>
      </div>
    </div>
  );
}

export default Modal;
