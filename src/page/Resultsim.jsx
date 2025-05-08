import React, { useEffect, useState, useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

function Resultsim() {
  const [results, setResults] = useState(null);
  const [processList, setProcessList] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [algorithmResults, setAlgorithmResults] = useState([]);
  const [zoomedChart, setZoomedChart] = useState(null);
  const cardsPerPage = 4;
  
  // Changed animation state tracking
  const [animations, setAnimations] = useState({});
  const animationTimersRef = useRef({});

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

  // Initialize animations when algorithm results change
  useEffect(() => {
    if (algorithmResults.length > 0) {
      // Create initial animation state for all algorithms
      const initialAnimations = {};
      algorithmResults.forEach(algo => {
        initialAnimations[algo.name] = false;
      });
      setAnimations(initialAnimations);
      
      // Schedule initial animations with staggered delays
      algorithmResults.forEach((algo, index) => {
        const timerId = setTimeout(() => {
          setAnimations(prev => ({ ...prev, [algo.name]: true }));
        }, 500 + (index * 200)); // Increased delay - slower initial animation
        
        // Store timer ID for cleanup
        animationTimersRef.current[algo.name] = timerId;
      });
    }
    
    // Cleanup function to clear any pending animation timers
    return () => {
      Object.values(animationTimersRef.current).forEach(timerId => {
        clearTimeout(timerId);
      });
    };
  }, [algorithmResults]);
  
  // Handle zoom animation
  useEffect(() => {
    if (zoomedChart) {
      const { name } = zoomedChart;
      // Clear any existing animation timer
      if (animationTimersRef.current[name]) {
        clearTimeout(animationTimersRef.current[name]);
      }
      
      // Reset and restart animation for zoomed chart
      setAnimations(prev => ({ ...prev, [name]: false }));
      
      // Trigger animation after a short delay
      const timerId = setTimeout(() => {
        setAnimations(prev => ({ ...prev, [name]: true }));
      }, 300);
      
      // Store the timer ID
      animationTimersRef.current[name] = timerId;
    }
  }, [zoomedChart]);

  const formatTime = (time) => parseFloat(time).toFixed(1);
  const playAgain = () => window.location.href = "/simulator";
  
  // Improved replay animation function with guaranteed refresh and slow animation
  const replayAnimation = (algoName) => {
    // Clear any existing animation timer
    if (animationTimersRef.current[algoName]) {
      clearTimeout(animationTimersRef.current[algoName]);
    }
    
    // Force state update to reset animation
    setAnimations(prev => ({ ...prev, [algoName]: false }));
    
    // Schedule animation restart with a longer delay for more visible effect
    const timerId = setTimeout(() => {
      setAnimations(prev => ({ ...prev, [algoName]: true }));
    }, 300); // Increased delay for more noticeable effect when clicking replay
    
    // Store the timer ID
    animationTimersRef.current[algoName] = timerId;
  };

  const renderGanttChart = (contextData, algoName) => {
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

    // Enhanced color and gradient options
    const gradients = [
      "bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500",
      "bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500",
      "bg-gradient-to-r from-purple-500 to-pink-400 hover:from-purple-600 hover:to-pink-500",
      "bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500",
      "bg-gradient-to-r from-red-500 to-pink-400 hover:from-red-600 hover:to-pink-500",
      "bg-gradient-to-r from-indigo-500 to-blue-400 hover:from-indigo-600 hover:to-blue-500", 
      "bg-gradient-to-r from-teal-400 to-cyan-400 hover:from-teal-500 hover:to-cyan-500",
      "bg-gradient-to-br from-fuchsia-500 to-purple-500 hover:from-fuchsia-600 hover:to-purple-600",
      "bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-500 hover:to-yellow-400",
      "bg-gradient-to-r from-rose-400 to-red-400 hover:from-rose-500 hover:to-red-500",
    ];

    const processHeight = sortedPids.length > 5 ? 22 : 26;
    const timelineHeight = 20;
    const padding = 10;
    const contentHeight = sortedPids.length * processHeight + timelineHeight + padding;
    const fixedHeight = 220;

    // Get animation state for this chart
    const isAnimating = animations[algoName] || false;

    return (
      <div className="relative w-full h-full border rounded-lg bg-gray-50 shadow-inner">
        <div className="overflow-x-auto overflow-y-auto" style={{ height: `${fixedHeight}px` }}>
          <div
            className="min-w-max"
            style={{ width: `${totalWidth + 70}px`, minHeight: `${contentHeight}px`, paddingBottom: "15px" }}
          >
            <div className="mt-2">
              {sortedPids.map((pid, idx) => {
                const gradient = gradients[idx % gradients.length];
                return (
                  <div key={pid} className="flex items-center mb-1" style={{ height: `${processHeight}px` }}>
                    <span className="w-12 text-xs font-medium mr-2 text-right text-gray-700 flex-shrink-0">P{pid}</span>
                    <div className="relative flex-1" style={{ height: `${processHeight - 6}px` }}>
                      {grouped[pid].map((p, i) => {
                        // Calculate animation delays based on process start time and index
                        // Slowed down animation by increasing delay multipliers
                        const animDelay = p.start * 0.2 + (i * 0.1);
                        const duration = Math.max(p.duration * timeUnitWidth, 10);
                        
                        return (
                          <div
                            key={i}
                            className={`absolute ${gradient} text-white text-xs flex items-center justify-center 
                                      rounded-md transition-all duration-1000 ease-out select-none`}
                            style={{
                              left: `${p.start * timeUnitWidth}px`,
                              width: isAnimating ? `${duration}px` : "0px",
                              height: `${processHeight - 6}px`,
                              fontSize: sortedPids.length > 5 ? '0.65rem' : '0.75rem',
                              opacity: isAnimating ? 1 : 0,
                              transitionDelay: `${animDelay}s`,
                              transform: isAnimating ? 'translateY(0) scale(1)' : 'translateY(8px) scale(0.95)',
                              border: '1px solid rgba(255,255,255,0.3)',
                              boxShadow: '0 3px 6px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.4)',
                              overflow: 'hidden',
                              zIndex: 10 - (p.start * 0.1) // Stack earlier processes on top
                            }}
                            title={`P${pid}: Start=${p.start}, Duration=${p.duration}`}
                          >
                            {p.duration >= 0.8 ? `P${pid}` : ""}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="relative mt-2 ml-14 mr-4" style={{ height: `${timelineHeight}px` }}>
              {/* Create a fancy timeline with animated appearance - slower animation */}
              <div 
                className="border-t border-gray-300 w-full absolute top-0 transition-all duration-1500" 
                style={{
                  width: isAnimating ? '100%' : '0%',
                  opacity: isAnimating ? 1 : 0,
                  transitionDelay: '0.5s'
                }}
              />
              {Array.from({ length: Math.ceil(maxTime) + 1 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute top-0 transition-all duration-1000"
                  style={{ 
                    left: `${i * timeUnitWidth}px`,
                    height: isAnimating ? '8px' : '0px',
                    width: '1px', 
                    backgroundColor: '#CBD5E0',
                    opacity: isAnimating ? 1 : 0,
                    transitionDelay: `${0.6 + (i * 0.12)}s` // Slowed down by increasing delay
                  }}
                >
                  <div 
                    className="absolute -left-3 top-3 text-xs text-gray-600 transition-all duration-800"
                    style={{
                      opacity: isAnimating ? 1 : 0,
                      transform: isAnimating ? 'translateY(0)' : 'translateY(-5px)',
                      transitionDelay: `${0.8 + (i * 0.12)}s` // Slowed down by increasing delay
                    }}
                  >
                    {i}
                  </div>
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
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm"
        onClick={() => setZoomedChart(null)}
      >
        <div
          className="bg-white rounded-lg shadow-2xl p-6 max-w-5xl w-full relative animate-fadeIn"
          onClick={(e) => e.stopPropagation()}
          style={{
            animation: 'fadeIn 0.3s ease-out',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}
        >
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">{name}</span>
            <span className="mx-2 text-gray-500">-</span>
            <span className="text-gray-700">Gantt Chart</span>
            
            <button
              className="ml-4 bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 
                        text-white py-1 px-4 rounded-md text-sm flex items-center transition-all shadow-md
                        hover:shadow-lg transform hover:translate-y-px active:translate-y-0.5"
              onClick={(e) => {
                e.stopPropagation();
                replayAnimation(name);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              เล่นแอนิเมชันซ้ำ
            </button>
          </h2>
          <div className="max-h-[70vh] overflow-auto border border-gray-200 p-4 rounded-lg bg-gray-50 shadow-inner">
            {renderGanttChart(contextData, name)}
          </div>
          <button
            onClick={() => setZoomedChart(null)}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 hover:bg-gray-100 p-1.5 rounded-full transition-all"
            aria-label="ปิด"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
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
              <div 
                key={idx} 
                className={`bg-white rounded-lg shadow-md overflow-hidden ${cardSizeClass} mb-4 flex-shrink-0 
                           hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1`}
                style={{ height: "320px" }}
              >
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-2 px-4 text-center rounded-t">
                  <h3 className="font-bold">{algo}</h3>
                </div>
                <div className="p-4 h-full">
                  <div className="flex justify-between mb-2">
                    <button
                      className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline flex items-center
                                transition-all duration-200 hover:translate-x-0.5"
                      onClick={() => replayAnimation(algo)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                      </svg>
                      เล่นซ้ำ
                    </button>
                    <button
                      className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline flex items-center
                                transition-all duration-200 hover:translate-x-0.5"
                      onClick={() => setZoomedChart({ name: algo, contextData: algoData.contextData })}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M5 8a1 1 0 011-1h1V6a1 1 0 012 0v1h1a1 1 0 110 2H9v1a1 1 0 11-2 0V9H6a1 1 0 01-1-1z" />
                        <path fillRule="evenodd" d="M2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8zm6-4a4 4 0 100 8 4 4 0 000-8z" clipRule="evenodd" />
                      </svg>
                      ขยาย
                    </button>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2 h-[220px] border border-gray-200 shadow-inner">
                    {renderGanttChart(algoData.contextData, algo)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {totalPages > 1 && (
          <div className="flex justify-center mt-4 space-x-2">
            <button onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))} disabled={currentPage === 0}
              className={`p-2 rounded-full ${currentPage === 0 ? "bg-gray-200 cursor-not-allowed" : "bg-white shadow hover:bg-gray-100"} transition-all`}>
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center px-4 font-medium">{currentPage + 1} / {totalPages}</div>
            <button onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))} disabled={currentPage === totalPages - 1}
              className={`p-2 rounded-full ${currentPage === totalPages - 1 ? "bg-gray-200 cursor-not-allowed" : "bg-white shadow hover:bg-gray-100"} transition-all`}>
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
    <div className="flex flex-col items-start w-full min-h-screen">
      <div className="container p-6 flex flex-col items-center max-w-6xl mx-auto">
        {error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>
        ) : results ? (
          <>
            {renderProcessTable()}
            {renderAlgorithmCards()}
            {renderSummaryTable()}
            {renderZoomModal()}

            <div className="mb-4 flex justify-center">
              <button
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 
                          text-white py-2 px-4 rounded-md flex items-center shadow-md hover:shadow-lg 
                          transition-all transform hover:-translate-y-0.5"
                onClick={playAgain}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                Play Again
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p>Loading simulation results...</p>
          </div>
        )}
      </div>

      <div className="mt-auto py-2 px-4">
        <button
          onClick={() => window.history.back()}
          className="flex text-blue-500 hover:text-blue-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          ย้อนกลับ
        </button>
      </div>
    </div>
  );
}

export default Resultsim;