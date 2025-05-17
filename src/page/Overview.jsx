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
        <div className="bg-[#3F72AF] min-h-screen w-full overflow-hidden relative mt-[-6.77rem] pt-[6.77rem]">
            <div className="flex flex-col items-center px-4 py-6  ">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-7xl">
                    {topics.map((topic) => (
                        <div
                            key={topic.id}
                            className="bg-[#1A3049] rounded-lg shadow-md flex flex-col items-center justify-start min-h-[10rem] w-full border-2 border-transparent hover:border-white hover:scale-[1.02] transition-all duration-300 cursor-pointer"
                            onClick={() => openModal(topic)}
                        >
                            {/* กล่องสี (Title) → ติดขอบบน ใช้สีจากข้อมูล */}
                            <div
                                className="rounded-lg w-3/4 flex justify-center items-center p-3 "
                                style={{ backgroundColor: topic.color }}
                            >
                                <div className="text-xl font-bold text-white text-center">
                                    {topic.title}
                                </div>
                            </div>

                            {/* คำอธิบาย (อยู่ข้างล่าง) */}
                            <div className="flex-1 flex items-center justify-center px-2 text-center">
                                <p className="text-sm text-gray-300">{topic.description}</p>
                            </div>
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
                        color={selectedContent.color}
                    />
                )}
            </div>
        </div>
    );
}

export default Overview;