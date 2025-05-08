import mergeSort from "./Mergesort";

export default function Priority(input) {
  let processes = input.map(([pid, arrival, burst, priority]) => ({
    pid,
    arrival,
    burst,
    priority,
  }));

  // Sort processes by priority (lower value means higher priority)
  processes = mergeSort(processes, "priority");


  let currentTime = 0;
  let waitingTimes = [];
  let turnaroundTimes = [];
  let ganttChart = [];

  for (let process of processes) {
    let { pid, arrival, burst, priority } = process;

    let startTime = Math.max(currentTime, arrival); // Ensure process starts after its arrival time
    let endTime = startTime + burst;

    let waitingTime = startTime - arrival; // Waiting time is the difference between start and arrival times
    let turnaroundTime = endTime - arrival; // Turnaround time is the difference between end and arrival times

    currentTime = endTime; // Update current time to the end of this process

    waitingTimes.push(waitingTime);
    turnaroundTimes.push(turnaroundTime);
    ganttChart.push({ pid, start: startTime, duration: burst });
  }

  return [ waitingTimes, turnaroundTimes, ganttChart ];
}