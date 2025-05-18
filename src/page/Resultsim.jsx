import React, { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, ScrollText, ZoomIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import GanttChart2D from "../components/GanttChart2D";
import { algorithmDescriptions } from "../data/Algodescription";
import mergeSort from "../components/Mergesort";

function Resultsim() {
  const navigate = useNavigate();
  const [results, setResults] = useState(null);
  const [processList, setProcessList] = useState([]);
  const [processIdCounter, setProcessIdCounter] = useState(1);
  const [selectedAlgorithms, setSelectedAlgorithms] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [algorithmResults, setAlgorithmResults] = useState([]);
  const [zoomedChart, setZoomedChart] = useState(null);
  const [algorithmInfo, setAlgorithmInfo] = useState(null);
  const cardsPerPage = 3;

  useEffect(() => {
    const storedResults = localStorage.getItem("simulationResults");
    const storedProcessList = localStorage.getItem("processList");

    if (storedResults) {
      try {
        const parsedResults = JSON.parse(storedResults);
        setResults(parsedResults);

        if (
          parsedResults.algorithmData &&
          Array.isArray(parsedResults.algorithmData)
        ) {
          setAlgorithmResults(parsedResults.algorithmData);
        } else {
          const extractedResults = parsedResults.algorithm
            .split("+")
            .map((algo) => ({
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
    navigate("/simulator");
  };

  const renderGanttChart = (contextData, isZoomed = false) => {
    if (!contextData || contextData.length === 0) {
      return <div className="text-gray-500">ไม่มีข้อมูล Gantt Chart</div>;
    }

    const scheduleData = contextData.map((item) => ({
      startTime: item.start,
      duration: item.duration,
      processId: item.pid,
    }));

    return (
      <div style={{ height: "100%", width: "100%" }}>
        <GanttChart2D scheduleData={scheduleData} isZoomed={isZoomed} />
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
          className="bg-white rounded-lg shadow-xl p-6 max-w-5xl w-full h-[90vh] relative"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-xl font-bold mb-4">{name} - Gantt Chart</h2>
          <div className="h-[calc(90vh-120px)] rounded bg-gray-50">
            {renderGanttChart(contextData, true)}
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

  // Updated to make the algorithm cards responsive with correct desktop layout
  const renderAlgorithmCards = () => {
    if (!results) return null;

    const algorithms = results.algorithm.split("+");
    const totalPages = Math.ceil(algorithms.length / cardsPerPage);
    const startIdx = currentPage * cardsPerPage;
    const endIdx = Math.min(startIdx + cardsPerPage, algorithms.length);
    const currentAlgorithms = algorithmResults
      .filter((a) => results.algorithm.split("+").includes(a.name))
      .slice(startIdx, endIdx);

    // For mobile: 2x2 grid (2 columns, 2 rows)
    // For desktop: Full width cards in separate containers as shown in image
    return (
      <div className="w-full md:w-[90vw]">
        {/* Mobile view - 2x2 grid */}
        <div className="flex flex-wrap justify-center gap-[2%] md:hidden w-full max-w-full mx-auto">
          {currentAlgorithms.map((algoData, idx) => {
            const algo = algoData.name;
            const isSingleCard = currentAlgorithms.length === 1; // ตรวจสอบว่ามีการ์ดเดียวหรือไม่
            return (
              <div
                key={`mobile-${algo}-${idx}`}
                className={`bg-white rounded-lg shadow-md overflow-hidden ${
                  isSingleCard ? "w-[95%]" : "w-[48%]"
                } mb-4 flex-shrink-0`} // ปรับความกว้างเมื่อมีการ์ดเดียว
                style={{ height: "280px", minHeight: "280px" }}
              >
                <div className="bg-gray-800 text-white py-2 px-4 text-center rounded-t relative">
                  <div className="absolute top-2 left-2">
                    <button
                      className="text-blue-400 hover:text-blue-200"
                      onClick={() => setAlgorithmInfo(getAlgorithmInfo(algo))}
                    >
                      <ScrollText size={14} />
                    </button>
                  </div>
                  <h3 className="font-bold text-xs">{algo}</h3>
                  <button
                    className="absolute top-2 right-2 text-blue-400 hover:text-blue-200"
                    onClick={() =>
                      setZoomedChart({
                        name: algo,
                        contextData: algoData.contextData,
                      })
                    }
                  >
                    <ZoomIn size={14} />
                  </button>
                </div>
                <div className="p-2 h-full">
                  <div className="bg-red-100 rounded shadow-inner p-1 h-[220px] overflow-hidden flex flex-col">
                    {renderGanttChart(algoData.contextData)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop view - cards as shown in image */}
        <div
          className={`hidden md:grid w-full max-w-full mx-auto justify-items-center gap-6`}
          style={{
            gridTemplateColumns: `repeat(${Math.min(
              currentAlgorithms.length,
              4
            )}, minmax(0, 1fr))`,
          }}
        >
          {currentAlgorithms.map((algoData, idx) => {
            const algo = algoData.name;
            // ปรับขนาดการ์ดตามจำนวน
            let cardWidth = "w-full";
            if (currentAlgorithms.length === 1) cardWidth = "w-[70%]";
            if (currentAlgorithms.length === 2) cardWidth = "w-[80%]";
            if (currentAlgorithms.length === 3) cardWidth = "w-[95%]";

            return (
              <div
                key={`desktop-${algo}-${idx}`}
                className={`bg-white rounded-lg shadow-md overflow-hidden mb-4 ${cardWidth}`}
              >
                <div className="bg-gray-800 text-white py-2 px-4 text-center rounded-t relative">
                  <div className="absolute top-2 left-2">
                    <button
                      className="text-blue-400 hover:text-blue-200"
                      onClick={() => setAlgorithmInfo(getAlgorithmInfo(algo))}
                    >
                      <ScrollText />
                    </button>
                  </div>
                  <h3 className="font-bold text-base">{algo}</h3>
                  <button
                    className="absolute top-2 right-2 text-blue-400 hover:text-blue-200"
                    onClick={() =>
                      setZoomedChart({
                        name: algo,
                        contextData: algoData.contextData,
                      })
                    }
                  >
                    <ZoomIn />
                  </button>
                </div>
                <div className="p-4">
                  <div className="bg-red-100 rounded shadow-inner p-2 h-[370px] overflow-hidden flex flex-col">
                    {renderGanttChart(algoData.contextData)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {algorithmResults.filter((a) =>
          results.algorithm.split("+").includes(a.name)
        ).length > cardsPerPage && (
          <div className="flex justify-center mt-2 mb-2 md:mt-4 space-x-2 text-[12px] md:text-base">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
              disabled={currentPage === 0}
              className={`p-1.5 md:p-2 rounded-full ${
                currentPage === 0
                  ? "bg-gray-200 cursor-not-allowed"
                  : "bg-white shadow hover:bg-gray-100"
              }`}
            >
              <ArrowLeft className="h-4 w-4 md:h-5 md:w-5" />
            </button>
            <div className="flex items-center px-2 md:px-4 font-medium">
              {currentPage + 1} / {totalPages}
            </div>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))
              }
              disabled={currentPage === totalPages - 1}
              className={`p-1.5 md:p-2 rounded-full ${
                currentPage === totalPages - 1
                  ? "bg-gray-200 cursor-not-allowed"
                  : "bg-white shadow hover:bg-gray-100"
              }`}
            >
              <ArrowRight className="h-4 w-4 md:h-5 md:w-5" />
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderSummaryTable = () => {
    if (!results) return null;

    const sortedResults = mergeSort(algorithmResults, "avgWaitingTime");

    return (
      <div className="w-full max-w-[98vw] mx-auto bg-white rounded-lg shadow overflow-hidden mb-8 text-[10px] md:text-base">
        <div className="grid grid-cols-3 bg-blue-500 text-white">
          <div className="py-2 px-4 text-center">Algorithm</div>
          <div className="py-2 px-4 text-center">Average Waiting Time</div>
          <div className="py-2 px-4 text-center">Average Turn Around Time</div>
        </div>
        {sortedResults.map((algo, idx) => (
          <div
            key={idx}
            className={`grid grid-cols-3 ${
              idx % 2 === 0 ? "bg-gray-50" : "bg-white"
            } border-b`}
          >
            <div className="py-2 px-4 text-center font-medium">{algo.name}</div>
            <div className="py-2 px-4 text-center">
              {formatTime(algo.avgWaitingTime)}
            </div>
            <div className="py-2 px-4 text-center">
              {formatTime(algo.avgTurnaroundTime)}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderProcessTable = () => {
    const data =
      processList.length > 0
        ? processList
        : results?.contextData?.reduce((acc, item) => {
            if (!acc[item.pid]) {
              acc[item.pid] = {
                id: item.pid,
                startTime: item.originalStartTime || 0,
                burstTime: item.originalBurstTime || 0,
                priority: item.priority || 0,
                timeQuantumRR: "-",
                timeQuantumMLQF: "-",
              };
            }
            return acc;
          }, {});
    if (!data || Object.keys(data).length === 0) return null;

    const processes = Array.isArray(data) ? data : Object.values(data);

    return (
      <div className="mb-8 flex flex-col w-full md:w-[70vw]">
        <h2 className="flex justify-start text-sm md:text-lg font-semibold mb-2">
          Process Scheduling Input
        </h2>
        <div
          className="overflow-x-auto bg-white rounded-lg shadow w-full"
          style={{ maxHeight: "400px", overflowY: "auto" }}
        >
          <table className="min-w-full text-[10px] md:text-base">
            <thead className="bg-gray-200 sticky top-0 z-10">
              <tr>
                <th className="py-1 px-1 text-center text-[10px] md:text-base">
                  Process ID
                </th>
                <th className="py-1 px-1 text-center text-[10px] md:text-base">
                  Start Time
                </th>
                <th className="py-1 px-1 text-center text-[10px] md:text-base">
                  Burst Time
                </th>
                <th className="py-1 px-1 text-center text-[10px] md:text-base">
                  Priority
                </th>
                <th className="py-1 px-1 text-center text-[10px] md:text-base">
                  Time Quantum(RR)
                </th>
                <th className="py-1 px-1 text-center text-[10px] md:text-base">
                  Time Quantum(MLQF)
                </th>
              </tr>
            </thead>
            <tbody>
              {processes.map((p, idx) => (
                <tr
                  key={idx}
                  className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="py-1 px-1 text-center text-[10px] md:text-base">
                    {p.id}
                  </td>
                  <td className="py-1 px-1 text-center text-[10px] md:text-base">
                    {p.startTime}
                  </td>
                  <td className="py-1 px-1 text-center text-[10px] md:text-base">
                    {p.burstTime}
                  </td>
                  <td className="py-1 px-1 text-center text-[10px] md:text-base">
                    {p.priority}
                  </td>
                  <td className="py-1 px-1 text-center text-[10px] md:text-base">
                    {p.timeQuantumRR}
                  </td>
                  <td className="py-1 px-1 text-center text-[10px] md:text-base">
                    {p.timeQuantumMLQF}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const removeProcess = (id) => {
    const newList = processList.filter((p) => p.id !== id);
    setProcessList(newList);

    if (newList.length === 0) {
      setProcessIdCounter(1);
    }
  };

  const addProcess = (process) => {
    setProcessList([
      ...processList,
      { ...process, id: processIdCounter.toString().padStart(3, "0") },
    ]);
    setProcessIdCounter(processIdCounter + 1);
  };

  const resetProcessList = () => {
    setProcessList([]);
    setProcessIdCounter(1);
    setSelectedAlgorithms([]);
  };

  const getAlgorithmInfo = (algoName) => {
    return algorithmDescriptions[algoName];
  };

  // เพิ่ม Modal component สำหรับแสดงข้อมูลอัลกอริทึม
  const renderAlgorithmInfoModal = () => {
    if (!algorithmInfo) return null;
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        onClick={() => setAlgorithmInfo(null)}
      >
        <div
          className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header section with close button */}
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-bold">{algorithmInfo.title}</h2>
            <button
              onClick={() => setAlgorithmInfo(null)}
              className="text-gray-500 hover:text-gray-800 p-1"
            >
              ✖
            </button>
          </div>

          {/* Content section */}
          <div className="p-6 space-y-4">
            <div>
              <h3 className="font-semibold">Formula:</h3>
              <p className="bg-gray-100 p-2 rounded text-sm">{algorithmInfo.formula}</p>
            </div>
            <div>
              <h3 className="font-semibold">Description:</h3>
              <p className="text-sm">{algorithmInfo.description}</p>
            </div>
            <div>
              <h3 className="font-semibold">Calculation:</h3>
              <div className="bg-gray-100 p-2 rounded">
                <p className="text-sm whitespace-pre-line">{algorithmInfo.calculation}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-start w-full min-h-screen pb-16">
      <div className="container p-2 md:p-6 pt-6 md:pt-16 flex flex-col items-center max-w-6xl mx-auto">
        <h1 className="text-lg md:text-2xl font-bold mb-6 w-full text-center bg-gray-100 py-3 rounded-lg shadow-sm">
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
            {renderAlgorithmInfoModal()}
          </>
        ) : (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p>Loading simulation results...</p>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white bg-opacity-90 shadow-md py-3 z-20">
        <div className="container mx-auto flex justify-between items-center px-6">
          <button
            onClick={goToSimulator}
            className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Simulator
          </button>
        </div>
      </div>
    </div>
  );
}

export default Resultsim;