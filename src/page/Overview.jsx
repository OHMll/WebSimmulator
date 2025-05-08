import { useState } from "react";
import Modal from "../components/cardoverview";
import topics from "../data/topic";
import topics2 from "../data/topic2";

function Overview() {
    const [selectedContent, setSelectedContent] = useState(null);

    const openModal = (topic) => {
        setSelectedContent(topic);
    };

    const closeModal = () => {
        setSelectedContent(null);
    };

    return (
        <div className="bg-[#3F72AF] h-full w-full">
            <div className="flex flex-col items-center overscroll-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-6xl mt-5">
                    {topics.map((topic) => (
                        <div
                            key={topic.id}
                            className="bg-[#1A3049] rounded-lg shadow-md flex flex-col items-center justify-start h-32 w-full border-2 border-transparent hover:border-white transition duration-300 cursor-pointer"
                            onClick={() => openModal(topic)}
                        >
                            {/* กล่องสี (Title) → ติดขอบบน ใช้สีจากข้อมูล */}
                            <div
                                className="top-0 rounded-lg w-3/4 flex justify-center items-center p-3"
                                style={{ backgroundColor: topic.color }}
                            >
                                <div className="text-xl font-bold text-black">{topic.title}</div>
                            </div>


                            {/* คำอธิบาย (อยู่ข้างล่าง) */}
                            <p className="text-sm text-gray-300 text-center mt-2">{topic.description}</p>
                        </div>
                    ))}
                </div>

                {/* แสดง Modal พร้อมเนื้อหาของหัวข้อที่เลือก */}
                {selectedContent && (
                    <Modal
                        isOpen={true}
                        title={selectedContent.title}
                        content={selectedContent.content}
                        onClose={closeModal}
                    />
                )}
            </div>
        </div>
    );
}

export default Overview;