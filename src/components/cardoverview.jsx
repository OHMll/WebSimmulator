import React from "react";

function Modal({ isOpen, title, content, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white text-black p-6 rounded-lg w-11/12 max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col justify-between">
        {/* หัวข้อ */}
        <div className="mb-4">
          <h2 className="text-2xl font-bold">{title}</h2>
        </div>

        {/* เนื้อหา */}
        <pre className="whitespace-pre-wrap text-black text-sm flex-1">{content}</pre>

        {/* ปุ่มปิดอยู่มุมขวาล่าง */}
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
