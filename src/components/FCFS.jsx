import mergeSort from "./Mergesort";

export default function Fcfs(input) {
    if (!input || !Array.isArray(input)) {
      console.error("Error: input is not an array or is undefined", input);
      return;
    }
  
    let processes = input.map(([pid, arrival, burst]) => ({
      pid,
      arrival,
      burst,
    }));
    
    processes = mergeSort(processes, "arrival");
  
    let n = processes.length;
    let wt = new Array(n).fill(0);
    let tat = new Array(n).fill(0);
    let ct = new Array(n).fill(0);
    let gantt = [];
    let currentTime = processes[0].arrival;
  
    for (let i = 0; i < n; i++) {
      if (currentTime < processes[i].arrival) {
        currentTime = processes[i].arrival; // รอจนกว่า process จะมาถึง
      }
    
      ct[i] = currentTime + processes[i].burst;
      tat[i] = ct[i] - processes[i].arrival;
      wt[i] = tat[i] - processes[i].burst;
      gantt.push({ pid: processes[i].pid, start: currentTime, end: ct[i] });
      currentTime = ct[i];
    }
    
    let contextData = gantt.map((entry, i) => {
      let duration =
        i === gantt.length - 1
          ? entry.end - entry.start
          : gantt[i + 1].start - entry.start;
      return { pid: entry.pid, start: entry.start, duration };
    });
  
    return [wt, tat, contextData];
    // return [wt, tat, contextData, gantt];
  }
  