import { useState } from "react";

export default function ProcessInputForm() {
  const [startTime, setStartTime] = useState("");
  const [burstTime, setBurstTime] = useState("");
  const [priority, setPriority] = useState("");
  const [quantumRR, setQuantumRR] = useState("");
  const [mlqfTimes, setMlqfTimes] = useState(["", "", ""]);

  return (
    <div className="p-6 max-w-lg mx-auto mt-10 border border-dashed bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-4">กำหนดค่า Parameter เอง</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700">Start Time</label>
          <input type="text" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="w-full p-2 border rounded-md" />
        </div>
        <div>
          <label className="block text-gray-700">Time Quantum in RR</label>
          <input type="text" value={quantumRR} onChange={(e) => setQuantumRR(e.target.value)} className="w-full p-2 border rounded-md" />
        </div>
        <div>
          <label className="block text-gray-700">Burst Time</label>
          <input type="text" value={burstTime} onChange={(e) => setBurstTime(e.target.value)} className="w-full p-2 border rounded-md" />
        </div>
        <div>
          <label className="block text-gray-700">Priority</label>
          <input type="text" value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full p-2 border rounded-md" />
        </div>
      </div>
      <div className="mt-4">
        <label className="block text-gray-700">Time Quantum in MLOF</label>
        {mlqfTimes.map((time, index) => (
          <input
            key={index}
            type="text"
            value={time}
            onChange={(e) => {
              const newTimes = [...mlqfTimes];
              newTimes[index] = e.target.value;
              setMlqfTimes(newTimes);
            }}
            placeholder={`${index + 1}st`}
            className="w-full p-2 border rounded-md mt-1"
          />
        ))}
      </div>
      <table className="w-full mt-6 border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200 border-b">
            <th className="text-left py-2 px-4 border">Process ID</th>
            <th className="text-left py-2 px-4 border">Start Time</th>
            <th className="text-left py-2 px-4 border">Burst Time</th>
            <th className="text-left py-2 px-4 border">Priority</th>
            <th className="text-left py-2 px-4 border">Time Quantum (RR)</th>
            <th className="text-left py-2 px-4 border">Time Quantum (MLQF)</th>
          </tr>
        </thead>
      </table>
      <button className="mt-4 bg-green-500 text-white py-2 px-4 rounded-md">Add Process</button>
    </div>
  );
}
