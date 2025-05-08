export default function Sjf(input) {
    let processes = input.map(([pid, arrival, burst]) => ({
      pid,
      arrival,
      burst,
    }));
  
    // Sort processes by arrival time
    processes.sort((a, b) => a.arrival - b.arrival);
  
    let n = processes.length;
    let completed = new Array(n).fill(false);
    let currentTime = 0;
    let waitingTime = new Array(n).fill(0);
    let turnaroundTime = new Array(n).fill(0);
    let completedProcesses = 0;
    let ganttChart = [];
  
    while (completedProcesses < n) {
      let available = [];
      // Find processes that have arrived and are not completed
      for (let i = 0; i < n; i++) {
        if (!completed[i] && processes[i].arrival <= currentTime) {
          available.push({ burst: processes[i].burst, index: i });
        }
      }
  
      if (available.length > 0) {
        // Sort the available processes by burst time (shortest first)
        available.sort((a, b) => a.burst - b.burst);
        let idx = available[0].index;
        let process = processes[idx];
        let startTime = currentTime;
        ganttChart.push({
          pid: process.pid,
          start: startTime,
          end: startTime + process.burst,
        });
        currentTime += process.burst;
        completed[idx] = true;
        completedProcesses += 1;
  
        turnaroundTime[idx] = currentTime - process.arrival;
        waitingTime[idx] = turnaroundTime[idx] - process.burst;
      } else {
        // If no process is available to run, increment the time
        currentTime += 1;
      }
    }
  
    // Create context data to map each process with its start time and duration
    let contextData = ganttChart.map((entry, i) => {
      let duration =
        i === ganttChart.length - 1
          ? entry.end - entry.start
          : ganttChart[i + 1].start - entry.start;
      return { pid: entry.pid, start: entry.start, duration };
    });
  
    return [waitingTime, turnaroundTime, contextData];
    // return [waitingTime, turnaroundTime, contextData, ganttChart];
  }