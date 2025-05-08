import React, { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate } from 'react-router-dom';

function Resultsim() {
  const navigate = useNavigate();
  const [results, setResults] = useState(null);
  const [processList, setProcessList] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [algorithmResults, setAlgorithmResults] = useState([]);
  const [zoomedChart, setZoomedChart] = useState(null); // Zoom state
  const cardsPerPage = 4;

  useEffect(() => {
    const storedResults = localStorage.getItem("simulationResults");
    const storedProcessList = localStorage.getItem("processList");

    if (storedResults) {
      try {
        const parsedResults = JSON.parse(storedResults);
        setResults(parsedResults);

        if (parsedResults.algorithmData && Array.isArray(parsedResults.algorithmData)) {
          setAlgorithmResults(parsedResults.algorithmData);
        } else {
          const extractedResults = parsedResults.algorithm.split("+").map(algo => ({
            name: algo,
            avgWaitingTime: parsedResults.avgWaitingTime,
            avgTurnaroundTime: parsedResults.avgTurnaroundTime,
            contextData: parsedResults.contextData,
          }));
          setAlgorithmResults(extractedResults);
        }
      } catch (err) {
        setError("ข้อมูลผลลัพธ์ไม่ถูกต้อง: " + err.message);
      }
    } else {
      setError("ไม่พบข้อมูลการจำลอง กรุณาเรียกใช้การจำลองก่อน");
    }

    if (storedProcessList) {
      try {
        setProcessList(JSON.parse(storedProcessList));
      } catch (err) {
        console.error("ข้อมูลกระบวนการไม่ถูกต้อง:", err);
      }
    }
  }, []);

  const formatTime = (time) => parseFloat(time).toFixed(1);
  
  const goToSimulator = () => {
    navigate('/simulator');
  };

  const renderGanttChart = (contextData) => {
    if (!contextData || contextData.length === 0) {
      return <div className="text-gray-500">ไม่มีข้อมูล Gantt Chart</div>;
    }

    const maxTime = Math.max(...contextData.map(p => p.start + p.duration));
    const timeUnitWidth = 30;
    const totalWidth = (Math.ceil(maxTime) + 1) * timeUnitWidth;

    const grouped = contextData.reduce((acc, p) => {
      if (!acc[p.pid]) acc[p.pid] = [];
      acc[p.pid].push(p);
      return acc;
    }, {});
    const sortedPids = Object.keys(grouped).sort((a, b) => parseInt(a) - parseInt(b));

    const colors = [
      "bg-blue-500", "bg-green-500", "bg-red-500", "bg-yellow-500",
      "bg-purple-500", "bg-pink-500", "bg-indigo-500", "bg-teal-500",
    ];

    const processHeight = sortedPids.length > 5 ? 22 : 26;
    const timelineHeight = 20;
    const padding = 10;
    const contentHeight = sortedPids.length * processHeight + timelineHeight + padding;
    const fixedHeight = 220;

    return (
      <div className="relative w-full h-full border rounded-lg bg-white">
        <div className="overflow-x-auto overflow-y-auto" style={{ height: `${fixedHeight}px` }}>
          <div
            className="min-w-max"
            style={{ width: `${totalWidth + 70}px`, minHeight: `${contentHeight}px`, paddingBottom: "15px" }}
          >
            <div className="mt-2">
              {sortedPids.map((pid, idx) => {
                const color = colors[idx % colors.length];
                return (
                  <div key={pid} className="flex items-center mb-1" style={{ height: `${processHeight}px` }}>
                    <span className="w-12 text-xs font-medium mr-2 text-right text-gray-700 flex-shrink-0">P{pid}</span>
                    <div className="relative flex-1" style={{ height: `${processHeight - 6}px` }}>
                      {grouped[pid].map((p, i) => (
                        <div
                          key={i}
                          className={`absolute ${color} text-white text-xs flex items-center justify-center rounded-sm shadow-sm`}
                          style={{
                            left: `${p.start * timeUnitWidth}px`,
                            width: `${Math.max(p.duration * timeUnitWidth, 10)}px`,
                            height: `${processHeight - 6}px`,
                            fontSize: sortedPids.length > 5 ? '0.65rem' : '0.75rem'
                          }}
                          title={`P${pid}: Start=${p.start}, Duration=${p.duration}`}
                        >
                          {p.duration >= 0.8 ? `P${pid}` : ""}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="relative mt-2 ml-14 mr-4" style={{ height: `${timelineHeight}px` }}>
              <div className="border-t border-gray-300 w-full absolute top-0" />
              {Array.from({ length: Math.ceil(maxTime) + 1 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute top-0 h-2 border-l border-gray-300"
                  style={{ left: `${i * timeUnitWidth}px` }}
                >
                  <div className="absolute -left-1 top-3 text-xs text-gray-600">{i}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderZoomModal = () => {
    if (!zoomedChart) return null;
    const { name, contextData } = zoomedChart;

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        onClick={() => setZoomedChart(null)}
      >
        <div
          className="bg-white rounded-lg shadow-xl p-6 max-w-5xl w-full relative"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-xl font-bold mb-4">{name} - Gantt Chart (Zoomed)</h2>
          <div className="max-h-[70vh] overflow-auto border p-4 rounded bg-gray-50">
            {renderGanttChart(contextData)}
          </div>
          <button
            onClick={() => setZoomedChart(null)}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          >
            ✖
          </button>
        </div>
      </div>
    );
  };

  const renderAlgorithmCards = () => {
    if (!results) return null;

    const algorithms = results.algorithm.split("+");
    const totalPages = Math.ceil(algorithms.length / cardsPerPage);
    const startIdx = currentPage * cardsPerPage;
    const endIdx = Math.min(startIdx + cardsPerPage, algorithms.length);
    const currentAlgorithms = algorithms.slice(startIdx, endIdx);

    let cardSizeClass = "w-[20%]";
    switch (currentAlgorithms.length) {
      case 1: cardSizeClass = "w-full"; break;
      case 2: cardSizeClass = "w-[45%]"; break;
      case 3: cardSizeClass = "w-[30%]"; break;
    }

    return (
      <div className="w-[90vw]">
        <div className="flex flex-wrap justify-center gap-[5%] w-full max-w-full mx-auto">
          {currentAlgorithms.map((algo, idx) => {
            const algoData = algorithmResults.find(a => a.name === algo) || {
              name: algo,
              contextData: results.contextData
            };
            return (
              <div key={idx} className={`bg-white rounded-lg shadow-md overflow-hidden ${cardSizeClass} mb-4 flex-shrink-0`} style={{ height: "320px" }}>
                <div className="bg-gray-800 text-white py-2 px-4 text-center rounded-t">
                  <h3 className="font-bold">{algo}</h3>
                </div>
                <div className="p-4 h-full">
                  <div className="flex justify-end mb-2">
                    <button
                      className="text-sm text-blue-600 hover:underline"
                      onClick={() => setZoomedChart({ name: algo, contextData: algoData.contextData })}
                    >
                      🔍 Zoom
                    </button>
                  </div>
                  <div className="bg-gray-100 rounded p-2 h-[220px]">
                    {renderGanttChart(algoData.contextData)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {totalPages > 1 && (
          <div className="flex justify-center mt-4 space-x-2">
            <button onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))} disabled={currentPage === 0}
              className={`p-2 rounded-full ${currentPage === 0 ? "bg-gray-200 cursor-not-allowed" : "bg-white shadow hover:bg-gray-100"}`}>
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center px-4 font-medium">{currentPage + 1} / {totalPages}</div>
            <button onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))} disabled={currentPage === totalPages - 1}
              className={`p-2 rounded-full ${currentPage === totalPages - 1 ? "bg-gray-200 cursor-not-allowed" : "bg-white shadow hover:bg-gray-100"}`}>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderSummaryTable = () => {
    if (!results) return null;
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
        <div className="grid grid-cols-3 bg-blue-500 text-white">
          <div className="py-2 px-4 text-center">Algorithm</div>
          <div className="py-2 px-4 text-center">Average Waiting Time</div>
          <div className="py-2 px-4 text-center">Average Turn Around Time</div>
        </div>
        {algorithmResults.map((algo, idx) => (
          <div key={idx} className={`grid grid-cols-3 ${idx % 2 === 0 ? "bg-gray-100" : "bg-gray-50"} border-b`}>
            <div className="py-2 px-4 text-center">{algo.name}</div>
            <div className="py-2 px-4 text-center">{formatTime(algo.avgWaitingTime)}</div>
            <div className="py-2 px-4 text-center">{formatTime(algo.avgTurnaroundTime)}</div>
          </div>
        ))}
      </div>
    );
  };

  const renderProcessTable = () => {
    const data = processList.length > 0 ? processList : results?.contextData?.reduce((acc, item) => {
      if (!acc[item.pid]) {
        acc[item.pid] = {
          id: item.pid,
          startTime: item.originalStartTime || 0,
          burstTime: item.originalBurstTime || 0,
          priority: item.priority || 0,
          timeQuantumRR: "-",
          timeQuantumMLQF: "-"
        };
      }
      return acc;
    }, {});
    if (!data || Object.keys(data).length === 0) return null;

    const processes = Array.isArray(data) ? data : Object.values(data);

    return (
      <div className="mb-8 flex flex-col w-[80vw]">
        <h2 className="flex justify-start text-lg font-semibold mb-2 ">Process Scheduling Input</h2>
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-2 px-4 text-center">Process ID</th>
                <th className="py-2 px-4 text-center">Start Time</th>
                <th className="py-2 px-4 text-center">Burst Time</th>
                <th className="py-2 px-4 text-center">Priority</th>
                <th className="py-2 px-4 text-center">Time Quantum(RR)</th>
                <th className="py-2 px-4 text-center">Time Quantum(MLQF)</th>
              </tr>
            </thead>
            <tbody>
              {processes.map((p, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="py-2 px-4 text-center">{p.id}</td>
                  <td className="py-2 px-4 text-center">{p.startTime}</td>
                  <td className="py-2 px-4 text-center">{p.burstTime}</td>
                  <td className="py-2 px-4 text-center">{p.priority}</td>
                  <td className="py-2 px-4 text-center">{p.timeQuantumRR}</td>
                  <td className="py-2 px-4 text-center">{p.timeQuantumMLQF}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-start w-full min-h-screen pb-16">
      <div className="container p-6 pt-16 flex flex-col items-center max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 w-full text-center bg-gray-100 py-3 rounded-lg shadow-sm">
          Process Scheduling Results
        </h1>
        
        {error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex flex-col items-center">
            <p>{error}</p>
            <button
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded flex items-center"
              onClick={goToSimulator}
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              กลับไปหน้า Simulator
            </button>
          </div>
        ) : results ? (
          <>
            {renderProcessTable()}
            {renderAlgorithmCards()}
            {renderSummaryTable()}
            {renderZoomModal()}
          </>
        ) : (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p>Loading simulation results...</p>
          </div>
        )}
      </div>

      {/* เหลือเพียงปุ่ม navigate ด้านล่างนี้เท่านั้น */}
      <div className="fixed bottom-0 left-0 right-0 bg-white bg-opacity-90 shadow-md py-3 z-20">
        <div className="container mx-auto flex justify-between items-center px-6">
          <button
            onClick={goToSimulator}
            className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            กลับไปหน้า Simulator
          </button>
          
          <p className="text-gray-500 text-sm">
            สามารถกลับไปแก้ไข Parameter และทำการจำลองใหม่ได้
          </p>
        </div>
      </div>
    </div>
  );
}

export default Resultsim;