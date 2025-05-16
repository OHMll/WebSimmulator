export const algorithmDescriptions = {
  'FCFS': {
  title: 'First Come First Serve (FCFS)',
  formula: 'Waiting Time = Start Time - Arrival Time',
  description: 'Processes are executed in the order they arrive in the ready queue. This is the simplest scheduling algorithm that requires minimal overhead but may lead to the "convoy effect" where short processes wait behind long ones.',
  calculation: `
    - Waiting Time = Start Time - Arrival Time
    - Turnaround Time = Completion Time - Arrival Time
    - Average Waiting Time = Total Waiting Time / Number of Processes
  `
},
'HRRN': {
  title: 'Highest Response Ratio Next (HRRN)',
  formula: 'Response Ratio = (W + S) / S',
  description: 'A non-preemptive scheduling algorithm that selects the process with the highest response ratio to balance between favoring short jobs and avoiding starvation. It accounts for both waiting time and expected service time when making scheduling decisions.',
  calculation: `
    - W = Waiting Time
    - S = Service Time (Burst Time)
    - Response Ratio = (Waiting Time + Burst Time) / Burst Time
    - The process with the highest Response Ratio is selected for execution next
  `
},
'Priority': {
  title: 'Priority Scheduling',
  formula: 'Process Selection based on Priority Number',
  description: 'Each process is assigned a priority level, and the scheduler selects processes based on their priority (lower number typically represents higher priority). This algorithm can be preemptive or non-preemptive and helps ensure critical processes are handled promptly.',
  calculation: `
    - Sort processes by Priority Number (lowest to highest)
    - Waiting Time = Start Time - Arrival Time
    - Turnaround Time = Completion Time - Arrival Time
  `
},
'RR': {
  title: 'Round Robin (RR)',
  formula: 'Time Slice = Quantum Time',
  description: 'A preemptive scheduling algorithm that allocates a fixed time quantum to each process in a cyclic order. It provides fair CPU distribution and good responsiveness for interactive systems, though it has higher context switching overhead.',
  calculation: `
    - Each process gets a fixed time quantum for execution
    - If a process doesn't complete within its time quantum, it's moved to the back of the queue
    - Waiting Time = Total Time in Queue
    - Turnaround Time = Completion Time - Arrival Time
  `
},
'SJF': {
  title: 'Shortest Job First (SJF)',
  formula: 'Select Process with Minimum Burst Time',
  description: 'A non-preemptive scheduling algorithm that selects the process with the smallest execution time. SJF is optimal for minimizing average waiting time but requires accurate knowledge of process burst times and can lead to starvation of longer processes.',
  calculation: `
    - Sort processes by Burst Time (ascending)
    - Waiting Time = Start Time - Arrival Time
    - Turnaround Time = Completion Time - Arrival Time
  `
},
'SRTF': {
  title: 'Shortest Remaining Time First (SRTF)',
  formula: 'Remaining Time = Burst Time - Executed Time',
  description: 'The preemptive version of SJF where the scheduler selects the process with the smallest remaining execution time. SRTF provides optimal average waiting time but incurs higher overhead due to frequent context switches and requires continuous monitoring of remaining times.',
  calculation: `
    - Check Remaining Time whenever a new process arrives
    - Select the process with the minimum Remaining Time
    - Waiting Time = Total Time in Queue
    - Turnaround Time = Completion Time - Arrival Time
  `
},
'MLQF': {
  title: 'Multi-level Queue with Feedback (MLQF)',
  formula: 'Multiple Queues with Different Time Quantum',
  description: 'A sophisticated scheduling system that uses multiple queues with different priorities and time quanta. Processes can move between queues based on their behavior and CPU usage patterns, balancing between responsiveness for I/O-bound processes and throughput for CPU-bound processes.',
  calculation: `
    - Queue 1: Time Quantum = t1 (shortest)
    - Queue 2: Time Quantum = t2
    - Queue 3: Time Quantum = t3 (longest)
    - Processes that don't complete within their time quantum are moved to the next lower queue
    - Waiting Time = Total Time in All Queues
    - Turnaround Time = Completion Time - Arrival Time
  `
}
};
